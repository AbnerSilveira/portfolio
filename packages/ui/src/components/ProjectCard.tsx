import type { ProjectMetadata } from "@portfolio/types";

import { cn } from "../lib/cn";

export interface ProjectCardProps {
  project: ProjectMetadata;
  className?: string;
}

const impactColors: Record<ProjectMetadata["impact"], string> = {
  high: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
  medium:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200",
  low: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <a
      href={`/projetos/${project.slug}`}
      className={cn(
        "group block rounded-lg border border-border bg-background p-6 transition hover:border-primary",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold group-hover:text-primary">
          {project.title}
        </h3>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            impactColors[project.impact],
          )}
        >
          {project.impact}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {project.description}
      </p>
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
