"""
Deal Engine: Rule-based pricing, concession ladder, and margin floor enforcement.
Core Principle: "Never gives a discount without asking for something back, and never breaches the margin floor."
"""
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# Pricing Tiers for Claude Enterprise
TIERS: Dict[str, Dict[str, Any]] = {
    "starter": {
        "name": "Claude Pro & Team",
        "price_per_seat_monthly": 15.0,
        "min_seats": 5,
        "max_seats": 20,
        "margin_floor_pct": 5.0,  # Max allowable discount is 5%
        "features": [
            "Claude Sonnet 5 access",
            "Standard context window & Artifacts",
            "Shared team project workspaces",
            "Standard email support"
        ]
    },
    "pro": {
        "name": "Claude Enterprise Team",
        "price_per_seat_monthly": 35.0,
        "min_seats": 15,
        "max_seats": 100,
        "margin_floor_pct": 15.0,  # Max allowable discount is 15%
        "features": [
            "Claude Opus 5 access (standard quota)",
            "1M+ token context window",
            "Native GitHub repository sync & PR review",
            "Enterprise Projects with custom instructions",
            "Priority latency & 99.9% uptime SLA"
        ]
    },
    "enterprise": {
        "name": "Claude Enterprise",
        "price_per_seat_monthly": 65.0,
        "min_seats": 50,
        "max_seats": 10000,
        "margin_floor_pct": 25.0,  # Max allowable discount is 25%
        "features": [
            "Flagship Claude Opus 5 with native deep reasoning",
            "Expanded 1,000,000-token (1M) context window",
            "Zero data retention & no model training guarantee",
            "Enterprise SSO (SAML/Okta/Azure AD) & SCIM sync",
            "SOC-2 Type II, HIPAA compliance & audit logging",
            "Dedicated Anthropic Solutions Architect & 99.99% SLA"
        ]
    }
}

# Concession ladder mapping: every discount percentage requires an explicit trade
CONCESSION_LADDER = [
    {
        "max_discount_pct": 5.0,
        "trade_required": "Annual upfront commitment",
        "description": "Commit to a 1-year annual billing upfront."
    },
    {
        "max_discount_pct": 10.0,
        "trade_required": "2-year contract term with annual billing",
        "description": "Commit to a 2-year multi-year agreement."
    },
    {
        "max_discount_pct": 15.0,
        "trade_required": "2-year contract + Co-marketing case study & logo rights",
        "description": "2-year agreement plus agreed public case study and logo reference."
    },
    {
        "max_discount_pct": 20.0,
        "trade_required": "3-year contract + Case study + Quarterly upfront payment",
        "description": "3-year enterprise commitment with upfront quarterly billing schedule."
    },
    {
        "max_discount_pct": 25.0,
        "trade_required": "3-year contract (>100 seats) + Executive sponsorship + Reference customer",
        "description": "3-year tier-1 enterprise partnership agreement."
    }
]

# Non-price levers offered when requested discount breaches margin floor
ALTERNATIVE_LEVERS = [
    {
        "name": "Complimentary White-Glove Onboarding",
        "value": "$2,500 value waived",
        "pitch": "Free assisted codebase ingestion, prompt architecture workshops, and team rollout."
    },
    {
        "name": "Phased Seat Ramp",
        "value": "Pay for active users first",
        "pitch": "Start billing at initial pilot headcount for month 1 and ramp up to full enterprise seats."
    },
    {
        "name": "Extended Payment Terms",
        "value": "Net 45 / Net 60",
        "pitch": "Flexible payment cycles to align with your corporate fiscal calendar."
    },
    {
        "name": "Dedicated Anthropic Solutions Architect",
        "value": "Enterprise Tier Perk",
        "pitch": "Direct weekly access to Anthropic technical staff for complex model integrations."
    }
]


class PricingQuote(BaseModel):
    tier: str
    tier_name: str
    seat_count: int
    list_price_per_seat: float
    monthly_list_total: float
    annual_list_total: float
    discount_pct: float
    effective_price_per_seat: float
    monthly_discounted_total: float
    annual_discounted_total: float
    margin_floor_pct: float
    concessions_given: List[str]
    trades_required: List[str]
    is_floor_breached: bool = False
    alternative_levers: List[Dict[str, str]] = Field(default_factory=list)


def determine_tier(seat_count: int) -> str:
    """Recommend or match tier based on seat count."""
    if seat_count < 15:
        return "starter"
    elif seat_count < 75:
        return "pro"
    else:
        return "enterprise"


