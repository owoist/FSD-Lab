import csv
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

FALLBACK_REGION = "GLOBAL"


class MissingFactorError(KeyError):
    pass


@dataclass(frozen=True)
class Factor:
    activity_type: str
    region: str
    value: float
    unit: str
    source: str
    source_year: int | None = None


class FactorTable:
    """Lookup of emission factors with region -> GLOBAL fallback."""

    def __init__(self, factors: Iterable[Factor]):
        self._by_key = {(f.activity_type, f.region): f for f in factors}

    def get(self, activity_type: str, region: str) -> Factor:
        for r in (region, FALLBACK_REGION):
            f = self._by_key.get((activity_type, r))
            if f:
                return f
        raise MissingFactorError(f"No emission factor for '{activity_type}' in '{region}' or GLOBAL")

    def regions(self) -> set[str]:
        return {r for _, r in self._by_key}

    @classmethod
    def from_rows(cls, rows: Iterable[dict]) -> "FactorTable":
        return cls(
            Factor(
                activity_type=r["activity_type"],
                region=r["region"],
                value=float(r["factor_value"]),
                unit=r["factor_unit"],
                source=r["source"],
                source_year=int(r["source_year"]) if r.get("source_year") else None,
            )
            for r in rows
        )

    @classmethod
    def from_csv(cls, path: Path) -> "FactorTable":
        with open(path, newline="", encoding="utf-8") as fh:
            return cls.from_rows(csv.DictReader(fh))