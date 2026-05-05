import { describe, expect, it } from "vitest";

import { isProbablyPrime } from "../src/lib/prime";

describe("isProbablyPrime (Miller-Rabin)", () => {
  it("detects small primes", () => {
    for (const p of [2n, 3n, 5n, 7n, 11n, 13n]) {
      expect(isProbablyPrime(p)).toBe(true);
    }
  });

  it("rejects composites", () => {
    for (const c of [4n, 9n, 15n, 21n, 25n]) {
      expect(isProbablyPrime(c)).toBe(false);
    }
  });

  it("handles Carmichael numbers correctly", () => {
    expect(isProbablyPrime(561n)).toBe(false);
    expect(isProbablyPrime(1105n)).toBe(false);
    expect(isProbablyPrime(1729n)).toBe(false);
  });

  it("accepts larger primes used in textbook RSA", () => {
    expect(isProbablyPrime(61n)).toBe(true);
    expect(isProbablyPrime(53n)).toBe(true);
  });
});
