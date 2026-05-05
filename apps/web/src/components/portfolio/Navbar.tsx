"use client";

import { useEffect, useState } from "react";

import { NavLink } from "@/components/NavLink";
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
        "sticky top-0 z-50 border-b border-border/30 bg-card transition-colors",
        scrolled && "border-border",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <NavLink
          href="/"
          exact
          className="font-mono text-sm font-medium tracking-tight hover:opacity-90"
        >
          <span className="text-primary">~/</span>
          <span className="text-muted-foreground">portfolio</span>
        </NavLink>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {links.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                className="hover:text-foreground"
                activeClassName="font-medium text-foreground"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
