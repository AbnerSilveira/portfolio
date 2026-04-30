"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { useTheme } from "./ThemeProvider";

const links = [
  { label: "Projetos", href: "/projetos" },
  { label: "TCC", href: "/tcc" },
  { label: "Sobre", href: "/sobre" },
] as const;

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-colors",
        scrolled && "navbar-scrolled border-border",
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground hover:text-primary"
        >
          portfolio
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={
              resolvedTheme === "dark"
                ? "Ativar tema claro"
                : "Ativar tema escuro"
            }
          >
            {resolvedTheme === "dark" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
