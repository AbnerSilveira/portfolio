"""
Persistência de sessões de análise em SQLite (metadados, timelines, agregados).

Esquema e migrações serão adicionados na Semana 2 (UI + relatórios).
O motor de detecção permanece stateless sobre `list[Packet]`.
"""

from __future__ import annotations

# Ex.: sqlite3.connect("sniffer.db") — não usado no scaffold.
