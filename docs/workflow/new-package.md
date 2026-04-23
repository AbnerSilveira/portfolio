# Workflow — Criar um novo pacote em `packages/`

Quando extrair código para um pacote compartilhado e como fazer sem quebrar nada.

---

## Quando criar um pacote

Criar pacote **imediatamente** se:

- O código vai ser usado por **2 ou mais** apps/projects
- Representa uma abstração clara (não é só um monte de helpers soltos)
- A interface pública é estável o suficiente para não mudar a cada semana

Não criar pacote se:

- É código que só um projeto precisa hoje, mesmo que "possa vir a ser útil"
- É uma abstração ainda em formação (espere o padrão emergir de 2-3 casos reais antes)
- É configuração muito específica (usar um componente inline é ok)

## Convenção de nomes

- `@portfolio/*` para pacotes utilitários (bibliotecas, configs)
- `@projects/*` para apps de projetos

Nome sempre em kebab-case, curto, descritivo:

- ✅ `@portfolio/crypto-utils`
- ✅ `@portfolio/security-validators`
- ❌ `@portfolio/utils` (genérico demais)
- ❌ `@portfolio/crypto-stuff-and-things` (longo demais)

---

## Passo a passo

### 1. Criar a estrutura

```bash
cd packages
mkdir <nome> && cd <nome>
mkdir src tests
```

### 2. `package.json`

```json
{
  "name": "@portfolio/<nome>",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "@portfolio/config-eslint": "workspace:*",
    "@portfolio/config-typescript": "workspace:*",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

### 3. `tsconfig.json`

```json
{
  "extends": "@portfolio/config-typescript/base.json",
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. `src/index.ts` (barrel)

Exportar apenas a API pública:

```typescript
export { funcaoPublica } from "./feature-a";
export type { TipoPublico } from "./feature-a";
```

Nunca exportar helpers internos. Se algo não está em `index.ts`, não existe para consumidores.

### 5. Escrever testes primeiro

Antes de implementar qualquer função pública, escrever o teste.

Exemplo para `@portfolio/crypto-utils`:

```typescript
// tests/hash.test.ts
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../src/hash";

describe("hashPassword", () => {
  it("returns a hash starting with $argon2id", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it("produces different hashes for same password (salt)", async () => {
    const h1 = await hashPassword("same");
    const h2 = await hashPassword("same");
    expect(h1).not.toBe(h2);
  });
});

describe("verifyPassword", () => {
  it("verifies correct password", async () => {
    const hash = await hashPassword("correct");
    expect(await verifyPassword("correct", hash)).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await hashPassword("correct");
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});
```

### 6. Implementar

```typescript
// src/hash.ts
import argon2 from "argon2";

/**
 * Hashes a password using Argon2id.
 * Parameters follow OWASP 2024 recommendations:
 * - memoryCost: 19456 KiB (19 MiB)
 * - timeCost: 2 iterations
 * - parallelism: 1
 *
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
```

### 7. Testar em isolamento

```bash
pnpm --filter @portfolio/<nome> test
pnpm --filter @portfolio/<nome> typecheck
pnpm --filter @portfolio/<nome> lint
```

### 8. Consumir no primeiro projeto

No `package.json` do projeto consumidor:

```json
{
  "dependencies": {
    "@portfolio/<nome>": "workspace:*"
  }
}
```

```bash
pnpm install
```

Usar:

```typescript
import { hashPassword } from "@portfolio/<nome>";
```

### 9. Validar o monorepo inteiro ainda passa

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Se algo quebrou, provavelmente:

- Alguma API pública não está exportada corretamente do barrel
- A config do Turborepo não declarou `dependsOn: ["^build"]` para o task que precisa do pacote buildado

### 10. Commit

```bash
git add packages/<nome> apps/<projeto-que-usa>
git commit -m "feat(<nome>): extract into shared package"
```

---

## Regras para pacotes compartilhados

### Nunca

- Importar de app específica (`import { something } from "apps/web/..."`) — isso quebra o isolamento
- Fazer breaking changes sem atualizar todos os consumidores no mesmo commit
- Ter dependências pesadas que vão inflar o bundle de quem consome (preferir peer deps quando aplicável)
- Exportar tipos internos que poderiam vazar detalhes de implementação

### Sempre

- Documentar a API pública com JSDoc
- Ter pelo menos 90% de cobertura de testes (é código de alto impacto)
- Seguir SemVer ao pensar em versões (mesmo privado)
- Adicionar ao CLAUDE.md raiz uma menção ao pacote quando ele vira "padrão" no monorepo

---

## Pacotes já planejados

Estes estão documentados em `CLAUDE.md` e serão criados conforme a necessidade:

| Pacote                           | Quando criar                 | Primeiro consumidor  |
| -------------------------------- | ---------------------------- | -------------------- |
| `@portfolio/config-*`            | Fase 0                       | Todos                |
| `@portfolio/types`               | Fase 0                       | Todos                |
| `@portfolio/ui`                  | Fase 1                       | `apps/web`           |
| `@portfolio/crypto-utils`        | Projeto 3 (Password Manager) | projetos 3, 8, 11    |
| `@portfolio/security-validators` | Projeto 4 (SQLi Scanner)     | projetos 4, 6, 9, 13 |
| `@portfolio/demo-harness`        | Projeto 7 (Honeypot)         | projetos 7, 14, TCC  |
