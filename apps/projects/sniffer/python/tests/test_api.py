def test_api_health() -> None:
    from fastapi.testclient import TestClient

    from src.api import app

    client = TestClient(app)
    assert client.get("/health").json() == {"status": "ok"}


def test_cors_allows_vercel_preview() -> None:
    from fastapi.testclient import TestClient

    from src.api import app

    client = TestClient(app)
    response = client.options(
        "/health",
        headers={
            "Origin": "https://portfolio-abc123.vercel.app",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert (
        response.headers.get("access-control-allow-origin")
        == "https://portfolio-abc123.vercel.app"
    )
