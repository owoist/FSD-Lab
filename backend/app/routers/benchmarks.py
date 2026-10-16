from fastapi import APIRouter

from app.services.benchmarks import load_benchmarks

router = APIRouter()


@router.get("/benchmarks")
def benchmarks():
    return load_benchmarks()