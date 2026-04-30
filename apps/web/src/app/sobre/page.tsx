import { SemesterTimeline } from "@portfolio/ui";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Sobre",
};

export default function SobrePage() {
  return (
    <main className="container py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold">Sobre</h1>
        <p className="mt-4 text-muted-foreground">
          Portfólio acadêmico-profissional focado em cibersegurança (Sistemas de
          Informação, 2023–2026).
        </p>
      </header>

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            O que você vai encontrar aqui
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Demos interativas (client-side) e sandboxed (quando necessário)
            </li>
            <li>Relatórios técnicos, threat intel, hardening e automação</li>
            <li>Um TCC com motor de decisão (AHP + TOPSIS + Gordon-Loeb)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Timeline acadêmica</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Selecione um semestre para ver os projetos daquele período.
          </p>
          <div className="mt-4">
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

      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-semibold">Contato</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Quer falar comigo? Envie uma mensagem que eu respondo no seu email.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
