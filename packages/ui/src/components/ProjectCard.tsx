"use client";

import type { CSSProperties } from "react";
import type { ProjectMetadata } from "@portfolio/types";

import { useInView } from "../hooks/use-in-view";
import { cn } from "../lib/cn";

export interface ProjectCardProps {
  project: ProjectMetadata;
  className?: string;
  /** Quando definido, substitui o link padrão `/projetos/[slug]`. */
  href?: string;
  "aria-label"?: string;
}

/** Classes definidas em `apps/web/src/app/globals.css` (evita purge do pacote ui). */
const impactDotClass: Record<ProjectMetadata["impact"], string> = {
  high: "project-card-impact-dot--high",
  medium: "project-card-impact-dot--medium",
  low: "project-card-impact-dot--low",
};

const impactLabel: Record<ProjectMetadata["impact"], string> = {
  high: "Impacto alto",
  medium: "Impacto médio",
  low: "Impacto baixo",
};

/** Espaço vertical igual entre blocos (cat · título+dot · descrição · tags). */
const CARD_BLOCK_GAP = "gap-y-3 sm:gap-y-3.5";

const cardShellClass =
  "project-card group flex h-full min-h-[168px] w-full flex-col rounded-lg border border-border bg-card p-3.5 sm:min-h-[180px] sm:p-4";

function ProjectCardBody({
  project,
  inDevelopment,
}: {
  project: ProjectMetadata;
  inDevelopment: boolean;
}) {
  const { ref: descRef, inView } = useInView<HTMLParagraphElement>({
    once: true,
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12,
  });

  const steps = String(Math.min(Math.max(project.description.length, 12), 96));
  const durationSec = Math.min(
    2.6,
    Math.max(0.85, project.description.length * 0.02),
  );

  const revealStyle = (
    inView
      ? {
          "--tw-delay": "0.05s",
          "--tw-duration": `${durationSec}s`,
          "--tw-steps": steps,
        }
      : {}
  ) as CSSProperties;

  return (
    <>
      <div
        className={cn("flex min-h-0 min-w-0 flex-1 flex-col", CARD_BLOCK_GAP)}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[11px] leading-normal tracking-wide sm:text-xs sm:leading-normal">
            <span className="text-primary">$</span>{" "}
            <span className="text-primary">cat</span>{" "}
            <span className="text-foreground/55">{project.slug}.md</span>
          </p>
          {inDevelopment ? (
            <span className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              em desenvolvimento
            </span>
          ) : null}
        </div>

        <header className="flex items-start gap-2.5 text-sm font-semibold leading-snug sm:text-base">
          <span
            aria-label={impactLabel[project.impact]}
            title={impactLabel[project.impact]}
            className={cn(
              "project-card-impact-dot mt-[0.3em]",
              impactDotClass[project.impact],
            )}
          />
          <h3
            className={cn(
              "min-w-0 flex-1 tracking-tight text-foreground",
              !inDevelopment && "group-hover:text-primary",
            )}
          >
            {project.title}
          </h3>
        </header>

        <p
          ref={descRef}
          className={cn(
            "min-w-0 shrink-0 text-xs leading-relaxed text-muted-foreground sm:text-[13px] sm:leading-relaxed",
            inView ? "tw-reveal" : "opacity-0",
          )}
          style={revealStyle}
        >
          {project.description}
        </p>
      </div>

      {project.tags.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[11px] leading-normal tracking-wide text-muted-foreground sm:text-xs sm:leading-normal">
          {project.tags.map((t) => (
            <li key={t}>
              <span className="text-primary">--</span>
              {t}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function ProjectCard({
  project,
  className,
  href,
  "aria-label": ariaLabel,
}: ProjectCardProps) {
  const inDevelopment = project.status === "in-development";
  const to = href ?? (inDevelopment ? undefined : `/projetos/${project.slug}`);

  if (!to) {
    return (
      <div
        aria-label={ariaLabel ?? `${project.title} — em desenvolvimento`}
        className={cn(cardShellClass, CARD_BLOCK_GAP, className)}
      >
        <ProjectCardBody project={project} inDevelopment={inDevelopment} />
      </div>
    );
  }

  return (
    <a
      href={to}
      aria-label={ariaLabel}
      className={cn(
        cardShellClass,
        "cursor-pointer no-underline",
        CARD_BLOCK_GAP,
        className,
      )}
    >
      <ProjectCardBody project={project} inDevelopment={inDevelopment} />
    </a>
  );
}
