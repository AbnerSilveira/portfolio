# CLAUDE.md — Sniffer (Projeto #2)

> Documento vivo. Referência de roadmap: `docs/roadmap/2023-2.md`.

## 1. O projeto

| Campo     | Valor                                      |
| --------- | ------------------------------------------ |
| Matéria   | Redes de Computadores I                    |
| Semestre  | 2023/2                                     |
| Categoria | `video` (demo gravada + upload PCAP no ar) |
| Impacto   | `high`                                     |

### O que faz

Analisador de tráfego a partir de **PCAP** (`.pcap` / `.pcapng`): detectores para **port scanning** (TCP SYN scan), **ARP spoofing**, **DNS tunneling** (entropia / tamanho) e **beaconing** (intervalos regulares). API **FastAPI** expõe análise e (futuro) WebSocket; UI **Next.js + Recharts** no pacote `@projects/sniffer-web`.

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
│   │   ├── capture.py          # rdpcap / iteração (sem live no deploy)
│   │   ├── pipeline.py         # orquestra detectores
│   │   ├── api.py              # FastAPI
│   │   ├── storage.py          # SQLite (stub / evolução)
│   │   ├── alert.py            # modelo Alert
│   │   └── detectors/
│   │       ├── port_scan.py    # implementado (SYN flood de portas)
│   │       ├── arp_spoof.py
│   │       ├── dns_tunnel.py
│   │       └── beaconing.py
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
├── web/                        # @projects/sniffer-web
├── fixtures/                   # PCAPs sintéticos — ver README
├── scripts/run-pytest.mjs      # pnpm test no pacote @projects/sniffer
├── package.json                # orquestra web + pytest
├── README.md
└── CLAUDE.md
```

### Fluxo de dados (alto nível)

1. **Entrada:** arquivo PCAP (upload HTTP ou fixture de teste).
2. **capture:** `rdpcap` → `list[Packet]`.
3. **pipeline:** cada módulo em `detectors/*.py` retorna `list[Alert]`.
4. **Saída API:** JSON agregado (e futuro: séries temporais para Recharts).
5. **UI:** consome API (`NEXT_PUBLIC_SNIFFER_API_URL`), exibe timeline e gráficos.

### Deploy (futuro)

- **Fly.io** para o serviço Python (capabilities `NET_RAW` / `NET_ADMIN` só se necessário; análise é **offline** sobre arquivo — preferido).
- **Sem captura live** no ambiente gerenciado: ver obstáculos no roadmap.
- Integração **sandbox-runner** e **DemoFrame** conforme `docs/architecture/sandbox-security.md`.

---

## 4. Convenções

- **Imports Python:** pacote top-level `src` com `pytest` `pythonpath = ["."]` em `python/pyproject.toml`.
- **Testes:** TDD; PCAPs de teste sempre **sintéticos** (Scapy), nunca tráfego real.
- **Limite PCAP:** 50 MB no upload (validar no `POST /analyze` quando existir).

---

## 5. Próximos passos (roadmap Semana 1–2)

- [ ] Implementar `arp_spoof`, `dns_tunnel`, `beaconing`.
- [ ] `POST /analyze` (multipart), limite de tamanho, validação de extensão.
- [ ] `WebSocket /stream` (live local apenas se viável; produção = análise de arquivo).
- [ ] UI: upload, timeline, gráficos Recharts.
- [ ] SQLite: persistir runs e contagens por detector.
- [ ] Dockerfile + Fly; entrada no sandbox-runner.
- [ ] MDX em `apps/web/content/projects/sniffer.mdx` + vídeo.

---

## 6. Checklist de sessão

- [ ] `pnpm --filter @projects/sniffer test` (pytest)
- [ ] `pnpm --filter @projects/sniffer-web lint typecheck build`
- [ ] Atualizar este arquivo se mudar contrato dos detectores ou da API
