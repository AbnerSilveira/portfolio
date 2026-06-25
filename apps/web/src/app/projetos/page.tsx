import { ProjectCard } from "@portfolio/ui";

import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";
import { getAllCatalogProjects } from "@/lib/projects";
import { projectGridClassName } from "@/lib/project-grid";

export const metadata = {
  title: "Projetos",
};

export default function ProjetosPage() {
  const projects = getAllCatalogProjects();
  const gridClass = projectGridClassName(projects.length);

  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd="ls ./projetos" />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Projetos
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Catálogo completo do portfólio acadêmico — projetos publicados e em
          desenvolvimento.
        </p>
      </header>

      <div className={gridClass}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </PortfolioPageMain>
  );
}
