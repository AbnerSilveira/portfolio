import Link from "next/link";

import { allProjects } from "contentlayer/generated";
import { ProjectCard } from "@portfolio/ui";

import { FEATURED_PLACEHOLDER_PROJECTS } from "@/data/featured-placeholders";
import { projectGridClassName } from "@/lib/project-grid";

const FEATURED_SLOT_COUNT = 6;

export function FeaturedProjects() {
  const real = [...allProjects]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, FEATURED_SLOT_COUNT);

  const usedSlugs = new Set(real.map((p) => p.slug));
  const fillerCount = Math.max(0, FEATURED_SLOT_COUNT - real.length);
  const fillers = FEATURED_PLACEHOLDER_PROJECTS.filter(
    (p) => !usedSlugs.has(p.slug),
  ).slice(0, fillerCount);

  const cards = [...real, ...fillers];

  return (
    <section id="projetos" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <p className="mb-2 font-mono text-xs sm:text-sm">
          <span className="text-primary">~/portfolio</span>
          <span className="text-foreground"> $ </span>
          <span className="text-foreground/90">ls ./projetos --featured</span>
        </p>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Projetos em destaque
          </h2>
          <Link
            href="/projetos"
            className="shrink-0 font-mono text-sm text-primary/90 transition-colors hover:text-primary"
          >
            ls --all -&gt;
          </Link>
        </div>
        <div className={projectGridClassName(cards.length)}>
          {real.map((project) => (
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
          {fillers.map((project) => (
            <ProjectCard
              key={`placeholder-${project.slug}`}
              href="/projetos"
              project={project}
              aria-label={`${project.title} — exemplo visual; abre a lista de projetos`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
