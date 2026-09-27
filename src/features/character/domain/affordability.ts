// Central point-cost table. All trait costs are declared here — nowhere else.
// UI components call canAfford() / calculateBudgetUsage() from character-eligibility.ts.

import type { Lifestyle } from "./lifestyle-rules";
import { LIFESTYLE_BUDGETS } from "./lifestyle-rules";

// ── Trait cost table ─────────────────────────────────────────────────────────
// Categories: body, grooming, outfit, footwear, accessory
export const TRAIT_COSTS: Record<string, number> = {
  // Body
  body_very_thin: 0,
  body_skinny: 0,
  body_soft: 0,
  body_average: 0,
  body_fat: 0,
  body_physically_worn: 0,
  body_labor_built: 3,
  body_delicate: 3,
  body_natural: 3,
  body_curvy: 5,
  body_fit: 8,
  body_athletic: 10,
  body_muscular: 15,
  body_hourglass: 10,

  // Outfit condition
  outfit_cond_worn: 3,
  outfit_cond_faded: 3,
  outfit_cond_stained: 2,
  outfit_cond_torn: 2,
  outfit_cond_patched: 2,
  outfit_cond_mismatched_buttons: 2,
  outfit_cond_missing_button: 2,
  outfit_cond_loose_fit: 2,
  outfit_cond_poor_fit: 2,
  outfit_cond_uneven_stitching: 2,
  outfit_cond_wrinkled: 2,
  outfit_cond_improperly_worn: 2,
  outfit_cond_reused: 3,
  outfit_cond_second_hand: 3,
  outfit_cond_carefully_maintained: 5,
  outfit_cond_tailored: 25,
  outfit_cond_premium_fabric: 35,
  outfit_cond_designer_finish: 60,

  // Outfit type tiers
  outfit_basic: 8,
  outfit_casual: 10,
  outfit_street: 12,
  outfit_ethnic_basic: 10,
  outfit_sport: 10,
  outfit_business: 20,
  outfit_ethnic_premium: 30,
  outfit_evening: 40,
  outfit_premium: 45,
  outfit_designer: 70,

  // Footwear
  footwear_worn_sandals: 2,
  footwear_cracked: 2,
  footwear_mismatched: 2,
  footwear_dusty: 3,
  footwear_repaired: 3,
  footwear_cheap_practical: 5,
  footwear_clean_everyday: 8,
  footwear_ethnic_basic: 10,
  footwear_formal: 15,
  footwear_premium_sneakers: 20,
  footwear_designer: 30,
  footwear_barefoot: 0,

  // Grooming
  grooming_none: 0,
  grooming_minimal: 2,
  grooming_amateur: 3,
  grooming_basic: 5,
  grooming_natural_glow: 6,
  grooming_normal: 8,
  grooming_professional: 15,
  grooming_luxury_skincare: 20,
  grooming_editorial: 25,

  // Accessories
  accessory_none: 0,
  accessory_basic: 5,
  accessory_mid: 12,
  accessory_luxury: 25,
  accessory_ultra_luxury: 40,
};

// ── Lifestyle min-budget requirements for premium traits ─────────────────────
// A trait requiring middle_class costs nothing extra — but poor cannot pick it
// without a story override.
export const TRAIT_MIN_LIFESTYLE: Record<string, Lifestyle> = {
  // Body
  body_athletic: "middle_class",
  body_muscular: "middle_class",
  body_hourglass: "middle_class",
  body_fit: "any" as unknown as Lifestyle, // available to all

  // Outfit conditions
  outfit_cond_tailored: "middle_class",
  outfit_cond_premium_fabric: "middle_class",
  outfit_cond_designer_finish: "rich",

  // Outfit tiers
  outfit_business: "middle_class",
  outfit_ethnic_premium: "middle_class",
  outfit_evening: "middle_class",
  outfit_premium: "rich",
  outfit_designer: "rich",

  // Footwear
  footwear_formal: "middle_class",
  footwear_premium_sneakers: "middle_class",
  footwear_designer: "rich",

  // Grooming
  grooming_professional: "middle_class",
  grooming_luxury_skincare: "rich",
  grooming_editorial: "rich",

  // Accessories
  accessory_luxury: "middle_class",
  accessory_ultra_luxury: "rich",
};

const LIFESTYLE_ORDER: Lifestyle[] = ["poor", "middle_class", "rich"];

function meetsLifestyleRequirement(
  required: Lifestyle | undefined,
  current: Lifestyle
): boolean {
  if (!required || required === ("any" as string)) return true;
  return LIFESTYLE_ORDER.indexOf(current) >= LIFESTYLE_ORDER.indexOf(required);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getTraitCost(traitId: string): number {
  return TRAIT_COSTS[traitId] ?? 0;
}

export interface AffordabilityCheck {
  allowed: boolean;
  cost: number;
  reason?: string;
  requiresOverride: boolean;
}

export function canAfford(
  lifestyle: Lifestyle,
  usedPoints: number,
  traitId: string,
  override = false
): AffordabilityCheck {
  const budget = LIFESTYLE_BUDGETS[lifestyle];
  const cost = TRAIT_COSTS[traitId] ?? 0;
  const minLifestyle = TRAIT_MIN_LIFESTYLE[traitId];
  const budgetOk = usedPoints + cost <= budget;
  const tierOk = meetsLifestyleRequirement(minLifestyle as Lifestyle, lifestyle);

  if (override) {
    return { allowed: true, cost, requiresOverride: true, reason: "Story override active" };
  }
  if (!tierOk) {
    return {
      allowed: false,
      cost,
      requiresOverride: true,
      reason: `Requires ${minLifestyle} lifestyle (current: ${lifestyle})`,
    };
  }
  if (!budgetOk) {
    return {
      allowed: false,
      cost,
      requiresOverride: false,
      reason: `Exceeds budget: ${usedPoints} + ${cost} > ${budget}`,
    };
  }
  return { allowed: true, cost, requiresOverride: false };
}

export interface BudgetBreakdown {
  used: number;
  remaining: number;
  budget: number;
  percentage: number;
  breakdown: Record<string, number>;
}

// Calculate total budget usage from selected trait IDs
export function calculateBudgetUsage(
  lifestyle: Lifestyle,
  selectedTraitIds: string[]
): BudgetBreakdown {
  const budget = LIFESTYLE_BUDGETS[lifestyle];
  const breakdown: Record<string, number> = {};
  let used = 0;
  for (const id of selectedTraitIds) {
    const cost = TRAIT_COSTS[id] ?? 0;
    if (cost > 0) {
      breakdown[id] = cost;
      used += cost;
    }
  }
  return {
    used,
    remaining: Math.max(0, budget - used),
    budget,
    percentage: Math.min(100, Math.round((used / budget) * 100)),
    breakdown,
  };
}

export function isTraitAllowedForLifestyle(
  traitId: string,
  lifestyle: Lifestyle
): boolean {
  const minLifestyle = TRAIT_MIN_LIFESTYLE[traitId] as Lifestyle | undefined;
  return meetsLifestyleRequirement(minLifestyle, lifestyle);
}
