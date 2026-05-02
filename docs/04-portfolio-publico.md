# 04 — Portfólio Público (apps/web)

Construção do hub central em Next.js (App Router). Este é o rosto público do portfólio — precisa ser rápido, bonito e ter SEO forte.

Uso recomendado: **Cursor** para a estrutura e lógica, **Lovable** quando quiser gerar telas específicas rápido. Sempre validar o código gerado contra os padrões do `CLAUDE.md` antes de comitar.

---

## Identidade visual e design polish

Tudo que antes estava em `design-system.md` e `07-design-polish.md` vive **nesta seção** do `04-portfolio-publico.md`. Não substitui os passos técnicos abaixo (bootstrap, MDX, SEO); complementa paleta, hero, cards e fluxo Lovable → Cursor.

**Onde está no código:** `packages/config-tailwind/theme.css` e `apps/web/src/app/globals.css` (Tailwind v4 + shadcn). Evoluções visuais devem respeitar a **parte A** desta seção.

### A — Design system (referência visual)

Fonte da verdade da identidade visual do `apps/web`. Decisões da sprint de polish (Fase 1.5). Fase 2+ consulta esta subseção para consistência.

#### Filosofia (visual)

Estética de cibersegurança moderna sem cair em kitsch ("hacker de filme"). Inspirações: Linear, Vercel, dashboards SOC modernos, Solarized. Identidade carregada por monospace pontual + acento periwinkle, não por chuva de código de fundo.

#### Modo de cor

Respeita `prefers-color-scheme` do visitante. Toggle manual pode vir depois sem retrabalho de tokens.

Referência de mapeamento em `packages/config-tailwind/theme.css` (exemplo conceitual — o repo pode usar oklch em `globals.css`):

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-card: var(--card);
  --color-border: var(--border);
  --color-border-hover: var(--border-hover);
  --color-danger: var(--danger);
  --color-warning: var(--warning);
}

:root {
  /* Light mode (default) — papel envelhecido */
  --background: #f6ecd4;
  --foreground: #2a2520;
  --muted: #544a3d;
  --accent: #3d4ba8;
  --card: #fdf7e6;
  --border: rgba(61, 53, 42, 0.15);
  --border-hover: rgba(61, 75, 168, 0.55);
  --danger: #a63d3d;
  --warning: #946817;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode — cyber azul profundo */
    --background: #0a0e1a;
    --foreground: #e0e8ff;
    --muted: rgba(224, 232, 255, 0.65);
    --accent: #7c93ff;
    --card: rgba(124, 147, 255, 0.04);
    --border: rgba(124, 147, 255, 0.15);
    --border-hover: rgba(124, 147, 255, 0.55);
    --danger: #ff7b7b;
    --warning: #ffb86b;
  }
}
```

#### Paleta — referência rápida

| Token        | Light (default)              | Dark                          |
| ------------ | ---------------------------- | ----------------------------- |
| background   | `#f6ecd4` papel envelhecido  | `#0a0e1a` cyber azul profundo |
| foreground   | `#2a2520` marrom-quase-preto | `#e0e8ff` branco-azulado      |
| muted        | `#544a3d`                    | `rgba(224,232,255,0.65)`      |
| accent       | `#3d4ba8` periwinkle deep    | `#7c93ff` periwinkle vibrante |
| card         | `#fdf7e6`                    | `rgba(124,147,255,0.04)`      |
| border       | `rgba(61,53,42,0.15)`        | `rgba(124,147,255,0.15)`      |
| border-hover | `rgba(61,75,168,0.55)`       | `rgba(124,147,255,0.55)`      |
| danger       | `#a63d3d`                    | `#ff7b7b`                     |
| warning      | `#946817`                    | `#ffb86b`                     |

Os pares accent/danger/warning partilham hue entre modos — só luminância muda.

#### Tipografia

- **Geist Sans** — corpo, títulos, navegação (`next/font` em `layout.tsx`). Pesos: 400, 500, 600 (semibold em títulos grandes).
- **Geist Mono** — hero terminal, badges, código MDX, métricas. Pesos: 400, 500.

Regra: monospace é pontual; nunca mono em prosa longa, listas ou navegação principal.

#### Layout

- **Radius:** cards `rounded-lg` (8px); seções `rounded-xl` (12px); inputs/botões `rounded-md` (6px).
- **Sombras:** sem `box-shadow` colorido em hover (borda + translação). Sombras neutras só em modais/popovers se necessário.
- **Espaçamento:** hero e seções principais `py-16` desktop / `py-12` mobile; cards `p-4` a `p-5`.

