# Portfólio — Cibersegurança

**Monorepo de portfólio acadêmico-profissional especializado em Segurança da Informação**

Sistemas de Informação | 2023–2026 | São Paulo

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Pré-Requisitos](#2-pré-requisitos)
3. [Subir Ambiente de Dev](#3-subir-ambiente-de-dev)
4. [Arquitetura do Monorepo](#4-arquitetura-do-monorepo)
5. [Aplicações](#5-aplicações)
6. [Pacotes Compartilhados](#6-pacotes-compartilhados)
7. [Estratégia de Demonstração](#7-estratégia-de-demonstração)
8. [Deploy](#8-deploy)
9. [Testes](#9-testes)
10. [Variáveis de Ambiente](#10-variáveis-de-ambiente)
11. [Roadmap de Projetos](#11-roadmap-de-projetos)

---

## 1. Visão Geral

Este monorepo concentra **15 projetos práticos de cibersegurança** desenvolvidos ao longo da graduação, mais o **TCC (SAD Cibersegurança)**. O portfólio público é o hub central — uma aplicação Next.js 15 que cataloga, demonstra e documenta cada projeto.

### O que este repositório faz

1. **Hospeda o portfólio público** — site Next.js com SSR/SEO, páginas por projeto e demos interativas.
2. **Centraliza os projetos acadêmicos** em `apps/projects/` com stack isolada por projeto.
3. **Compartilha código comum** via `packages/` — UI, configs, utils criptográficos, validação, tipos.
4. **Expõe demos em 3 modalidades** — interativa no browser, sandbox isolado em container efêmero, ou vídeo.
5. **Documenta o TCC** como projeto de referência arquitetural (`apps/projects/sad-ciberseguranca`).

### Princípios

- **Monorepo gerenciado por Turborepo + pnpm workspaces** — cache agressivo, build paralelo, dependências compartilhadas.
- **Cada projeto é independente mas reutiliza pacotes comuns** — evita reinventar componentes de UI, configs de ESLint/TS, validadores.
- **Metodologia Akita-XP adaptada** — pair programming com IA, TDD, small releases, CI em cada commit, refactoring contínuo.
- **Segurança antes de estética** — todo projeto passa por SAST, SCA e secrets scanning no CI; nenhum projeto "perigoso" roda em produção aberta.

---

## 2. Pré-Requisitos

| Ferramenta | Versão mínima | Instalação                         |
| ---------- | ------------- | ---------------------------------- |
| Node.js    | 20.x LTS      | [nodejs.org](https://nodejs.org)   |
| pnpm       | 9.x           | `npm install -g pnpm`              |
| Python     | 3.11          | [python.org](https://python.org)   |
| Docker     | 24.x          | [docker.com](https://docker.com)   |
| PostgreSQL | 15.x          | via Docker Compose                 |
| Git        | qualquer      | [git-scm.com](https://git-scm.com) |

Projetos específicos podem exigir ferramentas extras (Go, Rust, C/C++). Cada projeto documenta seus pré-requisitos em seu próprio `README.md`.

---

## 3. Subir Ambiente de Dev

### Instalação inicial (uma vez)

```bash
git clone https://github.com/<seu-usuario>/portfolio.git
cd portfolio
pnpm install
cp .env.example .env
docker compose up -d postgres redis
```

### Rodar o portfólio público

```bash
pnpm dev --filter=web
```

Portfólio disponível em `http://localhost:3000`.

### Rodar um projeto específico

```bash
pnpm dev --filter=@projects/sniffer
pnpm dev --filter=@projects/sad-ciberseguranca
```

### Rodar tudo em paralelo (Turborepo)

```bash
pnpm dev
```

### Scripts principais

| Comando          | O que faz                                        |
| ---------------- | ------------------------------------------------ |
| `pnpm dev`       | Sobe todas as apps em modo desenvolvimento       |
| `pnpm build`     | Build de produção de todas as apps/pacotes       |
| `pnpm lint`      | ESLint em todo o monorepo                        |
| `pnpm test`      | Testes unitários em todo o monorepo              |
| `pnpm test:cov`  | Testes com cobertura                             |
| `pnpm typecheck` | Verifica tipos TypeScript sem emitir             |
| `pnpm clean`     | Remove `node_modules`, `.next`, `dist`, `.turbo` |

---

## 4. Arquitetura do Monorepo

```
portfolio/
├── apps/
│   ├── web/                          # Portfólio público (Next.js 15)
│   ├── admin/                        # Painel interno (dashboard do honeypot, métricas)
│   └── projects/
│       ├── rsa-visualizer/           # Projeto 1
│       ├── sniffer/                  # Projeto 2
│       ├── password-manager/         # Projeto 3
│       ├── sql-injection-scanner/    # Projeto 4
│       ├── stegananalysis/           # Projeto 5
│       ├── owasp-scanner/            # Projeto 6
│       ├── honeypot/                 # Projeto 7
│       ├── encrypted-storage/        # Projeto 8
│       ├── waf/                      # Projeto 9
│       ├── cis-auditor/              # Projeto 10
│       ├── mobile-2fa/               # Projeto 11
│       ├── devsecops-pipeline/       # Projeto 12
│       ├── ids/                      # Projeto 13
│       ├── threat-intel-dashboard/   # Projeto 14
│       ├── iot-security/             # Projeto 15
│       └── sad-ciberseguranca/       # TCC
├── packages/
│   ├── ui/                           # Componentes React compartilhados (shadcn/ui)
│   ├── config-eslint/
│   ├── config-typescript/
│   ├── config-tailwind/
│   ├── crypto-utils/                 # Wrappers criptográficos comuns
│   ├── security-validators/          # Schemas Zod para inputs sensíveis
│   ├── types/                        # Tipos compartilhados
│   └── demo-harness/                 # Runtime para demos sandboxed
├── services/
│   ├── sandbox-runner/               # Docker-in-Docker para demos isoladas (Fly.io scale-to-zero)
│   └── threat-intel-aggregator/      # Agregador OSINT (rodado via GitHub Actions cron)
├── infra/
│   ├── docker/                       # Dockerfiles e compose files
│   ├── fly/                          # fly.toml dos apps (Fly.io)
│   ├── hetzner-temporada/            # Configs para ativar VPS nas temporadas do honeypot
│   └── github-actions/               # Workflows reutilizáveis
├── docs/                             # Documentação transversal
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Por que essa estrutura

- **`apps/web`** é a cara do portfólio. Consome dados dos projetos e expõe as demos.
- **`apps/projects/*`** isola cada projeto acadêmico. O monorepo aceita heterogeneidade de stack.
- **`packages/*`** é onde mora o código que não pode ser duplicado.
- **`services/*`** são serviços auxiliares com ciclo de vida próprio (rodam 24/7).
- **`infra/*`** centraliza toda configuração de deploy, Docker e CI.

---

## 5. Aplicações

### 5.1 `apps/web` — Portfólio Público

Hub central. Next.js 15 com App Router, SSR e ISR.

**Rotas principais:**

| Rota               | Descrição                                             |
| ------------------ | ----------------------------------------------------- |
| `/`                | Home com destaque de projetos                         |
| `/projetos`        | Lista completa categorizada                           |
| `/projetos/[slug]` | Página individual (descrição + demo + GitHub + vídeo) |
| `/tcc`             | Página dedicada ao SAD Cibersegurança                 |
| `/sobre`           | Sobre mim, contato, timeline acadêmica                |

**Stack:**

- Next.js 15 (App Router) + TypeScript 5
- Tailwind CSS + shadcn/ui (via `@portfolio/ui`)
- MDX + Contentlayer2 para conteúdo dos projetos
- Recharts + D3.js para visualizações
- Framer Motion para animações

### 5.2 `apps/projects/*` — Projetos Acadêmicos

Cada pasta é um projeto completo. Stack definida conforme a necessidade:

- **`rsa-visualizer`** — Next.js, roda 100% no cliente, embedado no portfólio.
- **`sniffer`** — Python (Scapy) + interface Next.js consumindo via WebSocket. Demo em vídeo + sandbox efêmero.
- **`sad-ciberseguranca`** — TCC completo: NestJS + React + Python + PostgreSQL.

### 5.3 `apps/admin` — Painel Interno

Painel protegido por auth. Exibe o **dashboard do honeypot** (projeto 7) com ataques capturados, métricas de visitação do portfólio, fila do sandbox runner e logs de produção.

---

## 6. Pacotes Compartilhados

### `@portfolio/ui`

Componentes React reutilizáveis. Base em shadcn/ui, com adições específicas:

- `<ProjectCard />` — card padrão na home
- `<DemoFrame />` — iframe seguro com sandbox CSP
- `<CodeBlock />` — syntax highlighting
- `<VideoEmbed />` — embed lazy-loaded
- `<SecurityBadge />` — badge de severidade (CVSS, OWASP)
- Primitivos shadcn/ui

### `@portfolio/crypto-utils`

Funções criptográficas auditadas, reutilizadas por múltiplos projetos:

- Hashing (Argon2, bcrypt, SHA-family)
- Geração de chaves (AES, RSA, ECDSA)
- HMAC, HKDF, PBKDF2
- Verificação de integridade (Merkle trees)
- Todas as funções testadas contra vetores oficiais (NIST, RFC)

### `@portfolio/security-validators`

Schemas Zod para inputs sensíveis:

- Validação de senhas com análise de entropia
- Validação de URLs com proteção contra SSRF
- Sanitização de HTML contra XSS
- Detecção de payload de SQL Injection/Command Injection
- Validação de CPF/CNPJ (LGPD)

### `@portfolio/demo-harness`

Runtime padrão para demos sandboxed. Define a interface `DemoRunner` que todo projeto demonstrável implementa.

### `@portfolio/config-*`

- `config-eslint` — regras uniformes
- `config-typescript` — `tsconfig` base
- `config-tailwind` — preset com design tokens

---

## 7. Estratégia de Demonstração

Cada projeto se encaixa em **uma das três categorias**:

### 7.1 Demo Interativa no Browser

Projetos que rodam 100% client-side ou com backend estático. Embedados via `<DemoFrame />`:

- RSA Visualizer, Password Manager (demo), Esteganálise, Encrypted Storage (detecção de PII), 2FA.

### 7.2 Demo em Sandbox efêmero

Projetos "perigosos" que exigem ambiente isolado. Chamados via `services/sandbox-runner`:

- SQL Injection Scanner, OWASP Scanner, WAF, CIS Auditor, IDS.

### 7.3 Demo em Vídeo + Live Dashboard

Projetos impossíveis de demonstrar em produção pública ou que brilham com dados reais acumulados:

- Sniffer (vídeo), Honeypot (dashboard live + vídeo), Threat Intel Dashboard (live), IoT Security (vídeo), DevSecOps Pipeline (documentação + live CI).

### Matriz por projeto

| #   | Projeto                | Categoria                        |
| --- | ---------------------- | -------------------------------- |
| 1   | RSA Visualizer         | Interativa                       |
| 2   | Sniffer                | Vídeo                            |
| 3   | Password Manager       | Interativa (demo)                |
| 4   | SQL Injection Scanner  | Sandbox                          |
| 5   | Esteganálise           | Interativa                       |
| 6   | OWASP Scanner          | Sandbox                          |
| 7   | Honeypot               | Híbrida (dashboard live + vídeo) |
| 8   | Encrypted Storage      | Interativa                       |
| 9   | WAF                    | Sandbox                          |
| 10  | CIS Auditor            | Sandbox                          |
| 11  | Mobile 2FA             | Interativa + APK                 |
| 12  | DevSecOps Pipeline     | Documentação + live CI           |
| 13  | IDS                    | Sandbox                          |
| 14  | Threat Intel Dashboard | Live                             |
| 15  | IoT Security           | Vídeo                            |
| TCC | SAD Cibersegurança     | Híbrida (live limitada)          |

---

## 8. Deploy

### Estratégia híbrida e barata

| Componente                                              | Plataforma                                           | Custo estimado               |
| ------------------------------------------------------- | ---------------------------------------------------- | ---------------------------- |
| `apps/web` (portfólio público)                          | Vercel (free tier)                                   | R$ 0                         |
| Projetos estáticos/client-side                          | Vercel (subdeploys)                                  | R$ 0                         |
| `services/sandbox-runner` + backends leves (TCC, demos) | Fly.io Machines (scale-to-zero)                      | R$ 0–15/mês conforme tráfego |
| DBs Postgres (vários contextos)                         | Neon (free, auto-suspend)                            | R$ 0                         |
| `services/threat-intel-aggregator`                      | GitHub Actions cron (2x/dia)                         | R$ 0                         |
| Honeypot (coleta real de ataques)                       | VPS Hetzner em **temporada** (2-3 meses no semestre) | ~R$ 28/mês só quando ligada  |
| Storage (vídeos, backups)                               | Cloudflare R2 (10GB free)                            | R$ 0                         |

**Total mensal típico: R$ 0–15.** Gastos de temporada do honeypot são pontuais (~R$ 150 ao longo de todo o curso, não recorrente).

### Fluxo de deploy

- **`apps/web` e subdeploys estáticos** — push em `main` dispara Vercel automaticamente.
- **`sandbox-runner` e outros serviços no Fly.io** — GitHub Actions executa `flyctl deploy` em push para `main`.
- **Threat intel aggregator** — GitHub Actions scheduled workflow (cron) roda 2x/dia, popula Neon.
- **Honeypot na temporada** — quando ativo, Hetzner provisionada via script em `infra/hetzner-temporada/`. Fora da temporada, destruída.

### Isolamento de domínios

- `portfolio.<seu-dominio>.com.br` — site principal
- `demo.<seu-dominio>.com.br` — subdomínio separado para sandbox (CSP isolada, cookies não compartilhados)
- `api.<seu-dominio>.com.br` — backends compartilhados

---

## 9. Testes

Cada app/pacote define seus próprios testes. Turborepo roda tudo em paralelo.

### Ferramentas padrão

- **Frontend** — Vitest + Testing Library
- **Backend Node** — Jest + Supertest
- **Backend Python** — pytest
- **E2E** — Playwright

### Cobertura mínima

- `packages/*` — 90% (código crítico compartilhado)
- `apps/web` — 70%
- `apps/projects/*` — 80% em lógica de negócio
- TCC (`sad-ciberseguranca`) — 80% em `DecisaoService` e `SimulacaoService`

### Segurança no CI

Todo commit passa por:

1. ESLint + Prettier
2. TypeScript typecheck
3. Testes unitários
4. **Semgrep** (SAST) — regras OWASP
5. **Snyk** ou **npm audit** (SCA)
6. **Gitleaks** (secrets detection)
7. **CodeQL** (análise profunda)

Nenhum PR merga sem CI verde.

---

## 10. Variáveis de Ambiente

Cada app tem seu próprio `.env`. Variáveis compartilhadas ficam no `.env` root.

### Root (`.env`)

```env
NODE_ENV=development
DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio
REDIS_URL=redis://localhost:6379
```

### `apps/web/.env`

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANDBOX_URL=http://localhost:4000
RESEND_API_KEY=                  # Formulário de contato
GITHUB_TOKEN=                    # Buscar stats dos repos
```

### `services/sandbox-runner/.env`

```env
SANDBOX_PORT=4000
DOCKER_SOCKET=/var/run/docker.sock
MAX_CONCURRENT_RUNS=5
RATE_LIMIT_PER_IP=10
```

Cada projeto tem `.env.example` próprio. Copiar e preencher antes de rodar.

---

## 11. Roadmap de Projetos

A ordem segue o calendário acadêmico (2023/1 → 2026/1) e alterna impacto Alto/Médio/Pequeno.

| #   | Projeto                | Matéria               | Semestre | Impacto    |
| --- | ---------------------- | --------------------- | -------- | ---------- |
| 1   | RSA Visualizer         | Matemática Discreta   | 2023/1   | 🟡 Médio   |
| 2   | Sniffer                | Redes I               | 2023/2   | 🔴 Alto    |
| 3   | Password Manager       | AED I                 | 2023/2   | 🟡 Médio   |
| 4   | SQL Injection Scanner  | BD I                  | 2024/1   | 🔴 Alto    |
| 5   | Esteganálise           | Visão Computacional   | 2024/1   | 🟡 Médio   |
| 6   | OWASP Scanner          | Tecnologia Web        | 2024/1   | 🔴 Alto    |
| 7   | Honeypot               | Sistemas Operacionais | 2024/2   | 🔴 Alto ⭐ |
| 8   | Encrypted Storage      | BD II                 | 2024/2   | 🔴 Alto    |
| 9   | WAF                    | Sistemas Web          | 2024/2   | 🔴 Alto    |
| 10  | CIS Auditor            | Seg. e Auditoria      | 2025/1   | 🔴 Alto ⭐ |
| 11  | Mobile 2FA             | Aplicativos Mobile    | 2025/1   | 🟡 Médio   |
| 12  | DevSecOps Pipeline     | Qualidade de Software | 2025/1   | 🟢 Pequeno |
| 13  | IDS                    | Redes II              | 2025/2   | 🔴 Alto    |
| 14  | Threat Intel Dashboard | Analytics             | 2025/2   | 🔴 Alto ⭐ |
| 15  | IoT Security           | Sistemas Distribuídos | 2026/1   | 🔴 Alto    |
| TCC | SAD Cibersegurança     | TCC                   | 2026/2   | 🔴 Alto ⭐ |

Cada projeto tem documentação detalhada em `docs/roadmap/<semestre>.md`.

---

## Licença

MIT para código próprio. Projetos que usam bibliotecas de terceiros mantêm as licenças originais.
