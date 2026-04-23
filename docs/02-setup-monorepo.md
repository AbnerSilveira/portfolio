# 02 — Setup do Monorepo

Passo a passo para inicializar o monorepo do zero. Executar em ordem. Cada seção termina com um commit que passa no CI.

---

## Pré-requisitos

Confirmar antes de começar:

```bash
node --version    # >= 20.x
pnpm --version    # >= 9.x
git --version
docker --version
```

Se pnpm não estiver instalado: `npm install -g pnpm@latest`.

---

## Passo 1 — Inicializar o repositório

```bash
mkdir portfolio && cd portfolio
git init
pnpm init
```

Abrir `package.json` e substituir o conteúdo por:

```json
{
  "name": "portfolio",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "test:cov": "turbo test:cov",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md,mdx,json,yaml,yml}\""
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "prettier": "^3.4.0",
    "@commitlint/cli": "^19.6.0",
    "@commitlint/config-conventional": "^19.6.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0"
  }
}
```

Criar `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "apps/projects/*"
  - "packages/*"
  - "services/*"
```

Criar `.gitignore` na raiz:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
.turbo/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local
!.env.example

# Editor
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/

# Python
__pycache__/
*.pyc
.venv/
venv/
```

Criar `.nvmrc` com a versão do Node:

```
20.18.1
```

Criar `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

**Commit:**

```bash
git add .
git commit -m "chore: initialize monorepo with pnpm workspaces and Turborepo"
```

---

## Passo 2 — Configurar Turborepo

Criar `turbo.json` na raiz:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:cov": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Commit:**

```bash
git add turbo.json
git commit -m "chore: add Turborepo pipeline configuration"
```

---

## Passo 3 — Pacotes de configuração compartilhada

### 3.1 `@portfolio/config-typescript`

```bash
mkdir -p packages/config-typescript
cd packages/config-typescript
```

Criar `package.json`:

```json
{
  "name": "@portfolio/config-typescript",
  "version": "0.0.0",
  "private": true,
  "files": ["*.json"]
}
```

Criar `base.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

Criar `nextjs.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "allowJs": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "noEmit": true
  }
}
```

Criar `nestjs.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "target": "ES2022",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist"
  }
}
```

### 3.2 `@portfolio/config-eslint`

```bash
cd ../..
mkdir -p packages/config-eslint
cd packages/config-eslint
```

`package.json`:

```json
{
  "name": "@portfolio/config-eslint",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./index.js",
  "files": ["*.js"],
  "peerDependencies": {
    "eslint": "^9.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "@eslint/js": "^9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-security": "^3.0.1",
    "typescript-eslint": "^8.19.0"
  }
}
```

`base.js`:

```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  security.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
    },
  },
];
```

### 3.3 `@portfolio/config-tailwind`

```bash
cd ../..
mkdir -p packages/config-tailwind
cd packages/config-tailwind
```

`package.json`:

```json
{
  "name": "@portfolio/config-tailwind",
  "version": "0.0.0",
  "private": true,
  "main": "./preset.js",
  "files": ["preset.js"],
  "peerDependencies": {
    "tailwindcss": "^3.4.0"
  }
}
```

`preset.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Design tokens do portfólio — ajustar após definir identidade visual
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 3.4 `@portfolio/types`

```bash
cd ../..
mkdir -p packages/types/src
cd packages/types
```

`package.json`:

```json
{
  "name": "@portfolio/types",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

`src/index.ts`:

```typescript
export type ProjectCategory =
  | "interactive"
  | "sandbox"
  | "video"
  | "documentation";
export type ProjectImpact = "high" | "medium" | "low";

export interface ProjectMetadata {
  slug: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  impact: ProjectImpact;
  category: ProjectCategory;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
}

export * from "./demo-runner";
```

`src/demo-runner.ts`:

```typescript
export interface DemoRunner<TInput, TOutput> {
  name: string;
  run(input: TInput): Promise<TOutput>;
  validateInput(input: unknown): TInput;
  isAvailable(): Promise<boolean>;
}
```

**Commit:**

```bash
cd ../..
git add packages/
git commit -m "feat(packages): add shared config packages (typescript, eslint, tailwind, types)"
```

---

## Passo 4 — Husky e pre-commit hooks

```bash
pnpm install
pnpm exec husky init
```

Substituir `.husky/pre-commit` por:

```bash
pnpm exec lint-staged
```

Criar `.husky/commit-msg`:

```bash
pnpm exec commitlint --edit "$1"
```

```bash
chmod +x .husky/commit-msg
```

No `package.json` raiz, adicionar:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --fix"],
    "*.{md,mdx,json,yaml,yml}": ["prettier --write"]
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"],
    "rules": {
      "type-enum": [
        2,
        "always",
        [
          "feat",
          "fix",
          "docs",
          "style",
          "refactor",
          "perf",
          "test",
          "chore",
          "security",
          "ci",
          "build"
        ]
      ]
    }
  }
}
```

**Commit:**

```bash
git add .
git commit -m "chore: add Husky pre-commit hooks and commitlint"
```

---

## Passo 5 — Docker Compose para dev local

Criar `docker-compose.yml` na raiz:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: portfolio_postgres
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
      POSTGRES_DB: portfolio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: portfolio_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Criar `.env.example`:

```env
NODE_ENV=development
DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio
REDIS_URL=redis://localhost:6379
```

Testar:

```bash
docker compose up -d
docker compose ps
docker compose down
```

**Commit:**

```bash
git add docker-compose.yml .env.example
git commit -m "chore: add Docker Compose for local Postgres and Redis"
```

---

## Passo 6 — VS Code workspace settings

Criar `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "files.exclude": {
    "**/node_modules": true,
    "**/.turbo": true,
    "**/.next": true
  }
}
```

Criar `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "yoavbls.pretty-ts-errors",
    "unifiedjs.vscode-mdx"
  ]
}
```

**Commit:**

```bash
git add .vscode/
git commit -m "chore: add VS Code workspace settings and extension recommendations"
```

---

## Passo 7 — Conectar ao GitHub

```bash
git branch -M main
git remote add origin git@github.com:<seu-usuario>/portfolio.git
git push -u origin main
```

No GitHub, em Settings:

- **Branches** — adicionar branch protection para `main`:
  - Require pull request before merging
  - Require status checks to pass before merging
  - Require conversation resolution before merging
- **Secrets and variables → Actions** — adicionar:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `SNYK_TOKEN`
  - `SEMGREP_APP_TOKEN` (opcional)

---

## Checklist de conclusão da Fase 0 (parte 1)

- [ ] `pnpm install` roda sem erros
- [ ] `docker compose up -d` sobe Postgres e Redis
- [ ] `.env` criado a partir do `.env.example` e preenchido
- [ ] Primeiro push no GitHub feito
- [ ] Branch protection configurada
- [ ] Secrets configurados

**Próximo passo:** `03-setup-ci-cd.md`.
