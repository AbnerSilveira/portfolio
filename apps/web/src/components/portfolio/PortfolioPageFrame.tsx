import type { ReactNode } from "react";

/** Mesmo grid horizontal da home/projetos + evita overflow em flex pai. */
export function PortfolioPageMain({ children }: { children: ReactNode }) {
  return (
    <main className="min-w-0">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">{children}</div>
    </main>
  );
}

/** Prompt estilo terminal acima do título (comando passado sem o prefixo ~/portfolio $). */
export function PortfolioCmdLine({ cmd }: { cmd: string }) {
  return (
    <p className="mb-2 min-w-0 font-mono text-xs sm:text-sm">
      <span className="text-primary">~/portfolio</span>
      <span className="text-foreground"> $ </span>
      <span className="break-all text-foreground/90">{cmd}</span>
    </p>
  );
}
