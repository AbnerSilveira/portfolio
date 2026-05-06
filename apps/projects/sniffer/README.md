# Sniffer — análise de PCAP (Projeto #2, 2023/2)

Sniffer em **Python 3.11 + Scapy** com detectores (port scan, ARP spoof, DNS tunneling, beaconing), API **FastAPI**, UI **Next.js + Recharts** e persistência **SQLite** (fases seguintes).

## Estrutura

```
apps/projects/sniffer/
├── python/           # Motor + API
├── web/              # @projects/sniffer-web — dashboard Next.js
├── fixtures/         # PCAPs sintéticos (ver README)
├── scripts/          # runner de pytest via pnpm
├── CLAUDE.md
└── package.json      # orquestra web + testes Python
```

## Comandos (na raiz `portfolio/`)

```bash
pnpm install
pnpm --filter @projects/sniffer test
pnpm --filter @projects/sniffer-web dev
```

## Python isolado

```bash
cd apps/projects/sniffer/python
python -m venv .venv
pip install -r requirements.txt
python -m pytest tests -q
uvicorn src.api:app --reload --port 8000
```

## Deploy / segurança

- Apenas análise de **arquivo PCAP** enviado (sem captura live no Fly).
- Limite de upload **50 MB** (a implementar no `POST /analyze`).
- Detalhes: `docs/roadmap/2023-2.md`, `docs/architecture/sandbox-security.md`.
