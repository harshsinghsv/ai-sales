import { NextRequest, NextResponse } from 'next/server';
import {
  AgoraClient,
  Agent,
  Area,
  CustomLLM,
  DeepgramSTT,
  ExpiresIn,
  MiniMaxTTS,
  OpenAI,
  SarvamSTT,
  SarvamTTS,
} from 'agora-agents';
import type { BaseSTT, BaseTTS, McpServersItem } from 'agora-agents';
import {
  BACKEND_HTTP_URL,
  DEFAULT_AGENT_UID,
  getServerAgoraCredentials,
} from '@/lib/agora';
import { registerAgentSession } from '@/lib/agent-registry';
import type {
  AgentPipelineConfig,
  AgentResponse,
  ClientStartRequest,
} from '@/types/conversation';

const agentUid = String(DEFAULT_AGENT_UID);

/**
 * Models Agora resells under its own OpenAI credentials. The SDK exports this
 * union as a type only (not a runtime value), so it is mirrored here — keep in
 * sync with agora-agents' OpenAIPresetModels if the SDK is upgraded.
 */
const OPENAI_PRESET_MODELS = [
  'gpt-4o-mini',
  'gpt-4.1-mini',
  'gpt-5-nano',
  'gpt-5-mini',
] as const;

type OpenAIPresetModel = (typeof OPENAI_PRESET_MODELS)[number];

function isPresetModel(model: string): model is OpenAIPresetModel {
  return (OPENAI_PRESET_MODELS as readonly string[]).includes(model);
}

/**
 * Builds the managed-OpenAI brain. Omitting apiKey/url puts the agent on
 * Agora's reseller credentials (no OpenAI key needed) — only valid for the
 * preset model list. Any other model requires BYOK via OPENAI_API_KEY.
 */
function buildManagedLlm(config: AgentPipelineConfig): OpenAI {
  const common = {
    mcpServers: buildMcpServers(config),
    systemMessages: [{ role: 'system', content: config.system_prompt }],
    greetingMessage: config.greeting_message,
    failureMessage: config.failure_message,
    maxHistory: 32,
    params: {
      temperature: config.llm_temperature,
      max_tokens: 300,
    },
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && isPresetModel(config.llm_model)) {
    return new OpenAI({ ...common, model: config.llm_model });
  }
  if (!apiKey) {
    throw new Error(
      `AGORA_LLM_MODEL="${config.llm_model}" is not an Agora reseller preset ` +
        `(${OPENAI_PRESET_MODELS.join(', ')}). Set OPENAI_API_KEY to bring your own key, ` +
        `or switch AGORA_LLM_MODE=custom to use the FastAPI brain.`,
    );
  }
  return new OpenAI({
    ...common,
    apiKey,
    model: config.llm_model,
    url: 'https://api.openai.com/v1/chat/completions',
  });
}

/**
 * ASR slot. Deepgram runs on Agora-managed credentials (no provider key) and
 * is the recommended default; "multi" enables Hindi/English code-switching,
 * which is how the agent's buyers actually speak. Sarvam stays available as a
 * BYOK alternative.
 */
function buildStt(config: AgentPipelineConfig): BaseSTT {
  if (config.stt_vendor === 'sarvam') {
    return new SarvamSTT({
      apiKey: config.sarvam.api_key,
      language: config.sarvam.stt_language,
    });
  }
  return new DeepgramSTT({
    model: config.deepgram.model as 'nova-2' | 'nova-3',
    language: config.deepgram.language,
  });
}

/**
 * TTS slot. MiniMax runs on Agora-managed credentials; omitting `key`,
 * `groupId` and `url` is what selects managed mode. voiceId is optional —
 * set MINIMAX_VOICE_ID to a Hindi voice for a Hindi-speaking Emily.
 */
function buildTts(config: AgentPipelineConfig): BaseTTS {
  if (config.tts_vendor === 'sarvam') {
    return new SarvamTTS({
      key: config.sarvam.api_key,
      speaker: config.sarvam.tts_speaker,
      targetLanguageCode: config.sarvam
        .tts_target_language_code as ConstructorParameters<
        typeof SarvamTTS
      >[0]['targetLanguageCode'],
      sampleRate: config.sarvam.tts_sample_rate,
    });
  }
  return new MiniMaxTTS({
    model: config.minimax.model as
      | 'speech-2.6-turbo'
      | 'speech-2.8-turbo',
    ...(config.minimax.voice_id ? { voiceId: config.minimax.voice_id } : {}),
  });
}

/**
 * MCP servers the agent may call tools from. Agora's engine performs the tool
 * calls server-side, so the browser is never in the loop.
 *
 * Per https://docs.agora.io/en/api-reference/api-ref/conversational-ai/join:
 * `name` and `endpoint` are required; `name` accepts only English letters and
 * numbers (max 48 chars) — no hyphens or underscores. `transport` is set
 * explicitly to match Agora's own documented example, even though the SDK
 * would default it to the same value.
 */
