"use client";

import { useState } from "react";

import { cn } from "../lib/cn";

export interface DemoFrameProps {
  src: string;
  title: string;
  height?: number;
  className?: string;
}

export function DemoFrame({
  src,
  title,
  height = 600,
  className,
}: DemoFrameProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border",
        className,
      )}
    >
      {!loaded && (
        <div
          className="flex items-center justify-center bg-muted text-muted-foreground"
          style={{ height }}
        >
          Carregando demo...
        </div>
      )}
      <iframe
        src={src}
        title={title}
        sandbox="allow-scripts allow-forms allow-same-origin"
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          height,
          width: "100%",
          border: 0,
          display: loaded ? "block" : "none",
        }}
      />
    </div>
  );
}
