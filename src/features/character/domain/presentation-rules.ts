import type { Lifestyle } from "./lifestyle-rules";

export const CLOTHING_CONDITIONS = [
  { id: "old", label: "Old" },
  { id: "new", label: "New" },
  { id: "damaged", label: "Damaged" },
] as const;

export const GROOMING_LEVELS = [
  { id: "simple", label: "Simple" },
  { id: "regular", label: "Regular" },
  { id: "professional", label: "Professional" },
] as const;

export const PRESENTATION_LEVELS = [
  { id: "weathered", label: "Weathered" },
  { id: "everyday", label: "Everyday" },
  { id: "polished", label: "Polished" },
] as const;

export type ClothingCondition = (typeof CLOTHING_CONDITIONS)[number]["id"];
export type GroomingLevel = (typeof GROOMING_LEVELS)[number]["id"];
export type PresentationLevel = (typeof PRESENTATION_LEVELS)[number]["id"];

interface PresentationRules {
  clothing: readonly ClothingCondition[];
  grooming: readonly GroomingLevel[];
  presentation: readonly PresentationLevel[];
  groomingStyleIds: readonly string[] | "all";
  conditionIds: readonly string[];
}

const RULES: Record<Lifestyle, PresentationRules> = {
  poor: {
    clothing: ["old", "damaged"],
    grooming: ["simple"],
    presentation: ["weathered", "everyday"],
    groomingStyleIds: ["fem_nomakeup_glow", "male_heavy_stubble", "male_tousled_scruff", "male_weathered_rugged"],
    conditionIds: ["cond_fresh_radiant", "cond_sweaty_heated", "cond_exhausted_strained", "cond_disheveled_wild"],
  },
  middle_class: {
    clothing: ["old", "new"],
    grooming: ["simple", "regular"],
    presentation: ["everyday", "polished"],
    groomingStyleIds: ["fem_nomakeup_glow", "fem_sunkissed_bronzed", "fem_smokey_kohl", "male_heavy_stubble", "male_clean_shaven", "male_short_boxed_beard", "male_tousled_scruff"],
    conditionIds: ["cond_fresh_radiant", "cond_sweaty_heated", "cond_exhausted_strained", "cond_disheveled_wild"],
  },
  rich: {
    clothing: ["new"],
    grooming: ["regular", "professional"],
    presentation: ["polished"],
    groomingStyleIds: "all",
    conditionIds: ["cond_fresh_radiant", "cond_exhausted_strained", "cond_pristine_composed"],
  },
};

export function getPresentationRules(lifestyle: Lifestyle): PresentationRules {
  return RULES[lifestyle];
}

export function getPresentationDefaults(lifestyle: Lifestyle): {
  clothingCondition: ClothingCondition;
  groomingLevel: GroomingLevel;
  presentationLevel: PresentationLevel;
} {
  const rules = RULES[lifestyle];
  return {
    clothingCondition: rules.clothing[0],
    groomingLevel: rules.grooming[0],
    presentationLevel: rules.presentation[0],
  };
}

export function pickPresentationForLifestyle(lifestyle: Lifestyle, random = Math.random) {
  const rules = RULES[lifestyle];
  const pick = <T,>(values: readonly T[]) => values[Math.floor(random() * values.length)];
  return {
    clothingCondition: pick(rules.clothing),
    groomingLevel: pick(rules.grooming),
    presentationLevel: pick(rules.presentation),
  };
}
