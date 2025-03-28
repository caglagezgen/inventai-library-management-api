import { describe, expect, it } from "vitest";
import { sum } from "#utils/sum.js";

describe("sum function", () => {
  it("should add two positive numbers correctly", () => {
    const a = 5;
    const b = 10;
    const result = sum(a, b);
    expect(result).toBe(15);
  });
});