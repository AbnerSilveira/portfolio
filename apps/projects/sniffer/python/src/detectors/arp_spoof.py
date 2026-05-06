"""Detecção de ARP spoofing / inconsistências na LAN."""

from __future__ import annotations

from collections import defaultdict
from typing import TYPE_CHECKING

from scapy.layers.l2 import ARP

from src.alert import Alert

if TYPE_CHECKING:
    from scapy.packet import Packet


def detect(packets: list[Packet]) -> list[Alert]:
    """
    Heurística inicial (offline, sobre PCAP):

    - Se observarmos *respostas* ARP (op=2) em que o mesmo IP (psrc) é anunciado por
      mais de um MAC (hwsrc), sinalizamos possível ARP spoofing/poisoning.
    """

    ip_to_macs: dict[str, set[str]] = defaultdict(set)

    for pkt in packets:
        if not pkt.haslayer(ARP):
            continue
        arp = pkt[ARP]

        # op=2: is-at (reply). Spoofing costuma aparecer via replies/gratuitous ARP.
        if int(getattr(arp, "op", 0)) != 2:
            continue

        psrc = str(getattr(arp, "psrc", "")).strip()
        hwsrc = str(getattr(arp, "hwsrc", "")).strip().lower()
        if not psrc or not hwsrc:
            continue

        ip_to_macs[psrc].add(hwsrc)

    alerts: list[Alert] = []
    for ip, macs in ip_to_macs.items():
        if len(macs) >= 2:
            sorted_macs = ", ".join(sorted(macs))
            alerts.append(
                Alert(
                    src_ip=ip,
                    scan_type="ARP_SPOOFING",
                    message=f"IP anunciado por múltiplos MACs: {sorted_macs}",
                ),
            )

    return alerts
