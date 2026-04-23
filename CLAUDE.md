# CLAUDE.md — Portfólio Cibersegurança

> Documento vivo. Atualizar a cada decisão de arquitetura, obstáculo resolvido ou padrão estabelecido.
> Este arquivo é lido integralmente antes de cada sessão de desenvolvimento com IA.

---

## 1. O Projeto

**Monorepo de portfólio acadêmico-profissional especializado em Cibersegurança**

Um monorepo gerenciado por **Turborepo + pnpm workspaces** que centraliza:

- O **portfólio público** (Next.js 15) como hub central.
- **15 projetos práticos** desenvolvidos ao longo da graduação, todos com viés de segurança.
- O **TCC (SAD Cibersegurança)** — Sistema de Apoio à Decisão com Gordon-Loeb + AHP + TOPSIS.
- Pacotes compartilhados (UI, crypto-utils, validators) que evitam duplicação.

**Curso:** Sistemas de Informação | **Anos:** 2023–2026 | **Cidade:** São Paulo

### Princípios não-negociáveis

1. **Reutilização antes de replicação** — qualquer componente usado em 2+ projetos vira package.
2. **Segurança é hábito, não fase** — todo commit passa por SAST, SCA e secrets scanning.
3. **TDD com IA** — testes vêm antes da implementação; o agente escreve testes que depois viram rede de segurança.
4. **Small releases** — cada commit em `main` é production-ready. CI verde ou não merga.
5. **Refactoring contínuo, não cirurgia de emergência** — deduplicação acontece a cada sessão.
6. **Humano decide o quê. IA decide o como.** Inverter piora o resultado dramaticamente.

---

## 2. Stack

### Nível monorepo

| Camada                                      | Tecnologia                           |
| ------------------------------------------- | ------------------------------------ |
| Gerenciador de pacotes                      | pnpm 9                               |
| Orquestrador                                | Turborepo                            |
| Linguagem base                              | TypeScript 5                         |
| Lint/Format                                 | ESLint + Prettier                    |
| Commit convention                           | Conventional Commits + commitlint    |
| Pre-commit hooks                            | Husky + lint-staged                  |
| CI                                          | GitHub Actions                       |
| Deploy (estático)                           | Vercel                               |
| Deploy (backends e sandbox — scale-to-zero) | Fly.io Machines                      |
| Banco Postgres serverless                   | Neon (auto-suspend)                  |
| Deploy (temporadas do honeypot)             | VPS Hetzner provisionada sob demanda |
| Cron jobs (threat intel)                    | GitHub Actions scheduled workflows   |
| Storage                                     | Cloudflare R2                        |

### Frontend (portfólio e projetos client-side)

| Camada          | Tecnologia                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 15 (App Router)                        |
| UI              | Tailwind CSS + shadcn/ui (via `@portfolio/ui`) |
| Conteúdo        | MDX + Contentlayer2                            |
| Formulários     | React Hook Form + Zod                          |
| Estado servidor | TanStack React Query v5                        |
| HTTP            | fetch nativo + wrapper tipado                  |
| Charts          | Recharts + D3.js                               |
| Animação        | Framer Motion                                  |
| Testes          | Vitest + Testing Library + Playwright          |

### Backend (NestJS para projetos que precisam)

| Camada    | Tecnologia                          |
| --------- | ----------------------------------- |
| Framework | NestJS 10 + TypeScript 5            |
| ORM       | Prisma                              |
| Banco     | PostgreSQL 15                       |
| Cache     | Redis                               |
| Validação | class-validator + class-transformer |
| Testes    | Jest + Supertest                    |

### Python (projetos de baixo nível e motor do TCC)

| Uso                    | Ferramentas                         |
| ---------------------- | ----------------------------------- |
| Sniffer/IDS/Scanners   | Scapy, requests                     |
| Motor AHP+TOPSIS (TCC) | NumPy                               |
| Análise estática       | Bandit (Python), Semgrep (polyglot) |
| Testes                 | pytest                              |

---

## 3. Filosofia do Monorepo

> Ler esta seção antes de criar qualquer projeto novo.

### 3.1 Quando criar um `package` vs uma `app`

- **`apps/*`** — deployável, tem ciclo de vida próprio, usuário final interage.
- **`packages/*`** — biblioteca, não faz sentido rodar sozinha, outros consomem.
- **`services/*`** — processo que roda 24/7 (sandbox runner, threat intel aggregator).

**Regra prática:** se algo vai ser importado por 2+ apps, vira package imediatamente. Não esperar "a terceira vez".

