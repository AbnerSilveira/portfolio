import { allProjects } from "contentlayer/generated";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/Mdx";
import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

const impactLabel = {
  high: "Impacto alto",
  medium: "Impacto médio",
  low: "Impacto baixo",
} as const;

const impactDotClass = {
  high: "project-card-impact-dot--high",
  medium: "project-card-impact-dot--medium",
  low: "project-card-impact-dot--low",
} as const;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const primaryCta =
    project.category === "interactive"
      ? {
          label: "./abrir-demo",
          href: `/projetos/${project.slug}/demo`,
          external: false,
        }
      : project.category === "sandbox" && project.demoUrl
        ? { label: "./abrir-demo", href: project.demoUrl, external: true }
        : project.category === "video" && project.videoUrl
          ? {
              label: "./assistir-video",
              href: project.videoUrl,
              external: true,
            }
          : null;

  const secondaryCta = project.githubUrl
    ? { label: "./ver-codigo", href: project.githubUrl, external: true }
    : null;

  const hasLinks = Boolean(primaryCta || secondaryCta);

  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd={`cat ./projetos/${project.slug}.mdx`} />

      <header className="mb-10 rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {project.tags.map((t) => (
              <span key={t} className="rounded bg-muted px-2 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        {hasLinks ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {primaryCta ? (
              primaryCta.external ? (
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {primaryCta.label}
                </a>
              ) : (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {primaryCta.label}
                </Link>
              )
            ) : null}

            {secondaryCta ? (
              <a
                href={secondaryCta.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-border/50 bg-card/60 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-primary/55 hover:text-primary"
              >
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
          <h2 className="font-mono text-sm font-medium text-primary">
            ./ficha
          </h2>
          <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <dt className="font-mono text-xs text-muted-foreground">
                subject
              </dt>
              <dd className="text-foreground/90">{project.subject}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <dt className="font-mono text-xs text-muted-foreground">
                semester
              </dt>
              <dd className="text-foreground/90">{project.semester}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <dt className="font-mono text-xs text-muted-foreground">date</dt>
              <dd className="font-mono text-foreground/90">
                {new Date(project.date).toISOString().slice(0, 10)}
              </dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <dt className="font-mono text-xs text-muted-foreground">
                category
              </dt>
              <dd className="font-mono text-foreground/90">
                {project.category}
              </dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <dt className="font-mono text-xs text-muted-foreground">
                impact
              </dt>
              <dd className="flex items-center gap-2 text-foreground/90">
                <span
                  aria-label={impactLabel[project.impact]}
                  title={impactLabel[project.impact]}
                  className={`project-card-impact-dot ${impactDotClass[project.impact]}`}
                />
                <span className="font-mono">{project.impact}</span>
              </dd>
            </div>
          </dl>
        </section>

        {hasLinks ? (
          <section className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 className="font-mono text-sm font-medium text-primary">
              ./links
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {primaryCta ? (
                <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    primary
                  </span>
                  {primaryCta.external ? (
                    <a
                      href={primaryCta.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                    >
                      {primaryCta.label}
                    </a>
                  ) : (
                    <Link
                      href={primaryCta.href}
                      className="font-mono text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                    >
                      {primaryCta.label}
                    </Link>
                  )}
                </li>
              ) : null}

              {secondaryCta ? (
                <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    code
                  </span>
                  <a
                    href={secondaryCta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                  >
                    {secondaryCta.label}
                  </a>
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="mt-10 prose prose-neutral max-w-none dark:prose-invert">
        <Mdx code={project.body.code} />
      </div>

      <div className="mt-16 border-t border-border/60 pt-10">
        <p className="mb-4 min-w-0 font-mono text-xs text-muted-foreground sm:text-sm">
          <span className="text-primary">~/portfolio/projetos</span>
          <span className="text-foreground"> $ </span>
          <span className="break-all text-foreground/90">cd ..</span>
        </p>
        <Link
          href="/projetos"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          cd ..
        </Link>
      </div>
    </PortfolioPageMain>
  );
}
