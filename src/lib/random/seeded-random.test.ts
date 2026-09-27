import { describe, expect, it } from "vitest";
import { createSeededRandom, pickSeeded } from "./seeded-random";

describe("Seeded random", () => {
  it("repeats the same sequence for the same seed", () => {
    const first = createSeededRandom("episode-12");
    const second = createSeededRandom("episode-12");
    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });

  it("selects a stable catalog item", () => {
    expect(pickSeeded(["a", "b", "c"], "morning-poor-male")).toBe(pickSeeded(["a", "b", "c"], "morning-poor-male"));
  });
});
