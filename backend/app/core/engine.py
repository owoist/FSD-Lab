from app.config import DAYS_PER_MONTH, METHODOLOGY_VERSION
from app.core.factors import FactorTable
from app.schemas import FootprintInput, FootprintResult, LineItem


def calculate_footprint(inp: FootprintInput, factors: FactorTable) -> FootprintResult:
    """The single calculation engine. API, tests, recommendations and
    report generation must all call this rather than re-implement formulas."""
    items: list[LineItem] = []

    def add(category, activity_type, quantity, unit):
        if quantity <= 0:
            return
        f = factors.get(activity_type, inp.region)
        items.append(
            LineItem(
                category=category,
                activity_type=activity_type,
                quantity=quantity,
                unit=unit,
                factor_value=f.value,
                factor_unit=f.unit,
                factor_region=f.region,
                source=f.source,
                kg_co2e=round(quantity * f.value, 3),
            )
        )

    add("electricity", "electricity.grid", inp.electricity_kwh, "kWh")

    # Merge repeated modes so the same mode isn't listed twice
    km_by_mode: dict[str, float] = {}
    for t in inp.trips:
        km_by_mode[t.mode] = km_by_mode.get(t.mode, 0) + t.distance_km
    for mode, km in km_by_mode.items():
        add("transport", f"transport.{mode}", km, "km")

    add("transport", "flight.short_haul", inp.flight_km_short_haul, "km")
    add("transport", "flight.long_haul", inp.flight_km_long_haul, "km")

    add("food", f"diet.{inp.diet_type}", DAYS_PER_MONTH, "day")
    add("other", "other.spend", inp.other_spend_usd, "USD")

    categories = {"electricity": 0.0, "transport": 0.0, "food": 0.0, "other": 0.0}
    for it in items:
        categories[it.category] += it.kg_co2e
    categories = {k: round(v, 3) for k, v in categories.items()}

    assumptions = [
        f"A month is treated as {DAYS_PER_MONTH} days.",
        "Diet is a per-day average for the selected diet type, not itemised meals.",
        "Transport distances are per-person (passenger-km); no car-sharing adjustment.",
        "Flight factors exclude radiative-forcing multipliers.",
    ]
    fallbacks = sorted({i.activity_type for i in items if i.factor_region != inp.region})
    if fallbacks:
        assumptions.append(
            f"No '{inp.region}'-specific factor for {', '.join(fallbacks)}; GLOBAL factors were used."
        )

    return FootprintResult(
        period=inp.period,
        total=round(sum(categories.values()), 3),
        categories=categories,
        line_items=items,
        assumptions=assumptions,
        methodology_version=METHODOLOGY_VERSION,
    )