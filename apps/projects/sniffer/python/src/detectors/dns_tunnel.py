"""Detecção de DNS tunneling (entropia / tamanho de query) — a implementar."""

from __future__ import annotations

from typing import TYPE_CHECKING

from src.alert import Alert

if TYPE_CHECKING:
    from scapy.packet import Packet


def detect(packets: list[Packet]) -> list[Alert]:
    """Placeholder — Semana 1 dia 4."""
    del packets
    return []
