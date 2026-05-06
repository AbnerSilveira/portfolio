from __future__ import annotations

from pathlib import Path

import pytest
from scapy.all import IP, UDP, DNS, DNSQR, Ether, rdpcap, wrpcap

pytest.importorskip("scapy")


def _pkt(time_s: float, *, src: str, dst: str, dport: int) -> object:
    # UDP genérico (poderia ser HTTP/DNS etc.). Usamos DNS só pra payload existir.
    p = (
        Ether()
        / IP(src=src, dst=dst)
        / UDP(sport=50000, dport=dport)
        / DNS(rd=1, qd=DNSQR(qname="ping.example.com"))
    )
    p.time = time_s
    return p


def generate_beaconing_pcap(tmp_path: Path) -> Path:
    """
    PCAP com beaconing:
    - 25 pacotes do mesmo src->dst em intervalos constantes (5s)
    - tráfego extra não periódico para não gerar falso-positivo
    """
    src = "10.0.0.5"
    dst = "10.0.0.53"
    dport = 53

    periodic = [_pkt(i * 5.0, src=src, dst=dst, dport=dport) for i in range(25)]

    noisy = [
        _pkt(2.0, src="10.0.0.6", dst=dst, dport=dport),
        _pkt(9.0, src="10.0.0.6", dst=dst, dport=dport),
        _pkt(30.0, src="10.0.0.6", dst=dst, dport=dport),
        _pkt(31.1, src="10.0.0.6", dst=dst, dport=dport),
    ]

    path = tmp_path / "beaconing.pcap"
    wrpcap(str(path), [*periodic, *noisy])
    return path


def test_detects_beaconing_periodic_intervals(tmp_path: Path) -> None:
    from src.detectors.beaconing import detect

    pcap = generate_beaconing_pcap(tmp_path)
    alerts = detect(rdpcap(str(pcap)))

    assert len(alerts) == 1
    assert alerts[0].scan_type == "BEACONING"
    assert alerts[0].src_ip == "10.0.0.5"
