from pathlib import Path

import pytest
from scapy.all import IP, TCP, Ether, rdpcap, wrpcap

pytest.importorskip("scapy")


def generate_port_scan_pcap(tmp_path: Path) -> Path:
    packets = [
        Ether() / IP(src="10.0.0.5", dst="10.0.0.10") / TCP(dport=port, flags="S")
        for port in range(1, 1001)
    ]
    path = tmp_path / "scan.pcap"
    wrpcap(str(path), packets)
    return path


def test_detects_tcp_syn_scan(tmp_path: Path) -> None:
    from src.detectors.port_scan import detect

    pcap = generate_port_scan_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))
    assert len(alerts) == 1
    assert alerts[0].src_ip == "10.0.0.5"
    assert alerts[0].scan_type == "TCP_SYN_SCAN"
