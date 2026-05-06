"""FastAPI — upload PCAP e análise (endpoints a expandir na Semana 1)."""

from __future__ import annotations

from fastapi import FastAPI

app = FastAPI(title="Sniffer Analyzer", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
