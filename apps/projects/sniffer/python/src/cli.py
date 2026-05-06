from __future__ import annotations

import base64
import contextlib
import json
import os
import sys
import tempfile

from scapy.all import rdpcap

from src.pipeline import run_pipeline


def _print_json(obj: object) -> None:
    sys.stdout.write(json.dumps(obj, ensure_ascii=False))
    sys.stdout.write("\n")


def main() -> int:
    tmp_path: str | None = None
    try:
        b64 = os.environ.get("PCAP_BASE64")
        if b64 is None or not b64.strip():
            if len(sys.argv) >= 2 and sys.argv[1].strip():
                # Fallback: path local para facilitar testes
                packets = rdpcap(sys.argv[1])
                alerts = run_pipeline(list(packets))
                _print_json(
                    {
                        "status": "ok",
                        "alerts": [a.__dict__ for a in alerts],
                        "count": len(alerts),
                    },
                )
                return 0

            _print_json(
                {
                    "status": "error",
                    "message": "PCAP_BASE64 env var not set and no input file path provided",
                },
            )
            return 1

        raw = base64.b64decode(b64, validate=False)

        # rdpcap funciona melhor via path; criar arquivo temporário
        with tempfile.NamedTemporaryFile(suffix=".pcap", delete=False) as tmp:
            tmp_path = tmp.name
            tmp.write(raw)
            tmp.flush()

        packets = rdpcap(tmp_path)
        alerts = run_pipeline(list(packets))

        _print_json(
            {
                "status": "ok",
                "alerts": [a.__dict__ for a in alerts],
                "count": len(alerts),
            },
        )
        return 0
    except Exception as exc:  # noqa: BLE001
        _print_json({"status": "error", "message": str(exc)})
        return 1
    finally:
        if tmp_path:
            with contextlib.suppress(OSError):
                os.unlink(tmp_path)


if __name__ == "__main__":
    raise SystemExit(main())
