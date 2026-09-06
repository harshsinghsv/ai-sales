"""
Unit tests for the Deal Engine & Concession Ladder.
"""
import pytest
from backend.deal_engine.engine import (
    determine_tier,
    calculate_quote,
    evaluate_concession_request,
    TIERS
)


def test_determine_tier():
    assert determine_tier(5) == "starter"
    assert determine_tier(14) == "starter"
    assert determine_tier(15) == "pro"
    assert determine_tier(74) == "pro"
    assert determine_tier(75) == "enterprise"
    assert determine_tier(200) == "enterprise"


def test_standard_list_quote():
    # 20 seats -> Pro tier ($35/seat)
    quote = calculate_quote(seat_count=20, requested_discount_pct=0.0)
    assert quote.tier == "pro"
    assert quote.list_price_per_seat == 35.0
    assert quote.effective_price_per_seat == 35.0
    assert quote.monthly_list_total == 700.0
    assert quote.annual_list_total == 8400.0
    assert quote.discount_pct == 0.0
    assert not quote.is_floor_breached
    assert len(quote.trades_required) == 0


def test_concession_within_margin_floor():
    # 50 seats on Pro tier, asking for 10% discount (floor is 15%)
    result = evaluate_concession_request(seat_count=50, requested_discount_pct=10.0, current_tier="pro")
    assert result["status"] == "conditional_approval"
    assert result["approved_discount_pct"] == 10.0
    assert result["required_trade"] is not None
    assert "2-year" in result["required_trade"]

    quote = result["quote"]
    assert quote["discount_pct"] == 10.0
    assert quote["effective_price_per_seat"] == 31.5  # 35 - 3.5
    assert not quote["is_floor_breached"]


def test_margin_floor_breach_and_alternative_levers():
    # 100 seats on Enterprise ($65/seat, floor is 25%), customer asks for 35% discount
    result = evaluate_concession_request(seat_count=100, requested_discount_pct=35.0, current_tier="enterprise")
    assert result["status"] == "declined_with_counter"
    assert result["approved_discount_pct"] == 25.0  # Held strictly at floor
    assert len(result["alternative_levers"]) > 0

    quote = result["quote"]
    assert quote["is_floor_breached"] is True
    assert quote["discount_pct"] == 25.0
    assert quote["effective_price_per_seat"] == 48.75  # 65 * 0.75
    # Must offer non-price levers like white-glove onboarding
    lever_names = [l["name"] for l in result["alternative_levers"]]
    assert any("Onboarding" in name for name in lever_names)