#### Detalhes de personalidade (máx. 3; não expandir sem decisão)

**1. Typewriter no subtítulo do Hero** — Nome em sans grande estático; subtítulo em mono letra a letra; cursor bloco `accent` ~0.5em×0.95em; blink step-end; fade do cursor após ~5s. Nome não animado (SEO/legibilidade). Só CSS keyframes, sem Framer.

**2. Hover sóbrio em cards** — Sem glow: borda `border` → `border-hover`, tint no fundo (dark: card 4% → 9% mix), `translateY(-2px)`, `transition 0.22s ease`.

**3. Badges de impacto** — Listing `/projetos`: ponto 8px ao lado do título (danger / warning / muted). Detalhe `/projetos/[slug]`: badge terminal `[ALTO]` / `[MÉDIO]` / `[BAIXO]` em mono. Sem pills coloridas; sem formato terminal no listing denso.

#### Princípios de validação (≤2 min por rota)

1. Hierarquia clara — um elemento dominante por seção?
2. Contraste WCAG AA — ≥4.5:1 normal, ≥3:1 large?
3. Densidade vs respiro?
4. Consistência com outras rotas?
5. Simplicidade — algo pode sair sem piorar? Em dúvida, tirar.

#### Validação concreta

Testar paleta em realtimecolors.com (`#f6ecd4` / `#0a0e1a`, texto `#2a2520` / `#e0e8ff`, primary `#3d4ba8` / `#7c93ff`). Lighthouse por rota: meta **95+** nas quatro métricas (Performance 95–99 com fontes custom aceitável).

#### Anti-padrões (UI)

- Cores hardcoded no JSX — usar tokens.
- Pills coloridas para status — ponto ou badge terminal conforme contexto.
- Glow colorido; fundo com dots/scanlines; Framer só por “detalhe”; mono em prosa longa; light/dark com hues divergentes por token.

#### Inspirações

Linear, Vercel, Solarized Light, GitHub Dark, Snyk / Wiz / Tailscale.

### B — Sprint de design polish (Lovable + Cursor)

Sprint curta (≈2–4 h) para sair do default Tailwind e dar personalidade **antes** da Fase 2. Não é DS completo. O comentário em `02-setup-monorepo.md` (tokens a ajustar após identidade) cumpre-se aqui e na **parte A**.

#### Pré-requisitos

- CI verde; site em produção acessível; Lovable + Cursor disponíveis.

#### Filosofia do polish

Não é redesign zero: trocar casca (paleta, tipo, espaçamento) em Hero, ProjectCard, timeline, formulário. Workflow: `docs/workflow/daily-workflow.md` — Lovable ~70%, Cursor ~30%. Direção: cyber elegante (SOC, Snyk/Wiz/Tailscale, Warp/Ghostty), sem kitsch Matrix.

#### Passo polish 1 — Direção (~15 min)

**Paleta (escolher uma base):** (A) terminal verde `#0a0e0a` / `#e0f0e0` / acentos verde; (B) cyber azul `#0a0e1a` / `#e0e8ff` / cyan ou `#7c93ff`; (C) carbon `#0d1117` / `#c9d1d9` / laranja ou roxo. **Tipo:** sans (Inter, Geist, Satoshi) + mono (JetBrains, Geist Mono); default recomendado **Geist Sans + Geist Mono**. **Detalhes (1–3):** cursor no hero, typewriter subtítulo, badges terminal, etc. Evitar Matrix rain, glitch pesado, neon a piscar tudo.

#### Passo polish 2 — Lovable (~45–60 min)

Prompt inicial (adaptar paleta/tipo escolhidos): Next 16, Tailwind v4, shadcn; navbar fixa blur (Projetos, TCC, Sobre); hero nome + subtítulo + 2 CTAs; seção destaque grid 3 col responsive + cards com impacto; footer mínimo. Referências: GitHub Dark, Vercel, SOC. Sem emojis; sem chuva de código.

Iterações típicas: “reduzir título hero”; “cards com matéria/semestre”; “paleta consistente em secundários”; “cursor após nome”.

#### Passo polish 3 — Cursor (~60–90 min)

