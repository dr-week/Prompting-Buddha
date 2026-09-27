import { describe, expect, it } from "vitest";
import {
  extractSkinTone,
  extractSkinCondition,
  combineSkin,
  textureForCondition,
} from "./skin-utils";
import { SKIN_COMPLEXIONS, SKIN_TEXTURES } from "@/lib/filmmaker-compiler";

describe("skin-utils domain module", () => {
  it("extracts known skin tone or defaults to first complexion", () => {
    expect(extractSkinTone("Warm Brown")).toBe("Warm Brown / Wheatish");
    expect(extractSkinTone("olive")).toBe("Mediterranean / Olive");
    expect(extractSkinTone("")).toBe(SKIN_COMPLEXIONS[0].label);
    expect(extractSkinTone("unrecognized alien tone")).toBe(SKIN_COMPLEXIONS[0].label);
  });

  it("extracts known skin condition or defaults to first texture", () => {
    const firstDesc = SKIN_TEXTURES[0].desc;
    expect(extractSkinCondition("")).toBe(firstDesc);
    expect(extractSkinCondition(SKIN_TEXTURES[1].desc)).toBe(SKIN_TEXTURES[1].desc);
  });

  it("combines tone and condition into standard prompt format", () => {
    const combined = combineSkin("Deep Bronze", "Natural matte finish");
    expect(combined).toBe("Deep Bronze complexion, Natural matte finish");
  });

  it("maps conditions to correct physical texture descriptors with safe fallbacks", () => {
    const sweatTexture = textureForCondition("cond_sweaty_heated");
    expect(sweatTexture.length).toBeGreaterThan(0);

    const disheveledTexture = textureForCondition("cond_disheveled_wild");
    expect(disheveledTexture).toBe(sweatTexture);

    const exhaustedTexture = textureForCondition("cond_exhausted_strained");
    expect(exhaustedTexture).toBeDefined();
    expect(exhaustedTexture.length).toBeGreaterThan(0);

    const fallbackTexture = textureForCondition("unknown_custom_condition");
    expect(fallbackTexture).toContain("matte");
  });
});
