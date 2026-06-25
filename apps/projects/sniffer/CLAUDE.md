# CLAUDE.md — Sniffer (Projeto #2)

> Documento vivo. Referência de roadmap: `docs/roadmap/2023-2.md`.

## 1. O projeto

| Campo     | Valor                                       |
| --------- | ------------------------------------------- |
| Matéria   | Redes de Computadores I                     |
| Semestre  | 2023/2                                      |
| Categoria | `interactive` (demo PCAP + UI no portfólio) |
| Impacto   | `high`                                      |

### O que faz

Analisador de tráfego a partir de **PCAP** (`.pcap` / `.pcapng`): detectores para **port scanning** (TCP SYN scan), **ARP spoofing**, **DNS tunneling** (entropia / tamanho) e **beaconing** (intervalos regulares). API **FastAPI** expõe `/analyze` e `/health`; UI **Next.js + Recharts** no pacote `@projects/sniffer-web`.

### Por que existe

Demonstrar competências de **análise de pacotes**, **detecção de padrões de ataque** e **visualização** para portfólio de cibersegurança, alinhado à matéria de Redes I.

---

## 2. Stack

| Camada       | Tecnologia                            |
| ------------ | ------------------------------------- |
| Motor        | Python 3.11, Scapy                    |
| API          | FastAPI, Uvicorn                      |
| UI           | Next.js 16 (App Router), Recharts     |
| Persistência | SQLite (sessões / metadados — fase 2) |
| Monorepo     | pnpm workspace, Turbo                 |

---

## 3. Arquitetura de pastas

```
apps/projects/sniffer/
├── python/
│   ├── src/
│   │   ├── demo_pcaps.py       # geradores Scapy (demos + testes)
│   │   ├── capture.py
│   │   ├── pipeline.py
│   │   ├── api.py
│   │   ├── storage.py          # stub / evolução
│   │   ├── alert.py
│   │   └── detectors/
│   ├── scripts/generate_demo_pcaps.py
│   └── tests/
├── web/                        # @projects/sniffer-web
├── fixtures/                   # PCAPs sintéticos commitados
├── scripts/
│   ├── run-pytest.mjs
│   └── generate-demo-pcaps.mjs
├── package.json
├── README.md
└── CLAUDE.md
```

### Fluxo de dados

1. **Entrada:** upload HTTP ou PCAP de demo (`/fixtures/*-demo.pcap`).
2. **pipeline:** detectores em paralelo → `list[Alert]`.
3. **API:** JSON agregado (`POST /analyze`).
4. **UI:** timeline + gráficos Recharts.

### Deploy

- **Fly.io** app `portfolio-sniffer-api` — `python/fly.toml`, workflow `.github/workflows/deploy-sniffer.yml`.
- Secret CI: `FLY_SNIFFER_API_TOKEN`.
- CORS: `*.vercel.app`, `SNIFFER_CORS_ORIGINS` (ex.: `https://abnerportfolio.site`).
- Produção: fallback em `sniffer-api.ts` → `https://portfolio-sniffer-api.fly.dev`.

---

## 4. Convenções

- PCAPs de demo/teste sempre **sintéticos** (`src/demo_pcaps.py` + `pnpm generate:fixtures`).
- Limite upload: **50 MB** (`POST /analyze`).

---

## 5. Estado do roadmap (Semana 1–2)

- [x] Detectores: port scan, ARP spoof, DNS tunnel, beaconing
- [x] `POST /analyze` (multipart, limite, extensão)
- [x] `WebSocket /stream` (stub — live não suportado no Fly)
- [x] UI: upload, timeline, gráficos Recharts
- [x] PCAPs demo (4 detectores) na workbench
- [x] Dockerfile + deploy Fly.io
- [x] MDX + demo embebida no portfólio (`/projetos/sniffer/demo`)
- [ ] SQLite: persistir runs e contagens por detector
- [ ] Integração sandbox-runner (fase posterior)
- [ ] Vídeo demo YouTube (opcional)

---

## 6. Checklist de sessão

- [ ] `pnpm --filter @projects/sniffer test`
- [ ] `pnpm --filter @projects/sniffer-web lint typecheck build`
- [ ] Se alterar PCAPs demo: `pnpm --filter @projects/sniffer generate:fixtures`
- [ ] Atualizar este arquivo se mudar contrato dos detectores ou da API
