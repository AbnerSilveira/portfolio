"use client";

import { useMemo } from "react";

import { TypewriterLines } from "./TypewriterLines";

export interface StepCalcRevealProps {
  /** Título do passo (ex. «n = p · q») — entra na animação como primeira linha. */
  heading: string;
  /** Linhas do cálculo (por ordem), depois do título. */
  lines: string[];
  /** Incrementar quando o passo volta a ficar ativo para repetir a animação. */
  animKey: number;
  /** Monospace + quebra para números longos */
  breakAll?: boolean;
  /** Disparado quando a sequência de typewriter da linha atual termina (ex.: passo 4). */
  onSequenceEnd?: () => void;
}

export function StepCalcReveal({
  heading,
  lines,
  animKey,
  breakAll,
  onSequenceEnd,
}: StepCalcRevealProps) {
  const combinedLines = useMemo(() => [heading, ...lines], [heading, lines]);

  return (
    <TypewriterLines
      key={animKey}
      animKey={animKey}
      breakAll={breakAll}
      emphasizeLastLine
      headingFirst
      lines={combinedLines}
      showPrompt
      onSequenceEnd={onSequenceEnd}
    />
  );
}
