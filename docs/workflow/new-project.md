# Workflow — Criar um novo projeto em `apps/projects/`

Ritual padronizado para começar um projeto novo. Seguir este passo a passo garante que todo projeto no monorepo tenha a mesma estrutura mínima e qualidade.

---

## 1. Decidir a stack

Antes de criar qualquer arquivo, decida:

- **Frontend-only?** Next.js client-heavy ou página dentro do próprio `apps/web`
- **Com backend próprio?** NestJS ou Node.js puro (Fastify)
- **Python?** Para sniffers, scanners, análise de rede
- **Híbrido?** Ex: Python backend + Next.js frontend

Regra: se já existe um projeto similar no monorepo, copie a estrutura dele. Não invente toda vez.

---

## 2. Criar a pasta

```bash
cd apps/projects
mkdir <slug>   # kebab-case, ex: "password-manager"
cd <slug>
```

---

## 3. Template de `package.json`

Para Next.js puro:

```json
{
  "name": "@projects/<slug>",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@portfolio/ui": "workspace:*",
    "@portfolio/types": "workspace:*"
  },
  "devDependencies": {
    "@portfolio/config-eslint": "workspace:*",
    "@portfolio/config-typescript": "workspace:*",
    "@portfolio/config-tailwind": "workspace:*",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

Para NestJS:

```json
{
  "name": "@projects/<slug>",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "lint": "eslint \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^10",
    "@nestjs/core": "^10",
    "@nestjs/platform-fastify": "^10",
    "@portfolio/security-validators": "workspace:*",
    "@portfolio/types": "workspace:*"
  },
  "devDependencies": {
    "@portfolio/config-typescript": "workspace:*",
    "@nestjs/cli": "^10",
    "@nestjs/testing": "^10",
    "typescript": "^5.7.0",
    "jest": "^29"
  }
}
```

---

## 4. Criar CLAUDE.md (obrigatório)

Template base:

```markdown
# CLAUDE.md — <Nome do Projeto>

> Documento vivo. Atualizar a cada decisão de arquitetura ou obstáculo resolvido.

## 1. O Projeto

**Matéria:** <Matéria da graduação>
**Semestre:** <AAAA/S>
**Categoria:** <interactive | sandbox | video | documentation>
**Impacto:** <high | medium | low>

### O que o projeto faz

<Descrição objetiva em 3-5 linhas>

### Por que existe

<Justificativa acadêmica + relevância para cibersegurança>

## 2. Stack

| Camada | Tecnologia |
| ------ | ---------- |
| ...    | ...        |

## 3. Arquitetura
```

<slug>/
├── src/
...

```

## 4. Conceitos Fundamentais

<Conceitos de segurança relevantes. Ex: para um scanner SQLi, explicar os 4 tipos de injection>

## 5. Obstáculos Conhecidos e Soluções

### 5.1 <Primeiro obstáculo>

**Problema:**
**Solução:**

## 6. Padrões de Código

<Padrões específicos deste projeto>

## 7. Testes

<Estratégia de testes — o que é mockado, o que é real>

## 8. Segurança

<Medidas específicas de segurança tomadas no projeto>

## 9. Checklist de Sessão

- [ ] ...

## 10. Próximos Passos

- [ ] ...
```

---

## 5. Criar README.md (obrigatório)

Template base:

```markdown
# <Nome do Projeto>

<Descrição curta em 1-2 linhas>

## Setup

\`\`\`bash
cd apps/projects/<slug>
pnpm install
cp .env.example .env
pnpm dev
\`\`\`

## Uso

<Como usar>

## Arquitetura

<Diagrama ou descrição>

## Testes

\`\`\`bash
pnpm test
\`\`\`

## Licença

MIT
```

---

## 6. Criar `.env.example`

Sempre. Mesmo que o projeto não precise de env vars hoje. É um lembrete de onde colocar se precisar depois.

```env
# Exemplos
NODE_ENV=development
API_URL=http://localhost:3000
```

---

## 7. Escrever os primeiros testes (TDD)

