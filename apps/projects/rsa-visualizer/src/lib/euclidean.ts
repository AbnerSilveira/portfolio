/**
 * Algoritmo de Euclides estendido (BigInt).
 * Encontra gcd(a,b) e coeficientes de Bézout x, y com a*x + b*y = gcd.
 */

export interface ExtendedGcdResult {
  gcd: bigint;
  x: bigint;
  y: bigint;
}

export function extendedEuclid(a: bigint, b: bigint): ExtendedGcdResult {
  if (b === 0n) {
    return { gcd: a, x: 1n, y: 0n };
  }
  const { gcd, x: x1, y: y1 } = extendedEuclid(b, a % b);
  const x = y1;
  const y = x1 - (a / b) * y1;
  return { gcd, x, y };
}

/**
 * Inverso modular de `a` módulo `m`: retorna x com (a * x) ≡ 1 (mod m), se existir.
 * Exige gcd(a, m) === 1.
 */
export function modInverse(a: bigint, m: bigint): bigint {
  if (m <= 0n) {
    throw new RangeError("modulus must be positive");
  }
  const { gcd, x } = extendedEuclid(((a % m) + m) % m, m);
  if (gcd !== 1n && gcd !== -1n) {
    throw new RangeError("no modular inverse: gcd(a, m) !== 1");
  }
  return ((x % m) + m) % m;
}
