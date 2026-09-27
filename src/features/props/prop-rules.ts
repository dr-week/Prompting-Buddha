import type { PropAsset } from "./types";

const ENVIRONMENT_TERMS = /\b(house|home|room|street|road|building|landscape|forest|beach|market|school|office|scrapyard)\b/i;

export function validatePropAsset(asset: Pick<PropAsset, "name" | "scope" | "ownerCharacterId">) {
  const issues: string[] = [];
  if (!asset.name.trim()) issues.push("Add a prop name.");
  if (ENVIRONMENT_TERMS.test(asset.name)) issues.push("Places belong to Environment, not Props.");
  if (asset.scope === "character" && !asset.ownerCharacterId) issues.push("Choose the character who owns this prop.");
  return issues;
}
