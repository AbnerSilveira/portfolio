"""
Leitura de pacotes a partir de PCAP.

Deploy (Fly / sandbox): apenas arquivos fornecidos pelo usuário — sem captura live
em interface real (ver `docs/roadmap/2023-2.md`).
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterator

from scapy.all import rdpcap
from scapy.packet import Packet


def iter_packets_from_pcap(path: str | Path) -> Iterator[Packet]:
    """Yield de pacotes a partir de um arquivo .pcap / .pcapng."""
    for pkt in rdpcap(str(path)):
        yield pkt


def load_pcap(path: str | Path) -> list[Packet]:
    """Carrega todos os pacotes de um PCAP na memória (arquivos pequenos / testes)."""
    return list(iter_packets_from_pcap(path))
