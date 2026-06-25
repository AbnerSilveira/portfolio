from pathlib import Path

import pytest
from scapy.all import rdpcap

from src.demo_pcaps import write_arp_spoof_demo

pytest.importorskip("scapy")


def generate_arp_spoof_pcap(tmp_path: Path) -> Path:
    path = tmp_path / "arp_spoof.pcap"
    write_arp_spoof_demo(path)
    return path


def test_detects_arp_spoofing_ip_to_multiple_macs(tmp_path: Path) -> None:
    from src.detectors.arp_spoof import detect

    pcap = generate_arp_spoof_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))

    assert len(alerts) == 1
    assert alerts[0].scan_type == "ARP_SPOOFING"
    assert alerts[0].src_ip == "10.0.0.1"
