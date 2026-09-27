"use client";

import { AlertTriangle } from "lucide-react";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";

export interface ConflictWarning {
  field: "wardrobe" | "grooming" | "condition" | "identity" | "body";
  message: string;
}

const GLAM_GROOMING = ["full glam", "dramatic smoky", "bold lip"];
const DISHEVELED_CONDITIONS = ["disheveled", "exhausted", "sweaty"];
const HEAL_KEYWORDS = ["heel", "stiletto", "platform pump", "mule"];

export function detectConflicts(
  character: CharacterConcept,
  gender: "male" | "female"
): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  const lifestyle = character.socioeconomicStatus;
  const outfitType = (character.outfitType || "").toLowerCase();
  const condition = (character.personCondition || "").toLowerCase();
  const grooming = (character.makeupStyle || "").toLowerCase();
  const footwear = (character.footwear || "").toLowerCase();

  // Lifestyle vs outfit: poor + evening glam or business chic
  if (
    lifestyle === "poor" &&
    (outfitType.includes("evening") ||
      outfitType.includes("gala") ||
      outfitType.includes("business"))
  ) {
    warnings.push({
      field: "wardrobe",
      message: "Outfit may conflict with poor lifestyle",
    });
  }

  // Gender change leaves male + lipstick/mascara grooming
  if (gender === "male" && (grooming.includes("lipstick") || grooming.includes("mascara"))) {
    warnings.push({
      field: "grooming",
      message: "Grooming references feminine makeup after gender change",
    });
  }

  // Outfit athletic + heels
  if (outfitType.includes("athletic") || outfitType.includes("sport")) {
    if (HEAL_KEYWORDS.some((h) => footwear.includes(h))) {
      warnings.push({
        field: "wardrobe",
        message: "Athletic outfit + heels may conflict",
      });
    }
  }

  // Disheveled condition + full glam grooming
  if (
    DISHEVELED_CONDITIONS.some((d) => condition.includes(d)) &&
    GLAM_GROOMING.some((g) => grooming.includes(g))
  ) {
    warnings.push({
      field: "condition",
      message: "Heavy grooming contradicts disheveled condition",
    });
  }

  return warnings;
}

export function ConflictBadge({ warnings, field }: { warnings: ConflictWarning[]; field: ConflictWarning["field"] }) {
  const match = warnings.find((w) => w.field === field);
  if (!match) return null;
  return (
    <span className="conflict-badge" title={match.message} aria-label={match.message}>
      <AlertTriangle size={12} aria-hidden="true" />
    </span>
  );
}
