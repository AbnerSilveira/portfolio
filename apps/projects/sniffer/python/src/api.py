"""FastAPI — upload PCAP e análise (Semana 1)."""

from __future__ import annotations

import contextlib
import os
import tempfile
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from scapy.all import rdpcap

from src.pipeline import run_pipeline

app = FastAPI(title="Sniffer Analyzer", version="0.1.0")

MAX_PCAP_BYTES = 50 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pcap", ".pcapng"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Upload de PCAP/PCAPNG e execução do pipeline de detectores.

    Restrições (roadmap):
    - tamanho máx 50MB
    - não captura live; trabalha sobre arquivo
    """

    filename = (file.filename or "").lower()
    _, ext = os.path.splitext(filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    data = await file.read(MAX_PCAP_BYTES + 1)
    if len(data) > MAX_PCAP_BYTES:
        raise HTTPException(status_code=413, detail="PCAP too large (max 50MB)")

    # rdpcap lê melhor a partir de path. No Windows, NamedTemporaryFile aberto
    # não pode ser reaberto (PermissionError), então criamos/fechamos antes.
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp_path = tmp.name
            tmp.write(data)
            tmp.flush()
        packets = rdpcap(tmp_path)
    finally:
        if tmp_path:
            with contextlib.suppress(OSError):
                os.unlink(tmp_path)

    alerts = run_pipeline(list(packets))
    return {
        "alerts": [a.__dict__ for a in alerts],
        "count": len(alerts),
    }


@app.websocket("/stream")
async def stream(ws: WebSocket) -> None:
    """
    WebSocket (Semana 1 dia 6).

    Captura live não é suportada no deploy (Fly). Este endpoint é um stub útil para a UI:
    - aceita mensagens do cliente
    - responde com status/progresso básico
    """

    await ws.accept()
    try:
        await ws.send_json({"type": "hello", "status": "ok"})
        while True:
            msg = await ws.receive_text()
            if msg.strip().lower() in {"close", "quit", "exit"}:
                await ws.send_json({"type": "bye"})
                return
            await ws.send_json(
                {
                    "type": "info",
                    "message": "Live capture is not supported here. Use POST /analyze with a PCAP file.",
                },
            )
    except WebSocketDisconnect:
        return
