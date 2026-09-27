import { SKIN_COMPLEXIONS, SKIN_TEXTURES } from "@/lib/filmmaker-compiler";

export function extractSkinTone(value = ""): string {
  const trimmed = value.trim();
  if (!trimmed) return SKIN_COMPLEXIONS[0].label;
  const lower = trimmed.toLowerCase();
  return (
    SKIN_COMPLEXIONS.find((item) => {
      const itemLower = item.label.toLowerCase();
      const idLower = item.id.toLowerCase();
      return (
        lower.includes(itemLower) ||
        itemLower.includes(lower) ||
        lower.includes(idLower)
      );
    })?.label ?? SKIN_COMPLEXIONS[0].label
  );
}

export function extractSkinCondition(value = ""): string {
  const trimmed = value.trim();
  if (!trimmed) return SKIN_TEXTURES[0].desc;
  const lower = trimmed.toLowerCase();
  return (
    SKIN_TEXTURES.find((item) => {
      const descLower = item.desc.toLowerCase();
      const labelLower = item.label.toLowerCase();
      const idLower = item.id.toLowerCase();
      return (
        lower.includes(descLower) ||
        descLower.includes(lower) ||
        lower.includes(labelLower) ||
        lower.includes(idLower)
      );
    })?.desc ?? SKIN_TEXTURES[0].desc
  );
}

export function combineSkin(tone: string, condition: string): string {
  return `${tone} complexion, ${condition}`;
}

export function textureForCondition(conditionId: string): string {
  if (conditionId === "cond_sweaty_heated" || conditionId === "cond_disheveled_wild") {
    return SKIN_TEXTURES.find((item) => item.id === "sweat_grease")?.desc ?? SKIN_TEXTURES[0]?.desc ?? "";
  }
  if (conditionId === "cond_exhausted_strained") {
    return SKIN_TEXTURES.find((item) => item.id === "pores_morning")?.desc ?? SKIN_TEXTURES[0]?.desc ?? "";
  }
  return SKIN_TEXTURES.find((item) => item.id === "natural_matte")?.desc ?? SKIN_TEXTURES[0]?.desc ?? "";
}
