import { describe, expect, it } from "vitest";
import { randomDailyMoment, appendDailyScenes } from "./data/daily-moments";
import { PRODUCTION_PRESETS } from "@/lib/filmmaker-compiler";

const baseProject = PRODUCTION_PRESETS.scrapyard_dawn;

describe("Storyboard: daily moments", () => {
  it("random daily moment preserves cast", () => {
    const result = randomDailyMoment(baseProject);
    expect(result.cast).toEqual(baseProject.cast);
  });

  it("random daily moment preserves location", () => {
    const result = randomDailyMoment(baseProject);
    expect(result.locationLock).toEqual(baseProject.locationLock);
  });

  it("random daily moment has no forced conclusion in scene beat", () => {
    const result = randomDailyMoment(baseProject);
    const beat = result.sceneBeat.toLowerCase();
    // scene beat should mention "no final conclusion" or similar
    expect(beat).toContain("no final conclusion");
  });

  it("random daily moment sets daily_series continuity", () => {
    const result = randomDailyMoment(baseProject);
    expect(result.storyFormat?.continuity).toBe("daily_series");
  });

  it("random daily moment sets minimal dialogue", () => {
    const result = randomDailyMoment(baseProject);
    expect(result.storyFormat?.dialogue).toBe("minimal");
  });
});

describe("Storyboard: batch management", () => {
  it("generated scenes receive unique IDs", () => {
    const result = appendDailyScenes(baseProject, 4);
    const newPanels = result.panels.slice(baseProject.panels.length);
    const ids = newPanels.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("next batch does not overwrite old scenes", () => {
    const step1 = appendDailyScenes(baseProject, 3);
    const originalCount = step1.panels.length;
    const step2 = appendDailyScenes(step1, 3);
    // Original panels must still exist with same IDs
    for (let i = 0; i < originalCount; i++) {
      expect(step2.panels[i].id).toBe(step1.panels[i].id);
    }
    expect(step2.panels.length).toBe(originalCount + 3);
  });

  it("batch size 3 adds exactly 3 scenes", () => {
    const before = baseProject.panels.length;
    const result = appendDailyScenes(baseProject, 3);
    expect(result.panels.length).toBe(before + 3);
  });

  it("batch size 4 adds exactly 4 scenes", () => {
    const before = baseProject.panels.length;
    const result = appendDailyScenes(baseProject, 4);
    expect(result.panels.length).toBe(before + 4);
  });

  it("batch size 5 adds exactly 5 scenes", () => {
    const before = baseProject.panels.length;
    const result = appendDailyScenes(baseProject, 5);
    expect(result.panels.length).toBe(before + 5);
  });

  it("batch size 9 adds exactly 9 scenes", () => {
    const before = baseProject.panels.length;
    const result = appendDailyScenes(baseProject, 9);
    expect(result.panels.length).toBe(before + 9);
  });
});
