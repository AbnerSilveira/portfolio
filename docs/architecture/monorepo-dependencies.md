# Arquitetura — Dependências entre Packages, Apps e Services

Mapa completo de quem depende de quem no monorepo. Útil quando você precisa entender o impacto de mudar algo em um pacote compartilhado.

---

## Grafo de dependências

```
                    ┌──────────────────────────────┐
                    │  @portfolio/config-*         │
                    │  (typescript, eslint,        │
                    │   tailwind)                  │
                    └──────────────┬───────────────┘
                                   │ (todos consomem)
                    ┌──────────────┴───────────────┐
                    ▼                              ▼
           ┌────────────────┐            ┌─────────────────┐
           │ @portfolio/    │            │ @portfolio/     │
           │ types          │◄───────────┤ ui              │
           └────────┬───────┘            └─────────┬───────┘
                    │                              │
                    │  ┌───────────────────────────┘
                    │  │
                    ▼  ▼
    ┌──────────────────────────────────────────────────┐
    │  apps/web  (portfólio público)                   │
    └──────────────────────────────────────────────────┘

           ┌────────────────────────────────────┐
           │  @portfolio/crypto-utils           │
           │  @portfolio/security-validators    │
           │  @portfolio/demo-harness           │
           └────────────────┬───────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────┐
          │  apps/projects/*                    │
          │  (consumo seletivo)                 │
          └─────────────────────────────────────┘

          ┌─────────────────────────────────────┐
          │  services/threat-intel-aggregator   │
          │                                     │
          │  ◄── services/sandbox-runner        │
          │  ◄── apps/projects/honeypot         │
          │  ◄── apps/projects/waf              │
          │  ◄── apps/projects/ids              │
          │  ◄── apps/projects/threat-intel-dashboard
          └─────────────────────────────────────┘
```

---

## Dependências por package

### `@portfolio/config-typescript`

**Consumido por:** todos os apps e packages (via `extends` no `tsconfig.json`)
**Risco de mudança:** alto — qualquer mudança afeta compilação de tudo
**Estratégia:** mudanças só via PR com CI completo; adicionar novos flags via opção, não como breaking change

### `@portfolio/config-eslint`

**Consumido por:** todos os apps que têm lint configurado
**Risco de mudança:** médio — pode fazer CI falhar por regras novas
**Estratégia:** quando adicionar regra estrita, primeiro rodar em modo warning por 1-2 semanas

### `@portfolio/config-tailwind`

**Consumido por:** `apps/web`, `apps/admin`, todos os `apps/projects/*` com UI React
**Risco de mudança:** baixo-médio — mudanças visuais detectáveis
**Estratégia:** Visual regression tests seriam bons, mas esforço alto. Validar manualmente na home do portfólio.

### `@portfolio/types`

**Consumido por:** `apps/web`, `@portfolio/ui`, maioria dos projetos
**Risco de mudança:** alto se alterar interfaces já consumidas
**Estratégia:** novas props em interface = safe; remover prop = breaking change, atualizar todos consumidores no mesmo PR

### `@portfolio/ui`

**Consumido por:** `apps/web`, `apps/admin`, alguns `apps/projects/*`
**Risco de mudança:** médio
**Estratégia:** adicionar novas variantes de componentes sem remover as antigas; deprecar explicitamente antes de remover

### `@portfolio/crypto-utils`

**Consumido por:** Password Manager (#3), Encrypted Storage (#8), Mobile 2FA (#11), eventualmente TCC
**Risco de mudança:** altíssimo — mudança pode invalidar dados já criptografados
**Estratégia:** nunca alterar parâmetros criptográficos sem versionamento. Exemplo:

```typescript
// Manter versão antiga para decrypt, nova para encrypt
export function hashPasswordV1(...) { /* Argon2 parâmetros antigos */ }
export function hashPasswordV2(...) { /* Argon2 parâmetros novos */ }
export const hashPassword = hashPasswordV2;  // default atual
```

### `@portfolio/security-validators`

**Consumido por:** SQLi Scanner (#4), OWASP Scanner (#6), WAF (#9), IDS (#13), TCC
**Risco de mudança:** médio
**Estratégia:** adicionar payloads/schemas é safe; remover é breaking — cuidado com validadores muito específicos

### `@portfolio/demo-harness`

**Consumido por:** todos os projetos que têm demo interativa
**Risco de mudança:** alto — mudar a interface `DemoRunner<T>` quebra todos os runners
**Estratégia:** congelar interface após 2 projetos usarem; evoluir via métodos opcionais

---

## Dependências entre services

### `services/threat-intel-aggregator`

Serviço mais reutilizado do monorepo. Consumido por:

- `apps/projects/honeypot` — enriquece IPs capturados
- `apps/projects/waf` — bloqueia requests de IPs maliciosos
- `apps/projects/ids` — enriquece alertas
- `apps/projects/threat-intel-dashboard` — é o backend principal

**Interface estável a partir da Fase 2:** criar versionamento de API (`/v1/...`) desde o início.

### `services/sandbox-runner`

Serviço crítico de segurança. Consumido apenas pelo `apps/web` (via proxy API). Projetos não falam com ele diretamente — apenas são **alvos** dele (rodam dentro).

---

## Ordem recomendada de builds

O Turborepo resolve automaticamente via `dependsOn: ["^build"]`. Mas útil entender:

1. **Config packages** (sem deps entre si) — build paralelo
2. **`@portfolio/types`** — depende apenas de configs
3. **`@portfolio/crypto-utils`, `@portfolio/security-validators`** — dependem de types
4. **`@portfolio/ui`** — depende de types
5. **`@portfolio/demo-harness`** — depende de types
6. **Services** — dependem de seus pacotes específicos
7. **Apps** — dependem do que for relevante

Paralelização máxima: passos 3, 4, 5 acontecem em paralelo. Apps também em paralelo no final.

---

## O que NÃO deve acontecer

### App importando outra app

```typescript
// ❌ NUNCA
import { something } from "../../../web/src/...";
```

Se dois apps precisam do mesmo código, extraia para `packages/`.

### Package importando app

```typescript
// ❌ NUNCA
// dentro de packages/ui/src/
import { config } from "../../../apps/web/...";
```

Packages são base. Apps são consumidores. Nunca inverter.

### Dependências circulares

Turborepo detecta e falha. Se acontecer:

- Extrair a parte comum para um novo package
- Usar events/interface em vez de chamada direta

### Versões dessincronizadas de deps comuns

Exemplo: `apps/web` usa `zod@3.24.0`, mas `packages/security-validators` usa `zod@3.22.0`.

**Solução:** definir versões no root `package.json` via `pnpm.overrides`:

```json
{
  "pnpm": {
    "overrides": {
      "zod": "^3.24.0",
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    }
  }
}
```

---

## Checklist ao criar ou modificar package

- [ ] Documentei a API pública no JSDoc?
- [ ] Atualizei este arquivo se for um package novo?
- [ ] Rodei `pnpm build` e `pnpm test` no monorepo inteiro?
- [ ] Verifiquei quem consome antes de remover/renomear algo?
- [ ] Adicionei versioning se for crypto-utils/security-validators?
