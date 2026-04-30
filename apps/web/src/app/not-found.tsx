import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[min(70dvh,calc(100dvh-12rem))] flex-col items-center justify-center bg-muted px-6 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
        404
      </h1>
      <p className="mb-6 text-xl text-muted-foreground">
        Esta página não existe.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/90"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
