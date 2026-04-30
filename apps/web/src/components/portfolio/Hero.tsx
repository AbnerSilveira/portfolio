import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BootLine = {
  prompt?: string;
  text: string;
  tone?: "muted" | "fg" | "ok" | "accent" | "warn";
  delay: number;
  duration: number;
};

const tone = {
  muted: "text-muted-foreground",
  fg: "text-foreground",
  ok: "text-primary",
  accent: "text-primary",
  warn: "text-foreground/70",
} as const;

const bootLines: BootLine[] = [
  {
    prompt: "~ $",
    text: "ssh abner@portfolio.es.br",
    tone: "muted",
    delay: 0.0,
    duration: 0.6,
  },
  {
    text: "[ok] tunnel established · region=BR-ES · locale=pt_BR.UTF-8",
    tone: "ok",
    delay: 0.75,
    duration: 0.55,
  },
  { prompt: "~ $", text: "uname -a", tone: "muted", delay: 1.4, duration: 0.4 },
  {
    text: "Linux portfolio 6.8 #BR-ES SMP x86_64 GNU/Linux",
    tone: "fg",
    delay: 1.85,
    duration: 0.55,
  },
  {
    prompt: "~ $",
    text: "cd portfolio && ./security-checks.sh --strict",
    tone: "muted",
    delay: 2.5,
    duration: 0.7,
  },
  {
    text: "[+] verificando assinaturas gpg ............ ok",
    tone: "fg",
    delay: 3.25,
    duration: 0.45,
  },
  {
    text: "[+] regras de firewall (iptables) .......... ok",
    tone: "fg",
    delay: 3.75,
    duration: 0.45,
  },
  {
    text: "[+] varredura de portas (nmap -sS) ......... ok",
    tone: "fg",
    delay: 4.25,
    duration: 0.45,
  },
  {
    text: "[+] scan de integridade (sha256) ........... ok",
    tone: "fg",
    delay: 4.75,
    duration: 0.45,
  },
  {
    text: "[+] checagem de credenciais vazadas ........ ok",
    tone: "fg",
    delay: 5.25,
    duration: 0.45,
  },
  {
    text: "[+] hardening do kernel .................... ok",
    tone: "fg",
    delay: 5.75,
    duration: 0.45,
  },
  {
    text: "[ok] todas as checagens passaram · 0 alertas",
    tone: "ok",
    delay: 6.3,
    duration: 0.5,
  },
  {
    prompt: "~/portfolio $",
    text: "clear && whoami",
    tone: "muted",
    delay: 7.0,
    duration: 0.55,
  },
];

const BOOT_FADE_DELAY = 7.7;
const BOOT_FADE_DURATION = 1.0;
const HERO_DELAY = BOOT_FADE_DELAY + 0.45;

const cssVars = (
  delay: number,
  duration: number,
  steps: number,
): CSSProperties =>
  ({
    "--tw-delay": `${delay}s`,
    "--tw-duration": `${duration}s`,
    "--tw-steps": `${steps}`,
  }) as CSSProperties;