def calculate_quote(
    seat_count: int,
    requested_discount_pct: float = 0.0,
    requested_tier: Optional[str] = None
) -> PricingQuote:
    """
    Calculate pricing, validate against margin floor, and determine necessary trade.
    """
    tier_key = (requested_tier or determine_tier(seat_count)).lower()
    if tier_key not in TIERS:
        tier_key = determine_tier(seat_count)

    tier_info = TIERS[tier_key]
    list_price = tier_info["price_per_seat_monthly"]
    margin_floor = tier_info["margin_floor_pct"]

    monthly_list = seat_count * list_price
    annual_list = monthly_list * 12

    # Check if discount exceeds margin floor
    is_breached = requested_discount_pct > margin_floor

    effective_discount_pct = min(requested_discount_pct, margin_floor) if is_breached else requested_discount_pct
    effective_price = list_price * (1.0 - effective_discount_pct / 100.0)
    monthly_discounted = seat_count * effective_price
    annual_discounted = monthly_discounted * 12

    concessions: List[str] = []
    trades: List[str] = []

    if effective_discount_pct > 0:
        concessions.append(f"{effective_discount_pct:.1f}% discount off standard seat license")
        # Identify matched trade from concession ladder
        matched_ladder = None
        for step in CONCESSION_LADDER:
            if effective_discount_pct <= step["max_discount_pct"]:
                matched_ladder = step
                break
        if not matched_ladder and CONCESSION_LADDER:
            matched_ladder = CONCESSION_LADDER[-1]

        if matched_ladder:
            trades.append(matched_ladder["trade_required"])

    alt_levers: List[Dict[str, str]] = []
    if is_breached:
        alt_levers = ALTERNATIVE_LEVERS

    return PricingQuote(
        tier=tier_key,
        tier_name=tier_info["name"],
        seat_count=seat_count,
        list_price_per_seat=list_price,
        monthly_list_total=round(monthly_list, 2),
        annual_list_total=round(annual_list, 2),
        discount_pct=round(effective_discount_pct, 1),
        effective_price_per_seat=round(effective_price, 2),
        monthly_discounted_total=round(monthly_discounted, 2),
        annual_discounted_total=round(annual_discounted, 2),
        margin_floor_pct=margin_floor,
        concessions_given=concessions,
        trades_required=trades,
        is_floor_breached=is_breached,
        alternative_levers=alt_levers
    )


def evaluate_concession_request(
    seat_count: int,
    requested_discount_pct: float,
    current_tier: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates customer's discount request.
    Returns structured decision: whether approved, countered, or declined with alternatives.
    """
    quote = calculate_quote(seat_count, requested_discount_pct, current_tier)

    if quote.is_floor_breached:
        return {
            "status": "declined_with_counter",
            "message": (
                f"We cannot offer {requested_discount_pct:.0f}% because our hard enterprise margin floor "
                f"for the {quote.tier_name} plan is {quote.margin_floor_pct:.0f}%. "
                f"However, we can do {quote.margin_floor_pct:.0f}% off in exchange for a {quote.trades_required[0] if quote.trades_required else 'annual commitment'}, "
                f"plus we can include complimentary white-glove team onboarding ($2,500 value) to bridge the difference."
            ),
            "approved_discount_pct": quote.margin_floor_pct,
            "max_allowed_discount_pct": quote.margin_floor_pct,
            "required_trade": quote.trades_required[0] if quote.trades_required else "Annual upfront commitment",
            "alternative_levers": quote.alternative_levers,
            "quote": quote.model_dump()
        }
    elif requested_discount_pct > 0:
        required_trade = quote.trades_required[0] if quote.trades_required else "Annual upfront commitment"
        return {
            "status": "conditional_approval",
            "message": (
                f"I can approve a {requested_discount_pct:.0f}% discount, bringing your effective price down to "
                f"${quote.effective_price_per_seat:.2f}/seat/month (${quote.monthly_discounted_total:.0f}/month total). "
                f"To lock in this pricing, our requirement is {required_trade}. Does that work for your timeline?"
            ),
            "approved_discount_pct": requested_discount_pct,
            "max_allowed_discount_pct": quote.margin_floor_pct,
            "required_trade": required_trade,
            "alternative_levers": [],
            "quote": quote.model_dump()
        }
    else:
        return {
            "status": "list_price",
            "message": (
                f"For {seat_count} seats on {quote.tier_name}, standard pricing is "
                f"${quote.list_price_per_seat:.2f}/seat/month (${quote.monthly_list_total:.0f}/month total)."
            ),
            "approved_discount_pct": 0.0,
            "max_allowed_discount_pct": quote.margin_floor_pct,
            "required_trade": None,
            "alternative_levers": [],
            "quote": quote.model_dump()
        }
