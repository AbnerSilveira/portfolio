import { allProjects } from "contentlayer/generated";
import { ProjectCard } from "@portfolio/ui";

import { Hero } from "@/components/Hero";

export default function HomePage() {
  const featured = allProjects.filter((p) => p.impact === "high").slice(0, 6);

  return (
    <main>
      <Hero />
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Projetos em destaque</h2>
          <a
            className="text-sm text-muted-foreground hover:text-foreground"
            href="/projetos"
          >
            Ver todos
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
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
      </section>
    </main>
  );
}
