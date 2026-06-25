/** Tipos compartilhados do monorepo (`@portfolio/types`). */
export type ProjectCategory =
  | "interactive"
  | "sandbox"
  | "video"
  | "documentation";
export type ProjectImpact = "high" | "medium" | "low";
export type ProjectStatus = "ready" | "in-development";

export interface ProjectMetadata {
  slug: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  impact: ProjectImpact;
  category: ProjectCategory;
  tags: string[];
  status?: ProjectStatus;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
}

export * from "./demo-runner";
