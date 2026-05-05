/**
 * Converte texto curto em inteiro m para RSA em bloco único (UTF-8 → BigInt).
 * Didático: cada byte vira 8 bits à esquerda do acumulador.
 */

export function utf8ToMessageBigInt(text: string): bigint {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new RangeError("Mensagem vazia.");
  }
  const bytes = new TextEncoder().encode(trimmed);
  let m = 0n;
  for (const b of bytes) {
    m = (m << 8n) + BigInt(b);
  }
  if (m === 0n) {
    throw new RangeError("m não pode ser 0.");
  }
  return m;
}

/** Inverso de utf8ToMessageBigInt (bytes big-endian). */
export function bigIntToUtf8(m: bigint): string {
  if (m <= 0n) {
    throw new RangeError("m tem de ser positivo.");
  }
  const bytes: number[] = [];
  let x = m;
  while (x > 0n) {
    bytes.unshift(Number(x & 0xffn));
    x >>= 8n;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(
    new Uint8Array(bytes),
  );
}
