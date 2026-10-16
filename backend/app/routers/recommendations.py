from fastapi import APIRouter, Request

from app.schemas import FootprintInput, Recommendation
from app.services.recommendations import recommend

router = APIRouter()


@router.post("/recommendations", response_model=list[Recommendation])
def recommendations(payload: FootprintInput, request: Request):
    return recommend(payload, request.app.state.factors)