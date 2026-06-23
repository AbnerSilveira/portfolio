"""Detecção de DNS tunneling (entropia / tamanho de query)."""

from __future__ import annotations

import math
from collections import Counter
from typing import TYPE_CHECKING

from scapy.layers.dns import DNS, DNSQR
from scapy.layers.inet import IP, UDP

from src.alert import Alert

if TYPE_CHECKING:
    from scapy.packet import Packet


def shannon_entropy(value: str) -> float:
    """
    Entropia de Shannon (bits por caractere).
    - strings mais aleatórias (base32/base64/hex payloads) tendem a ter entropia alta
    - rótulos DNS humanos (www, mail, api) tendem a ter entropia baixa
    """
    if not value:
        return 0.0
    counts = Counter(value)
    length = len(value)
    entropy = 0.0
    for c in counts.values():
        p = c / length
        entropy -= p * math.log2(p)
    return entropy


def detect(packets: list[Packet]) -> list[Alert]:
    """
    Heurística inicial (offline, sobre PCAP):

    - Observa queries DNS (UDP dst port 53) e avalia o primeiro label (subdomínio).
    - Sinaliza quando o label é grande e com entropia alta (sugere payload codificado).
    """

    alerts: list[Alert] = []

    for pkt in packets:
        if not (pkt.haslayer(IP) and pkt.haslayer(UDP) and pkt.haslayer(DNS)):
            continue

        udp = pkt[UDP]
        if int(getattr(udp, "dport", 0)) != 53:
            continue

        ip = pkt[IP]
        dns = pkt[DNS]
        qd = getattr(dns, "qd", None)
        if qd is None:
            continue

        # Scapy 2.7+: qd/an/ns/ar viraram PacketListField. Pegar o primeiro item.
        if isinstance(qd, list):
            if not qd:
                continue
            qd0 = qd[0]
        else:
            qd0 = qd

        raw_qname = getattr(qd0, "qname", b"")
        if isinstance(raw_qname, bytes):
            qname = raw_qname.decode("utf-8", errors="ignore")
        else:
            qname = str(raw_qname)
        qname = qname.rstrip(".")
        if not qname:
            continue

        first_label = qname.split(".")[0]
        label_len = len(first_label)
        ent = shannon_entropy(first_label.lower())

        # Thresholds conservadores para reduzir falso-positivo.
        # Observação: base32/base64 costuma ficar entre ~4.5 e 5.5 bits/char.
        if label_len >= 50 and ent >= 4.0:
            alerts.append(
                Alert(
                    src_ip=str(getattr(ip, "src", "")),
                    dst_ip=str(getattr(ip, "dst", "")),
                    scan_type="DNS_TUNNELING",
                    message=f"label_len={label_len} entropy={ent:.2f} qname={qname}",
                    timestamp=float(getattr(pkt, "time", 0.0)),
                ),
            )

    return alerts
