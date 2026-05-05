import { describe, expect, it } from "vitest";

import { decrypt, encrypt, generateKeyPair, totient } from "../src/lib/rsa";

describe("totient", () => {
  it("computes (p-1)(q-1) for distinct primes", () => {
    expect(totient(61n, 53n)).toBe(3120n);
  });

  it("rejects equal primes", () => {
    expect(() => totient(61n, 61n)).toThrow(RangeError);
  });
});

describe("RSA round-trip", () => {
  it("encrypts and decrypts with textbook 61×53, e=17", () => {
    const p = 61n;
    const q = 53n;
    const e = 17n;
    const { publicKey, privateKey } = generateKeyPair(p, q, e);
    expect(publicKey.n).toBe(3233n);

    const m = 123n;
    const c = encrypt(m, publicKey);
    expect(c).not.toBe(m);
    expect(decrypt(c, privateKey)).toBe(m);
  });

  it("rejects message out of range", () => {
    const { publicKey } = generateKeyPair(61n, 53n, 17n);
    expect(() => encrypt(4000n, publicKey)).toThrow(RangeError);
  });
});
