import { allProjects } from "contentlayer/generated";
import type { ProjectMetadata, ProjectStatus } from "@portfolio/types";

import { PROJECT_CATALOG } from "@/data/project-catalog";

function fromMdx(project: (typeof allProjects)[number]): ProjectMetadata {
  return {
    slug: project.slug,
    title: project.title,
    description: project.description,
    subject: project.subject,
    semester: project.semester,
    impact: project.impact,
    category: project.category,
    tags: project.tags,
    status: "ready",
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    videoUrl: project.videoUrl,
  };
}

const publishedBySlug = new Map(
  allProjects.map((project) => [project.slug, fromMdx(project)]),
);

/** Todos os projetos do roadmap: MDX publicado = ready; restante = em desenvolvimento. */
export function getAllCatalogProjects(): ProjectMetadata[] {
  return PROJECT_CATALOG.map((catalog) => {
    const published = publishedBySlug.get(catalog.slug);
    if (published) {
      return published;
    }
    return {
      ...catalog,
      status: "in-development" satisfies ProjectStatus,
    };
  });
}

export function getAllProjects(): ProjectMetadata[] {
  return getAllCatalogProjects().filter((p) => p.status === "ready");
}

export function getFeaturedProjects(): ProjectMetadata[] {
  return getAllCatalogProjects();
}

export function getProjectBySlug(slug: string): ProjectMetadata | undefined {
  return getAllCatalogProjects().find((p) => p.slug === slug);
}
