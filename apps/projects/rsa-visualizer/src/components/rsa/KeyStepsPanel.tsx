"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@portfolio/ui";

import { StepCalcReveal } from "@/components/rsa/StepCalcReveal";
import { extendedEuclid } from "@/lib/euclidean";
import { chunkBigIntLine } from "@/lib/chunk-bigint-display";
import type { RsaPrivateKey, RsaPublicKey } from "@/lib/rsa";

const STEP_COUNT = 4;

export interface KeyStepsPanelProps {
  lastP: bigint | null;
  lastQ: bigint | null;
  phi: bigint | null;
  publicKey: RsaPublicKey | null;
  privateKey: RsaPrivateKey | null;
  /** Chamado uma vez por par de chaves quando o typewriter do passo 4 (d) termina. */
  onDerivationComplete?: () => void;
}

export function KeyStepsPanel({
  lastP,
  lastQ,
  phi,
  publicKey,
  privateKey,
  onDerivationComplete,
}: KeyStepsPanelProps) {
  const hasKeys = publicKey !== null && privateKey !== null && phi !== null;
  const reduceMotion = useReducedMotion();

  const [activeStep, setActiveStep] = useState(0);
  const [replayNonce, setReplayNonce] = useState(0);
  const keyVersionRef = useRef("");

  const keyFingerprint = hasKeys
    ? `${publicKey.n.toString()}|${phi.toString()}|${publicKey.e.toString()}|${privateKey.d.toString()}`
    : "";

  const derivationEmittedRef = useRef<string | null>(null);
  /** Após «← Passo»: não avançar sozinho ao fim do typewriter até «Passo →», Reiniciar ou novas chaves. */
  const blockAutoAdvanceRef = useRef(false);

  useEffect(() => {
    derivationEmittedRef.current = null;
  }, [keyFingerprint]);

  const handleStep4TypingComplete = useCallback(() => {
    if (!keyFingerprint || derivationEmittedRef.current === keyFingerprint) {
      return;
    }
    derivationEmittedRef.current = keyFingerprint;
    onDerivationComplete?.();
  }, [keyFingerprint, onDerivationComplete]);

  /** Ao fim do typewriter: avança sozinho, exceto se o utilizador tiver ido para trás com «← Passo». */
  const handleStepTypingEnd = useCallback(
    (stepIndex: number) => {
      if (stepIndex === STEP_COUNT - 1) {
        handleStep4TypingComplete();
        return;
      }
      if (blockAutoAdvanceRef.current) {
        return;
      }
      setActiveStep((s) => Math.min(STEP_COUNT - 1, s + 1));
    },
    [handleStep4TypingComplete],
  );

  const stepLines = useMemo(() => {
    if (
      !hasKeys ||
      !publicKey ||
      !privateKey ||
      !phi ||
      lastP === null ||
      lastQ === null
    ) {
      return null;
    }
    const pm1 = lastP - 1n;
    const qm1 = lastQ - 1n;
    const rawGcd = extendedEuclid(publicKey.e, phi).gcd;
    const gcd = rawGcd < 0n ? -rawGcd : rawGcd;
    const verify = (publicKey.e * privateKey.d) % phi;

    return {
      n: [
        `p = ${lastP.toString()}`,
        `q = ${lastQ.toString()}`,
        `n = p·q = ${publicKey.n.toString()}`,
      ],
      phi: [
        `p − 1 = ${pm1.toString()}`,
        `q − 1 = ${qm1.toString()}`,
        `φ(n) = (${pm1.toString()})·(${qm1.toString()}) = ${phi.toString()}`,
      ],
      e: [
        `e = ${publicKey.e.toString()}`,
        `gcd(e, φ(n)) = gcd(${publicKey.e.toString()}, ${phi.toString()}) = ${gcd.toString()}`,
      ],
      d: [
        "d ≡ e⁻¹ (mod φ(n))",
        `(e·d) mod φ(n) = ${verify.toString()}`,
        ...chunkBigIntLine("d = ", privateKey.d, 26),
      ],
    };
  }, [hasKeys, publicKey, privateKey, phi, lastP, lastQ]);

  useEffect(() => {
    if (!hasKeys || !keyFingerprint) {
      return;
    }
    if (keyVersionRef.current === keyFingerprint) {
      return;
    }
    keyVersionRef.current = keyFingerprint;
    blockAutoAdvanceRef.current = false;
    setActiveStep(0);
  }, [hasKeys, keyFingerprint]);

  const goPrev = useCallback(() => {
    blockAutoAdvanceRef.current = true;
    setActiveStep((s) => Math.max(0, s - 1));
  }, []);

  const goNext = useCallback(() => {
    blockAutoAdvanceRef.current = false;
    setActiveStep((s) => Math.min(STEP_COUNT - 1, s + 1));
  }, []);

  const restart = useCallback(() => {
    blockAutoAdvanceRef.current = false;
    setActiveStep(0);
    setReplayNonce((n) => n + 1);
  }, []);

  const btnClass = cn(
    "rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground",
    "transition-colors hover:border-primary/50 hover:bg-muted/50",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-40",
  );

  return (
    <section
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm",
      )}
      aria-labelledby="rsa-steps-heading"
    >
      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary">~/rsa-visualizer</span>
          <span className="text-foreground"> $ </span>
          <span className="text-foreground/90">cat ./steps.md</span>
        </p>
        <h2
          id="rsa-steps-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Passos
        </h2>
      </div>

      {!hasKeys || !stepLines ? (
        <p className="text-sm text-muted-foreground">
          Escolhe <span className="font-mono text-foreground">p</span>,{" "}
          <span className="font-mono text-foreground">q</span> e{" "}
          <span className="font-mono text-foreground">e</span>, depois{" "}
          <strong className="text-foreground">Gerar chaves</strong>.
        </p>
      ) : (
        <>
          <ol
            key={keyFingerprint}
            className="min-w-0 space-y-3 pl-0"
            aria-live="polite"
            aria-relevant="text"
            aria-atomic="false"
          >
            <StepRow
              index={0}
              activeStep={activeStep}
              replayNonce={replayNonce}
              reduceMotion={!!reduceMotion}
              title="n = p · q"
              lines={stepLines.n}
              onTypingComplete={() => handleStepTypingEnd(0)}
            />
            <StepRow
              index={1}
              activeStep={activeStep}
              replayNonce={replayNonce}
              reduceMotion={!!reduceMotion}
              title="φ(n) = (p − 1)(q − 1)"
              lines={stepLines.phi}
              onTypingComplete={() => handleStepTypingEnd(1)}
            />
            <StepRow
              index={2}
              activeStep={activeStep}
              replayNonce={replayNonce}
              reduceMotion={!!reduceMotion}
              title="gcd(e, φ(n)) = 1"
              lines={stepLines.e}
              onTypingComplete={() => handleStepTypingEnd(2)}
            />
            <StepRow
              index={3}
              activeStep={activeStep}
              replayNonce={replayNonce}
              reduceMotion={!!reduceMotion}
              title="d ≡ e⁻¹ (mod φ)"
              lines={stepLines.d}
              breakAll
              onTypingComplete={() => handleStepTypingEnd(3)}
            />
          </ol>

          <div
            className="flex flex-wrap items-center gap-2 border-t border-border pt-4"
            role="toolbar"
            aria-label="Navegação entre passos"
          >
            <button
              type="button"
              className={btnClass}
              onClick={goPrev}
              disabled={activeStep <= 0}
              aria-label="Passo anterior"
            >
              ← Passo
            </button>
            <button
              type="button"
              className={btnClass}
              onClick={goNext}
              disabled={activeStep >= STEP_COUNT - 1}
              aria-label="Passo seguinte"
            >
              Passo →
            </button>
            <button type="button" className={btnClass} onClick={restart}>
              Reiniciar
            </button>
            <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">
              {activeStep + 1}/{STEP_COUNT}
            </span>
          </div>
        </>
      )}
    </section>
  );
}

