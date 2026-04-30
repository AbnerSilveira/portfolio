import { allProjects } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = ["", "/projetos", "/sobre", "/tcc"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const projectRoutes = allProjects.map((p) => ({
    url: `${base}/projetos/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticRoutes, ...projectRoutes];
}
