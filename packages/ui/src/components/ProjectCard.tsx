import type { ProjectMetadata } from "@portfolio/types";

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

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <a
      href={`/projetos/${project.slug}`}
      className={cn(
        "project-card group block rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-2 h-2 w-2 shrink-0 rounded-full",
            impactDot[project.impact],
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
