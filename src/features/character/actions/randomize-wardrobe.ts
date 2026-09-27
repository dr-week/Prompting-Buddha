import type { CharacterConcept } from "@/lib/filmmaker-compiler";
import { getContextualFootwear, getContextualOutfits, type ColorPaletteOption, type CulturalContext, type FootwearOption, type OutfitOption, type WardrobeMode } from "../data";
import type { Lifestyle } from "../domain/lifestyle-rules";

export interface WardrobeSelection {
  outfit: OutfitOption;
  footwear: FootwearOption;
}

export interface WardrobeContext {
  gender: "male" | "female";
  culture: CulturalContext;
  lifestyle: Lifestyle;
  mode?: WardrobeMode;
  strategy?: "first" | "random";
}

const choose = <T,>(items: T[], strategy: WardrobeContext["strategy"]): T =>
  strategy === "first" ? items[0] : items[Math.floor(Math.random() * items.length)];

export function resolveCulturalContext(character: CharacterConcept, origin: "all" | "non_indian" | "indian" = "indian"): CulturalContext {
  return character.culturalContext || (origin === "non_indian" ? "western" : "india");
}

export function selectContextualWardrobe({ gender, culture, lifestyle, mode = "normal", strategy = "random" }: WardrobeContext): WardrobeSelection {
  const outfits = getContextualOutfits(gender, culture, lifestyle, mode);
  const footwear = getContextualFootwear(gender, culture, lifestyle);
  if (!outfits.length || !footwear.length) throw new Error(`Missing wardrobe options for ${gender}/${culture}/${lifestyle}/${mode}.`);
  return { outfit: choose(outfits, strategy), footwear: choose(footwear, strategy) };
}

export function wardrobePatch(selection: WardrobeSelection, palette: ColorPaletteOption): Pick<CharacterConcept, "outfitType" | "clothingPalette" | "wardrobeFabric" | "footwear"> {
  return {
    outfitType: selection.outfit.label,
    clothingPalette: palette.label,
    wardrobeFabric: `${palette.colors}. ${selection.outfit.pieces} ${selection.outfit.fitDesc}`,
    footwear: selection.footwear.label,
  };
}

export function findContextualOutfit(character: CharacterConcept, gender: "male" | "female", origin: "all" | "non_indian" | "indian" = "indian") {
  const lifestyle = character.socioeconomicStatus || "middle_class";
  const culture = resolveCulturalContext(character, origin);
  const outfits = getContextualOutfits(gender, culture, lifestyle);
  return outfits.find((outfit) => outfit.label === character.outfitType) || outfits[0];
}
