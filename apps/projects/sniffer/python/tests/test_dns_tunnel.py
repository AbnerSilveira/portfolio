from __future__ import annotations

from pathlib import Path

import pytest
from scapy.all import rdpcap

from src.demo_pcaps import write_dns_tunnel_demo

pytest.importorskip("scapy")


def generate_dns_tunnel_pcap(tmp_path: Path) -> Path:
    path = tmp_path / "dns_tunnel.pcap"
    write_dns_tunnel_demo(path)
    return path


def test_detects_dns_tunneling_by_entropy(tmp_path: Path) -> None:
    from src.detectors.dns_tunnel import detect

    pcap = generate_dns_tunnel_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))

    assert len(alerts) == 1
    assert alerts[0].scan_type == "DNS_TUNNELING"
    assert alerts[0].src_ip == "10.0.0.9"
