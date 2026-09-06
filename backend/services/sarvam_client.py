"""
Sarvam AI integration service.
Handles Chat Completions for natural Hinglish conversation and function tool calls.
Supports Sarvam-105b-conversations / Sarvam-105b / Sarvam-m.
"""
import logging
from typing import Dict, Any, List, Optional
import httpx
from backend.config import settings

logger = logging.getLogger("sarvam_client")


SYSTEM_SALES_PERSONA = """
You are Emily, a senior enterprise sales executive at TeamSync (a high-performance collaborative project & workstream management platform, competing against Jira and Asana).
Your goal is to qualify inbound leads, understand their team workflows, present the right pricing tier, handle objections with confidence, and negotiate deals using our concession ladder.

Key Guidelines:
1. Tone: Warm, executive, natural Indian code-switching (Hinglish/English). Use conversational fillers naturally (e.g., "Bilkul", "Definitely", "Sunie", "Fair enough").
2. Memory: Remember previously mentioned team sizes, names, and requirements. Never ask the customer twice for information they already shared. You are given the full conversation so far — read it before replying. Never repeat a pitch, quote, or explanation you already gave earlier in this same conversation; move the conversation forward instead (ask a new question, address a new point, or advance to next steps).
3. Objections:
   - Competitor (Jira/Asana): "Jira is great for legacy issue tracking, but engineering teams spend 4 hours a week just updating tickets. TeamSync automates sprint syncs directly from GitHub PRs with zero manual updates."
   - Pricing: Hold our value. Never grant a discount without demanding a concession in return (e.g., annual commitment, multi-year, or case study).
   - Trust/Security: "We have SOC-2 Type II, ISO 27001, and our data centers are hosted locally in Mumbai (AWS ap-south-1) with 99.99% SLA."
4. Tool Discipline:
   - When asked about pricing or changing seat counts, call `get_pricing`.
   - When customer asks for a discount, call `apply_discount`. If the discount is above the margin floor, politely state the floor, offer our counter-offer with the required trade, and offer complimentary onboarding as an alternative lever.
   - When customer wants a demo or meeting with enterprise sales, call `book_meeting` and `create_crm_lead`.
   - If customer asks to talk to a human or requested terms cannot be resolved, call `escalate_to_human`.
"""


