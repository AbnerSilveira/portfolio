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
- Limite de upload **50 MB** no `POST /analyze`.
- Detalhes: `docs/roadmap/2023-2.md`, `docs/architecture/sandbox-security.md`.

### Fly.io (`portfolio-sniffer-api`)

App em `apps/projects/sniffer/python/fly.toml`. Deploy via GitHub Actions (**Deploy Sniffer API**) após merge em `main`.

**Secrets (GitHub):**

```bash
cd apps/projects/sniffer/python
fly apps create portfolio-sniffer-api   # primeira vez
fly tokens create deploy -a portfolio-sniffer-api -x 999999h --name github-actions
# → GitHub Secret: FLY_SNIFFER_API_TOKEN (linha inteira com FlyV1)
```

**CORS (domínio próprio, opcional):**

```bash
fly secrets set SNIFFER_CORS_ORIGINS="https://seu-dominio.com.br" -a portfolio-sniffer-api
```

Previews `*.vercel.app` já são aceitos pela API. **Vercel** (`apps/web`):

```
NEXT_PUBLIC_SNIFFER_API_URL=https://portfolio-sniffer-api.fly.dev
```
