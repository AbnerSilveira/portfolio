# 06 — Integração do TCC

O TCC (SAD Cibersegurança) já tem documentação avançada própria (CLAUDE.md e README.md anexados originalmente). Este documento trata da **integração** dele ao monorepo e de como ele se beneficia dos pacotes compartilhados sem perder independência.

---

## Contexto

O TCC nasceu como projeto autônomo em `backend/` + `frontend/` + `motor/`. Ao entrar no monorepo, ele passa a viver em:

```
apps/projects/sad-ciberseguranca/
├── backend/        # NestJS API (mantém estrutura original)
├── frontend/       # React + Vite (mantém estrutura original)
├── motor/          # Python (mantém estrutura original)
├── CLAUDE.md       # Original do TCC, preservado
├── README.md       # Original do TCC, preservado
└── package.json    # Novo: orquestra os 3 subsistemas
```

**Princípio:** não reescrever. O TCC é um trabalho acadêmico avaliado — sua estrutura original é respeitada. O monorepo adiciona conveniências, não substitui o que já existe.

---

## O que muda ao integrar

### 1. Pacotes compartilhados disponíveis

O backend do TCC pode agora importar:

- `@portfolio/security-validators` — para validar inputs do formulário (CPF, CNPJ, URLs)
- `@portfolio/types` — para tipos comuns (porte empresarial, etc., se fizer sentido)
- `@portfolio/crypto-utils` — se o TCC vier a armazenar dados sensíveis das empresas analisadas

### 2. CI unificado

O pipeline geral do monorepo agora testa o TCC junto. `turbo test --filter=@projects/sad-ciberseguranca` roda só os testes do TCC quando apenas ele muda.

### 3. Deploy separado

O TCC continua com deploy próprio — o dashboard do TCC é parte do portfólio público, mas a API e o Postgres do TCC ficam em Fly.io (backend scale-to-zero) + Neon (Postgres branch dedicado `tcc-sad-ciberseguranca`). Isso mantém custo próximo de R$ 0 fora de períodos de demonstração e escala automaticamente durante a defesa.

### 4. Página dedicada no portfólio

`apps/web/app/tcc/page.tsx` recebe tratamento especial — página mais rica que a de um projeto comum, com explicação do Gordon-Loeb, AHP, TOPSIS, e um link que embeda a UI do SAD via iframe sandbox.

---

## Passos de integração

### Passo 1 — Mover o projeto para `apps/projects/sad-ciberseguranca/`

```bash
cd portfolio
mkdir -p apps/projects/sad-ciberseguranca
# Copiar backend/, frontend/, motor/, CLAUDE.md, README.md para dentro
```

### Passo 2 — Criar `package.json` orquestrador

`apps/projects/sad-ciberseguranca/package.json`:

```json
{
  "name": "@projects/sad-ciberseguranca",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "pnpm run --parallel dev:backend dev:frontend",
    "dev:backend": "cd backend && npm run start:dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "pnpm run build:backend && pnpm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "test": "pnpm run test:backend && pnpm run test:frontend",
    "test:backend": "cd backend && npm run test",
    "test:frontend": "cd frontend && npm run test",
    "lint": "pnpm run lint:backend && pnpm run lint:frontend",
    "lint:backend": "cd backend && npm run lint",
    "lint:frontend": "cd frontend && npm run lint"
  }
}
```

> O backend e frontend continuam com `npm` internamente (como nasceram). O wrapper em pnpm só orquestra. Isso evita quebrar os lock files já validados da Fase 2 do TCC.

### Passo 3 — Consumir pacotes compartilhados (onde fizer sentido)

No `backend/package.json` do TCC, adicionar se relevante:

```json
{
  "dependencies": {
    "@portfolio/security-validators": "workspace:*",
    "@portfolio/types": "workspace:*"
  }
}
```

Uso no backend:

```typescript
import { urlSchema, cnpjSchema } from "@portfolio/security-validators";
import type { ProjectMetadata } from "@portfolio/types";
```

### Passo 4 — Deploy

O TCC tem dois componentes deployáveis:

**Backend NestJS + PostgreSQL → Fly.io + Neon:**

