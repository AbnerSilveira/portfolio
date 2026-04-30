import { cn } from "../lib/cn";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  copyright: string;
  links?: FooterLink[];
  className?: string;
}

export function Footer({ copyright, links, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-border bg-background", className)}>
      <div className="container flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>{copyright}</div>
        {links?.length ? (
          <div className="flex flex-wrap gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
