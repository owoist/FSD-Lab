BODY = {"region": "India", "electricity_kwh": 180,
        "trips": [{"mode": "car_petrol", "distance_km": 320}], "diet_type": "mixed"}


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_factors(client):
    r = client.get("/api/emission-factors", params={"region": "India"})
    assert r.status_code == 200 and len(r.json()) > 0


def test_calculate_and_save_roundtrip(client):
    r = client.post("/api/calculate", params={"save": True}, json=BODY)
    assert r.status_code == 200
    data = r.json()
    assert data["total"] > 0 and data["comparisons"]
    saved = client.get(f"/api/reports/{data['report_id']}")
    assert saved.status_code == 200 and saved.json()["total"] == data["total"]


def test_validation_error(client):
    r = client.post("/api/calculate", json={**BODY, "electricity_kwh": -1})
    assert r.status_code == 422


def test_recommendations_sorted(client):
    recs = client.post("/api/recommendations", json=BODY).json()
    savings = [x["estimated_savings_kg_co2e_monthly"] for x in recs]
    assert recs and savings == sorted(savings, reverse=True)


def test_unknown_report(client):
    assert client.get("/api/reports/999999").status_code == 404