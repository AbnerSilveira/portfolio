import { describe, expect, it } from "vitest";

import { modMul, modPow } from "../src/lib/modular";

describe("modMul", () => {
  it("multiplies modulo m", () => {
    expect(modMul(7n, 5n, 13n)).toBe(9n);
  });
});

describe("modPow", () => {
  it("calculates 4^13 mod 497 correctly", () => {
    expect(modPow(4n, 13n, 497n)).toBe(445n);
  });

  it("handles large numbers", () => {
    expect(modPow(2n, 100n, 1_000_000_007n)).toBe(976371285n);
  });

  it("returns 1 for exponent 0 (m > 1)", () => {
    expect(modPow(9n, 0n, 17n)).toBe(1n);
  });

  it("throws on non-positive modulus", () => {
    expect(() => modPow(1n, 1n, 0n)).toThrow(RangeError);
  });
});
