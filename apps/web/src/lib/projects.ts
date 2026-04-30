import { allProjects } from "contentlayer/generated";
import type { ProjectMetadata } from "@portfolio/types";

export function getAllProjects(): ProjectMetadata[] {
  return allProjects.map((project) => ({
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
  }));
}

export function getFeaturedProjects(): ProjectMetadata[] {
  return getAllProjects()
    .filter((p) => p.impact === "high")
    .slice(0, 6);
}
