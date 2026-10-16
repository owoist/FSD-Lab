from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import EmissionFactor
from app.schemas import FactorOut

router = APIRouter()


@router.get("/emission-factors", response_model=list[FactorOut])
def list_factors(region: str | None = Query(None), db: Session = Depends(get_db)):
    q = select(EmissionFactor).order_by(EmissionFactor.activity_type, EmissionFactor.region)
    if region:
        q = q.where(EmissionFactor.region.in_([region, "GLOBAL"]))
    rows = db.scalars(q).all()
    return [FactorOut(activity_type=r.activity_type, region=r.region,
                      factor_value=r.factor_value, factor_unit=r.factor_unit,
                      source=r.source, source_year=r.source_year) for r in rows]