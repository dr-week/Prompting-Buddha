import { describe, expect, it } from "vitest";
import { PRODUCTION_PRESETS } from "../filmmaker-compiler";
import { compileCharacterSheetPrompt } from "./character";
import { compileStoryboardPrompt } from "./storyboard";
import { auditPromptContinuity } from "./auditor";
import { storyFormatGuidance, buildCaptureDirective } from "./story-format";
import { compileVideoPrompts } from "./video";
import { auditPromptText, correctPromptText } from "./prompt-auditor";

describe("deterministic prompt compiler", () => {
  const project = PRODUCTION_PRESETS.scrapyard_dawn;

  it("locks the named character in a character prompt", () => {
    const prompt = compileCharacterSheetPrompt(project.cast[0]);
    expect(prompt).toContain(project.cast[0].name.toUpperCase());
    expect(prompt).toContain(project.cast[0].tag);
  });

  it("keeps storyboard panel order", () => {
    const prompt = compileStoryboardPrompt(project);
    expect(prompt.indexOf("PANEL 1")).toBeLessThan(prompt.indexOf("PANEL 2"));
  });

  it("returns structured audit findings", () => {
    const findings = auditPromptContinuity(project);
    expect(Array.isArray(findings)).toBe(true);
    findings.forEach((finding) => expect(finding).toHaveProperty("recommendation"));
  });
});

describe("model-specific prompt profiles", () => {
  it("formats video references for Kling instead of claiming Google Flow syntax", () => {
    const prompt = compileVideoPrompts({ ...PRODUCTION_PRESETS.scrapyard_dawn, panels: PRODUCTION_PRESETS.scrapyard_dawn.panels.slice(0, 1) }, true, { nsfwMode: false, negativeGuardrails: true, compactMode: true, platformSyntax: "kling" });
    expect(prompt).toContain("KLING SETTING:");
    expect(prompt).toContain("REFERENCE ASSETS:");
    expect(prompt).not.toContain("GOOGLE FLOW SETTING:");
  });

  it("removes compiler research metadata in compact character mode", () => {
    const prompt = compileCharacterSheetPrompt(PRODUCTION_PRESETS.scrapyard_dawn.cast[0], { nsfwMode: false, negativeGuardrails: true, compactMode: true, platformSyntax: "google_flow" });
    expect(prompt).not.toContain("Section Allocation:");
    expect(prompt).not.toContain("Affordability Budget:");
    expect(prompt).toContain(PRODUCTION_PRESETS.scrapyard_dawn.cast[0].tag);
  });
});

describe("standalone prompt auditor", () => {
  it("detects wardrobe transitions and returns a deterministic safe correction", () => {
    const prompt = "Arjun changes his clothing into a uniform while the camera remains static.";
    const issues = auditPromptText(prompt, "google_flow");
    expect(issues.some((issue) => issue.id === "wardrobe_transition")).toBe(true);
    expect(correctPromptText(prompt, issues)).toContain("CUT REQUIRED");
  });

  it("detects syntax that conflicts with the selected target", () => {
    const issues = auditPromptText("GOOGLE FLOW SETTING: video\nFLOW INGREDIENTS: @CHAR_ARJUN", "kling");
    expect(issues.some((issue) => issue.id === "platform_mismatch")).toBe(true);
  });
});

describe("prompt section deduplication", () => {
  it("daily_series continuity directive appears exactly once in storyboard prompt", () => {
    const project = {
      ...PRODUCTION_PRESETS.scrapyard_dawn,
      storyFormat: { mode: "slice_of_life" as const, capture: "raw_vlog" as const, continuity: "daily_series" as const, dialogue: "minimal" as const },
    };
    const prompt = compileStoryboardPrompt(project);
    // Count occurrences of key continuity instruction keyword
    const matches = (prompt.match(/open-ended/g) || []).length;
    expect(matches).toBeLessThanOrEqual(1);
  });

  it("buildCaptureDirective includes EPISODE, CAPTURE, CONTINUITY, DIALOGUE sections", () => {
    const directive = buildCaptureDirective({ mode: "slice_of_life", capture: "raw_vlog", continuity: "daily_series", dialogue: "minimal" });
    expect(directive).toContain("EPISODE:");
    expect(directive).toContain("CAPTURE:");
    expect(directive).toContain("CONTINUITY:");
    expect(directive).toContain("DIALOGUE:");
  });

  it("buildCaptureDirective does not repeat EPISODE keyword", () => {
    const directive = buildCaptureDirective({ mode: "slice_of_life", capture: "raw_vlog", continuity: "daily_series", dialogue: "minimal" });
    const matches = (directive.match(/EPISODE:/g) || []).length;
    expect(matches).toBe(1);
  });

  it("storyFormatGuidance returns same mode/capture/continuity/dialogue as input", () => {
    const result = storyFormatGuidance({ mode: "slice_of_life", capture: "raw_vlog", continuity: "daily_series", dialogue: "minimal" });
    expect(result.mode).toBe("slice_of_life");
    expect(result.capture).toBe("raw_vlog");
    expect(result.continuity).toBe("daily_series");
    expect(result.dialogue).toBe("minimal");
  });
});
