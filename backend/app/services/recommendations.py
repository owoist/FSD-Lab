from app.core.engine import calculate_footprint
from app.core.factors import FactorTable
from app.schemas import FootprintInput, Recommendation, Trip

CAR_MODES = {"car_petrol", "car_diesel"}
MIN_SAVING_KG = 0.5


def _shift_car_to_metro(inp: FootprintInput, share: float) -> FootprintInput:
    trips: list[Trip] = []
    moved = 0.0
    for t in inp.trips:
        if t.mode in CAR_MODES:
            moved += t.distance_km * share
            trips.append(Trip(mode=t.mode, distance_km=t.distance_km * (1 - share)))
        else:
            trips.append(t)
    trips.append(Trip(mode="metro_rail", distance_km=moved))
    return inp.model_copy(update={"trips": trips})


def _car_to_ev(inp: FootprintInput) -> FootprintInput:
    trips = [Trip(mode="car_ev", distance_km=t.distance_km) if t.mode in CAR_MODES else t
             for t in inp.trips]
    return inp.model_copy(update={"trips": trips})


DIET_STEP_DOWN = {"meat_heavy": "mixed", "mixed": "vegetarian"}


def _scenarios(inp: FootprintInput):
    """Yield (id, category, text, modified_input) for applicable actions."""
    if any(t.mode in CAR_MODES and t.distance_km > 0 for t in inp.trips):
        yield ("shift_to_transit", "transport",
               "Move 30% of your car distance to metro/rail or bus.",
               _shift_car_to_metro(inp, 0.30))
        yield ("switch_to_ev", "transport",
               "Switch your car travel to an electric vehicle.",
               _car_to_ev(inp))
    if inp.diet_type in DIET_STEP_DOWN:
        nxt = DIET_STEP_DOWN[inp.diet_type]
        yield ("diet_step_down", "food",
               f"Shift from a '{inp.diet_type}' to a '{nxt}' diet.",
               inp.model_copy(update={"diet_type": nxt}))
    if inp.flight_km_short_haul + inp.flight_km_long_haul > 0:
        yield ("cut_flights", "transport",
               "Replace or skip 25% of your flying (train or video call instead).",
               inp.model_copy(update={
                   "flight_km_short_haul": inp.flight_km_short_haul * 0.75,
                   "flight_km_long_haul": inp.flight_km_long_haul * 0.75}))
    if inp.electricity_kwh > 0:
        yield ("cut_electricity", "electricity",
               "Cut electricity use by 15% (efficient appliances, AC set to 24-26 °C).",
               inp.model_copy(update={"electricity_kwh": inp.electricity_kwh * 0.85}))
    if inp.other_spend_usd > 0:
        yield ("cut_spending", "other",
               "Reduce discretionary purchases by 20% (repair, reuse, buy second-hand).",
               inp.model_copy(update={"other_spend_usd": inp.other_spend_usd * 0.80}))


def recommend(inp: FootprintInput, factors: FactorTable) -> list[Recommendation]:
    base = calculate_footprint(inp, factors).total
    recs = []
    for rid, cat, text, modified in _scenarios(inp):
        saving = base - calculate_footprint(modified, factors).total
        if saving >= MIN_SAVING_KG:
            recs.append(Recommendation(
                id=rid, category=cat, action_text=text,
                estimated_savings_kg_co2e_monthly=round(saving, 2),
                percent_of_total=round(100 * saving / base, 1) if base else 0.0,
            ))
    return sorted(recs, key=lambda r: r.estimated_savings_kg_co2e_monthly, reverse=True)