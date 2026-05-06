export default function SnifferHomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Sniffer</h1>
        <p className="mt-2 max-w-prose opacity-80">
          Dashboard Next.js + Recharts. Upload de PCAP e timeline de alertas
          serão ligados à API FastAPI na raiz{" "}
          <code className="font-mono text-sm">python/</code>.
        </p>
      </header>
      <section className="rounded-lg border border-black/10 bg-black/[0.03] p-4 text-sm dark:border-white/15 dark:bg-white/[0.06]">
        <p>
          API local: defina{" "}
          <code className="font-mono">NEXT_PUBLIC_SNIFFER_API_URL</code> (ver{" "}
          <code className="font-mono">../.env.example</code>).
        </p>
      </section>
    </main>
  );
}
