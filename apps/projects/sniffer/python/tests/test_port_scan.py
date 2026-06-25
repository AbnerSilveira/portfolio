from pathlib import Path

import pytest
from scapy.all import rdpcap

from src.demo_pcaps import write_port_scan_demo

pytest.importorskip("scapy")


def generate_port_scan_pcap(tmp_path: Path) -> Path:
    path = tmp_path / "scan.pcap"
    write_port_scan_demo(path)
    return path


def test_detects_tcp_syn_scan(tmp_path: Path) -> None:
    from src.detectors.port_scan import detect

    pcap = generate_port_scan_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))
    assert len(alerts) == 1
    assert alerts[0].src_ip == "10.0.0.5"
    assert alerts[0].scan_type == "TCP_SYN_SCAN"
