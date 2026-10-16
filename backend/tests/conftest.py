import pytest
from fastapi.testclient import TestClient

from app.config import DATA_DIR
from app.core.factors import FactorTable
from app.main import app


@pytest.fixture(scope="session")
def factors():
    return FactorTable.from_csv(DATA_DIR / "emission_factors.csv")


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:     # runs lifespan (seeding)
        yield c