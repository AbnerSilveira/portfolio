"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@portfolio/ui";

import { CryptoMessagePanel } from "@/components/rsa/CryptoMessagePanel";
import { TypewriterLines } from "@/components/rsa/TypewriterLines";
import type { RsaPrivateKey, RsaPublicKey } from "@/lib/rsa";

export interface KeyOutputPanelProps {
  publicKey: RsaPublicKey | null;
  privateKey: RsaPrivateKey | null;
  /** Só mostra chaves / encriptação interativa após o typewriter do passo 4 (coluna central). */
  outputUnlocked: boolean;
}

const shellClass = "overflow-hidden rounded-lg border border-border bg-card";

const sectionLabelClass =
  "border-b border-border bg-muted px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

export function KeyOutputPanel({
  publicKey,
  privateKey,
  outputUnlocked,
}: KeyOutputPanelProps) {
  const hasKeys = publicKey !== null && privateKey !== null;

  const [keysAnimKey, setKeysAnimKey] = useState(0);
  const [keysRevealDone, setKeysRevealDone] = useState(false);

  useEffect(() => {
    if (!outputUnlocked) {
      setKeysRevealDone(false);
      return;
    }
    setKeysAnimKey((k) => k + 1);
    setKeysRevealDone(false);
  }, [outputUnlocked]);

  const keysLines = useMemo(() => {
    if (!hasKeys || !publicKey || !privateKey) {
      return [] as string[];
    }
    return [
      "— Chave pública —",
      `n = ${publicKey.n.toString()}`,
      `e = ${publicKey.e.toString()}`,
      "",
      "— Chave privada (não partilhar) —",
      `d = ${privateKey.d.toString()}`,
    ];
  }, [hasKeys, publicKey, privateKey]);

  const onKeysTyped = useCallback(() => {
    setKeysRevealDone(true);
  }, []);

  const showCryptoPanel =
    keysRevealDone && hasKeys && publicKey !== null && privateKey !== null;

  return (
    <section
      className={cn(
        "flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm",
      )}
      aria-labelledby="rsa-output-heading"
    >
      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary">~/rsa-visualizer</span>
          <span className="text-foreground"> $ </span>
          <span className="text-foreground/90">./export-keys.sh</span>
        </p>
        <h2
          id="rsa-output-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Saída
        </h2>
      </div>

      {!outputUnlocked ? (
        <div
          className={cn(
            "min-w-0 rounded-lg border border-dashed border-border/70 bg-muted/10 px-3 py-3",
          )}
        >
          {!hasKeys ? (
            <>
              <p className="text-balance text-xs leading-snug text-muted-foreground">
                Ainda sem chaves.
              </p>
              <p className="mt-2 text-balance text-xs leading-snug text-muted-foreground">
                Na coluna da esquerda: escolhe{" "}
                <span className="font-mono text-foreground/85">p</span>,{" "}
                <span className="font-mono text-foreground/85">q</span>,{" "}
                <span className="font-mono text-foreground/85">e</span>. Depois,{" "}
                <strong className="text-foreground">Gerar chaves</strong>.
              </p>
            </>
          ) : (
            <p className="text-balance text-xs leading-snug text-muted-foreground">
              Vai ao <strong className="text-foreground">passo 4</strong> no
              painel central e espera que a animação do cálculo de{" "}
              <span className="font-mono text-foreground/85">d</span> termine —
              aí aparecem as chaves aqui.
            </p>
          )}
        </div>
      ) : hasKeys && keysLines.length > 0 ? (
        <div className="min-w-0 space-y-4">
          <div className={shellClass}>
            <p className={sectionLabelClass}>Chaves</p>
            <div className={cn("min-w-0 px-3 pb-3 pt-1")}>
              <TypewriterLines
                key={`keys-${keysAnimKey}`}
                animKey={keysAnimKey}
                breakAll
                emphasizeLastLine={false}
                lines={keysLines}
                showPrompt={false}
                startDelay={0.05}
                className="mt-0 space-y-1"
                onSequenceEnd={onKeysTyped}
              />
            </div>
          </div>

          {showCryptoPanel ? (
            <CryptoMessagePanel publicKey={publicKey} privateKey={privateKey} />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