interface StepRowProps {
  index: number;
  activeStep: number;
  replayNonce: number;
  reduceMotion: boolean;
  title: string;
  lines: string[];
  breakAll?: boolean;
  /** Quando o typewriter do passo atual termina (todos os passos). */
  onTypingComplete?: () => void;
}

function StepRow({
  index,
  activeStep,
  replayNonce,
  reduceMotion,
  title,
  lines,
  breakAll,
  onTypingComplete,
}: StepRowProps) {
  const [animKey, setAnimKey] = useState(0);
  const prevRef = useRef<{ step: number; replay: number } | null>(null);

  const isPast = index < activeStep;
  const isCurrent = index === activeStep;
  const dimmed = index > activeStep;
  const duration = reduceMotion ? 0 : 0.32;

  useEffect(() => {
    if (activeStep !== index) {
      if (prevRef.current && prevRef.current.step === index) {
        prevRef.current = { step: -1, replay: replayNonce };
      }
      return;
    }
    const cur = { step: activeStep, replay: replayNonce };
    if (prevRef.current === null) {
      prevRef.current = cur;
      return;
    }
    const changed =
      prevRef.current.step !== cur.step ||
      prevRef.current.replay !== cur.replay;
    prevRef.current = cur;
    if (changed) {
      setAnimKey((k) => k + 1);
    }
  }, [activeStep, index, replayNonce]);

  return (
    <motion.li
      layout={false}
      initial={false}
      animate={{
        opacity: reduceMotion ? 1 : dimmed ? 0.35 : 1,
        y: reduceMotion ? 0 : dimmed ? 3 : 0,
        scale: reduceMotion ? 1 : isCurrent ? 1.01 : 1,
      }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex gap-3 rounded-lg border px-2 py-2.5 sm:px-3",
        isCurrent
          ? "border-primary/40 bg-primary/10 shadow-sm"
          : "border-transparent",
      )}
    >
      <span
        className={cn(
          "mt-0.5 min-w-[1.25rem] font-mono text-xs tabular-nums",
          isCurrent ? "text-primary" : "text-muted-foreground",
        )}
        aria-hidden
      >
        {index + 1}.
      </span>
      <div className="min-w-0 flex-1">
        {!isCurrent ? (
          <>
            <div
              className={cn(
                "text-sm font-medium",
                isPast ? "text-foreground/90" : "text-foreground/55",
              )}
            >
              {title}
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground/45">…</p>
          </>
        ) : (
          <StepCalcReveal
            heading={title}
            lines={lines}
            animKey={animKey}
            breakAll={breakAll}
            onSequenceEnd={onTypingComplete}
          />
        )}
      </div>
    </motion.li>
  );
}
