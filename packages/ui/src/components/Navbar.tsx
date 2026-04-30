import { cn } from "../lib/cn";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand: { label: string; href: string };
  links: NavbarLink[];
  className?: string;
}

export function Navbar({ brand, links, className }: NavbarProps) {
  return (
    <header className={cn("border-b border-border bg-background", className)}>
      <div className="container flex h-14 items-center justify-between">
        <a href={brand.href} className="font-semibold hover:text-primary">
          {brand.label}
        </a>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
