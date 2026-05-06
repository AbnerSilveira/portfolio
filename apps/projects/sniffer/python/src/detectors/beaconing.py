"""Detecção de beaconing (intervalos regulares para o mesmo destino)."""

from __future__ import annotations

import math
from collections import defaultdict
from typing import TYPE_CHECKING

from scapy.layers.inet import IP, TCP, UDP

from src.alert import Alert

if TYPE_CHECKING:
    from scapy.packet import Packet


def detect(packets: list[Packet]) -> list[Alert]:
    """
    Heurística inicial (offline, sobre PCAP):

    Beaconing costuma aparecer como conexões periódicas (intervalo quase constante)
    do mesmo host para o mesmo destino.

    Implementação:
    - agrupa eventos por (src_ip, dst_ip, proto, dport)
    - ordena timestamps e calcula deltas
    - se houver eventos suficientes e a variação relativa for baixa (CV), sinaliza
    """

    MIN_EVENTS = 20
    CV_THRESHOLD = 0.15  # coeficiente de variação (std/mean) — menor = mais periódico

    series: dict[tuple[str, str, str, int], list[float]] = defaultdict(list)

    for pkt in packets:
        if not pkt.haslayer(IP):
            continue
        ip = pkt[IP]

        proto = None
        dport = None
        if pkt.haslayer(UDP):
            proto = "udp"
            dport = int(pkt[UDP].dport)
        elif pkt.haslayer(TCP):
            proto = "tcp"
            dport = int(pkt[TCP].dport)
        else:
            continue

        t = float(getattr(pkt, "time", 0.0))
        if t <= 0:
            continue

        series[(str(ip.src), str(ip.dst), proto, dport)].append(t)

    alerts: list[Alert] = []

    for (src, dst, proto, dport), times in series.items():
        if len(times) < MIN_EVENTS:
            continue

        times.sort()
        deltas = [t2 - t1 for t1, t2 in zip(times, times[1:]) if (t2 - t1) > 0]
        if len(deltas) < MIN_EVENTS - 1:
            continue

        mean = sum(deltas) / len(deltas)
        if mean <= 0:
            continue

        var = sum((d - mean) ** 2 for d in deltas) / len(deltas)
        std = math.sqrt(var)
        cv = std / mean

        if cv <= CV_THRESHOLD:
            alerts.append(
                Alert(
                    src_ip=src,
                    dst_ip=dst,
                    scan_type="BEACONING",
                    message=f"proto={proto} dport={dport} mean={mean:.2f}s cv={cv:.2f} events={len(times)}",
                ),
            )

    return alerts
