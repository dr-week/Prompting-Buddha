// Per-lifestyle allowed option sets.
// UI components call getXxxConstraints(lifestyle) instead of hard-coding checks.

import type { Lifestyle } from "./lifestyle-rules";

export interface CategoryConstraint {
  allowedIds: string[] | "all";      // specific IDs allowed, or "all"
  blockedConditions?: string[];      // e.g. "designer_finish" blocked for poor
  allowedConditions?: string[];      // e.g. "worn", "faded" default for poor
}

// ── Body type constraints per lifestyle ──────────────────────────────────────
export function getBodyConstraints(lifestyle: Lifestyle): CategoryConstraint {
  if (lifestyle === "poor") {
    return {
      allowedIds: [
        "body_very_thin", "body_skinny", "body_average", "body_soft",
        "body_fat", "body_physically_worn", "body_labor_built", "body_delicate",
        "body_fit", // accessible — just not idealized
        // female
        "fem_natural_soft", "fem_petite_fit",
        // male
        "male_natural_healthy",
      ],
      blockedConditions: [],
    };
  }
  if (lifestyle === "middle_class") {
    return {
      allowedIds: "all",
      blockedConditions: [],
    };
  }
  // rich
  return { allowedIds: "all" };
}

// ── Grooming constraints ──────────────────────────────────────────────────────
export function getGroomingConstraints(lifestyle: Lifestyle): CategoryConstraint {
  if (lifestyle === "poor") {
    return {
      allowedIds: [
        "grooming_none", "grooming_minimal", "grooming_amateur", "grooming_basic",
        "male_tousled_scruff", "male_weathered_rugged", "male_heavy_stubble",
        "fem_nomakeup_glow", "fem_sunkissed_bronzed", "fem_postworkout_sweaty",
        "cond_disheveled_wild", "cond_exhausted_strained",
      ],
      blockedConditions: ["grooming_professional", "grooming_luxury_skincare", "grooming_editorial"],
    };
  }
  if (lifestyle === "middle_class") {
    return {
      allowedIds: "all",
      blockedConditions: ["grooming_luxury_skincare", "grooming_editorial"],
    };
  }
  return { allowedIds: "all" };
}

// ── Footwear constraints ──────────────────────────────────────────────────────
export function getFootwearConstraints(lifestyle: Lifestyle): CategoryConstraint {
  if (lifestyle === "poor") {
    return {
      allowedIds: [
        "footwear_worn_sandals", "footwear_cracked", "footwear_mismatched",
        "footwear_dusty", "footwear_repaired", "footwear_cheap_practical", "footwear_barefoot",
        // existing footwear IDs at basic tier
        "male_leather_sandals", "male_barefoot", "male_athletic_trainers",
        "fem_barefoot_anklet", "fem_court_sneakers",
      ],
      blockedConditions: ["footwear_formal", "footwear_premium_sneakers", "footwear_designer"],
    };
  }
  if (lifestyle === "middle_class") {
    return {
      allowedIds: "all",
      blockedConditions: ["footwear_designer"],
    };
  }
  return { allowedIds: "all" };
}

// ── Default outfit conditions per lifestyle ──────────────────────────────────
// Used by randomizer to pick a starting condition when none is set
export const DEFAULT_OUTFIT_CONDITIONS: Record<Lifestyle, string[]> = {
  poor: ["outfit_cond_worn", "outfit_cond_faded", "outfit_cond_reused", "outfit_cond_second_hand", "outfit_cond_stained"],
  middle_class: ["outfit_cond_carefully_maintained", "outfit_cond_wrinkled", "outfit_cond_worn"],
  rich: ["outfit_cond_carefully_maintained", "outfit_cond_tailored", "outfit_cond_premium_fabric"],
};

export function getDefaultOutfitConditions(lifestyle: Lifestyle): string[] {
  return DEFAULT_OUTFIT_CONDITIONS[lifestyle];
}

// ── Is option accessible? (quick check for UI disable state) ─────────────────
export function isOptionAllowedForLifestyle(
  optionId: string,
  lifestyle: Lifestyle,
  constraints: CategoryConstraint
): boolean {
  if (constraints.allowedIds === "all") return true;
  return (constraints.allowedIds as string[]).includes(optionId);
}
