/** Pares (p, q) primos distintos para modo didático — escolha via PRNG criptográfico. */
export const RSA_PRESET_PAIRS: readonly [bigint, bigint][] = [
  [61n, 53n],
  [17n, 19n],
  [101n, 103n],
  [7n, 19n],
  [11n, 29n],
  [13n, 23n],
] as const;

export function pickRandomPresetPair(): [bigint, bigint] {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const len = RSA_PRESET_PAIRS.length;
  const idx = buf[0]! % len;
  const pair = RSA_PRESET_PAIRS.find((_, i) => i === idx);
  if (!pair) {
    return RSA_PRESET_PAIRS[0]!;
  }
  return pair;
}
