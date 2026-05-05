"use client";

import { cn } from "@portfolio/ui";

import { RSA_PRESET_PAIRS } from "@/lib/rsa-presets";

export interface PrimeSelectorProps {
  p: string;
  q: string;
  e: string;
  onPChange: (value: string) => void;
  onQChange: (value: string) => void;
  onEChange: (value: string) => void;
  onApply: () => void;
  onPreset: (p: bigint, q: bigint) => void;
  onRandomPair: () => void;
  error: string | null;
}

export function PrimeSelector({
  p,
  q,
  e,
  onPChange,
  onQChange,
  onEChange,
  onApply,
  onPreset,
  onRandomPair,
  error,
}: PrimeSelectorProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-border bg-card p-5 shadow-sm",
        "lg:min-h-0",
      )}
      aria-labelledby="rsa-primes-heading"
    >
      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary">~/rsa-visualizer</span>
          <span className="text-foreground"> $ </span>
          <span className="text-foreground/90">openssl prime -generate</span>
        </p>
        <h2
          id="rsa-primes-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Primos e expoente
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modo didático: primos pequenos. Sem{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">
            Math.random()
          </code>{" "}
          nos presets aleatórios.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            p (primo)
          </span>
          <input
            value={p}
            onChange={(ev) => onPChange(ev.target.value)}
            className={cn(
              "rounded-md border border-input bg-background px-3 py-2 font-mono text-sm",
              "text-foreground outline-none ring-ring/40 transition-shadow focus-visible:ring-2",
            )}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            q (primo ≠ p)
          </span>
          <input
            value={q}
            onChange={(ev) => onQChange(ev.target.value)}
            className={cn(
              "rounded-md border border-input bg-background px-3 py-2 font-mono text-sm",
              "text-foreground outline-none ring-ring/40 transition-shadow focus-visible:ring-2",
            )}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            e (público, coprimo com φ)
          </span>
          <input
            value={e}
            onChange={(ev) => onEChange(ev.target.value)}
            className={cn(
              "rounded-md border border-input bg-background px-3 py-2 font-mono text-sm",
              "text-foreground outline-none ring-ring/40 transition-shadow focus-visible:ring-2",
            )}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      </div>

      {error ? (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApply}
          className={cn(
            "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
            "transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          Gerar chaves
        </button>
        <button
          type="button"
          onClick={onRandomPair}
          className={cn(
            "rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground",
            "transition-colors hover:border-primary/50 hover:bg-muted/60",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          Par aleatório
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {RSA_PRESET_PAIRS.map(([pp, qq]) => (
            <button
              key={`${pp}-${qq}`}
              type="button"
              onClick={() => onPreset(pp, qq)}
              className={cn(
                "rounded-md border border-border px-3 py-1.5 font-mono text-xs text-foreground",
                "transition-colors hover:border-primary/50 hover:bg-muted/50",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              p={pp.toString()} · q={qq.toString()}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
