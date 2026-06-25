from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from scapy.all import IP, TCP, Ether, wrpcap

from src.api import app

pytest.importorskip("scapy")


def generate_port_scan_pcap(tmp_path: Path) -> Path:
    packets = [
        Ether() / IP(src="10.0.0.5", dst="10.0.0.10") / TCP(dport=port, flags="S")
        for port in range(1, 200)
    ]
    path = tmp_path / "scan.pcap"
    wrpcap(str(path), packets)
    return path


def test_analyze_returns_alerts(tmp_path: Path) -> None:
    client = TestClient(app)
    pcap = generate_port_scan_pcap(tmp_path)
    data = pcap.read_bytes()

    r = client.post(
        "/analyze",
        files={"file": ("scan.pcap", data, "application/vnd.tcpdump.pcap")},
    )
    assert r.status_code == 200
    payload = r.json()

    assert payload["count"] >= 1
    assert any(a["scan_type"] == "TCP_SYN_SCAN" for a in payload["alerts"])


def test_stream_websocket_stub() -> None:
    client = TestClient(app)
    with client.websocket_connect("/stream") as ws:
        hello = ws.receive_json()
        assert hello["type"] == "hello"

        ws.send_text("hi")
        msg = ws.receive_json()
        assert msg["type"] == "info"
