import { SemesterTimeline } from "@portfolio/ui";

import { ContactForm } from "@/components/ContactForm";
import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";

export const metadata = {
  title: "Sobre",
};

export default function SobrePage() {
  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd="man sobre" />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Sobre
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Portfólio acadêmico-profissional focado em cibersegurança (Sistemas de
          Informação, 2023–2026): projetos práticos, escrita técnica e um TCC
          com motor de decisão em segurança.
        </p>
      </header>

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            O que você vai encontrar aqui
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-primary sm:text-sm">
                ▸
              </span>
              <span>
                Demos interativas (client-side) e sandboxed quando o risco
                exigir isolamento.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-primary sm:text-sm">
                ▸
              </span>
              <span>
                Relatórios técnicos, threat intel, hardening e automação com
                foco em reprodutibilidade.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-primary sm:text-sm">
                ▸
              </span>
              <span>
                TCC com SAD em cibersegurança (Gordon–Loeb + AHP + TOPSIS), com
                links e artefatos à medida que forem publicados.
              </span>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Timeline acadêmica
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Selecione um semestre para ver os destaques daquele período.
          </p>
          <div className="mt-4 rounded-lg border border-border/50 bg-card/25 p-4 sm:p-6">
            <SemesterTimeline
              defaultSemester="2023/2"
              items={[
                {
                  semester: "2023/1",
                  title: "RSA Visualizer",
                  description: "Matemática discreta → criptografia aplicada.",
                  href: "/projetos",
                },
                {
                  semester: "2023/2",
                  title: "Sniffer + Password Manager",
                  description: "Redes I + AED I (projetos práticos).",
                },
                {
                  semester: "2024/1",
                  title: "SQLi Scanner + OWASP Scanner",
                  description:
                    "Scanners e validação de payloads com foco em segurança.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section
        id="contato"
        className="mt-14 scroll-mt-24 border-t border-border/60 pt-12 sm:mt-16 sm:pt-14"
      >
        <p className="mb-2 font-mono text-xs text-muted-foreground sm:text-sm">
          <span className="text-primary">#</span> contato —{" "}
          <span className="text-foreground/80">./send-message</span>
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Contato
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Quer falar comigo? Envie uma mensagem; respondo no e-mail informado.
        </p>
        <div className="mt-6 min-w-0">
          <ContactForm />
        </div>
      </section>
    </PortfolioPageMain>
  );
}
