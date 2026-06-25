from __future__ import annotations

from pathlib import Path

import pytest
from scapy.all import rdpcap

from src.demo_pcaps import write_beaconing_demo

pytest.importorskip("scapy")


def generate_beaconing_pcap(tmp_path: Path) -> Path:
    path = tmp_path / "beaconing.pcap"
    write_beaconing_demo(path)
    return path


def test_detects_beaconing_periodic_intervals(tmp_path: Path) -> None:
    from src.detectors.beaconing import detect

    pcap = generate_beaconing_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))

    assert len(alerts) == 1
    assert alerts[0].scan_type == "BEACONING"
    assert alerts[0].src_ip == "10.0.0.5"
