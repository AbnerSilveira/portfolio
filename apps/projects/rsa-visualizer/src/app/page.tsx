export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">RSA Visualizer</h1>
      <p className="text-muted-foreground">
        Scaffold do projeto (#1 — 2023/1). Próximo passo: motor em{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          src/lib/
        </code>{" "}
        com testes em{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          tests/
        </code>
        .
      </p>
    </main>
  );
}
