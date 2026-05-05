/**
 * RSA minimal (BigInt): chaves a partir de primos distintos, encriptação e decriptação.
 * Didático — não substitui validação completa (padding, tamanhos, etc.).
 */

import { extendedEuclid, modInverse } from "./euclidean";
import { modPow } from "./modular";
import { isProbablyPrime } from "./prime";

export interface RsaPublicKey {
  n: bigint;
  e: bigint;
}

export interface RsaPrivateKey {
  n: bigint;
  d: bigint;
}

const DEFAULT_E = 65537n;

/** φ(n) = (p-1)(q-1) para p, q primos distintos */
export function totient(p: bigint, q: bigint): bigint {
  if (p === q) {
    throw new RangeError("p and q must be distinct primes");
  }
  return (p - 1n) * (q - 1n);
}

/**
 * Gera par de chaves RSA a partir de primos p, q e expoente público e (default 65537).
 * e deve ser coprimo com φ(n).
 */
export function generateKeyPair(
  p: bigint,
  q: bigint,
  e: bigint = DEFAULT_E,
): { publicKey: RsaPublicKey; privateKey: RsaPrivateKey } {
  if (!isProbablyPrime(p) || !isProbablyPrime(q)) {
    throw new RangeError("p and q must be prime");
  }
  if (p === q) {
    throw new RangeError("p and q must be distinct");
  }
  const n = p * q;
  const phi = totient(p, q);
  if (e <= 1n || e >= phi) {
    throw new RangeError("e must satisfy 1 < e < phi(n) and gcd(e, phi) = 1");
  }
  const { gcd } = extendedEuclid(e, phi);
  const absGcd = gcd < 0n ? -gcd : gcd;
  if (absGcd !== 1n) {
    throw new RangeError("e must be coprime with phi(n)");
  }
  const d = modInverse(e, phi);
  return {
    publicKey: { n, e },
    privateKey: { n, d },
  };
}

export function encrypt(message: bigint, pub: RsaPublicKey): bigint {
  if (message < 0n || message >= pub.n) {
    throw new RangeError("message must satisfy 0 <= m < n");
  }
  return modPow(message, pub.e, pub.n);
}

export function decrypt(ciphertext: bigint, priv: RsaPrivateKey): bigint {
  if (ciphertext < 0n || ciphertext >= priv.n) {
    throw new RangeError("ciphertext must satisfy 0 <= c < n");
  }
  return modPow(ciphertext, priv.d, priv.n);
}