const showVars = (delay: number, duration = 0.6): CSSProperties =>
  ({
    "--hero-show-delay": `${delay}s`,
    "--hero-show-duration": `${duration}s`,
  }) as CSSProperties;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-40 pb-20 sm:pt-48 sm:pb-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden translate-x-6 items-center justify-center hero-show md:flex md:translate-x-12"
          aria-hidden
          style={{
            ...showVars(HERO_DELAY + 0.8, 1.2),
            width: "min(48vw, 560px)",
          }}
        >
          <Image
            src="/icon-cybersecurity.png"
            alt=""
            width={768}
            height={768}
            loading="lazy"
            className="h-auto w-full select-none opacity-70 brightness-0 dark:opacity-30 dark:brightness-100"
            style={{ filter: "blur(0.3px)" }}
          />
        </div>

        <div
          className="boot-fade mb-8 space-y-1 overflow-hidden font-mono text-xs sm:text-sm"
          aria-hidden
          style={
            {
              "--boot-fade-delay": `${BOOT_FADE_DELAY}s`,
              "--boot-fade-duration": `${BOOT_FADE_DURATION}s`,
            } as CSSProperties
          }
        >
          {bootLines.map((line, i) => (
            <div
              key={i}
              className="tw-row w-full"
              style={{ "--tw-delay": `${line.delay}s` } as CSSProperties}
            >
              {line.prompt ? (
                <span className="tw-prompt shrink-0">{line.prompt}</span>
              ) : null}
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "tw-line block w-full",
                    tone[line.tone ?? "muted"],
                  )}
                  style={cssVars(
                    line.delay,
                    line.duration,
                    Math.max(8, line.text.length),
                  )}
                >
                  {line.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="tw-row mb-6 w-full font-mono text-xs text-muted-foreground sm:text-sm hero-show"
          aria-hidden
          style={
            {
              ...showVars(HERO_DELAY, 0.4),
              "--tw-delay": `${HERO_DELAY}s`,
            } as CSSProperties
          }
        >
          <span className="tw-prompt shrink-0">~/portfolio $</span>
          <div className="min-w-0 flex-1">
            <span
              className="tw-line block w-full"
              style={cssVars(HERO_DELAY, 0.4, 7)}
            >
              whoami
            </span>
          </div>
        </div>

        <h1
          className="hero-show mt-2 font-sans font-medium text-foreground"
          style={{
            fontSize: "clamp(3rem, 8vw, 4rem)",
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
            ...showVars(HERO_DELAY + 0.4, 0.5),
          }}
        >
          <span
            className="tw-line inline-block max-w-full"
            style={cssVars(HERO_DELAY + 0.5, 0.9, 14)}
          >
            Abner Silveira
          </span>
        </h1>

        <div
          className="tw-row mt-6 w-full font-mono text-sm text-muted-foreground sm:text-base hero-show"
          aria-label="estudante de SI · full-stack developer · segurança ofensiva e defensiva"
          style={
            {
              ...showVars(HERO_DELAY + 1.4, 0.4),
              "--tw-delay": `${HERO_DELAY + 1.4}s`,
            } as CSSProperties
          }
        >
          <span className="tw-prompt shrink-0" aria-hidden>
            ~/portfolio $
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="tw-line block w-full"
              style={cssVars(HERO_DELAY + 1.5, 0.9, 16)}
            >
              cat about.txt
            </span>
          </div>
        </div>

        <div
          className="tw-row mt-2 w-full font-mono text-sm text-foreground sm:text-base hero-show"
          aria-hidden
          style={
            {
              ...showVars(HERO_DELAY + 2.4, 0.4),
              "--tw-delay": `${HERO_DELAY + 2.4}s`,
            } as CSSProperties
          }
        >
          <div className="min-w-0 flex-1">
            <span
              className="tw-line block w-full"
              style={cssVars(HERO_DELAY + 2.5, 2.6, 70)}
            >
              estudante de SI · full-stack developer · segurança ofensiva e
              defensiva
            </span>
          </div>
          <span
            className="tw-cursor--temp shrink-0"
            style={
              {
                "--tw-cursor-delay": `${HERO_DELAY + 5.2}s`,
                "--tw-cursor-life": "5s",
              } as CSSProperties
            }
            aria-hidden
          />
        </div>

        <div
          className="mt-10 flex flex-wrap items-center gap-3 hero-show"
          style={showVars(HERO_DELAY + 1.0, 0.5)}
        >
          <Link
            href="/#projetos"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            ./ver-projetos
          </Link>
          <Link
            href="/sobre"
            className="inline-flex items-center justify-center rounded-md border border-border/40 px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-primary/55 hover:text-primary"
          >
            man sobre
          </Link>
        </div>
      </div>
    </section>
  );
}
