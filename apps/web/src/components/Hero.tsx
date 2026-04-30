export function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Portfólio de Cibersegurança
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Projetos práticos focados em segurança ofensiva, defensiva e
            engenharia segura: scanners, WAF/IDS, threat intel e hardening.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
              href="/projetos"
            >
              Ver projetos
            </a>
            <a
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
              href="/sobre"
            >
              Sobre mim
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
