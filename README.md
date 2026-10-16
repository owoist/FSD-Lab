# Ecometrics

### Run it
```bash
cd backend
python -m venv .venv && source .venv\Scripts\activate
pip install -r requirements.txt
pytest
uvicorn app.main:app --reload
```

Then open http://localhost:8000/docs for API docs.

### To-do
- Replace every PLACEHOLDER row in CSV data with a sourced factor, and record the source and year. Without that, the app produces plausible-looking but unverified results.