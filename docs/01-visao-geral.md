# 01 — Visão Geral e Plano de Execução

Este documento é o **índice de leitura obrigatória** antes de começar qualquer trabalho no monorepo. Ele define o "porquê" de cada decisão e a ordem em que cada peça será construída.

---

## Por que um monorepo

A pergunta natural é "por que não 16 repositórios separados?". A resposta tem três camadas:

**1. Reutilização.** Pelo menos 5 projetos vão precisar de hashing seguro, 4 vão precisar de validação de inputs maliciosos, e praticamente todos vão precisar dos mesmos componentes de UI (`<DemoFrame />`, `<ProjectCard />`, `<CodeBlock />`). Em repos separados, isso vira copy-paste — que envelhece mal e cria bugs divergentes. Em monorepo, cai em `packages/` e todo mundo consome a mesma versão.

**2. Consistência de qualidade.** Uma config de ESLint, um tsconfig base, um preset Tailwind. Quando algo melhora em um lugar, melhora em todos. Quando um CVE aparece em uma dependência, `pnpm up -r` resolve para o monorepo inteiro.

**3. CI único e coerente.** O portfólio completo passa por um só pipeline. Segurança (Semgrep, Snyk, Gitleaks) roda uma vez para tudo. Turborepo só rebuild o que mudou, então CI continua rápido mesmo com 16 projetos.

## Por que Turborepo + pnpm

pnpm economiza disco e é mais rápido que npm/yarn. Turborepo adiciona cache local e remoto, grafo de dependências e execução paralela. A combinação é padrão Vercel e integra perfeitamente com Next.js.

Alternativas consideradas e rejeitadas:

- **Nx** — mais poderoso mas excesso para solo dev. Melhor para equipes grandes polyglot.
- **pnpm puro** — funciona, mas perde o cache do Turbo. Para 16 projetos, faz diferença.

## Por que Next.js 15 para o portfólio

Portfólio público precisa de SEO forte, SSR e páginas estáticas rápidas. Next.js 15 com App Router faz isso nativamente, com deploy gratuito no Vercel e integração direta com MDX para o conteúdo dos projetos.

## Estratégia de execução

O trabalho é dividido em **fases**. Cada fase entrega algo deployável antes da próxima começar. Isso não é waterfall — é small releases em escala macro. Cada projeto dentro de uma fase tem seus próprios small releases.

### Fase 0 — Fundação (1 semana)

Monorepo funcional, CI/CD rodando, plataformas de deploy configuradas, primeiro serviço no ar. Sem isso, qualquer projeto que vier depois vai acumular dívida de infra.

Entregáveis:

- Turborepo + pnpm workspaces inicializado
- Pacotes base: `@portfolio/config-eslint`, `config-typescript`, `config-tailwind`, `types`
- `apps/web` com home placeholder deployada no Vercel
- GitHub Actions rodando lint, typecheck, test, Semgrep, Gitleaks
- Neon provisionado com branches por contexto (`main`, `tcc-*`, `honeypot-*`, `threat-intel`)
- Fly.io com app do `sandbox-runner` em modo scale-to-zero
- `services/sandbox-runner` com endpoint `/health` funcionando em `<app>.fly.dev`

Ver `02-setup-monorepo.md` e `03-setup-ci-cd.md`.

### Fase 1 — Portfólio público mínimo (1 semana)

O site do portfólio totalmente funcional, mesmo sem projetos ainda. Páginas, navegação, formulário de contato, MDX pipeline, componentes base no `@portfolio/ui`.

Entregáveis:

- `apps/web` com todas as rotas funcionando
- `@portfolio/ui` com os 8 componentes base
- Formulário de contato via Resend
- MDX pipeline ligado ao Contentlayer2
- SEO, sitemap, robots.txt, OpenGraph
- Timeline acadêmica

Ver `04-portfolio-publico.md`.

### Fase 2 — Projetos acadêmicos (ritmo acadêmico)

Um projeto por matéria relevante, na ordem do calendário. Cada projeto segue um ritual: criar do template, implementar com TDD, documentar no CLAUDE.md próprio, adicionar ao portfólio via MDX.

A ordem sugerida de execução está em `05-roadmap-projetos.md` e detalhada nos arquivos `roadmap/2023-1.md` até `roadmap/2026-1.md`.

### Fase 3 — TCC (2026/1–2026/2)

Último ano. O TCC (SAD Cibersegurança) é o projeto de maior profundidade. Ele já tem documentação avançada (Fase 1 e Fase 2 prontas, Fase 3 é a implementação). Integra-se ao monorepo como `apps/projects/sad-ciberseguranca`.

Ver `06-integracao-tcc.md`.

### Fase 4 — Polimento e lançamento (contínuo)

Ajustes de UX do portfólio, otimização de SEO, casos de uso, videos demo refilmados, README individual de cada projeto revisado, página "Sobre" polida.

## Como o "Vibe Coding disciplinado" se aplica aqui

Akita tem razão: pair programming com IA só funciona com disciplina. Traduzido para este monorepo:

**O humano (você) decide:**

- Quais 15 projetos existem
- Que stack cada projeto usa
- Como os pacotes compartilhados são organizados
- O que vira sandbox, o que vira demo interativa, o que vira vídeo
- O que é "bom o suficiente" para commitar

**A IA (Cursor/Claude Code) executa:**

- Boilerplate do Next.js, NestJS, Prisma
- Testes unitários e de integração
- Refactoring mecânico
- Implementação de features já especificadas
- Documentação técnica derivada do código

**Nunca inverter.** Se a IA propuser "vamos usar GraphQL em vez de REST" sem você pedir, pare. Se ela criar 8 camadas de abstração para um problema simples, pare. Se ela refatorar sem testes cobrindo o código antigo, pare.

## Ordem de leitura recomendada

1. `README.md` (root) — visão do produto
2. `CLAUDE.md` (root) — padrões e princípios
3. `docs/01-visao-geral.md` — este arquivo
4. `docs/02-setup-monorepo.md` — primeira fase prática
5. `docs/03-setup-ci-cd.md` — CI e deploy
6. `docs/04-portfolio-publico.md` — portfólio Next.js
7. `docs/05-roadmap-projetos.md` — roadmap detalhado
8. `docs/roadmap/<semestre>.md` — projetos do semestre corrente
9. `docs/06-integracao-tcc.md` — quando chegar no TCC
10. `docs/architecture/*` — decisões arquiteturais específicas
11. `docs/workflow/*` — fluxos do dia a dia (novo projeto, novo pacote, etc.)

---

## Próximo passo

Ir para `02-setup-monorepo.md` e começar a inicializar o monorepo.
