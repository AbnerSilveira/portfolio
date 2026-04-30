export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">$</span> echo &quot;© {year} Abner
          Silveira&quot;
        </p>
        <ul className="flex items-center gap-6 font-mono text-sm">
          <li>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