function buildMcpServers(
  config: AgentPipelineConfig,
): McpServersItem[] | undefined {
  const servers: McpServersItem[] = [];

  if (config.deal_engine_mcp_url) {
    servers.push({
      name: 'claudeEnterpriseDealEngine',
      transport: 'streamable_http',
      endpoint: config.deal_engine_mcp_url,
    });
  }

  (config.mcp_server_urls ?? []).forEach((url, i) => {
    servers.push({
      name: `mcpServer${i + 1}`,
      transport: 'streamable_http',
      endpoint: url,
    });
  });

  return servers.length ? servers : undefined;
}

function requireCredentials(): { appId: string; appCertificate: string } {
  const { appId, appCertificate } = getServerAgoraCredentials();
  if (!appId || !appCertificate) {
    throw new Error(
      'Missing Agora credentials. Set NEXT_PUBLIC_AGORA_APP_ID and NEXT_AGORA_APP_CERTIFICATE (AGORA_APP_ID / AGORA_APP_CERTIFICATE are accepted as fallbacks).',
    );
  }
  return { appId, appCertificate };
}

/**
 * Fetches the adaptive Emily persona and pipeline settings from FastAPI.
 * The Python deal engine owns stage detection and prompt construction — this
 * route never rebuilds that logic, it only transports the result into Agora.
 */
async function fetchPipelineConfig(
  conversationId: string,
  seed: ClientStartRequest['seed'],
): Promise<AgentPipelineConfig> {
  const params = new URLSearchParams({ conversation_id: conversationId });
  if (seed?.customer_name) params.set('customer_name', seed.customer_name);
  if (seed?.company) params.set('company', seed.company);
  if (seed?.email) params.set('email', seed.email);
  if (seed?.seat_count) params.set('seat_count', String(seed.seat_count));

  const res = await fetch(
    `${BACKEND_HTTP_URL}/api/agent/pipeline-config?${params.toString()}`,
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error(
      `Backend pipeline-config failed (${res.status}). Is the FastAPI server running on ${BACKEND_HTTP_URL}?`,
    );
  }
  return (await res.json()) as AgentPipelineConfig;
}

export async function POST(request: NextRequest) {
  try {
    // --- 1. Parse request ---
    const body: ClientStartRequest = await request.json();
    const { requester_id, channel_name, seed } = body;

    if (!channel_name || !requester_id) {
      return NextResponse.json(
        { error: 'channel_name and requester_id are required' },
        { status: 400 },
      );
    }

    const { appId, appCertificate } = requireCredentials();

    // Channel name is the FastAPI conversation_id — one id across RTC, the
    // cockpit WebSocket, and the post-call deal memo.
    const conversationId = channel_name;
    const config = await fetchPipelineConfig(conversationId, seed);

    // --- 2. Build the agent ---
    // area: change to Area.EU or Area.AP for European or Asia-Pacific deployments.
    const client = new AgoraClient({
      area: Area.US,
      appId,
      appCertificate,
    });

    const agent = new Agent({
      client,
      // VAD replaces the hand-rolled browser voice-activity detection: Agora's
      // cloud pipeline now owns turn-taking and barge-in.
      turnDetection: {
        config: {
          speech_threshold: 0.5,
          start_of_speech: {
            mode: 'vad',
            vad_config: {
              interrupt_duration_ms: 160,
              prefix_padding_ms: 300,
            },
          },
          end_of_speech: {
            mode: 'vad',
            vad_config: {
              silence_duration_ms: 480,
            },
          },
        },
      },
      // RTM carries transcripts, agent state, metrics and errors to the browser.
      // enable_tools keeps the deal-engine tool calls available on the custom path.
      advancedFeatures: { enable_rtm: true, enable_tools: true },
      parameters: {
        audio_scenario: 'chorus',
        data_channel: 'rtm',
        enable_error_message: true,
        enable_metrics: true,
      },
    })
      .withStt(buildStt(config))
      .withLlm(
        config.llm_mode === 'custom'
          ? // Custom path: Agora calls our FastAPI /v1/chat/completions, which
            // runs the deal engine, tool calls, CRM sync and cockpit broadcast.
            new CustomLLM({
              url: config.custom_llm_url!,
              apiKey: config.custom_llm_api_key!,
              model: config.llm_model,
              greetingMessage: config.greeting_message,
              failureMessage: config.failure_message,
              maxHistory: 32,
              mcpServers: buildMcpServers(config),
            })
          : // Managed path: Agora-hosted OpenAI credentials, driven by the
            // stage-aware persona built in backend/middleware/sales_persona.py.
            buildManagedLlm(config),
      )
      .withTts(buildTts(config));

    // remoteUids restricts the agent to only process audio from this user.
    const session = agent.createSession({
      name: `sales-agent-${channel_name}`,
      channel: channel_name,
      agentUid,
      remoteUids: [requester_id],
      idleTimeout: 60,
      expiresIn: ExpiresIn.hours(1),
      debug: false,
    });

    const agentId = await session.start();

    // Kept so /api/agent-think can inject typed messages from the cockpit's
    // text box into this live session.
    registerAgentSession(agentId, session);

    return NextResponse.json({
      agent_id: agentId,
      create_ts: Math.floor(Date.now() / 1000),
      state: 'RUNNING',
      conversation_id: conversationId,
    } as AgentResponse);
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to start conversation',
      },
      { status: 500 },
    );
  }
}
