# 04 — Portfólio Público (apps/web)

Construção do hub central em Next.js (App Router). Este é o rosto público do portfólio — precisa ser rápido, bonito e ter SEO forte.

Uso recomendado: **Cursor** para a estrutura e lógica, **Lovable** quando quiser gerar telas específicas rápido. Sempre validar o código gerado contra os padrões do `CLAUDE.md` antes de comitar.

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
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Adicionar dependências:

```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @portfolio/config-eslint@workspace:* @portfolio/config-typescript@workspace:* @portfolio/config-tailwind@workspace:* @portfolio/types@workspace:*
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

> **Tailwind v4 (CSS-first):** este monorepo usa Tailwind 4. Não há `tailwind.config.ts` por padrão.\n+>\n+> Em vez disso, o tema/tokens compartilhados ficam em `@portfolio/config-tailwind/theme.css` e são importados no `globals.css`.

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

Escolher as opções padrão. O `init` vai criar `components.json`, `src/lib/utils.ts` e componentes iniciais (ex.: `Button`).\n+\n+**Ajuste recomendado no monorepo:** em `src/lib/utils.ts`, reexportar `cn` do pacote `@portfolio/ui` para evitar duplicação.

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
│   ├── FeaturedProjects.tsx
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
import { useMDXComponent } from "next-contentlayer2/hooks";

export async function generateStaticParams() {
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

  const MDX = useMDXComponent(project.body.code);

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
        <MDX />
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
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await resend.emails.send({
      from: "portfolio@<seu-dominio>.com.br",
      to: "<seu-email>@gmail.com",
      subject: `[Portfolio] Contato de ${data.name}`,
      reply_to: data.email,
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
  const body = await request.json();
  const parsed = runSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SANDBOX_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await response.json();
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

- [ ] Home carrega
- [ ] Lista de projetos funciona
- [ ] Detalhe do projeto placeholder renderiza o MDX
- [ ] Formulário de contato responde (se tiver Resend key)
- [ ] `/sitemap.xml` e `/robots.txt` retornam
- [ ] Lighthouse: Performance ≥ 95, SEO ≥ 95, Accessibility ≥ 95

Commitar e push. O workflow `deploy-web.yml` vai deployar automaticamente no Vercel.

---

## Checklist de conclusão da Fase 1

- [ ] `apps/web` rodando local e em produção
- [ ] `@portfolio/ui` com 8 componentes base
- [ ] Pipeline MDX funcionando
- [ ] Todas as rotas principais implementadas
- [ ] SEO configurado (sitemap, robots, metadata)
- [ ] Formulário de contato funcional
- [ ] Lighthouse ≥ 95 nas 4 métricas
- [ ] Timeline acadêmica implementada

**Próximo passo:** `05-roadmap-projetos.md`.
