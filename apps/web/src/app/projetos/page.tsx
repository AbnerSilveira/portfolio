import { allProjects } from "contentlayer/generated";
import { ProjectCard } from "@portfolio/ui";

export const metadata = {
  title: "Projetos",
};

export default function ProjetosPage() {
  const projects = [...allProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <main className="container py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Projetos</h1>
        <p className="mt-3 text-muted-foreground">
          Lista completa de projetos, com foco em segurança e engenharia de
          software.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
