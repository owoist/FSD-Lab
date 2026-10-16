from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import FootprintReport
from app.schemas import CalculateResponse

router = APIRouter()


@router.get("/reports/{report_id}", response_model=CalculateResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.get(FootprintReport, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return CalculateResponse.model_validate_json(report.result_json)