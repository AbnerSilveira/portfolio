"""Orquestra os detectores sobre uma lista de pacotes Scapy."""

from __future__ import annotations

from scapy.packet import Packet

from src.alert import Alert
from src.detectors import arp_spoof, beaconing, dns_tunnel, port_scan


def run_pipeline(packets: list[Packet]) -> list[Alert]:
    """Executa todos os detectores e retorna alertas agregados."""
    alerts: list[Alert] = []
    for module in (port_scan, arp_spoof, dns_tunnel, beaconing):
        alerts.extend(module.detect(packets))
    return sorted(alerts, key=lambda a: (a.src_ip, a.scan_type, a.dst_ip))
