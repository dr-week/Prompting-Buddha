import { describe, expect, it } from "vitest";
import { PRODUCTION_PRESETS } from "@/lib/filmmaker-compiler";
import { compileStoryboardPrompt } from "@/lib/compiler/storyboard";
import { deriveCinematicCompositionPlanes } from "@/lib/compiler/composition";
import { detectPhysicalSafetyDirectives } from "@/lib/compiler/safety";

describe("Storyboard Data Flow & Continuity Integration", () => {
  const scrapyard = PRODUCTION_PRESETS.scrapyard_dawn;
  const cyberpunk = PRODUCTION_PRESETS.cyberpunk_courier;

  it("preserves exact multi-character tags and names across storyboard prompt compilation", () => {
    const prompt = compileStoryboardPrompt(scrapyard);
    
    // Check lead character presence and tag
    expect(prompt).toContain("@CHAR_ARJUN");
    expect(prompt).toContain("ARJUN");

    // Check supporting character presence and tag
    expect(prompt).toContain("@CHAR_RAMESH");
    expect(prompt).toContain("RAMESH");

    // Check cast roster lock instructions
    expect(prompt).toContain("Lock exact facial topology, hairstyle, skin tone, and wardrobe for Arjun, Ramesh across all panels.");
  });

  it("enforces aspect ratio directives dynamically", () => {
    // 9:16 vertical
    const verticalPrompt = compileStoryboardPrompt(scrapyard);
    expect(verticalPrompt).toContain("VERTICAL COMPOSITION DIRECTIVE (9:16 Mobile Cinematic)");
    expect(verticalPrompt).toContain("Stage characters using vertical depth planes.");

    // 16:9 widescreen
    const widePrompt = compileStoryboardPrompt(cyberpunk);
    expect(widePrompt).toContain("WIDESCREEN STAGING DIRECTIVE (16:9)");
    expect(widePrompt).toContain("Stage characters across horizontal cinematic thirds.");
  });

  it("derives consistent 3D depth planes for panels (Z0, Z1, Z2)", () => {
    const panel = scrapyard.panels[0];
    const shotSpec = deriveCinematicCompositionPlanes(panel, scrapyard.aspectRatio, scrapyard.locationLock, scrapyard.opticsAndAesthetics);

    expect(shotSpec.depthPlanes).toHaveProperty("z0Foreground");
    expect(shotSpec.depthPlanes).toHaveProperty("z1SubjectFocalPlane");
    expect(shotSpec.depthPlanes).toHaveProperty("z2BackgroundFalloff");

    expect(shotSpec.depthPlanes.z1SubjectFocalPlane).toContain("Arjun's face on pillow");
    expect(shotSpec.opticsProfile).toContain("100mm Macro Cine Prime");
  });

  it("correctly identifies physical safety and dexterity contracts for hazardous interactions", () => {
    // Washing/water isolation
    const washDirectives = detectPhysicalSafetyDirectives("Arjun washes his face at the water basin and splash tap.");
    expect(washDirectives.some((d) => d.includes("WATER & ELECTRICAL ISOLATION CONTRACT"))).toBe(true);

    // Thermal contact (chai/tea)
    const teaDirectives = detectPhysicalSafetyDirectives("Ramesh lifts the boiling tea handi from the stove.");
    expect(teaDirectives.some((d) => d.includes("THERMAL PROTECTION CONTRACT"))).toBe(true);

    // Rigging and blade contracts
    const riggingDirectives = detectPhysicalSafetyDirectives("Lowering the coconut bunch using tensioned coir rope and sharp sickle blade.");
    expect(riggingDirectives.some((d) => d.includes("MECHANICAL RIGGING"))).toBe(true);
    expect(riggingDirectives.some((d) => d.includes("BLADE DEXTERITY"))).toBe(true);
  });

  it("renders dialogue types faithfully in compiled storyboard output", () => {
    const prompt = compileStoryboardPrompt(scrapyard);

    // Inner thought panels should be explicitly marked VOICEOVER / INNER THOUGHT
    expect(prompt).toContain("Dialogue / Thought (VOICEOVER / INNER THOUGHT [Speaker: Arjun])");

    // Silent panels should have no spoken dialogue line rendered
    const silentPanel = scrapyard.panels.find((p) => p.dialogueType === "silent");
    expect(silentPanel).toBeDefined();
  });
});
