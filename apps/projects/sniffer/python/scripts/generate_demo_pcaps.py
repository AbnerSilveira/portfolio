#!/usr/bin/env python3
"""Gera PCAPs de demo e copia para fixtures do sniffer-web e apps/web."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

PYTHON_ROOT = Path(__file__).resolve().parents[1]
SNIFFER_ROOT = PYTHON_ROOT.parent
APPS_WEB_FIXTURES = SNIFFER_ROOT.parents[1] / "web" / "public" / "fixtures"

sys.path.insert(0, str(PYTHON_ROOT))

from src.demo_pcaps import DEMO_PCAP_WRITERS  # noqa: E402

OUTPUT_DIRS = [
    SNIFFER_ROOT / "fixtures",
    SNIFFER_ROOT / "web" / "public" / "fixtures",
    APPS_WEB_FIXTURES,
]


def main() -> None:
    for directory in OUTPUT_DIRS:
        directory.mkdir(parents=True, exist_ok=True)

    for filename, (_label, writer) in DEMO_PCAP_WRITERS.items():
        temp = PYTHON_ROOT / ".demo-out" / filename
        temp.parent.mkdir(parents=True, exist_ok=True)
        writer(temp)
        for directory in OUTPUT_DIRS:
            shutil.copy2(temp, directory / filename)
        print(f"wrote {filename} -> {len(OUTPUT_DIRS)} dirs")

    shutil.rmtree(PYTHON_ROOT / ".demo-out", ignore_errors=True)


if __name__ == "__main__":
    main()
