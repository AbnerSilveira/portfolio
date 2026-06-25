# 03 — Setup de CI/CD e Infraestrutura

Depois do monorepo inicializado, o próximo passo é garantir que **todo commit passe por um CI rigoroso** e que a infraestrutura de deploy esteja pronta antes dos projetos começarem a ser construídos.

> **Nota de revisão (abr/2026):** este doc foi reescrito para usar **Fly.io + Neon + GitHub Actions cron** em vez de Railway + VPS Hetzner 24/7. Motivo: custo. O plano antigo custava ~R$ 56/mês fixo; o novo custa ~R$ 0–15/mês com scale-to-zero. Ver `deployment-topology.md` para detalhes da arquitetura.
>
> Se você já rodou os passos 1, 2 e 3 deste doc na versão antiga: **tudo que você fez continua válido**, esses três passos não mudaram. Apenas os passos 4 em diante foram refeitos.

---

## Passo 1 — GitHub Actions: Pipeline base

Criar `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    name: Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: portfolio
          POSTGRES_PASSWORD: portfolio
          POSTGRES_DB: portfolio_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://portfolio:portfolio@localhost:5432/portfolio_test

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

> **Nota (pnpm):** se o `package.json` raiz tiver `packageManager: pnpm@…`, **não** passe `version:` no `pnpm/action-setup@v4` — senão o Action falha com “Multiple versions of pnpm specified”.

---

## Passo 2 — Pipeline de segurança

Criar `.github/workflows/security.yml`:

```yaml
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1" # Segunda-feira 6h UTC

jobs:
  gitleaks:
    name: Gitleaks (secrets detection)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  semgrep:
    name: Semgrep (SAST)
    runs-on: ubuntu-latest
    container: returntocorp/semgrep
    steps:
      - uses: actions/checkout@v4
      - run: semgrep ci --config=auto
        env:
          SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}

  snyk:
    name: Snyk (dependency scanning)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --all-projects --severity-threshold=high

  codeql:
    name: CodeQL
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    strategy:
      fail-fast: false
      matrix:
        # Rode Python só quando houver código Python analisável no repo.
        # Em monorepo JS/TS puro, o job de Python costuma falhar com "No source code was seen during the build".
        language: [javascript-typescript]
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
      - uses: github/codeql-action/analyze@v3
```

Criar `.gitleaks.toml` na raiz com regras customizadas (opcional — Gitleaks tem defaults sensatos).

---

## Passo 3 — Deploy do `apps/web` (Vercel)

O deploy do portfólio público (`apps/web`) é feito via **integração nativa Vercel ↔ GitHub** (Settings → Git no painel da Vercel), com:

- Framework Preset: **Next.js**
- Root Directory: **`apps/web`**
- Include files outside the root directory: **Enabled**

Isso evita workflows redundantes e deploy duplicado a cada push. Mantenha apenas CI/Security em GitHub Actions.

---

## Passo 4 — Provisionar Neon (Postgres serverless)

### 4.1 Criar conta e projeto

1. Criar conta gratuita em [neon.tech](https://neon.tech) (pode logar com GitHub)
2. Criar projeto `portfolio`
3. Região: **AWS us-east-2** (Ohio) — menor latência dos backends Fly.io que ficarão em região próxima

### 4.2 Criar branches do DB por contexto

No dashboard Neon, em "Branches", criar:

| Branch                   | Uso                              |
| ------------------------ | -------------------------------- |
| `main` (default)         | Dados gerais do portfólio        |
| `tcc-sad-ciberseguranca` | DB do TCC                        |
| `honeypot-capture`       | Dados das temporadas do honeypot |
| `threat-intel`           | Cache do cron de threat intel    |

Cada branch tem connection string própria. Copiar todas para um gerenciador de senhas temporariamente.

### 4.3 Inserir connection strings como secrets do GitHub

No repo, Settings → Secrets → Actions:

```
NEON_DATABASE_URL_MAIN=postgresql://...
NEON_DATABASE_URL_TCC=postgresql://...
NEON_DATABASE_URL_HONEYPOT=postgresql://...
NEON_DATABASE_URL_THREAT_INTEL=postgresql://...
```

### 4.4 Docker Compose local continua valendo

Para dev local continua-se rodando Postgres via Docker Compose (já configurado). Neon é só produção. No `.env.example` do root, deixar claro:

```env
# Desenvolvimento local (Docker Compose)
DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio

