export const metadata = {
  title: "TCC",
};

export default function TccPage() {
  return (
    <main className="container py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-bold">TCC — SAD Cibersegurança</h1>
        <p className="mt-4 text-muted-foreground">
          Sistema de Apoio à Decisão com Gordon-Loeb + AHP + TOPSIS. Esta página
          vai linkar para o projeto completo e para as simulações.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-background p-6">
        <h2 className="text-xl font-semibold">Em construção</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No próximo passo, vamos integrar conteúdo MDX e/ou dashboard do TCC.
        </p>
      </section>
    </main>
  );
}
