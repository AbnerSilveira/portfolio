import type { CSSProperties } from "react";
import Link from "next/link";

const SUBTITLE = "estudante de SI · segurança ofensiva e defensiva";
const SUBTITLE_STEPS = String(SUBTITLE.length);

export function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container py-16 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Abner Silveira
          </h1>
          <div
            className="tw-row mt-4 w-full max-w-2xl font-mono text-sm text-muted-foreground sm:text-base"
            style={
              {
                "--tw-steps": SUBTITLE_STEPS,
                "--tw-duration": "2.4s",
                "--tw-delay": "0.15s",
                "--tw-cursor-delay": "2.55s",
              } as CSSProperties
            }
          >
            <span className="tw-prompt" aria-hidden>
              ~
            </span>
            <div className="min-w-0 flex-1">
              <span className="tw-line block w-full">{SUBTITLE}</span>
            </div>
            <span className="tw-cursor--temp shrink-0" aria-hidden />
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projetos"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Ver projetos
            </Link>
            <Link
              href="/sobre"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
            >
              Sobre mim
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
