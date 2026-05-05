const MAX_DIGITS = 24;

/** Parseia inteiro decimal positivo; limite de dígitos evita entradas absurdas no MR. */
export function parsePositiveBigInt(
  raw: string,
): { ok: true; value: bigint } | { ok: false; error: string } {
  const s = raw.trim().replaceAll("_", "");
  if (s.length === 0) {
    return { ok: false, error: "Valor vazio." };
  }
  if (!/^\d+$/.test(s)) {
    return { ok: false, error: "Use apenas dígitos (0–9)." };
  }
  if (s.length > MAX_DIGITS) {
    return {
      ok: false,
      error: `Máximo de ${MAX_DIGITS} dígitos (modo didático).`,
    };
  }
  const value = BigInt(s);
  if (value < 2n) {
    return { ok: false, error: "Use um inteiro ≥ 2." };
  }
  return { ok: true, value };
}
