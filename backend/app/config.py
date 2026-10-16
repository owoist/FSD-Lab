import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./footprint.db")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
METHODOLOGY_VERSION = "1.0"
DAYS_PER_MONTH = 30