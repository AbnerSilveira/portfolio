"use client";

import { DemoFrame } from "@portfolio/ui";

function demoSrc(): string {
  const raw = process.env.NEXT_PUBLIC_RSA_VISUALIZER_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3001";
}

/** Iframe da demo Next em `apps/projects/rsa-visualizer` (porta 3001 em dev). */
export function RsaDemoFrame() {
  return (
    <DemoFrame
      src={demoSrc()}
      title="RSA Visualizer — demo"
      height={780}
      className="not-prose"
    />
  );
}
