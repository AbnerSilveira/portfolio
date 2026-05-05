import { describe, expect, it } from "vitest";

import { bigIntToUtf8, utf8ToMessageBigInt } from "../src/lib/utf8-message";

describe("utf8ToMessageBigInt / bigIntToUtf8", () => {
  it("round-trips ASCII", () => {
    const m = utf8ToMessageBigInt("RSA");
    expect(bigIntToUtf8(m)).toBe("RSA");
  });

  it("round-trips com acentos", () => {
    const m = utf8ToMessageBigInt("Olá");
    expect(bigIntToUtf8(m)).toBe("Olá");
  });

  it("rejeita vazio", () => {
    expect(() => utf8ToMessageBigInt("   ")).toThrow(RangeError);
  });
});
