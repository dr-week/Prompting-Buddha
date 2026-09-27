import { describe, expect, it } from "vitest";
import { validatePropAsset } from "./prop-rules";

describe("Props domain", () => {
  it("keeps places in Environment instead of Props", () => {
    expect(validatePropAsset({ name: "Old house", scope: "scene" })).toContain("Places belong to Environment, not Props.");
    expect(validatePropAsset({ name: "Bicycle", scope: "scene" })).toEqual([]);
  });

  it("requires an owner for character-owned props", () => {
    expect(validatePropAsset({ name: "Phone", scope: "character" })).toContain("Choose the character who owns this prop.");
    expect(validatePropAsset({ name: "Phone", scope: "character", ownerCharacterId: "char-1" })).toEqual([]);
  });
});
