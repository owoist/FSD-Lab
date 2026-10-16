from typing import Literal

from pydantic import BaseModel, Field

TransportMode = Literal[
    "car_petrol", "car_diesel", "car_ev", "two_wheeler", "bus", "metro_rail"
]
DietType = Literal["vegan", "vegetarian", "mixed", "meat_heavy"]
Category = Literal["electricity", "transport", "food", "other"]


class Trip(BaseModel):
    mode: TransportMode
    distance_km: float = Field(ge=0, le=100_000, description="Total km per month for this mode")


class FootprintInput(BaseModel):
    period: Literal["monthly"] = "monthly"
    region: str = Field(default="GLOBAL", max_length=64)
    electricity_kwh: float = Field(default=0, ge=0, le=100_000)
    trips: list[Trip] = Field(default_factory=list, max_length=20)
    flight_km_short_haul: float = Field(default=0, ge=0, le=1_000_000)
    flight_km_long_haul: float = Field(default=0, ge=0, le=1_000_000)
    diet_type: DietType = "mixed"
    other_spend_usd: float = Field(default=0, ge=0, le=10_000_000,
                                   description="Monthly spend on goods/services, USD")


class LineItem(BaseModel):
    category: Category
    activity_type: str
    quantity: float
    unit: str
    factor_value: float
    factor_unit: str
    factor_region: str          # region actually used (may be GLOBAL fallback)
    source: str
    kg_co2e: float


class FootprintResult(BaseModel):
    period: str
    unit: str = "kg CO2e"
    total: float
    categories: dict[Category, float]
    line_items: list[LineItem]
    assumptions: list[str]
    methodology_version: str


class BenchmarkComparison(BaseModel):
    benchmark_id: str
    label: str
    annual_per_capita_tco2e: float
    user_annualised_tco2e: float
    ratio: float                # user / benchmark
    source: str


class CalculateResponse(FootprintResult):
    annualised_tco2e: float
    comparisons: list[BenchmarkComparison]
    report_id: int | None = None


class Recommendation(BaseModel):
    id: str
    category: Category
    action_text: str
    estimated_savings_kg_co2e_monthly: float
    percent_of_total: float


class FactorOut(BaseModel):
    activity_type: str
    region: str
    factor_value: float
    factor_unit: str
    source: str
    source_year: int | None