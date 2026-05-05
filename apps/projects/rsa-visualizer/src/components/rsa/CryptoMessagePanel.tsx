"use client";

import { useCallback, useState } from "react";

import { cn } from "@portfolio/ui";

import { TypewriterLines } from "./TypewriterLines";
import { decrypt, encrypt } from "../../lib/rsa";
import type { RsaPrivateKey, RsaPublicKey } from "../../lib/rsa";
import { parsePositiveBigInt } from "../../lib/parse-bigint";
import { bigIntToUtf8, utf8ToMessageBigInt } from "../../lib/utf8-message";

export interface CryptoMessagePanelProps {
  publicKey: RsaPublicKey;
  privateKey: RsaPrivateKey;
}

const shellClass = "overflow-hidden rounded-lg border border-border bg-card";

const sectionLabelClass =
  "border-b border-border bg-muted px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

const btnClass = cn(
  "rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
  "transition-opacity hover:opacity-90",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "disabled:pointer-events-none disabled:opacity-40",
);

export function CryptoMessagePanel({
  publicKey,
  privateKey,
}: CryptoMessagePanelProps) {
  const [mode, setMode] = useState<"text" | "decimal">("text");
  const [input, setInput] = useState("Oi");
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const run = useCallback(() => {
    setError(null);
    setLines(null);
    try {
      let m: bigint;
      if (mode === "decimal") {
        const r = parsePositiveBigInt(input.trim());
        if (!r.ok) {
          setError(r.error);
          return;
        }
        m = r.value;
      } else {
        m = utf8ToMessageBigInt(input);
      }
      if (m >= publicKey.n) {
        const nStr = publicKey.n.toString();
        setError(
          mode === "text"
            ? `Em modo texto, cada byte UTF-8 entra em m como «grande-endian» (m ← 256·m + byte). Daí m = ${m.toString()} ≥ n = ${nStr}. Com este n não cabe «teste» (5 bytes). Tenta 1 letra ASCII (ex.: «a») ou gera chaves com primos maiores até n > m.`
            : `m tem de ser estritamente menor que n (${nStr}).`,
        );
        return;
      }
      const c = encrypt(m, publicKey);
      const mPrime = decrypt(c, privateKey);

      const eStr = publicKey.e.toString();
      const block: string[] = [
        mode === "text"
          ? `m = ${m.toString()}  UTF-8 ${JSON.stringify(input.trim())}`
          : `m = ${m.toString()}`,
        `c = m^e mod n = m^(${eStr}) mod n = ${c.toString()}`,
        `m' = c^d mod n = ${mPrime.toString()}`,
      ];

      if (mode === "text" && mPrime === m) {
        try {
          block.push(
            `Texto UTF-8 recuperado: ${JSON.stringify(bigIntToUtf8(mPrime))}`,
          );
        } catch {
          block.push("Recuperação numérica coincide com m.");
        }
      }

      setLines(block);
      setAnimKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao calcular.");
    }
  }, [input, mode, privateKey, publicKey]);

  return (
    <div className={shellClass}>
      <p className={sectionLabelClass}>Encriptar / Decriptar (interativo)</p>
      <div className="space-y-3 px-3 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Modo texto: a frase inteira vira um único inteiro{" "}
          <span className="font-mono text-foreground/90">m</span> (bytes UTF-8
          em grande-endian), que tem de ser{" "}
          <span className="font-mono text-foreground/90">{"< n"}</span>. Com{" "}
          <span className="font-mono text-foreground/90">n</span> pequeno só
          cabem mensagens muito curtas; modo decimal aceita um{" "}
          <span className="font-mono text-foreground/90">m</span> já numérico.
        </p>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Modo de entrada"
        >
          <button
            type="button"
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium",
              mode === "text"
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted/40",
            )}
            onClick={() => setMode("text")}
          >
            Texto UTF-8
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium",
              mode === "decimal"
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted/40",
            )}
            onClick={() => setMode("decimal")}
          >
            m decimal
          </button>
        </div>

        {mode === "text" ? (
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Mensagem
            </span>
            <textarea
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              rows={2}
              className={cn(
                "w-full min-w-0 resize-y rounded-md border border-border bg-background px-2 py-1.5",
                "font-mono text-xs text-foreground placeholder:text-muted-foreground",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
              placeholder="Ex.: Olá"
              spellCheck={false}
            />
          </label>
        ) : (
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">
              m (inteiro ≥ 2)
            </span>
            <input
              type="text"
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              className={cn(
                "w-full min-w-0 rounded-md border border-border bg-background px-2 py-1.5",
                "font-mono text-xs text-foreground",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
              inputMode="numeric"
              placeholder="Ex.: 42"
            />
          </label>
        )}

        {error ? (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <button type="button" className={btnClass} onClick={run}>
          Encriptar e animar
        </button>

        {lines && lines.length > 0 ? (
          <div className="min-w-0 border-t border-border pt-3">
            <TypewriterLines
              key={animKey}
              animKey={animKey}
              breakAll
              emphasizeLastLine={false}
              lines={lines}
              showPrompt={false}
              startDelay={0.06}
              className="mt-0 space-y-1"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
