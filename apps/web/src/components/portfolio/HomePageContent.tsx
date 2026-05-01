"use client";

import { useState } from "react";

import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { Hero } from "@/components/portfolio/Hero";
import { HeroReplayConsole } from "@/components/portfolio/HeroReplayConsole";

export function HomePageContent() {
  const [heroKey, setHeroKey] = useState(0);

  return (
    <main>
      <Hero key={heroKey} />
      <HeroReplayConsole onReplay={() => setHeroKey((k) => k + 1)} />
      <FeaturedProjects />
    </main>
  );
}
