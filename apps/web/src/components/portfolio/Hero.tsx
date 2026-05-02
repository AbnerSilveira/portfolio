"use client";

import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { HERO_INTRO_SESSION_KEY } from "@/lib/hero-intro-session";
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

/** Linhas “brutas” da sequência de boot (segundos); comprimidas abaixo para ~45% menos tempo total. */
const rawBootLines: BootLine[] = [
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

/** Quanto encolher a timeline do terminal (~0.55 ≈ metade do tempo; digitação um pouco mais lenta para ainda ler). */
const BOOT_PACE = 0.54;
const BOOT_DURATION_PACE = Math.min(0.82, BOOT_PACE + 0.22);

function compressBootLines(lines: BootLine[], pace: number): BootLine[] {
  return lines.map((l) => ({
    ...l,
    delay: Number((l.delay * pace).toFixed(3)),
    duration: Math.max(
      0.2,
      Number((l.duration * BOOT_DURATION_PACE).toFixed(3)),
    ),
  }));
}

const bootLines = compressBootLines(rawBootLines, BOOT_PACE);

const lastBootEnd = bootLines.reduce(
  (max, l) => Math.max(max, l.delay + l.duration),
  0,
);
const BOOT_FADE_DELAY = Number((lastBootEnd + 0.14).toFixed(2));
const BOOT_FADE_DURATION = Math.max(0.55, 0.62 + BOOT_PACE * 0.35);
/** Início do conteúdo principal (logo após o fade do bloco de boot). */
const HERO_DELAY = Number((BOOT_FADE_DELAY + 0.32).toFixed(2));

/** Escalonamento do hero após o boot (mesma ordem, menos espera entre passos). */
const HERO_STAGGER = 0.58;
const heroT = (offsetFromHero: number) =>
  Number((HERO_DELAY + offsetFromHero * HERO_STAGGER).toFixed(2));

/** Início / duração do typewriter da bio (para o cursor aparecer logo após o texto). */
const HERO_BIO_TYPE_OFFSET = 4.31;
const HERO_BIO_TYPE_DURATION = 1.42;
const HERO_CURSOR_DELAY = Number(
  (
    HERO_DELAY +
    HERO_BIO_TYPE_OFFSET * HERO_STAGGER +
    HERO_BIO_TYPE_DURATION +
    0.1
  ).toFixed(2),
);

/** Após isso grava sessionStorage (fim do cursor + margem). */
const HERO_INTRO_MARK_MS = Math.ceil((HERO_CURSOR_DELAY + 4.35 + 0.3) * 1000);

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
  const [skipIntro, setSkipIntro] = useState(false);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(HERO_INTRO_SESSION_KEY) === "1") {
        setSkipIntro(true);
      }
    } catch {
      /* storage indisponível */
    }
  }, []);

  useEffect(() => {
    if (skipIntro) return;
    const id = window.setTimeout(() => {
      try {
        sessionStorage.setItem(HERO_INTRO_SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, HERO_INTRO_MARK_MS);
    return () => clearTimeout(id);
  }, [skipIntro]);

  return (
    <section
      className={cn(
        "relative overflow-x-clip bg-background pt-36 pb-16 sm:pt-44 sm:pb-20",
        skipIntro && "hero-static",
      )}
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden translate-x-6 items-center justify-center hero-deco-show md:flex md:translate-x-12"
          aria-hidden
          style={{
            ...showVars(heroT(1.38), 0.82),
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

        {skipIntro ? (
          <div className="mb-5" aria-hidden />
        ) : (
          <div
            className="boot-fade mb-5 overflow-hidden font-mono text-xs leading-normal sm:text-sm sm:leading-normal"
            aria-hidden
            style={
              {
                "--boot-fade-delay": `${BOOT_FADE_DELAY}s`,
                "--boot-fade-duration": `${BOOT_FADE_DURATION}s`,
              } as CSSProperties
            }
          >
            <div className="boot-fade__inner">
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
          </div>
        )}

        <div
          className="tw-row mb-6 w-full font-mono text-xs text-muted-foreground sm:text-sm hero-show"
          aria-hidden
          style={
            {
              ...showVars(heroT(0), 0.35),
              "--tw-delay": `${heroT(0)}s`,
            } as CSSProperties
          }
        >
          <span className="tw-prompt shrink-0">~/portfolio $</span>
          <div className="min-w-0 flex-1">
            <span
              className="tw-line block w-full"
              style={cssVars(heroT(0), 0.35, 7)}
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
            ...showVars(heroT(0.69), 0.44),
          }}
        >
          <span
            className="tw-line inline-block max-w-full"
            style={cssVars(heroT(0.86), 0.52, 14)}
          >
            Abner Silveira
          </span>
        </h1>

        <div
          className="tw-row mt-6 w-full font-mono text-sm text-muted-foreground sm:text-base hero-show"
          aria-label="estudante de SI · full-stack developer · segurança ofensiva e defensiva"
          style={
            {
              ...showVars(heroT(2.41), 0.34),
              "--tw-delay": `${heroT(2.41)}s`,
            } as CSSProperties
          }
        >
          <span className="tw-prompt shrink-0" aria-hidden>
            ~/portfolio $
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="tw-line block w-full"
              style={cssVars(heroT(2.59), 0.52, 16)}
            >
              cat about.txt
            </span>
          </div>
        </div>

        <div
          className="tw-row mt-2 w-full min-w-0 font-mono text-sm text-foreground sm:text-base hero-show"
          aria-hidden
          style={
            {
              ...showVars(heroT(4.14), 0.34),
              "--tw-delay": `${heroT(4.14)}s`,
            } as CSSProperties
          }
        >
          <div className="min-w-0 flex-1">
            <span className="inline-flex min-w-0 max-w-full items-baseline gap-1">
              <span
                className="tw-line tw-line--fit inline-block min-w-0"
                data-hero-bio
                style={cssVars(
                  heroT(HERO_BIO_TYPE_OFFSET),
                  HERO_BIO_TYPE_DURATION,
                  70,
                )}
              >
                estudante de SI · full-stack developer · segurança ofensiva e
                defensiva
              </span>
              {!skipIntro ? (
                <span
                  className="tw-cursor--temp shrink-0"
                  style={
                    {
                      "--tw-cursor-delay": `${HERO_CURSOR_DELAY}s`,
                      "--tw-cursor-life": "4.2s",
                    } as CSSProperties
                  }
                  aria-hidden
                />
              ) : null}
            </span>
          </div>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center gap-3 hero-show"
          style={showVars(heroT(1.72), 0.42)}
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