```yaml
# .github/workflows/deploy-tcc-backend.yml
name: Deploy TCC Backend

on:
  push:
    branches: [main]
    paths:
      - "apps/projects/sad-ciberseguranca/backend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: apps/projects/sad-ciberseguranca/backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

O `fly.toml` do backend do TCC fica em `apps/projects/sad-ciberseguranca/backend/fly.toml` com `app = "portfolio-tcc-backend"` e `DATABASE_URL` apontando para o branch `tcc-sad-ciberseguranca` do Neon (via secrets do Fly).

**Importante na defesa:** evitar cold start na apresentação fazendo um warm-up 2 min antes (`curl https://portfolio-tcc-backend.fly.dev/health`). Alternativa: durante a janela da defesa, setar `min_machines_running = 1` via `flyctl scale count 1` — custo insignificante por algumas horas.

**Frontend React → Vercel (subdeploy):**

Configurar um segundo projeto Vercel apontando para `apps/projects/sad-ciberseguranca/frontend` com domínio `tcc.<seu-dominio>.com.br`.

### Passo 5 — Página dedicada no portfólio

`apps/web/app/tcc/page.tsx`:

```typescript
import { DemoFrame } from "@portfolio/ui";

export default function TCCPage() {
  return (
    <main className="container py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-bold">SAD Cibersegurança</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Sistema de Apoio à Decisão para Alocação Ótima de Investimentos em Segurança da Informação
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Metodologia</h2>
        <p>
          O sistema combina três metodologias consagradas: o <strong>Modelo Gordon-Loeb</strong> (2002),
          que estabelece o teto econômico de investimento; o <strong>AHP</strong> (Saaty, 1980), que
          pondera os critérios de decisão; e o <strong>TOPSIS</strong> (Hwang & Yoon, 1981), que
          rankeia as alternativas pela distância da solução ideal.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Demonstração</h2>
        <DemoFrame
          src="https://tcc.<seu-dominio>.com.br"
          title="SAD Cibersegurança"
          height={800}
        />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Referências</h2>
        <ul className="list-disc pl-6">
          <li>Gordon, L. A., & Loeb, M. P. (2002). The Economics of Information Security Investment.</li>
          <li>Saaty, T. L. (1980). The Analytic Hierarchy Process.</li>
          <li>Hwang, C. L., & Yoon, K. (1981). Multiple Attribute Decision Making.</li>
          <li>IBM. (2025). Cost of a Data Breach Report 2025.</li>
        </ul>
      </section>
    </main>
  );
}
```

---

## O que NÃO mudar no TCC

Para preservar a integridade acadêmica:

- Não renomear `DecisaoService`, `TopsisService` ou qualquer camada documentada no TCC
- Não mudar o `sad_config.json` por conveniência de monorepo — ele é gerado pelo script Python e tem validação acadêmica
- Não substituir NestJS/React por outra stack — a banca pode perguntar sobre as escolhas, e elas estão justificadas na documentação original
- Não comprimir as 3 camadas (motor/backend/frontend) em uma só — a separação é intencional e pedagogicamente justificada

---

## Cronograma sugerido para a integração

**2026/1 (antes do TCC formal começar):**

- Fazer a integração estrutural no monorepo
- Validar que CI roda sem quebrar nada
- Preparar a página `/tcc` no portfólio

**2026/2 (semestre do TCC):**

- Implementar as Fases 3, 4 e 5 do TCC (código + deploy + redação final)
- A cada release do TCC, o portfólio reflete automaticamente via ISR do Next.js

---

## Checklist de integração

- [ ] TCC movido para `apps/projects/sad-ciberseguranca/`
- [ ] `package.json` orquestrador criado
- [ ] CI roda os testes do TCC sem falhar
- [ ] `@portfolio/security-validators` integrado onde fizer sentido
- [ ] Fly.io app `portfolio-tcc-backend` deployado com branch `tcc-sad-ciberseguranca` do Neon
- [ ] Vercel configurado para `tcc.<seu-dominio>.com.br`
- [ ] Página `/tcc` do portfólio implementada
- [ ] README original e CLAUDE.md original do TCC preservados