Mapear Lovable → `Hero.tsx`, `ProjectCard.tsx`, `layout.tsx`. Obrigatório: Tailwind v4 tokens em `theme.css` / `globals.css`, não `bg-[#…]` solto; shadcn primitivos em `components/ui/`, domínio em `components/portfolio` ou equivalente; `@base-ui` em vez de Radix se Lovable errar; `<Link>` do Next; dados reais Contentlayer; `next/font` para Geist; WCAG.

```powershell
pnpm --filter web lint
pnpm --filter web typecheck
pnpm --filter web build
pnpm --filter web dev
```

Lighthouse: manter scores altos; se contraste falhar, corrigir antes do commit.

#### Passo polish 4 — Outras rotas (~30 min)

`/projetos`, `/projetos/[slug]` (prose dark), `/sobre`, `/tcc`, `not-found`.

#### Passo polish 5 — Commits

Commits pequenos sugeridos: fontes → theme → hero/home → ProjectCard → restantes rotas; Conventional Commits; validar antes de push.

#### Passo polish 6 — Documentar

Atualizar a **parte A** desta seção com decisões finais (paleta real, pesos, tokens). Atualizar comentário em `packages/config-tailwind/theme.css` para apontar a **`docs/04-portfolio-publico.md` (seção identidade visual)**.

#### Critérios de pronto (polish)

- Identidade coerente em produção; paleta nas 5 rotas principais; Lighthouse 95+ (tolerância performance); mobile+desktop; **parte A** atualizada; comentário de tokens resolvido; commits validados.

#### Anti-padrões (sprint polish)

Não mexer em rotas/API/Contentlayer “de brinde”; não adicionar Framer só por animação; não DS completo infinito; não `--no-verify`; não trocar shadcn por outra lib.

#### Tempo total estimado

~3–4 h (uma sessão ou duas de 1,5–2 h).

#### Depois do polish

Seguir `05-roadmap-projetos.md` (Fase 2); novos projetos alinham à **parte A** deste documento.

---

## Passo 1 — Bootstrap do Next.js

```bash
cd apps
pnpm create next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --turbopack
cd web
```

Editar `apps/web/package.json`:

```json
{
  "name": "web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "contentlayer": "contentlayer2 build",
    "build": "pnpm contentlayer && next build --webpack",
    "start": "next start",
    "lint": "pnpm contentlayer && eslint .",
    "typecheck": "pnpm contentlayer && tsc --noEmit",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest"
  }
}
```

Adicionar dependências:

```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @portfolio/config-eslint@workspace:* @portfolio/config-typescript@workspace:* @portfolio/config-tailwind@workspace:* @portfolio/types@workspace:*
pnpm add -D @portfolio/ui@workspace:*
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest tw-animate-css@latest
```

Ajustar `tsconfig.json`:

