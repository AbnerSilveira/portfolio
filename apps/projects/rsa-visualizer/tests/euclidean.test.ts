import { describe, expect, it } from "vitest";

import { extendedEuclid, modInverse } from "../src/lib/euclidean";

describe("extendedEuclid", () => {
  it("finds gcd and Bezout coefficients", () => {
    const { gcd, x, y } = extendedEuclid(240n, 46n);
    expect(gcd).toBe(2n);
    expect(240n * x + 46n * y).toBe(2n);
  });

  it("returns gcd when second argument is 0", () => {
    const { gcd } = extendedEuclid(7n, 0n);
    expect(gcd).toBe(7n);
  });
});

describe("modInverse", () => {
  it("inverts modulo phi for RSA-sized e", () => {
    const phi = 3120n;
    const e = 17n;
    const d = modInverse(e, phi);
    expect((e * d) % phi).toBe(1n);
    expect(d).toBe(2753n);
  });

  it("throws when inverse does not exist", () => {
    expect(() => modInverse(6n, 9n)).toThrow(RangeError);
  });
});
