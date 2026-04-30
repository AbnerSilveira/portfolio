"use client";

import type { ProjectMetadata } from "@portfolio/types";
import type { CSSProperties } from "react";

import { useInView } from "../hooks/use-in-view";
import { cn } from "../lib/cn";

export interface ProjectCardProps {
  project: ProjectMetadata;
  className?: string;
}

const impactDot: Record<ProjectMetadata["impact"], string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground",
};

const impactLabel: Record<ProjectMetadata["impact"], string> = {
  high: "Impacto alto",
  medium: "Impacto médio",
  low: "Impacto baixo",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { ref, inView } = useInView<HTMLParagraphElement>({ once: true });
  const steps = String(Math.min(Math.max(project.description.length, 12), 80));

  return (
    <a
      href={`/projetos/${project.slug}`}
      className={cn(
        "project-card group block cursor-pointer rounded-lg border border-border bg-card p-5 no-underline",
        className,
      )}
    >
      <p className="mb-3 font-mono text-xs text-muted-foreground">
        <span className="text-primary">$</span> cat {project.slug}.md
      </p>

      <header className="flex items-start gap-2.5">
        <span
          aria-label={impactLabel[project.impact]}
          title={impactLabel[project.impact]}
          className={cn(
            "mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full",
            impactDot[project.impact],
          )}
        />
        <h3 className="text-base font-medium leading-tight text-foreground group-hover:text-primary">
          {project.title}
        </h3>
      </header>

      <p
        ref={ref}
        className={cn(
          "mt-3 text-sm leading-relaxed text-muted-foreground",
          inView ? "tw-reveal" : "opacity-0",
        )}
        style={
          {
            "--tw-delay": "0.1s",
            "--tw-duration": "1.6s",
            "--tw-steps": steps,
          } as CSSProperties
        }
      >
        {project.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
        {project.tags.map((t) => (
          <li key={t} className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">--</span>
            {t}
          </li>
        ))}
      </ul>
    </a>
  );
}