```json
{
  "extends": "@portfolio/config-typescript/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

> **Tailwind v4 (CSS-first):** este monorepo usa Tailwind 4. Não há `tailwind.config.ts` por padrão.
>
> Em vez disso, o tema/tokens compartilhados ficam em `@portfolio/config-tailwind/theme.css` e são importados no `globals.css`.

Atualizar `src/app/globals.css`:

```css
@import "tailwindcss";
@import "@portfolio/config-tailwind/theme.css";
@import "tw-animate-css";
```

---

## Passo 2 — Criar o pacote `@portfolio/ui`

```bash
cd ../../packages
mkdir -p ui/src/components ui/src/lib
cd ui
```

`package.json`:

```json
{
  "name": "@portfolio/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@portfolio/config-typescript": "workspace:*",
    "@portfolio/types": "workspace:*",
    "typescript": "^5.7.0",
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

`src/lib/cn.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`src/index.ts` (mínimo no Passo 2):

```typescript
export * from "./lib/cn";
```

### Inicializar shadcn/ui

Dentro de `apps/web`:

```bash
cd ../../apps/web
pnpm dlx shadcn@latest init --defaults
```

Escolher as opções padrão. O `init` vai criar `components.json`, `src/lib/utils.ts` e componentes iniciais (ex.: `Button`).

**Ajuste recomendado no monorepo:** em `src/lib/utils.ts`, reexportar `cn` do pacote `@portfolio/ui` para evitar duplicação.

---

## Passo 3 — Componentes base do `@portfolio/ui`

Criar os 8 componentes essenciais. Exemplo do `ProjectCard`:

`packages/ui/src/components/ProjectCard.tsx`:

```typescript
import type { ProjectMetadata } from "@portfolio/types";
import { cn } from "../lib/cn";

interface ProjectCardProps {
  project: ProjectMetadata;
  className?: string;
}

const impactColors = {
  high: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200",
  low: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <a
      href={`/projetos/${project.slug}`}
      className={cn(
        "group block rounded-lg border p-6 transition hover:border-primary",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold group-hover:text-primary">
          {project.title}
        </h3>
        <span className={cn("rounded-full px-2 py-0.5 text-xs", impactColors[project.impact])}>
          {project.impact}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
```

Criar também: `DemoFrame`, `CodeBlock`, `VideoEmbed`, `SecurityBadge`, `SemesterTimeline`, `Navbar`, `Footer`.

`packages/ui/src/components/DemoFrame.tsx`:

```typescript
"use client";

import { useState } from "react";
import { cn } from "../lib/cn";

interface DemoFrameProps {
  src: string;
  title: string;
  height?: number;
  className?: string;
}

export function DemoFrame({ src, title, height = 600, className }: DemoFrameProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg border", className)}>
      {!loaded && (
        <div
          className="flex items-center justify-center bg-muted text-muted-foreground"
          style={{ height }}
        >
          Carregando demo...
        </div>
      )}
      <iframe
        src={src}
        title={title}
        sandbox="allow-scripts allow-forms allow-same-origin"
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ height, width: "100%", border: 0, display: loaded ? "block" : "none" }}
      />
    </div>
  );
}
```

`src/index.ts`:

```typescript
export * from "./components/ProjectCard";
export * from "./components/DemoFrame";
export * from "./components/CodeBlock";
export * from "./components/VideoEmbed";
export * from "./components/SecurityBadge";
export * from "./components/SemesterTimeline";
export * from "./components/Navbar";
export * from "./components/Footer";
export * from "./lib/cn";
```

---

## Passo 4 — Pipeline MDX com Contentlayer2

```bash
cd ../../apps/web
pnpm add contentlayer2 next-contentlayer2
pnpm add -D @types/mdx
```

Criar `contentlayer.config.ts` na raiz de `apps/web`:

```typescript
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    subject: { type: "string", required: true },
    semester: { type: "string", required: true },
    impact: {
      type: "enum",
      options: ["high", "medium", "low"],
      required: true,
    },
    category: {
      type: "enum",
      options: ["interactive", "sandbox", "video", "documentation"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    githubUrl: { type: "string" },
    demoUrl: { type: "string" },
    videoUrl: { type: "string" },
    date: { type: "date", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^projects\//, ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Project],
});
```

Integrar no `next.config.ts`:

```typescript
import { withContentlayer } from "next-contentlayer2";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@portfolio/ui", "@portfolio/types"],
};

export default withContentlayer(nextConfig);
```

---

## Passo 5 — Estrutura de rotas e páginas

```
apps/web/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                         # Home
│   ├── sobre/page.tsx
│   ├── projetos/
│   │   ├── page.tsx                     # Lista
│   │   └── [slug]/page.tsx              # Detalhe
│   ├── tcc/page.tsx                     # SAD Cibersegurança
│   └── api/
│       ├── contact/route.ts
│       └── sandbox/run/route.ts
├── components/
│   ├── Hero.tsx
│   ├── Mdx.tsx
│   └── ContactForm.tsx
└── lib/
    ├── projects.ts                      # Query helpers
    └── api.ts
```

### Home — `app/page.tsx`

```typescript
import { allProjects } from "contentlayer/generated";
import { ProjectCard } from "@portfolio/ui";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  const featured = allProjects
    .filter((p) => p.impact === "high")
    .slice(0, 6);

  return (
    <main>
      <Hero />
      <section className="container py-16">
        <h2 className="mb-8 text-3xl font-bold">Projetos em destaque</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              project={{
                slug: project.slug,
                title: project.title,
                description: project.description,
                subject: project.subject,
                semester: project.semester,
                impact: project.impact,
                category: project.category,
                tags: project.tags,
                githubUrl: project.githubUrl,
                demoUrl: project.demoUrl,
                videoUrl: project.videoUrl,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
```

### Detalhe — `app/projetos/[slug]/page.tsx`

```typescript
import { allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="container py-12">
      <header className="mb-8">
        <div className="mb-2 text-sm text-muted-foreground">
          {project.subject} — {project.semester}
        </div>
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
      </header>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <Mdx code={project.body.code} />
      </div>
    </article>
  );
}
```

---

## Passo 6 — API routes

### Contato — `app/api/contact/route.ts`

```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "RESEND_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const body: unknown = await request.json();
    const data = contactSchema.parse(body);

    const from = process.env.CONTACT_FROM_EMAIL ?? "portfolio@example.com";
    const to = process.env.CONTACT_TO_EMAIL ?? "you@example.com";

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `[Portfolio] Contato de ${data.name}`,
      replyTo: data.email,
      text: data.message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 },
    );
  }
}
```

### Sandbox proxy — `app/api/sandbox/run/route.ts`

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";

const runSchema = z.object({
  projectId: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(50),
  input: z.unknown(),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = runSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const baseUrl =
    process.env.SANDBOX_RUNNER_URL ?? process.env.NEXT_PUBLIC_SANDBOX_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Sandbox runner URL not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data, { status: response.status });
}
```

