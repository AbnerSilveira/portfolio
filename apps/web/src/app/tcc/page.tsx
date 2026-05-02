import Link from "next/link";

import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";

export const metadata = {
  title: "TCC",
};

export default function TccPage() {
  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd="cat ./tcc/README.md" />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          TCC — SAD Cibersegurança
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Sistema de Apoio à Decisão para priorizar investimentos em segurança,
          combinando Gordon–Loeb, AHP e TOPSIS. Esta página centraliza contexto
          e próximos passos até o dashboard e simulações publicados.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="min-w-0 rounded-lg border border-border/50 bg-card/25 p-5 sm:p-6">
          <h2 className="font-mono text-sm font-medium text-primary">
            ./stack
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Modelagem de risco e decisão multicritério: pesos com AHP, ordenação
            com TOPSIS e curva Gordon–Loeb para ligar investimento ao benefício
            esperado de controles.
          </p>
        </section>
        <section className="min-w-0 rounded-lg border border-border/50 bg-card/25 p-5 sm:p-6">
          <h2 className="font-mono text-sm font-medium text-primary">
            ./roadmap
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Conteúdo técnico em MDX e links para o repositório do TCC</li>
            <li>Simulações e cenários reproduzíveis no browser</li>
            <li>Integração com a listagem de projetos do portfólio</li>
          </ul>
        </section>
      </div>

      <section className="mt-10 rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Em construção</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          No próximo passo entram MDX, dados de exemplo e o painel interativo.
          Enquanto isso, a lista geral de projetos já reflete o que está
          versionado.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/projetos"
            className="inline-flex items-center justify-center rounded-md border border-border/40 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-primary/55 hover:text-primary"
          >
            ls ./projetos
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            cd ~
          </Link>
        </div>
      </section>
    </PortfolioPageMain>
  );
}
