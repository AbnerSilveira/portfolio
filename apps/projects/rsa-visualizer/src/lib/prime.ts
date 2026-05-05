/**
 * Teste de primalidade de Miller–Rabin (BigInt).
 * Determinístico para n < 3_825_123_056_546_413_131 usando testemunhas fixas (suficiente para modo didático).
 */

import { modPow } from "./modular";

/** Testemunhas que tornam MR determinístico para todo n de 64 bits (cf. literature). */
const DETERMINISTIC_WITNESSES: bigint[] = [
  2n,
  3n,
  5n,
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
];

function millerRabinRound(n: bigint, a: bigint, d: bigint, r: number): boolean {
  let x = modPow(a, d, n);
  if (x === 1n || x === n - 1n) {
    return true;
  }
  for (let i = 1; i < r; i++) {
    x = (x * x) % n;
    if (x === n - 1n) {
      return true;
    }
  }
  return false;
}

/**
 * @returns true se n for provavelmente primo (sem falsos negativos para a gama coberta pelas testemunhas).
 */
export function isProbablyPrime(n: bigint): boolean {
  if (n < 2n) {
    return false;
  }
  if (n === 2n || n === 3n) {
    return true;
  }
  if (n % 2n === 0n) {
    return false;
  }

  let d = n - 1n;
  let r = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }

  for (const a of DETERMINISTIC_WITNESSES) {
    if (a >= n - 1n) {
      continue;
    }
    if (!millerRabinRound(n, a, d, r)) {
      return false;
    }
  }
  return true;
}
