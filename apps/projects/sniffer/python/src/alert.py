from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Alert:
    """Alerta normalizado emitido por um detector."""

    src_ip: str
    scan_type: str
    dst_ip: str = ""
    message: str = ""
    timestamp: float = 0.0
