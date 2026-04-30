import type { ProjectMetadata } from "@portfolio/types";

import { cn } from "../lib/cn";

export interface ProjectCardProps {
  project: ProjectMetadata;
  className?: string;
  /** Quando definido, substitui o link padrão `/projetos/[slug]` (ex.: placeholders → `/projetos`). */
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

export function ProjectCard({
  project,
  className,
  href,
  "aria-label": ariaLabel,
}: ProjectCardProps) {
  const to = href ?? `/projetos/${project.slug}`;

  return (
    <a
      href={to}
      aria-label={ariaLabel}
      className={cn(
        "project-card group flex h-full min-h-[168px] w-full cursor-pointer flex-col rounded-lg border border-border bg-card p-3.5 no-underline sm:min-h-[180px] sm:p-4",
        CARD_BLOCK_GAP,
        className,
      )}
    >
      <div
        className={cn("flex min-h-0 min-w-0 flex-1 flex-col", CARD_BLOCK_GAP)}
      >
        <p className="font-mono text-[11px] leading-normal tracking-wide sm:text-xs sm:leading-normal">
          <span className="text-primary">$</span>{" "}
          <span className="text-primary">cat</span>{" "}
          <span className="text-foreground/55">{project.slug}.md</span>
        </p>

        <header className="flex items-start gap-2.5 text-sm font-semibold leading-snug sm:text-base">
          <span
            aria-label={impactLabel[project.impact]}
            title={impactLabel[project.impact]}
            className={cn(
              "project-card-impact-dot mt-[0.3em]",
              impactDotClass[project.impact],
            )}
          />
          <h3 className="min-w-0 flex-1 tracking-tight text-foreground group-hover:text-primary">
            {project.title}
          </h3>
        </header>

        <p className="min-h-0 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px] sm:leading-relaxed">
          {project.description}
        </p>
      </div>

      {project.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[11px] leading-normal tracking-wide text-muted-foreground sm:text-xs sm:leading-normal">
          {project.tags.map((t) => (
            <li key={t}>
              <span className="text-primary">--</span>
              {t}
            </li>
          ))}
        </ul>
      ) : null}
    </a>
  );
}
