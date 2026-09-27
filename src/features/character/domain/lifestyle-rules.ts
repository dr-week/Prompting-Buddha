// Lifestyle: the first controlling category.
// Every character category derives its allowed options from this tier.

export type Lifestyle = "poor" | "middle_class" | "rich";

export const LIFESTYLE_BUDGETS: Record<Lifestyle, number> = {
  poor: 35,
  middle_class: 70,
  rich: 100,
};

export interface LifestyleRule {
  id: Lifestyle;
  label: string;
  budget: number;
  narrative: string;
  promptDirective: string;
}

export const LIFESTYLE_RULES: Record<Lifestyle, LifestyleRule> = {
  poor: {
    id: "poor",
    label: "Poor / limited resources",
    budget: 35,
    narrative:
      "Limited budget and access. Clothing is usually older, reused, faded, or repaired. Grooming is simple and self-maintained. Accessories are minimal.",
    promptDirective:
      "Do not add designer clothing, luxury accessories, premium footwear, or polished studio styling unless explicitly overridden with a story justification.",
  },
  middle_class: {
    id: "middle_class",
    label: "Middle class / moderate resources",
    budget: 70,
    narrative:
      "Medium budget. Mix of affordable, practical, clean, and moderately fashionable clothing. Some variety in footwear and accessories. Normal grooming and occasional makeup. Premium or luxury styling requires enough remaining points.",
    promptDirective:
      "Keep clothing practical, accessible, and character-specific. Occasional fashion is acceptable. Avoid exclusive luxury items unless budget permits.",
  },
  rich: {
    id: "rich",
    label: "Rich / high resources",
    budget: 100,
    narrative:
      "Maximum budget. Lavish, premium, tailored, designer, or high-quality clothing. Professional grooming and skincare. Broad access to body presentation and styling options. Luxury props and premium materials allowed.",
    promptDirective:
      "Show wealth through tailored fit, quality materials, precise grooming, maintained clothing, and curated accessories. Avoid generic luxury stereotypes.",
  },
};

export function getLifestyleConstraints(lifestyle: Lifestyle): LifestyleRule {
  return LIFESTYLE_RULES[lifestyle];
}

export function getLifestyleBudget(lifestyle: Lifestyle = "middle_class"): number {
  return LIFESTYLE_BUDGETS[lifestyle];
}
