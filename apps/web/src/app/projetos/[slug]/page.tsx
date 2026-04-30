import { allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="container py-12">
      <header className="mb-8">
        <div className="mb-2 text-sm text-muted-foreground">
          {project.subject} — {project.semester}
        </div>
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {project.tags.map((t) => (
            <span key={t} className="rounded bg-muted px-2 py-1">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <Mdx code={project.body.code} />
      </div>
    </article>
  );
}
