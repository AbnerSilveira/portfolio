/**
 * Aritmética modular (BigInt). Base do RSA — sem bibliotecas criptográficas.
 */

/** (a * b) % m com m > 0 */
export function modMul(a: bigint, b: bigint, m: bigint): bigint {
  if (m <= 0n) {
    throw new RangeError("modulus must be positive");
  }
  const aa = ((a % m) + m) % m;
  const bb = ((b % m) + m) % m;
  return (aa * bb) % m;
}

/**
 * Exponenciação modular: base^exp mod m.
 * Exponenciação binária — O(log exp).
 */
export function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  if (m <= 0n) {
    throw new RangeError("modulus must be positive");
  }
  if (m === 1n) {
    return 0n;
  }
  let b = ((base % m) + m) % m;
  let e = exp;
  if (e < 0n) {
    throw new RangeError(
      "negative exponent requires modular inverse (not supported here)",
    );
  }
  let result = 1n;
  while (e > 0n) {
    if (e & 1n) {
      result = modMul(result, b, m);
    }
    b = modMul(b, b, m);
    e >>= 1n;
  }
  return result;
}
