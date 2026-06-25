"""Detecção de port scan (ex.: rajada de TCP SYN para muitas portas do mesmo alvo)."""

from __future__ import annotations

from collections import defaultdict
from typing import TYPE_CHECKING

from scapy.layers.inet import IP, TCP

from src.alert import Alert

if TYPE_CHECKING:
    from scapy.packet import Packet

# Limiar conservador: tráfego legítimo raramente abre dezenas de handshakes SYN distintos
# para o mesmo par src/dst em um único PCAP de análise.
_MIN_DISTINCT_SYN_DPORTS = 50


def detect(packets: list[Packet]) -> list[Alert]:
    syn_ports: dict[tuple[str, str], set[int]] = defaultdict(set)
    last_seen: dict[tuple[str, str], float] = {}

    for pkt in packets:
        if not pkt.haslayer(TCP) or not pkt.haslayer(IP):
            continue
        ip = pkt[IP]
        tcp = pkt[TCP]
        flags = int(tcp.flags)
        syn = 0x02
        ack = 0x10
        if (flags & syn) and not (flags & ack):
            key = (ip.src, ip.dst)
            syn_ports[key].add(int(tcp.dport))
            last_seen[key] = float(getattr(pkt, "time", 0.0))

    alerts: list[Alert] = []
    for (src, dst), ports in syn_ports.items():
        if len(ports) >= _MIN_DISTINCT_SYN_DPORTS:
            alerts.append(
                Alert(
                    src_ip=src,
                    dst_ip=dst,
                    scan_type="TCP_SYN_SCAN",
                    message=f"{len(ports)} SYN distintos",
                    timestamp=last_seen.get((src, dst), 0.0),
                ),
            )
    return alerts
