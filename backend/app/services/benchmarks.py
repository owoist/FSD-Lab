import json
from functools import lru_cache

from app.config import DATA_DIR
from app.schemas import BenchmarkComparison


@lru_cache
def load_benchmarks() -> list[dict]:
    with open(DATA_DIR / "benchmarks.json", encoding="utf-8") as fh:
        return json.load(fh)


def compare(monthly_total_kg: float) -> tuple[float, list[BenchmarkComparison]]:
    annual_t = monthly_total_kg * 12 / 1000
    out = [
        BenchmarkComparison(
            benchmark_id=b["benchmark_id"],
            label=b["label"],
            annual_per_capita_tco2e=b["annual_per_capita_tco2e"],
            user_annualised_tco2e=round(annual_t, 3),
            ratio=round(annual_t / b["annual_per_capita_tco2e"], 2),
            source=b["source"],
        )
        for b in load_benchmarks()
    ]
    return round(annual_t, 3), out