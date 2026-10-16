from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.engine import calculate_footprint
from app.core.factors import MissingFactorError
from app.db import get_db
from app.models import ActivityRecord, FootprintReport
from app.schemas import CalculateResponse, FootprintInput
from app.services.benchmarks import compare

router = APIRouter()


@router.post("/calculate", response_model=CalculateResponse)
def calculate(
    payload: FootprintInput,
    request: Request,
    save: bool = Query(False, description="Persist the report and return its id"),
    db: Session = Depends(get_db),
):
    try:
        result = calculate_footprint(payload, request.app.state.factors)
    except MissingFactorError as e:
        raise HTTPException(status_code=422, detail=str(e))

    annual_t, comparisons = compare(result.total)
    response = CalculateResponse(
        **result.model_dump(), annualised_tco2e=annual_t, comparisons=comparisons
    )

    if save:
        report = FootprintReport(
            region=payload.region,
            period=payload.period,
            total_kg_co2e=result.total,
            methodology_version=result.methodology_version,
            result_json="",
            activities=[
                ActivityRecord(category=i.category, activity_type=i.activity_type,
                               quantity=i.quantity, unit=i.unit, kg_co2e=i.kg_co2e)
                for i in result.line_items
            ],
        )
        db.add(report)
        db.flush()                      # assigns report_id
        response.report_id = report.report_id
        report.result_json = response.model_dump_json()
        db.commit()

    return response