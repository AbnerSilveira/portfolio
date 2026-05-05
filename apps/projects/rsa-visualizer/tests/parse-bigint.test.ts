import { describe, expect, it } from "vitest";

import { parsePositiveBigInt } from "../src/lib/parse-bigint";

describe("parsePositiveBigInt", () => {
  it("accepts valid integers", () => {
    expect(parsePositiveBigInt("61")).toEqual({ ok: true, value: 61n });
    expect(parsePositiveBigInt("  53  ")).toEqual({ ok: true, value: 53n });
  });

  it("rejects invalid input", () => {
    expect(parsePositiveBigInt("").ok).toBe(false);
    expect(parsePositiveBigInt("abc").ok).toBe(false);
    expect(parsePositiveBigInt("1").ok).toBe(false);
  });
});
