"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@portfolio/ui";

import { KeyOutputPanel } from "./KeyOutputPanel";
import { KeyStepsPanel, type KeyStepsPanelHandle } from "./KeyStepsPanel";
import { PrimeSelector } from "./PrimeSelector";
import { generateKeyPair, totient } from "../../lib/rsa";
import type { RsaPrivateKey, RsaPublicKey } from "../../lib/rsa";
import { parsePositiveBigInt } from "../../lib/parse-bigint";
import { pickRandomPresetPair } from "../../lib/rsa-presets";

function isBracketHotkeyBlockedTarget(target: EventTarget | null): boolean {
  const el = target instanceof HTMLElement ? target : null;
  if (!el) {
    return false;
  }
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  if (tag === "INPUT") {
    return true;
  }
  if (el.isContentEditable) {
    return true;
  }
  return false;
}

const SHORTCUTS_HELP =
  "Atalhos (fora de campos de texto): [ / ] passo anterior/seguinte · Alt+R reiniciar passos · Ctrl+Enter gerar chaves (não na área de mensagem).";

function errMessage(e: unknown): string {
  if (e instanceof RangeError) {
    return e.message;
  }
  if (e instanceof Error) {
    return e.message;
  }
  return "Erro ao gerar chaves.";
}

export interface RsaWorkbenchProps {
  /** Ajusta o chrome/layout quando embebido num site host (ex.: apps/web). */
  variant?: "standalone" | "embedded";
  /**
   * Quando definido, renderiza um link "← Portfólio" no topo do header com este href.
   * Útil quando a demo é servida fora do contexto do `apps/web` (que já tem Navbar própria).
   */
  backHref?: string;
}

