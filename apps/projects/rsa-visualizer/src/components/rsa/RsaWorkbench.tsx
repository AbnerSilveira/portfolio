"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@portfolio/ui";

import { KeyOutputPanel } from "@/components/rsa/KeyOutputPanel";
import { KeyStepsPanel } from "@/components/rsa/KeyStepsPanel";
import { PrimeSelector } from "@/components/rsa/PrimeSelector";
import { generateKeyPair, totient } from "@/lib/rsa";
import type { RsaPrivateKey, RsaPublicKey } from "@/lib/rsa";
import { parsePositiveBigInt } from "@/lib/parse-bigint";
import { pickRandomPresetPair } from "@/lib/rsa-presets";

function errMessage(e: unknown): string {
  if (e instanceof RangeError) {
    return e.message;
  }
  if (e instanceof Error) {
    return e.message;
  }
  return "Erro ao gerar chaves.";
}

export function RsaWorkbench() {
  const portfolioBase = useMemo(
    () => process.env.NEXT_PUBLIC_PORTFOLIO_URL?.replace(/\/$/, "") ?? "",
    [],
  );

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

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">
              <span className="text-primary">~/</span>
              <span className="text-foreground/80">rsa-visualizer</span>
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              RSA Visualizer
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
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
          </div>
          {portfolioBase ? (
            <a
              href={portfolioBase}
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

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
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
