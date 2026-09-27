import type { PlatformSyntax } from "./prompt-profile";
import type { PromptAuditIssue } from "./types";
import { predictLaya } from "@/lib/laya/client";
import { PROMPT_AUDIT_SCHEMA } from "@/lib/laya/schemas";

export function auditPromptText(prompt: string, platform: PlatformSyntax): PromptAuditIssue[] {
  const issues: PromptAuditIssue[] = [];
  const trimmed = prompt.trim();
  if (!trimmed) {
    return [
      {
        id: "empty_prompt",
        severity: "critical",
        title: "Prompt is empty",
        explanation: "There is no prompt to audit.",
        recommendation: "Paste or compile a prompt first.",
      },
    ];
  }
  if (/\b(change|changes|changing|transform|transforms|switch|switches)\b.{0,40}\b(clothes|clothing|outfit|uniform|wardrobe)\b/i.test(trimmed)) {
    issues.push({
      id: "wardrobe_transition",
      severity: "critical",
      title: "Wardrobe transition inside one generation",
      explanation: "A single generation is being asked to preserve identity while changing clothing.",
      recommendation: "Split the wardrobe states across an explicit editorial cut.",
    });
  }
  if (platform !== "google_flow" && /GOOGLE FLOW SETTING|FLOW INGREDIENTS:/i.test(trimmed)) {
    issues.push({
      id: "platform_mismatch",
      severity: "warning",
      title: "Target syntax mismatch",
      explanation: `The prompt contains Google Flow-specific syntax while the selected target is ${platform}.`,
      recommendation: "Recompile with the selected target profile.",
    });
  }
  const lines = trimmed.split("\n").map((line) => line.trim()).filter((line) => line.length > 20);
  const normalized = lines.map((line) => line.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
  if (new Set(normalized).size !== normalized.length) {
    issues.push({
      id: "duplicate_instruction",
      severity: "warning",
      title: "Repeated instruction",
      explanation: "The same long instruction appears more than once and can compete for model attention.",
      recommendation: "Keep one copy of each instruction.",
    });
  }
  if (/\b(the man|the woman|the boy|the girl|the character)\b/i.test(trimmed) && !/@CHAR_[A-Z0-9]+/.test(trimmed)) {
    issues.push({
      id: "generic_identity",
      severity: "warning",
      title: "Weak character anchor",
      explanation: "A generic character label is used without a stable character token.",
      recommendation: "Use the character's proper name and stable asset tag.",
    });
  }
  return issues;
}

/**
 * Enhanced prompt audit using Laya System 1 Decision Engine with fallback to sync heuristics.
 * Evaluates semantic wardrobe transitions, identity anchors, and duplicate attention conflicts.
 */
export async function auditPromptWithLaya(
  prompt: string,
  platform: PlatformSyntax
): Promise<PromptAuditIssue[]> {
  const syncIssues = auditPromptText(prompt, platform);
  if (syncIssues.some((issue) => issue.id === "empty_prompt")) {
    return syncIssues;
  }

  const layaResult = await predictLaya(prompt, PROMPT_AUDIT_SCHEMA);
  if (!layaResult) {
    return syncIssues;
  }

  const answers = layaResult.answers || layaResult;
  const layaIssues: PromptAuditIssue[] = [];

  const wardrobeNoul =
    typeof answers.wardrobe_transition?.noul === "number"
      ? answers.wardrobe_transition.noul
      : typeof answers.wardrobe_transition?.score === "number"
      ? answers.wardrobe_transition.score
      : undefined;

  if (wardrobeNoul !== undefined && wardrobeNoul > 0.65) {
    layaIssues.push({
      id: "wardrobe_transition",
      severity: "critical",
      title: "Wardrobe transition inside one generation",
      explanation: "A single generation is being asked to preserve identity while changing clothing.",
      recommendation: "Split the wardrobe states across an explicit editorial cut.",
    });
  }

  const genericIdentityNoul =
    typeof answers.generic_identity?.noul === "number"
      ? answers.generic_identity.noul
      : typeof answers.generic_identity?.score === "number"
      ? answers.generic_identity.score
      : undefined;

  if (genericIdentityNoul !== undefined && genericIdentityNoul > 0.70) {
    layaIssues.push({
      id: "generic_identity",
      severity: "warning",
      title: "Weak character anchor",
      explanation: "A generic character label is used without a stable character token.",
      recommendation: "Use the character's proper name and stable asset tag.",
    });
  }

  const attentionNoul =
    typeof answers.attention_competition?.noul === "number"
      ? answers.attention_competition.noul
      : typeof answers.attention_competition?.score === "number"
      ? answers.attention_competition.score
      : undefined;

  if (attentionNoul !== undefined && attentionNoul > 0.70) {
    layaIssues.push({
      id: "duplicate_instruction",
      severity: "warning",
      title: "Repeated instruction",
      explanation: "The same long instruction appears more than once and can compete for model attention.",
      recommendation: "Keep one copy of each instruction.",
    });
  }

  // Combine issues, preserving Laya decisions first, then deduplicating with sync heuristics
  const seenIds = new Set<string>();
  const mergedIssues: PromptAuditIssue[] = [];

  for (const issue of [...layaIssues, ...syncIssues]) {
    if (!seenIds.has(issue.id)) {
      seenIds.add(issue.id);
      mergedIssues.push(issue);
    }
  }

  return mergedIssues;
}

export function correctPromptText(prompt: string, issues: PromptAuditIssue[]) {
  const seen = new Set<string>();
  const deduplicated = prompt
    .split("\n")
    .filter((line) => {
      const key = line.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
      if (key.length <= 20 || !seen.has(key)) {
        if (key.length > 20) seen.add(key);
        return true;
      }
      return false;
    })
    .join("\n")
    .trim();

  if (!issues.some((issue) => issue.id === "wardrobe_transition")) return deduplicated;
  return `${deduplicated}\n\nCUT REQUIRED: Render each wardrobe state as a separate shot. Preserve the same identity within each shot; do not animate a clothing transformation.`;
}
