import { describe, expect, it } from "vitest";

import { chunkBigIntLine } from "../src/lib/chunk-bigint-display";

describe("chunkBigIntLine", () => {
  it("returns one line when short", () => {
    expect(chunkBigIntLine("x = ", 123n, 10)).toEqual(["x = 123"]);
  });

  it("chunks long decimal string", () => {
    const v = 123456789012345678901234567890n;
    const lines = chunkBigIntLine("d = ", v, 12);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toContain("d = ");
    expect(lines.join("")).toContain("123456789012345678901234567890");
  });
});
