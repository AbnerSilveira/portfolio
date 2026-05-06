from pathlib import Path

import pytest
from scapy.all import ARP, Ether, rdpcap, wrpcap

pytest.importorskip("scapy")


def generate_arp_spoof_pcap(tmp_path: Path) -> Path:
    """
    Gera um PCAP sintético com conflito:
    o mesmo IP (10.0.0.1) aparece respondendo com dois MACs diferentes.
    """
    pkts = [
        Ether(src="aa:aa:aa:aa:aa:aa", dst="ff:ff:ff:ff:ff:ff")
        / ARP(op=2, psrc="10.0.0.1", hwsrc="aa:aa:aa:aa:aa:aa", pdst="10.0.0.2"),
        Ether(src="bb:bb:bb:bb:bb:bb", dst="ff:ff:ff:ff:ff:ff")
        / ARP(op=2, psrc="10.0.0.1", hwsrc="bb:bb:bb:bb:bb:bb", pdst="10.0.0.2"),
    ]
    path = tmp_path / "arp_spoof.pcap"
    wrpcap(str(path), pkts)
    return path


def test_detects_arp_spoofing_ip_to_multiple_macs(tmp_path: Path) -> None:
    from src.detectors.arp_spoof import detect

    pcap = generate_arp_spoof_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))

    assert len(alerts) == 1
    assert alerts[0].scan_type == "ARP_SPOOFING"
    assert alerts[0].src_ip == "10.0.0.1"