# Produção: definido em secrets do provedor de deploy (Fly.io)
# Ver NEON_DATABASE_URL_* em GitHub Actions secrets
```

---

## Passo 5 — Provisionar Fly.io

### 5.1 Criar conta e instalar CLI

1. Criar conta em [fly.io](https://fly.io) com GitHub
2. **Importante:** o free tier existe mas exige cartão de crédito no cadastro (não cobra se ficar dentro do free, mas exigência de cadastro). Se o cartão for um problema, opção alternativa é Railway com plano $5 free trial (curto prazo) ou Render free (com limitações maiores de cold start — 50s vs 1s).
3. Instalar CLI:

```bash
curl -L https://fly.io/install.sh | sh
flyctl auth login
```

### 5.2 Criar o app do sandbox-runner

```bash
cd services/sandbox-runner
flyctl launch --no-deploy --name portfolio-sandbox-runner
```

Quando perguntado:

- Região: **São Paulo (gru)** — latência mínima do Brasil
- Postgres: **skip** (usamos Neon)
- Redis: **skip** (se precisar, usar Upstash Redis free)

Isso cria um `fly.toml`. Editar para habilitar scale-to-zero:

```toml
app = "portfolio-sandbox-runner"
primary_region = "gru"

[build]

[env]
  PORT = "4000"
  NODE_ENV = "production"

[http_service]
  internal_port = 4000
  force_https = true
  auto_stop_machines = "suspend"    # chave do scale-to-zero
  auto_start_machines = true
  min_machines_running = 0          # 0 = pode dormir totalmente
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  timeout = "5s"
  path = "/health"
```

### 5.3 Configurar secrets no Fly.io

```bash
flyctl secrets set \
  DATABASE_URL="$NEON_DATABASE_URL_MAIN" \
  SANDBOX_PORT=4000 \
  -a portfolio-sandbox-runner
```

### 5.4 Criar o app do TCC backend (quando chegar a fase)

Repetir processo em `apps/projects/sad-ciberseguranca/backend/`:

```bash
cd apps/projects/sad-ciberseguranca/backend
flyctl launch --no-deploy --name portfolio-tcc-backend
```

Mesmo fly.toml, mudando apenas `app`, `internal_port` e `DATABASE_URL` (usa o branch `tcc-sad-ciberseguranca` do Neon).

---

## Passo 6 — GitHub Actions para deploy no Fly.io

Criar `.github/workflows/deploy-services.yml`:

```yaml
name: Deploy Services (Fly.io)

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - "services/sandbox-runner/**"
      - "packages/**"
      - "pnpm-lock.yaml"

jobs:
  deploy-sandbox-runner:
    name: Deploy sandbox-runner to Fly.io
    runs-on: ubuntu-latest
    concurrency:
      group: deploy-sandbox-runner
      cancel-in-progress: true
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy . --remote-only --dockerfile services/sandbox-runner/Dockerfile --config services/sandbox-runner/fly.toml
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