### 3.2 Convenção de nomes

```
@portfolio/ui
@portfolio/crypto-utils
@portfolio/security-validators
@portfolio/config-eslint
@portfolio/config-typescript
@portfolio/config-tailwind
@portfolio/types
@portfolio/demo-harness

@projects/rsa-visualizer
@projects/sniffer
@projects/sad-ciberseguranca
```

### 3.3 Estrutura padrão de um projeto em `apps/projects/*`

```
apps/projects/<slug>/
├── src/
│   ├── modules/            # Se for NestJS/Next com backend
│   ├── components/         # Se for Next puro
│   └── ...
├── tests/                  # Ou __tests__ colocado junto
├── public/                 # Se for Next
├── README.md               # Setup e uso (obrigatório)
├── CLAUDE.md               # Contexto para IA (obrigatório)
├── .env.example            # Obrigatório
├── package.json
└── tsconfig.json           # extends do @portfolio/config-typescript
```

### 3.4 Cada projeto tem seu próprio CLAUDE.md

Este CLAUDE.md é o **guia do monorepo**. Cada `apps/projects/<slug>/CLAUDE.md` é focado naquele projeto: obstáculos encontrados, APIs externas usadas, quirks de segurança. Exatamente como o CLAUDE.md do SAD Cibersegurança é para o TCC.

---

## 4. Arquitetura do Monorepo

```
portfolio/
├── apps/
│   ├── web/                          # Next.js 15 — portfólio público
│   ├── admin/                        # Next.js — painel interno
│   └── projects/
│       ├── rsa-visualizer/           # 1 — Matemática Discreta
│       ├── sniffer/                  # 2 — Redes I
│       ├── password-manager/         # 3 — AED I
│       ├── sql-injection-scanner/    # 4 — BD I
│       ├── stegananalysis/           # 5 — Visão Computacional
│       ├── owasp-scanner/            # 6 — Tecnologia Web
│       ├── honeypot/                 # 7 — Sistemas Operacionais ⭐
│       ├── encrypted-storage/        # 8 — BD II
│       ├── waf/                      # 9 — Sistemas Web
│       ├── cis-auditor/              # 10 — Seg. e Auditoria ⭐
│       ├── mobile-2fa/               # 11 — Aplicativos Mobile
│       ├── devsecops-pipeline/       # 12 — Qualidade de Software
│       ├── ids/                      # 13 — Redes II
│       ├── threat-intel-dashboard/   # 14 — Analytics ⭐
│       ├── iot-security/             # 15 — Sistemas Distribuídos
│       └── sad-ciberseguranca/       # TCC ⭐
├── packages/
│   ├── ui/
│   ├── crypto-utils/
│   ├── security-validators/
│   ├── demo-harness/
│   ├── types/
│   ├── config-eslint/
│   ├── config-typescript/
│   └── config-tailwind/
├── services/
│   ├── sandbox-runner/
│   └── threat-intel-aggregator/
├── infra/
│   ├── docker/
│   ├── fly/
│   ├── hetzner-temporada/
│   └── github-actions/
├── docs/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Fluxo de dados entre apps

```
┌─────────────────────────────────────────────────┐
│  apps/web (Next.js 15)                          │
│  Portfólio público, SSR, SEO                    │
└──────┬────────────────────────┬─────────────────┘
       │                        │
       │ embed iframe           │ API call
       │ (demos seguras)        │ (sandbox runner)
       ↓                        ↓
