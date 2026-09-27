import type { Lifestyle } from "../domain/lifestyle-rules";

export interface LifestyleOption {
  id: Lifestyle;
  label: string;
  points: number;
  description: string;
  shortDesc: string;
}

export const LIFESTYLE_OPTIONS: LifestyleOption[] = [
  {
    id: "poor",
    label: "Poor",
    points: 35,
    shortDesc: "35 pts",
    description:
      "Limited budget. Worn, reused, or repaired clothing. Basic grooming. Few accessories. Practical footwear only.",
  },
  {
    id: "middle_class",
    label: "Middle class",
    points: 70,
    shortDesc: "70 pts",
    description:
      "Moderate budget. Mix of practical and fashionable clothing. Normal grooming. Some accessory variety.",
  },
  {
    id: "rich",
    label: "Rich",
    points: 100,
    shortDesc: "100 pts",
    description:
      "Full budget. Tailored, premium, or designer clothing. Professional grooming. Luxury accessories allowed.",
  },
];
