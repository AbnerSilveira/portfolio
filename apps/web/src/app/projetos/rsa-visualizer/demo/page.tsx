import type { Metadata } from "next";

import { RsaVisualizer } from "@projects/rsa-visualizer";

import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";

export const metadata: Metadata = {
  title: "RSA Visualizer — Demo",
  description: "Demonstração interativa de RSA didático passo a passo.",
};

export default function RsaVisualizerDemoPage() {
  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd="cd ./projetos/rsa-visualizer/demo" />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          RSA Visualizer — Demo
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          RSA didático no browser: primos, φ(n), Euclides estendido, chaves e
          round-trip de encriptação/decriptação com BigInt e animações.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Atalhos (fora de campos de texto):{" "}
          <span className="font-mono">[</span> /{" "}
          <span className="font-mono">]</span> passo anterior/seguinte ·{" "}
          <span className="font-mono">Alt+R</span> reiniciar ·{" "}
          <span className="font-mono">Ctrl+Enter</span> gerar chaves
        </p>
      </header>

      <RsaVisualizer variant="embedded" />
    </PortfolioPageMain>
  );
}