---

## Passo 7 — SEO e metadata

`app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Portfolio — Cibersegurança",
    template: "%s | Portfolio",
  },
  description:
    "Portfólio de projetos em cibersegurança: scanners, honeypots, IDS, threat intelligence e mais.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Portfolio Cibersegurança",
  },
  robots: { index: true, follow: true },
};
```

Criar `app/sitemap.ts`:

```typescript
import { allProjects } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/projetos", "/sobre", "/tcc"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
  const projectRoutes = allProjects.map((p) => ({
    url: `${base}/projetos/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...staticRoutes, ...projectRoutes];
}
```

Criar `app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
```

---

## Passo 8 — Timeline acadêmica

Componente interativo na página `/sobre` exibindo a jornada semestre a semestre, com os projetos que pertencem a cada um. Código em `packages/ui/src/components/SemesterTimeline.tsx`.

---

## Passo 9 — Primeiro conteúdo placeholder

Criar `apps/web/content/projects/placeholder.mdx`:

```mdx
---
title: "Projeto Placeholder"
description: "Este projeto ainda será construído."
subject: "Matéria X"
semester: "2023/1"
impact: "high"
category: "interactive"
tags: ["placeholder"]
date: 2026-01-01
---

## Em construção

Este projeto será detalhado em breve.
```

---

## Passo 10 — Testar, validar, deployar

```bash
cd ../../
pnpm dev --filter=web
```

Acessar http://localhost:3000. Validar:

- [x] Home carrega
- [x] Lista de projetos funciona
- [x] Detalhe do projeto placeholder renderiza o MDX
- [x] Formulário de contato responde (com `RESEND_API_KEY` e `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` configurados)
- [x] `/sitemap.xml` e `/robots.txt` retornam
- [x] Lighthouse (meta): SEO, Accessibility e Best Practices ≥ 95 — validado localmente (2026-05-01). **Performance** ≥ 95: confirmar na URL publicada com [PageSpeed Insights](https://pagespeed.web.dev/) ou Lighthouse contra produção; em `localhost` headless o score de Performance costuma ficar bem abaixo do alvo e não reflete a Vercel.

Commitar e push. O deploy do `apps/web` acontece via **integração nativa Vercel ↔ GitHub**.

- (Vercel) Configurar Framework Preset = Next.js, Root Directory = apps/web, Include files outside = Enabled

---

## Checklist de conclusão da Fase 1

- [x] `apps/web` rodando local e em produção (build `pnpm --filter web build` OK; `main` integrado ao GitHub para deploy Vercel)
- [x] `@portfolio/ui` com 8 componentes base (`ProjectCard`, `DemoFrame`, `CodeBlock`, `VideoEmbed`, `SecurityBadge`, `SemesterTimeline`, `Navbar`, `Footer`)
- [x] Pipeline MDX funcionando (Contentlayer + `content/projects/*.mdx`)
- [x] Todas as rotas principais implementadas (`/`, `/projetos`, `/projetos/[slug]`, `/sobre`, `/tcc`, `not-found`; contato em `/sobre#contato`)
- [x] SEO configurado (sitemap, robots, metadata em `layout.tsx`)
- [x] Formulário de contato funcional (`/api/contact` + Resend; requer env em produção)
- [x] Lighthouse: SEO, Accessibility e Best Practices ≥ 95 (validação local 2026-05-01); Performance ≥ 95 — **confirmar na URL de produção** (ver nota no Passo 10)
- [x] Timeline acadêmica implementada (`SemesterTimeline` em `/sobre`)
- [x] Identidade visual alinhada à seção **Identidade visual e design polish** deste doc (após polish)

**Próximo passo:** `05-roadmap-projetos.md`.
