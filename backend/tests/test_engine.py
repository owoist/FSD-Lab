import pytest

from app.core.engine import calculate_footprint
from app.core.factors import Factor, FactorTable, MissingFactorError
from app.schemas import FootprintInput, Trip


def tiny_table():
    return FactorTable([
        Factor("electricity.grid", "GLOBAL", 0.5, "kg/kWh", "test"),
        Factor("electricity.grid", "India", 0.8, "kg/kWh", "test"),
        Factor("transport.car_petrol", "GLOBAL", 0.2, "kg/km", "test"),
        Factor("diet.mixed", "GLOBAL", 4.0, "kg/day", "test"),
    ])


def test_known_values():
    inp = FootprintInput(region="GLOBAL", electricity_kwh=100,
                         trips=[Trip(mode="car_petrol", distance_km=50)], diet_type="mixed")
    r = calculate_footprint(inp, tiny_table())
    assert r.categories["electricity"] == 50.0
    assert r.categories["transport"] == 10.0
    assert r.categories["food"] == 120.0       # 4.0 * 30 days
    assert r.total == 180.0


def test_region_specific_factor_wins():
    r = calculate_footprint(FootprintInput(region="India", electricity_kwh=100), tiny_table())
    assert r.categories["electricity"] == 80.0


def test_missing_factor_raises():
    inp = FootprintInput(flight_km_short_haul=100)
    with pytest.raises(MissingFactorError):
        calculate_footprint(inp, tiny_table())


def test_negative_input_rejected():
    with pytest.raises(ValueError):
        FootprintInput(electricity_kwh=-5)


def test_total_equals_sum_of_categories(factors):
    r = calculate_footprint(FootprintInput(electricity_kwh=180,
                            trips=[Trip(mode="bus", distance_km=100)]), factors)
    assert r.total == pytest.approx(sum(r.categories.values()))