O `Dockerfile` do serviço assume **contexto na raiz do monorepo** (copia `pnpm-lock.yaml`, `packages/` e `services/`). O comando segue a doc da Fly sobre monorepos: [Monorepo and multi-environment deployments](https://fly.io/docs/launch/monorepo/).

**Deploy automático pelo painel Fly (GitHub integrado ao app):** costuma rodar `flyctl launch plan propose` na **raiz** do repo, onde não há `Dockerfile` — por isso o erro que você viu. Para monorepo, o caminho prático é **não depender** desse deploy: use **só** este workflow (Actions + `FLY_API_TOKEN`) ou desligue o Git no app Fly para parar de gerar deploys falhos em paralelo.

Para obter o `FLY_API_TOKEN`:

```bash
cd services/sandbox-runner
fly tokens create deploy -a portfolio-sandbox-runner -x 999999h --name github-actions
```

Cole **a linha inteira** (começa com `FlyV1 fm2_...`) em GitHub Secrets como `FLY_API_TOKEN` — sem aspas, sem quebra de linha.

O workflow usa `--local-only` (build no runner do GitHub) porque **deploy tokens não acordam o remote builder** da Fly; `--remote-only` falha com `unauthorized` no CI mesmo com token válido.

Com `workflow_dispatch` no `on:`, dá para disparar **Deploy Services (Fly.io)** manualmente em **Actions → Run workflow**, sem commit só para testar o token.

Quando o TCC backend chegar, duplicar este workflow em `deploy-tcc-backend.yml` com o path `apps/projects/sad-ciberseguranca/backend/**`.

---

## Passo 7 — Vercel para o portfólio público

No dashboard do Vercel:

1. Import Git Repository → selecionar `portfolio`
2. Root Directory: `apps/web`
3. Framework Preset: Next.js
4. **Build Command, Install Command, Output Directory:** sem overrides (campos vazios = defaults do Next.js/Turborepo)
5. Include files outside the root directory: **Enabled**

Configurar domínio: `portfolio.<seu-dominio>.com.br`.

Variáveis de ambiente:

```
NEXT_PUBLIC_SITE_URL=https://portfolio.<seu-dominio>.com.br
NEXT_PUBLIC_SANDBOX_URL=https://portfolio-sandbox-runner.fly.dev
RESEND_API_KEY=<sua-key>
CONTACT_FROM_EMAIL=onboarding@resend.dev
CONTACT_TO_EMAIL=<email-que-recebe-os-contatos>
```

> **Resend (modo de testes):** enquanto você não tiver um domínio próprio verificado no Resend, use `CONTACT_FROM_EMAIL=onboarding@resend.dev` (limitações do modo de onboarding). Quando tiver domínio verificado, troque para um `from` do seu domínio.

---

## Passo 8 — Cloudflare R2 para storage

> **Nota:** este passo é **infra externa** e não costuma aparecer como “check verde” no CI. Faça quando você for realmente publicar assets grandes (ex.: vídeos de demo, PCAPs, imagens pesadas) para não estourar bandwidth do Vercel. Até lá, pode ficar pendente sem bloquear a Fase 0.

No Cloudflare:

1. R2 → Create Bucket → `portfolio-assets`
2. Gerar API Token com permissão Object Read & Write
3. Configurar bucket público para pasta `/videos/` (demos em vídeo)
4. Configurar CORS para permitir origin do portfólio

Variáveis:

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=portfolio-assets
R2_PUBLIC_URL=https://assets.<seu-dominio>.com.br
```

**Onde isso entra primeiro no roadmap:** Sniffer (#2 — vídeo/PCAP), SQL Injection Scanner (#4 — relatórios/fixtures), IDS (#13 — campanhas em PCAP), IoT Security (#15 — vídeo com takes grandes) e, se quiser self-host de assets, Honeypot (#7). Detalhe por projeto em `docs/05-roadmap-projetos.md` e nos `docs/roadmap/*.md` correspondentes.

---

## Passo 9 — Primeiro deploy teste

Criar o `services/sandbox-runner` em estado mínimo para validar o pipeline:

```bash
mkdir -p services/sandbox-runner/src
cd services/sandbox-runner
```

`package.json`:

```json
{
  "name": "@portfolio/sandbox-runner",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
  },
  "dependencies": {
    "fastify": "^5.2.0"
  },
  "devDependencies": {
    "@portfolio/config-typescript": "workspace:*",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "@types/node": "^20"
  }
}
```

`src/main.ts`:

```typescript
import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/health", async () => ({ status: "ok", timestamp: Date.now() }));

const port = Number(process.env.PORT ?? process.env.SANDBOX_PORT ?? 4000);
server.listen({ port, host: "0.0.0.0" }).catch((err) => {
  server.log.error(err);
  process.exit(1);
});
```

`Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./
USER app
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

Deploy:

```bash
# Deploy manual para validar antes do CI
flyctl deploy --remote-only

# Testar
curl https://portfolio-sandbox-runner.fly.dev/health
```

Se retornar `{"status":"ok",...}`, a infra está pronta.

**Espere ~5 minutos sem fazer request e teste novamente** — primeira request depois de suspend deve levar ~1s a mais (cold start). Isso é normal e esperado.

---

## Passo 10 — GitHub Actions cron para threat intel

Ver detalhes em `threat-intel-cron.md`. Resumo: workflow agendado que substitui o serviço 24/7 do plano antigo.

`.github/workflows/threat-intel-cron.yml`:

```yaml
name: Threat Intel Aggregator

on:
  schedule:
    - cron: "0 */12 * * *" # a cada 12h
  workflow_dispatch: # permite rodar manualmente

jobs:
  aggregate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: services/threat-intel-aggregator
      - run: npm run aggregate
        working-directory: services/threat-intel-aggregator
        env:
          DATABASE_URL: ${{ secrets.NEON_DATABASE_URL_THREAT_INTEL }}
          ABUSEIPDB_API_KEY: ${{ secrets.ABUSEIPDB_API_KEY }}
          VIRUSTOTAL_API_KEY: ${{ secrets.VIRUSTOTAL_API_KEY }}
          SHODAN_API_KEY: ${{ secrets.SHODAN_API_KEY }}
```

Só criar quando o projeto Threat Intel Dashboard chegar no roadmap (2025/2).

---

## Checklist de conclusão da Fase 0 (completa)

Marque no GitHub / consoles o que não dá para inferir só pelo repositório.

### Auditoria (repo `portfolio/` — 2026-04-24; Neon/secrets confirmados 2026-05-03)

| Critério                                   | Evidência no repo                                                             | Verificação externa                                                                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI (lint, typecheck, test, build)          | `.github/workflows/ci.yml` com quatro jobs                                    | Último run verde em **Actions**                                                                                                                                   |
| Security (Gitleaks, Semgrep, Snyk, CodeQL) | `.github/workflows/security.yml`                                              | Secrets `SEMGREP_APP_TOKEN`, `SNYK_TOKEN`; aba **Security** para CodeQL                                                                                           |
| Deploy Vercel                              | Integração nativa Vercel ↔ GitHub (Settings → Git; Root Directory `apps/web`) | Dashboard Vercel                                                                                                                                                  |
| Fly sandbox-runner                         | `services/sandbox-runner/`, `deploy-services.yml`, `fly.toml` (scale-to-zero) | `GET /health` → **200** com `{"status":"ok",...}` (testado 2026-04-24)                                                                                            |
| Neon + branches + secrets                  | Checklist Fase 0; connection strings não versionadas (só secrets)             | Branches `main`, `tcc-sad-ciberseguranca`, `honeypot-capture`, `threat-intel`; `NEON_DATABASE_URL_*` no GitHub; Fly secrets conforme apps — confirmado 2026-05-03 |
| Domínio `api.*` → Fly                      | —                                                                             | DNS no provedor                                                                                                                                                   |
| R2                                         | —                                                                             | Opcional até assets grandes (Passo 8); não bloqueia Fase 0                                                                                                        |
| Branch protection                          | —                                                                             | **Settings → Branches** em `main`                                                                                                                                 |

### Itens (marque você no clone local ou no PR)

- [x] CI rodando: lint, typecheck, test, build (workflow em `.github/workflows/ci.yml`)
- [x] Security scan rodando: Gitleaks, Semgrep, Snyk, CodeQL (`.github/workflows/security.yml`)
- [x] Vercel: integração nativa Vercel ↔ GitHub (Settings → Git; Root Directory `apps/web`)
- [x] Neon provisionado com branches `main`, `tcc-sad-ciberseguranca`, `honeypot-capture`, `threat-intel` (confirmado 2026-05-03)
- [x] Connection strings do Neon em GitHub Secrets e Fly.io Secrets (confirmado 2026-05-03)
- [x] Fly.io com app `portfolio-sandbox-runner` deployado e scale-to-zero (`fly.toml`: `min_machines_running = 0`, checks em `/health`)
- [x] `https://portfolio-sandbox-runner.fly.dev/health` respondendo (verificado 2026-04-24)
- [ ] Domain mapping: `api.<seu-dominio>.com.br` apontando para o Fly app (só se você for usar hostname próprio)
- [ ] Cloudflare R2 provisionado (adiável; ver nota do Passo 8)
- [ ] Branch protection em `main` exige CI verde (configuração no GitHub, não versionada aqui)

**Próximo passo:** `04-portfolio-publico.md`.

---

## Apêndice — Se você já rodou a versão antiga deste doc (com Kamal/VPS)

Se você já provisionou a Hetzner e configurou Kamal na versão anterior deste documento, siga este roteiro de migração:

### Passos (nesta ordem — testar antes de destruir)

1. **Não cancele nada ainda.** Mantenha a VPS rodando.
2. Execute os passos 4 (Neon) e 5 (Fly.io) deste doc novo.
3. Refaça o Passo 6 (deploy via `flyctl deploy` em vez de `kamal deploy`).
4. Suba o `sandbox-runner` no Fly.io e valide `GET /health`.
5. Atualize DNS: `api.<seu-dominio>.com.br` aponta para `<app>.fly.dev` (via CNAME).
6. Teste uma chamada real do portfólio para o sandbox runner no Fly.
7. Só quando tudo estiver funcionando: remova `infra/kamal/` do repo, cancele a VPS Hetzner no dashboard.

### O que preservar do trabalho anterior

- Dockerfile do sandbox runner — funciona igual no Fly.io
- Código do sandbox runner em si — zero mudança
- Configs de CI/security (passos 1 e 2) — nada muda
- Deploy do Vercel (passo 3) — nada muda

### O que remover

- Diretório `infra/kamal/`
- Arquivo `.github/workflows/deploy-services.yml` **antigo** (o novo substitui com `flyctl deploy`)
- Secrets `VPS_HOST`, `SSH_PRIVATE_KEY`, `KAMAL_REGISTRY_PASSWORD` do GitHub
- Subscription da Hetzner (cancela no dashboard depois de validar Fly.io)

### Configs para arquivar em `infra/hetzner-temporada/` (não deletar)

- Setup script original da VPS (ufw, fail2ban, Docker)
- Traefik docker-compose.yml
- Qualquer config específica do honeypot

**Isso vira template para as temporadas de coleta do honeypot.** Cada semestre em que você precisar rodar o honeypot, você provisiona uma Hetzner nova e roda esses scripts, deixa por 2-3 meses, destrói.
