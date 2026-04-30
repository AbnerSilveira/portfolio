"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "Projetos", href: "/projetos" },
  { label: "TCC", href: "/tcc" },
  { label: "Sobre", href: "/sobre" },
] as const;

export function Navbar() {
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
