def test_api_health() -> None:
    from fastapi.testclient import TestClient

    from src.api import app

    client = TestClient(app)
    assert client.get("/health").json() == {"status": "ok"}
