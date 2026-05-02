import { allProjects } from "contentlayer/generated";
import { ProjectCard } from "@portfolio/ui";

import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";
import { projectGridClassName } from "@/lib/project-grid";

export const metadata = {
  title: "Projetos",
};

export default function ProjetosPage() {
  const projects = [...allProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const gridClass = projectGridClassName(projects.length);

  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd="ls ./projetos" />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Projetos
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Lista completa de projetos, com foco em segurança e engenharia de
          software.
        </p>
      </header>

      <div className={gridClass}>
        {projects.map((project) => (
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
    </PortfolioPageMain>
  );
}
