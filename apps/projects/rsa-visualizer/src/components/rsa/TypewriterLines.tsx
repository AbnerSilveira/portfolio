"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@portfolio/ui";

const TICK_MS = 36;
const LINE_GAP_MS = 56;
const EMPTY_GAP_MS = 96;

/** Ritmo mais lento (~+45% face à versão anterior). */
const RSA_MIN_DUR_S = 0.15;
const RSA_PER_CHAR_S = 0.0045;
const RSA_MAX_DUR_S = 0.58;

function lineDurationSec(chars: number) {
  return Math.min(
    RSA_MAX_DUR_S,
    Math.max(RSA_MIN_DUR_S, RSA_MIN_DUR_S + chars * RSA_PER_CHAR_S),
  );
}

function lineDurationRevealSec(length: number) {
  return Math.min(0.65, 0.2 + length * 0.0045);
}

function computeLineDurMs(line: string, breakAll: boolean | undefined): number {
  if (line === "") {
    return 0;
  }
  if (breakAll && line.length > 40) {
    return lineDurationRevealSec(line.length) * 1000;
  }
  return lineDurationSec(line.length) * 1000;
}

export interface TypewriterLinesProps {
  lines: string[];
  animKey: number;
  onSequenceEnd?: () => void;
  breakAll?: boolean;
  className?: string;
  startDelay?: number;
  showPrompt?: boolean;
  emphasizeLastLine?: boolean;
  headingFirst?: boolean;
}

type RowMeta =
  | { kind: "empty"; startMs: number; gapMs: number }
  | {
      kind: "text";
      lineIndex: number;
      text: string;
      startMs: number;
      durMs: number;
      rate: number;
    };

export function TypewriterLines({
  lines,
  animKey,
  onSequenceEnd,
  breakAll,
  className,
  startDelay = 0.04,
  showPrompt = true,
  emphasizeLastLine = true,
  headingFirst = false,
}: TypewriterLinesProps) {
  const onEndRef = useRef(onSequenceEnd);
  onEndRef.current = onSequenceEnd;

  const { rowMetas, totalMs } = useMemo(() => {
    let t = startDelay * 1000;
    const metas: RowMeta[] = [];
    lines.forEach((line, lineIndex) => {
      if (line === "") {
        metas.push({ kind: "empty", startMs: t, gapMs: EMPTY_GAP_MS });
        t += EMPTY_GAP_MS;
        return;
      }
      const durMs = computeLineDurMs(line, breakAll);
      const rate = line.length > 0 ? line.length / durMs : 0;
      metas.push({
        kind: "text",
        lineIndex,
        text: line,
        startMs: t,
        durMs,
        rate,
      });
      t += durMs + LINE_GAP_MS;
    });
    return { rowMetas: metas, totalMs: t };
  }, [lines, breakAll, startDelay]);

  const [elapsedMs, setElapsedMs] = useState(0);

  const lastTextRowIx = useMemo(() => {
    let last = -1;
    rowMetas.forEach((m, j) => {
      if (m.kind === "text") {
        last = j;
      }
    });
    return last;
  }, [rowMetas]);

  useEffect(() => {
    setElapsedMs(0);
    const started = performance.now();
    let endedCallback = false;

    const tick = (): boolean => {
      const elapsed = performance.now() - started;
      const clamped = Math.min(elapsed, totalMs);
      setElapsedMs(clamped);
      if (clamped >= totalMs && !endedCallback) {
        endedCallback = true;
        onEndRef.current?.();
      }
      return clamped >= totalMs;
    };

    tick();
    const id = window.setInterval(() => {
      if (tick()) {
        window.clearInterval(id);
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [animKey, totalMs]);

  const textWrap = breakAll
    ? "[overflow-wrap:anywhere] break-all"
    : "[overflow-wrap:anywhere]";

  function visibleCharCount(
    text: string,
    startMs: number,
    durMs: number,
    rate: number,
  ): number {
    if (text.length === 0) {
      return 0;
    }
    if (elapsedMs <= startMs) {
      return 0;
    }
    if (elapsedMs >= startMs + durMs) {
      return text.length;
    }
    // ceil: com ticks discretos, floor(rate·Δt) podia ficar em length−1 até saltar o fim da linha.
    const n = Math.ceil((elapsedMs - startMs) * rate);
    return Math.min(text.length, Math.max(0, n));
  }

  return (
    <div
      className={cn("mt-2 space-y-1 font-mono text-xs", textWrap, className)}
    >
      {rowMetas.map((meta, rowIx) => {
        if (meta.kind === "empty") {
          return (
            <div
              key={`${animKey}-e-${rowIx}`}
              className="h-2 shrink-0"
              aria-hidden
            />
          );
        }

        const { text, startMs, durMs, rate, lineIndex } = meta;
        const n = visibleCharCount(text, startMs, durMs, rate);
        const visible = text.slice(0, n);
        const isLast = rowIx === lastTextRowIx;

        const isHeadingLine = headingFirst && lineIndex === 0;
        const lineTone = isHeadingLine
          ? "font-sans text-sm font-semibold leading-snug text-foreground"
          : emphasizeLastLine && !isLast
            ? "text-muted-foreground"
            : "text-foreground/90";

        const wrapClipReveal = !!breakAll;
        const clipProgress =
          text.length === 0
            ? 1
            : Math.min(1, Math.max(0, n / Math.max(1, text.length)));

        if (wrapClipReveal) {
          return (
            <div
              key={`${animKey}-r-${rowIx}`}
              className="flex w-full min-h-[1.25em] items-baseline gap-2"
            >
              {showPrompt ? (
                <span className="shrink-0 text-primary select-none" aria-hidden>
                  {">"}
                </span>
              ) : null}
              <span
                className={cn(
                  "min-w-0 flex-1 whitespace-pre-wrap break-all",
                  lineTone,
                )}
                style={{
                  clipPath: `inset(0 ${(1 - clipProgress) * 100}% 0 0)`,
                }}
              >
                {text}
              </span>
            </div>
          );
        }

        return (
          <div
            key={`${animKey}-l-${rowIx}`}
            className="flex w-full min-h-[1.25em] items-baseline gap-2"
          >
            {showPrompt ? (
              <span className="shrink-0 text-primary select-none" aria-hidden>
                {">"}
              </span>
            ) : null}
            <span
              className={cn(
                "min-w-0 flex-1 overflow-hidden whitespace-nowrap",
                lineTone,
              )}
            >
              {visible}
              {n < text.length ? (
                <span className="inline-block w-[0.35em] shrink-0 animate-pulse bg-primary/80 align-text-bottom" />
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