class SarvamClient:
    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY
        self.chat_url = settings.SARVAM_CHAT_URL
        self.model = settings.SARVAM_CHAT_MODEL

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.6,
        max_tokens: int = 300,
    ) -> Dict[str, Any]:
        """
        Frontier-first provider cascade for the custom-middleware path:
        OpenAI -> Groq -> Gemini -> Sarvam (Hinglish specialist) -> local.
        Replies are capped for voice (short, speech-ready turns).
        """
        # 1. Primary: OpenAI (frontier quality when a key is configured)
        if settings.OPENAI_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                if tools:
                    payload["tools"] = tools

                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                    response.raise_for_status()
                    return response.json()
            except Exception as e:
                logger.error(f"Error calling OpenAI API: {e}. Checking alternative provider.")

        # 2. Secondary: Groq API (Ultra-fast 500 tok/s Llama-3.3-70b raw generation)
        if settings.GROQ_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                if tools:
                    payload["tools"] = tools

                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                    response.raise_for_status()
                    return response.json()
            except Exception as e:
                logger.error(f"Error calling Groq API: {e}")

        # 3. Tertiary: Google Gemini (OpenAI compatible endpoint)
        if settings.GEMINI_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.GEMINI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gemini-1.5-flash",
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                if tools:
                    payload["tools"] = tools

                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.post("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", headers=headers, json=payload)
                    response.raise_for_status()
                    return response.json()
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}")

        # 4. Quaternary: Sarvam AI (Hinglish specialist fallback)
        if self.is_configured:
            headers = {
                "api-subscription-key": self.api_key,
                "Content-Type": "application/json"
            }
            payload: Dict[str, Any] = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if tools:
                payload["tools"] = tools

            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(self.chat_url, headers=headers, json=payload)
                    response.raise_for_status()
                    return response.json()
            except Exception as e:
                logger.error(f"Error calling Sarvam Chat API: {e}. Checking alternative provider.")

        # 5. Contextual Local Sales Intelligence (fallback when no API keys are provided)
        return self._generate_local_response(messages)

    def _generate_local_response(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Intelligent Hinglish B2B sales dialogue engine for seamless conversational flow.
        """
        last_user_msg = ""
        user_turn_count = 0
        for m in reversed(messages):
            if m.get("role") == "user":
                user_turn_count += 1
                if not last_user_msg:
                    last_user_msg = m.get("content", "").lower()

        # 1. Competitor objection
        if any(w in last_user_msg for w in ["jira", "asana", "linear", "clickup", "competitor", "difference", "compare"]):
            reply = (
                "Bilkul valid sawaal hai! Jira is widely used, lekin most engineering squads complain that developers "
                "spend hours manually updating statuses. TeamSync automatically syncs from GitHub commits and PRs, "
                "aur hamara real-time sprint dashboard eliminates status meetings completely. "
                "Aapki current team size kitni hai so I can share relevant engineering case studies?"
            )
        # 2. Exploring pricing / plans / costs
        elif any(w in last_user_msg for w in ["pricing", "price", "explor", "cost", "tier", "plan", "how much", "rate", "charge"]):
            reply = (
                "Bilkul! Humare paas three transparent tiers hain: "
                "Starter at $15/seat/month for agile squads, "
                "Pro at $35/seat/month with automated GitHub sync and sprint velocity tracking, "
                "aur Enterprise at $65/seat/month with custom SSO, SOC-2 compliance, and a dedicated Technical Account Manager. "
                "Aapki engineering team mein approximately kitne engineers hain so I can give you an exact quote?"
            )
        # 3. Seat size / volume
        elif any(w in last_user_msg for w in ["seats", "users", "people", "team", "engineers", "devs"]):
            reply = (
                "Understood! Team size ke hisaab se we structure tailored rollout terms. "
                "For high-growth teams, our Pro and Enterprise tiers include dedicated onboarding support. "
                "Are you planning a month-to-month rollout or an annual agreement?"
            )
        # 4. Pricing objection / discount negotiation
        elif any(w in last_user_msg for w in ["discount", "cheaper", "expensive", "budget", "reduce", "percent", "%", "deal", "negotiate", "less"]):
            reply = (
                "Dekhiye, on standard month-to-month billing our prices are fixed to maintain top-tier infrastructure. "
                "Lekin agar aap annual upfront ya multi-quarter commitment consider kar rahe hain, "
                "to I can unlock up to 10% to 15% discount for your team. "
                "What contract duration works best for your finance cycle?"
            )
        # 5. Features / Security / Integrations
        elif any(w in last_user_msg for w in ["feature", "security", "sso", "soc", "github", "gitlab", "integration", "compliance"]):
            reply = (
                "TeamSync offers enterprise-grade SOC-2 Type II compliance, SAML/Okta SSO, and automated GitHub/GitLab bi-directional sync. "
                "Hamare automated sprint triggers ensure zero manual data entry for developers. "
                "Are there specific compliance requirements your security team needs?"
            )
        # 6. Meeting / demo booking
        elif any(w in last_user_msg for w in ["demo", "meeting", "call", "schedule", "book", "connect", "calendar"]):
            reply = (
                "Fantastic! Main ek dedicated solution architect ke saath live 30-minute deep dive demo schedule kar deta hoon. "
                "Could you please share your work email address aur preferred time tomorrow?"
            )
        # 7. Escalation to human
        elif any(w in last_user_msg for w in ["human", "manager", "escalate", "speak to someone", "representative", "specialist", "agent"]):
            reply = (
                "Haan bilkul, main hamare Senior Enterprise Director ko instantly loop in kar raha hoon. "
                "I've logged our conversation notes and deal context in HubSpot so they have complete background."
            )
        # 8. Greetings / Chit-chat
        elif any(w in last_user_msg for w in ["hi", "hello", "hey", "namaste", "morning", "afternoon", "evening"]):
            reply = (
                "Namaste! Glad to connect with you. How can I assist you with TeamSync today — "
                "would you like to review our automated sprint workflows, or explore pricing tiers for your team?"
            )
        # 9. Conversational fallback (Never repeats the introductory greeting)
        else:
            reply = (
                "Understood! TeamSync helps high-velocity engineering squads eliminate status meetings and automate sprint execution from Git commits. "
                "Are you evaluating this for an immediate sprint rollout, or comparing against your current tools?"
            )

        return {
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": reply
                    }
                }
            ]
        }


sarvam_client = SarvamClient()