Antes de qualquer lógica de domínio, escrever:

- 3-5 testes que descrevem o comportamento esperado
- Um teste "walking skeleton" que valida que o projeto sobe

Exemplo para um scanner:

```typescript
describe("SqlInjectionScanner", () => {
  it("detects UNION-based injection", async () => {
    const scanner = new SqlInjectionScanner();
    const result = await scanner.scan({ url: "http://target/?id=1" });
    expect(result.vulnerabilities).toContainEqual(
      expect.objectContaining({ type: "union-based" }),
    );
  });

  it("returns empty when target is safe", async () => {
    const scanner = new SqlInjectionScanner();
    const result = await scanner.scan({ url: "http://safe-target/" });
    expect(result.vulnerabilities).toEqual([]);
  });

  it("validates URL input", async () => {
    const scanner = new SqlInjectionScanner();
    await expect(scanner.scan({ url: "not-a-url" })).rejects.toThrow();
  });
});
```

Depois, implementar.

---

## 8. Primeiro commit

```bash
cd ../../..
pnpm install    # registra o novo workspace
pnpm --filter @projects/<slug> test
pnpm --filter @projects/<slug> lint
git add apps/projects/<slug>
git commit -m "feat(<slug>): scaffold project structure"
```

---

## 9. Integrar ao portfólio

### 9.1 Criar MDX em `apps/web/content/projects/<slug>.mdx`

```mdx
---
title: "<Nome do Projeto>"
description: "<Descrição curta>"
subject: "<Matéria>"
semester: "2024/1"
impact: "high"
category: "sandbox"
tags: ["sqli", "web-security", "owasp"]
githubUrl: "https://github.com/<seu-usuario>/portfolio/tree/main/apps/projects/<slug>"
date: 2024-03-15
---

## Sobre o projeto

<Descrição detalhada em 2-3 parágrafos>

## Arquitetura

<Diagrama ou explicação>

## Demo

<DemoFrame src="..." title="..." />

ou

<VideoEmbed url="..." />

## Destaques técnicos

- Ponto interessante 1
- Ponto interessante 2

## Código

[Ver no GitHub](https://github.com/...)
```

### 9.2 Testar localmente

```bash
pnpm dev --filter=web
# acessar http://localhost:3000/projetos/<slug>
```

---

## 10. Configurar demo (conforme categoria)

### Se for `interactive`

O projeto expõe um componente React embedado via `<DemoFrame />`. Garantir que ele roda isolado sem dependências do `apps/web`.

### Se for `sandbox`

Adicionar entrada no `services/sandbox-runner/src/projects.ts`:

```typescript
export const PROJECTS = {
  "<slug>": {
    image: "ghcr.io/<seu-usuario>/portfolio-<slug>:latest",
    timeout: 30000,
    networkMode: "none",
    memoryMb: 256,
    cpuQuota: 50000,
  },
};
```

Criar `Dockerfile` no projeto. Configurar build no CI para publicar a imagem no GitHub Container Registry.

### Se for `video`

Upload do vídeo para YouTube (unlisted) ou Cloudflare R2. Adicionar URL no frontmatter do MDX.

### Se for `documentation`

Escrever o MDX com todo o conteúdo técnico. Sem demo interativa.

---

## 11. Atualizar a raiz

No `CLAUDE.md` do root, na seção de obstáculos, documentar se algum padrão novo emergiu do projeto.

No `docs/roadmap/<semestre>.md`, marcar o projeto como concluído.

---

## Checklist final

- [ ] Projeto roda com `pnpm dev --filter=@projects/<slug>`
- [ ] Testes passam com `pnpm test --filter=@projects/<slug>`
- [ ] Lint limpo com `pnpm lint --filter=@projects/<slug>`
- [ ] `CLAUDE.md` e `README.md` preenchidos (não templates vazios)
- [ ] `.env.example` criado
- [ ] MDX criado e aparece no portfólio
- [ ] Demo configurada (interactive/sandbox/video conforme categoria)
- [ ] CI verde no PR
- [ ] Mergeado em `main`