┌─────────────────┐    ┌──────────────────────┐
│ apps/projects/* │    │ services/sandbox-    │
│ (demos client)  │    │ runner (Fly.io)      │
└─────────────────┘    └──────────┬───────────┘
                                  │ spawn container
                                  ↓
                       ┌──────────────────────┐
                       │ Projeto "perigoso"   │
                       │ rodando isolado      │
                       └──────────────────────┘
```

---

## 5. Aplicações

### 5.1 `apps/web` — Portfólio Público

**Rotas principais:**

| Rota               | Renderização  | Descrição                             |
| ------------------ | ------------- | ------------------------------------- |
| `/`                | SSG           | Home com destaque de projetos         |
| `/projetos`        | SSG           | Lista filtrada por categoria/semestre |
| `/projetos/[slug]` | SSG + ISR     | Página individual do projeto          |
| `/tcc`             | SSG           | Página dedicada ao SAD Cibersegurança |
| `/sobre`           | SSG           | Sobre mim, contato, timeline          |
| `/api/contact`     | Edge function | Envia email via Resend                |
| `/api/sandbox/run` | Edge function | Proxy para `services/sandbox-runner`  |

**Estrutura:**

```
apps/web/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Home
│   │   ├── sobre/page.tsx
│   │   └── projetos/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── (dashboards)/
│   │   └── tcc/page.tsx
│   └── api/
│       ├── contact/route.ts
│       └── sandbox/run/route.ts
├── content/                      # MDX dos projetos
│   ├── rsa-visualizer.mdx
│   └── ...
├── components/
│   ├── ProjectCard.tsx
│   ├── DemoFrame.tsx
│   └── TimelineAcademic.tsx
└── lib/
    ├── mdx.ts
    └── api.ts
```

### 5.2 `apps/projects/*` — Projetos Acadêmicos

Cada projeto é autônomo. Formas de integração com o portfólio:

- **Interativo (client-only)** — exporta componente React usado via `<DemoFrame />`.
- **Com backend próprio** — deploy separado no Fly.io (scale-to-zero); portfólio embeda via iframe ou consome via API.
- **Sandbox** — portfólio chama `/api/sandbox/run` passando o projeto ID, recebe resultado.

### 5.3 `apps/admin` — Painel Interno

Protegido por auth. Exibe dashboard do honeypot (ataques capturados), métricas de visitação, fila do sandbox runner e logs.

---

## 6. Pacotes Compartilhados

### 6.1 `@portfolio/ui`

Componentes reutilizáveis. Componente novo deve responder SIM a pelo menos uma:

- É usado em 2+ apps/projects?
- Representa padrão visual do portfólio (ex: `<ProjectCard />`)?
- Abstrai primitiva shadcn/ui com customização específica?

### 6.2 `@portfolio/crypto-utils`

**Regra crítica:** nenhuma função criptográfica é escrita do zero sem vetores de teste oficiais. Toda função tem:

1. Referência ao RFC/NIST spec no JSDoc.
2. Teste comparando output com vetores oficiais.
3. Nota sobre algoritmos obsoletos (MD5, SHA-1) marcando-os como `@deprecated`.

### 6.3 `@portfolio/security-validators`

Validadores Zod para inputs sensíveis. Sempre incluem:

- Rejeição explícita de payloads maliciosos conhecidos
- Limites de tamanho (evitar DoS)
- Normalização antes de validação (evitar bypass por Unicode)

### 6.4 `@portfolio/demo-harness`

Interface padrão que toda demo implementa:

```typescript
interface DemoRunner<TInput, TOutput> {
  name: string;
  run(input: TInput): Promise<TOutput>;
  validateInput(input: unknown): TInput;
  isAvailable(): Promise<boolean>;
}
```

---

## 7. Serviços

### 7.1 `services/sandbox-runner`

API HTTP em Fastify/NestJS que roda no **Fly.io com scale-to-zero**. Recebe request do portfólio, instancia container Docker efêmero interno ao Fly Machine, executa projeto isolado, retorna resultado. Suspende a máquina após ~5min sem tráfego; cold start de ~1s no próximo request.

**Medidas de segurança obrigatórias:**

- Network namespace isolado (sem acesso à rede interna)
- CPU/memória limitadas (cgroups)
- Timeout de 30s por execução
- Rate limit por IP: 10 runs/hora
- Capabilities dropped (`--cap-drop=ALL`)
- Read-only root filesystem
- Non-root user dentro do container

### 7.2 `services/threat-intel-aggregator`

Script Node que agrega dados de APIs OSINT (AbuseIPDB, VirusTotal, Shodan) em Postgres do Neon. **Não é um serviço 24/7** — roda via **GitHub Actions scheduled workflow a cada 12h**. Usado pelo Threat Intel Dashboard (projeto 14) e pelo Honeypot (projeto 7, durante temporadas) para enriquecer IPs capturados.

### 7.3 Honeypots em temporada

Os honeypots do projeto 7 **não rodam 24/7**. São ativados em janelas planejadas (semestre da matéria, pré-TCC, pré-entrevistas estratégicas) via provisionamento sob demanda de uma VPS Hetzner. Dados coletados são exportados para o Neon e ficam permanentes no portfólio com rótulo da janela de coleta. Configs em `infra/hetzner-temporada/`.

---

## 8. Obstáculos Conhecidos e Soluções

> Seção mais valiosa do arquivo. Atualizar sempre que resolver um problema novo.

### 8.1 Next.js 15 App Router com MDX + Contentlayer

**Problema:** Contentlayer original tem incompatibilidades com Next 15.

**Solução:** usar **Contentlayer2** (fork mantido) ou migrar para **Fumadocs**. Validar na criação do `apps/web`.

### 8.2 Turborepo + pnpm + TypeScript project references

**Problema:** `tsc --build` falha quando packages não foram buildados ainda.

**Solução:** no `turbo.json`, declarar `"dependsOn": ["^build"]` para tasks que dependem de packages.

### 8.3 Demos sandboxed causando vazamento entre sessões

**Problema:** duas pessoas rodando a mesma demo simultaneamente veem dados uma da outra.

**Solução:** **nunca reutilizar containers entre execuções**. Cada chamada ao sandbox runner instancia container novo, executa, destrói. Container ID incluído em response para debug.

### 8.4 CORS entre `portfolio.com` e `demo.portfolio.com`

**Problema:** subdomínios diferentes para isolar cookies/CSP, mas quebra CORS por padrão.

**Solução:** configurar CORS explicitamente no sandbox runner apenas para o domínio do portfólio. Usar `credentials: 'omit'` no fetch.

### 8.5 Assets estáticos grandes (vídeos de demo) no Vercel

**Problema:** Vercel cobra bandwidth acima do free tier.

**Solução:** vídeos **nunca** hospedados no Vercel. Sempre YouTube/Vimeo (embed) ou Cloudflare R2 (direct link). `<VideoEmbed />` do `@portfolio/ui` faz lazy-load.

### 8.6 Honeypot capturando dados reais e LGPD

**Problema:** honeypot captura IPs e tentativas de ataque — dados pessoais sob LGPD.

**Solução:** tratar honeypot como sistema de segurança com base legal legítimo interesse (Art. 7º, IX LGPD). Não exibir IPs completos no dashboard público — mascarar últimos octetos. Reter dados por 90 dias no máximo.

### 8.7 Código duplicado entre projetos de scanner

**Problema:** SQL Injection Scanner, OWASP Scanner e IDS compartilham lógica de detecção de payloads.

**Solução:** extrair para `@portfolio/security-validators` com schemas Zod. Qualquer scanner novo importa e estende.

### 8.8 Secrets em `.env` comitados acidentalmente

**Problema:** desenvolvedor (ou agente) comita `.env` real em vez de `.env.example`.

**Solução:** `gitleaks` roda no pre-commit (Husky) e no CI. `.env` no `.gitignore` global. Cada projeto tem `.env.example` sem valores reais.

### 8.9 Cold start do Fly.io + Neon somados atrapalhando UX da demo

**Problema:** a primeira chamada a uma demo do sandbox, depois que Fly.io suspendeu a máquina E Neon suspendeu o DB, pode levar ~1.5s (Fly acorda ~1s, Neon acorda ~500ms). Usuário vê tela em branco.

**Solução:** no componente `<DemoFrame />`, fazer um `fetch('/health')` preemptivo (fire-and-forget) ao montar. Quando o usuário clica "Rodar", a máquina já está acordada. Mostrar skeleton/spinner durante o run independente disso.

### 8.10 Honeypot precisa rodar real em rede pública

**Problema:** honeypot só tem valor de portfólio se captura tráfego real — ou seja, precisa de IP público aberto. Fly.io não é adequado (ambiente gerenciado, sem controle raw de rede).

**Solução:** honeypot **não** roda em Fly.io. É o único serviço que exige temporada de VPS Hetzner dedicada. Fora da janela de coleta, a VPS é destruída e o dashboard mostra dados históricos congelados no Neon. Ver `deployment-topology.md` seção "Hetzner CPX11 (temporada de coleta)".

---

## 9. Padrões de Código

### 9.1 Backend (NestJS)

- Estrutura: `controller → service → (repository, se houver persistência) → dto`
- DTOs com `class-validator` + `class-transformer`
- Respostas padronizadas com `TransformInterceptor` (`{ success: true, data: {} }`)
- Erros com `HttpExceptionFilter`
- **Sem lógica de negócio no controller** — apenas recebe request, delega ao service, retorna response
- Carregar configs uma vez na inicialização (`OnModuleInit`), não a cada request

### 9.2 Frontend (Next.js + React)

- Componentes: `PascalCase` (ex: `RankingCard`)
- Hooks: prefixo `use` (ex: `useProjects`)
- Serviços: sufixo `.service.ts` (ex: `projects.service.ts`)
- Estado de servidor sempre via **React Query** (`useQuery` para leitura, `useMutation` para escrita)
- Formulários com **React Hook Form + Zod** — validação no schema Zod, não no componente
- Nunca enviar objeto de formulário diretamente para API — usar mapper
- Server Components por padrão; `'use client'` apenas quando necessário

### 9.3 Commits

Conventional Commits obrigatório:

```
feat(web): add project detail page
fix(sniffer): handle empty packet capture buffer
refactor(ui): extract DemoFrame to @portfolio/ui
test(crypto-utils): add RFC 8017 test vectors for RSA
docs(honeypot): document LGPD compliance strategy
chore(deps): bump next from 15.0.0 to 15.1.0
security(waf): patch XSS bypass in rule engine
```

### 9.4 Nomenclatura de Arquivos

```
apps/web/src/modules/projetos/
├── pages/ProjetosPage.tsx
├── components/ProjectCard.tsx
├── components/DemoFrame.tsx
├── hooks/useProjects.ts
├── services/projects.service.ts
└── types/project.types.ts
```

---

## 10. Checklist de Sessão

Antes de cada sessão de desenvolvimento com IA, verificar:

- [ ] Este CLAUDE.md está atualizado com decisões da última sessão?
- [ ] Se for mexer em projeto específico, o CLAUDE.md dele foi lido?
- [ ] Se for criar código novo usado por 2+ projetos, vai para `packages/`?
- [ ] A feature nova tem testes antes da implementação (TDD)?
- [ ] O commit vai seguir Conventional Commits?
- [ ] Variáveis sensíveis estão em `.env` (não hardcoded)?
- [ ] Se for projeto "perigoso", o isolamento sandbox está configurado?
- [ ] CI vai passar? (rodar `pnpm test` e `pnpm lint` antes de commitar)

---

## 11. Referencial e Metodologia

### Metodologia de Desenvolvimento — Akita-XP Adaptado

Baseado no artigo de Fábio Akita "Do Zero à Pós-Produção em 1 Semana" (Feb 2026), adaptado para solo developer + IA:

- **Pair programming com IA** — Cursor/Claude Code como par. Eu navego (defino direção), agente pilota (escreve código).
- **Small releases** — cada commit em `main` é production-ready.
- **TDD obrigatório** — ratio teste/código alvo: 1.5x.
- **Refactoring contínuo** — extrair duplicações a cada sessão, não a cada trimestre.
- **Integração Contínua** — lint + typecheck + test + SAST + SCA + secrets a cada commit.
- **Documentação como investimento** — CLAUDE.md + READMEs são lidos pela IA em 2 segundos antes de cada sessão.

### Referências

| Conceito         | Referência                                       |
| ---------------- | ------------------------------------------------ |
| Metodologia dev  | Fábio Akita — The M.Akita Chronicles (2026)      |
| XP               | Kent Beck — Extreme Programming Explained (1999) |
| TDD com IA       | Anthropic — Claude Code Best Practices           |
| Monorepo         | Turborepo docs + Vercel Style Guide              |
| OWASP Top 10     | OWASP Foundation                                 |
| MITRE ATT&CK     | MITRE Corporation                                |
| LGPD             | Lei 13.709/2018                                  |
| CIS Benchmarks   | Center for Internet Security                     |
| Sandbox security | Docker security best practices + Aqua Security   |

---

## 12. Estado Atual do Projeto

**Concluído:**

- [x] Seleção dos 15 projetos acadêmicos
- [x] Documentação estratégica (este arquivo + README.md)
- [x] Roadmap por semestre definido
- [x] TCC SAD Cibersegurança com Fase 2 (modelagem) completa
- [x] Setup do monorepo (Turborepo + pnpm)
- [x] Criação dos pacotes compartilhados (`@portfolio/config-*`)
- [x] Bootstrap do `apps/web` (Next.js 15)
- [x] Pipeline CI base (GitHub Actions)
- [x] **Decisão de arquitetura (abr/2026): scale-to-zero com Fly.io + Neon + cron actions em vez de Railway + VPS 24/7. Ver `deployment-topology.md`.**

**Próximos passos imediatos:**

- [ ] Provisionar Neon (criar branches por contexto)
- [ ] Provisionar Fly.io (app `portfolio-sandbox-runner`, scale-to-zero)
- [ ] Deploy teste do sandbox-runner mínimo (/health respondendo)
- [ ] Primeiro projeto: RSA Visualizer (menor escopo, serve de template)

**Fazer só quando o projeto exigir:**

- [ ] Temporada de honeypot na Hetzner (ativar em 2024/2 durante Sistemas Operacionais)
- [ ] Cron de threat-intel (ativar em 2025/2 durante Analytics)

Ver `docs/01-visao-geral.md` para o plano completo passo a passo.
