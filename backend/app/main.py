from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.config import CORS_ORIGINS, DATA_DIR, METHODOLOGY_VERSION
from app.core.factors import FactorTable
from app.db import Base, SessionLocal, engine
from app.models import EmissionFactor
from app.routers import benchmarks, calculate, factors, health, recommendations, reports


def seed_factors() -> None:
    """Load the CSV into the DB once, then build the in-memory FactorTable from the DB."""
    table = FactorTable.from_csv(DATA_DIR / "emission_factors.csv")
    with SessionLocal() as db:
        if db.scalars(select(EmissionFactor).limit(1)).first() is None:
            import csv
            with open(DATA_DIR / "emission_factors.csv", newline="", encoding="utf-8") as fh:
                for r in csv.DictReader(fh):
                    db.add(EmissionFactor(
                        activity_type=r["activity_type"], region=r["region"],
                        factor_value=float(r["factor_value"]), factor_unit=r["factor_unit"],
                        source=r["source"],
                        source_year=int(r["source_year"]) if r["source_year"] else None))
            db.commit()
    return table


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    seed_factors()
    with SessionLocal() as db:
        rows = db.scalars(select(EmissionFactor)).all()
        app.state.factors = FactorTable.from_rows(
            {"activity_type": r.activity_type, "region": r.region,
             "factor_value": r.factor_value, "factor_unit": r.factor_unit,
             "source": r.source, "source_year": r.source_year} for r in rows)
    yield


app = FastAPI(title="Ecometrics API", version=METHODOLOGY_VERSION, lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS,
                   allow_methods=["*"], allow_headers=["*"])

for r in (health, factors, calculate, benchmarks, recommendations, reports):
    app.include_router(r.router, prefix="/api")