export function RsaWorkbench({
  variant = "standalone",
  backHref,
}: RsaWorkbenchProps = {}) {
  const [pStr, setPStr] = useState("61");
  const [qStr, setQStr] = useState("53");
  const [eStr, setEStr] = useState("17");
  const [error, setError] = useState<string | null>(null);
  const [phi, setPhi] = useState<bigint | null>(null);
  const [publicKey, setPublicKey] = useState<RsaPublicKey | null>(null);
  const [privateKey, setPrivateKey] = useState<RsaPrivateKey | null>(null);
  const [lastP, setLastP] = useState<bigint | null>(null);
  const [lastQ, setLastQ] = useState<bigint | null>(null);
  const [outputUnlocked, setOutputUnlocked] = useState(false);
  const stepsRef = useRef<KeyStepsPanelHandle>(null);

  const keyExportFingerprint = useMemo(() => {
    if (!publicKey || !privateKey) {
      return "";
    }
    return `${publicKey.n.toString()}|${privateKey.d.toString()}`;
  }, [publicKey, privateKey]);

  useEffect(() => {
    setOutputUnlocked(false);
  }, [keyExportFingerprint]);

  const applyKeys = useCallback(() => {
    setError(null);
    const pR = parsePositiveBigInt(pStr);
    const qR = parsePositiveBigInt(qStr);
    const eR = parsePositiveBigInt(eStr);
    if (!pR.ok) {
      setError(`p: ${pR.error}`);
      return;
    }
    if (!qR.ok) {
      setError(`q: ${qR.error}`);
      return;
    }
    if (!eR.ok) {
      setError(`e: ${eR.error}`);
      return;
    }
    if (pR.value === qR.value) {
      setError("p e q têm de ser distintos.");
      return;
    }
    try {
      const pair = generateKeyPair(pR.value, qR.value, eR.value);
      setPhi(totient(pR.value, qR.value));
      setPublicKey(pair.publicKey);
      setPrivateKey(pair.privateKey);
      setLastP(pR.value);
      setLastQ(qR.value);
    } catch (e) {
      setPhi(null);
      setPublicKey(null);
      setPrivateKey(null);
      setLastP(null);
      setLastQ(null);
      setError(errMessage(e));
    }
  }, [pStr, qStr, eStr]);

  const onPreset = useCallback((p: bigint, q: bigint) => {
    setPStr(p.toString());
    setQStr(q.toString());
    setError(null);
  }, []);

  const onRandomPair = useCallback(() => {
    const [pp, qq] = pickRandomPresetPair();
    setPStr(pp.toString());
    setQStr(qq.toString());
    setError(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      if (e.ctrlKey && e.key === "Enter" && !e.metaKey && !e.altKey) {
        if (e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        applyKeys();
        return;
      }

      if (
        e.altKey &&
        (e.key === "r" || e.key === "R") &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        if (isBracketHotkeyBlockedTarget(e.target)) {
          return;
        }
        e.preventDefault();
        stepsRef.current?.restart();
        return;
      }

      if (e.key === "[" || e.key === "]") {
        if (e.ctrlKey || e.metaKey || e.altKey) {
          return;
        }
        if (isBracketHotkeyBlockedTarget(e.target)) {
          return;
        }
        e.preventDefault();
        if (e.key === "[") {
          stepsRef.current?.goPrev();
        } else {
          stepsRef.current?.goNext();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyKeys]);

  return (
    <div className={cn(variant === "standalone" && "min-h-dvh")}>
      <a
        href="#rsa-workbench-main"
        className={cn(
          "fixed left-3 z-[100] rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-md",
          "outline-none ring-2 ring-transparent transition-transform",
          "-top-16 focus:top-3 focus:ring-ring motion-reduce:transition-none",
        )}
      >
        Saltar para o conteúdo
      </a>
      {variant === "standalone" ? (
        <header className="border-b border-border bg-card/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:px-6 sm:py-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-mono text-xs text-muted-foreground">
                <span className="text-primary">~/</span>
                <span className="text-foreground/80">rsa-visualizer</span>
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                RSA Visualizer
              </h1>
              <div className="mt-2 grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="min-w-0 text-sm text-muted-foreground">
                  Matemática Discreta · 2023/1 · chaves a partir de{" "}
                  <span className="font-mono text-foreground/90">p</span>,{" "}
                  <span className="font-mono text-foreground/90">q</span>,{" "}
                  <span className="font-mono text-foreground/90">e</span> (mesmo
                  motor que em{" "}
                  <code className="rounded bg-muted px-1 font-mono text-xs">
                    src/lib
                  </code>
                  ).
                </p>
                <span className="group relative shrink-0 pt-0.5">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-sm border border-border/60 bg-muted/40",
                      "text-[9px] font-bold leading-none text-muted-foreground/80 transition-colors",
                      "hover:border-border hover:bg-muted/70 hover:text-muted-foreground",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                    )}
                    aria-label="Atalhos de teclado"
                    aria-describedby="rsa-shortcuts-tooltip"
                  >
                    !
                  </button>
                  <span
                    id="rsa-shortcuts-tooltip"
                    role="tooltip"
                    className={cn(
                      "pointer-events-none absolute right-0 top-full z-50 mt-1.5 w-max max-w-[min(18rem,calc(100vw-2rem))]",
                      "rounded border border-border bg-card px-2 py-1.5 text-left text-[10px] leading-snug text-foreground shadow-sm",
                      "opacity-0 transition-opacity duration-150",
                      "group-hover:opacity-100 group-focus-within:opacity-100",
                    )}
                  >
                    {SHORTCUTS_HELP}
                  </span>
                </span>
              </div>
            </div>
            {backHref ? (
              <a
                href={backHref}
                className={cn(
                  "shrink-0 font-mono text-sm text-primary/90 underline-offset-4 transition-colors",
                  "hover:text-primary hover:underline",
                )}
              >
                ← Portfólio
              </a>
            ) : null}
          </div>
        </header>
      ) : null}

      <main
        id="rsa-workbench-main"
        tabIndex={-1}
        className={cn(
          "scroll-mt-4 outline-none",
          variant === "standalone" &&
            "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14",
        )}
      >
        <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-3 lg:items-start">
          <PrimeSelector
            p={pStr}
            q={qStr}
            e={eStr}
            onPChange={setPStr}
            onQChange={setQStr}
            onEChange={setEStr}
            onApply={applyKeys}
            onPreset={onPreset}
            onRandomPair={onRandomPair}
            error={error}
          />
          <KeyStepsPanel
            ref={stepsRef}
            lastP={lastP}
            lastQ={lastQ}
            phi={phi}
            publicKey={publicKey}
            privateKey={privateKey}
            onDerivationComplete={() => setOutputUnlocked(true)}
          />
          <KeyOutputPanel
            outputUnlocked={outputUnlocked}
            publicKey={publicKey}
            privateKey={privateKey}
          />
        </div>
      </main>
    </div>
  );
}
