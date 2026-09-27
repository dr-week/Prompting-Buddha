import type { CharacterConcept } from "../filmmaker-compiler";

export const AFFORDABILITY_ALLOCATION = {
  identity: 10,
  body: 12,
  hair: 10,
  grooming: 15,
  face: 12,
  skin: 16,
  wardrobe: 25,
} as const;

export type AffordabilityTier = "poor" | "middle_class" | "rich";

export const AFFORDABILITY_POINTS: Record<AffordabilityTier, number> = {
  poor: 35,
  middle_class: 65,
  rich: 100,
};

export function affordabilityProfile(character: CharacterConcept) {
  const tier = character.socioeconomicStatus || "middle_class";
  const points = AFFORDABILITY_POINTS[tier];
  const allowance = tier === "poor"
    ? "Limited resources: amateur or minimal makeup, basic grooming, repaired or reused clothing, low-cost fabrics, few accessories, and practical maintenance. Avoid luxury styling unless explicitly justified by story, inheritance, theft, employment, or a special event."
    : tier === "rich"
      ? "Maximum resources: premium clothing, professional grooming and makeup, tailored fit, high-quality materials, maintained skin and hair, curated accessories, and easy access to specialist services. Keep luxury specific and character-driven."
      : "Moderate resources: accessible branded or tailored pieces, occasional professional grooming, maintained clothing with practical compromises, and a limited but believable accessory budget.";
  return { tier, points, allowance };
}
