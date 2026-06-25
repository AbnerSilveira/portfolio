import Link from "next/link";

import { ProjectCard } from "@portfolio/ui";

import { getAllCatalogProjects } from "@/lib/projects";
import { projectGridClassName } from "@/lib/project-grid";

export function FeaturedProjects() {
  const projects = getAllCatalogProjects();

  return (
    <section id="projetos" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <p className="mb-2 font-mono text-xs sm:text-sm">
          <span className="text-primary">~/portfolio</span>
          <span className="text-foreground"> $ </span>
          <span className="text-foreground/90">ls ./projetos</span>
        </p>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Projetos
          </h2>
          <Link
            href="/projetos"
            className="shrink-0 font-mono text-sm text-primary/90 transition-colors hover:text-primary"
          >
            cat README.md -&gt;
          </Link>
        </div>
        <div className={projectGridClassName(projects.length)}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
