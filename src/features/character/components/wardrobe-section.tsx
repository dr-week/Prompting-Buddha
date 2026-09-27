import { useMemo } from "react";
import { Shirt } from "lucide-react";
import { CategoryCard } from "./category-card";
import {
  CLEAN_COLOR_PALETTES,
  type OutfitOption,
  type ColorPaletteOption,
  type FootwearOption,
  getContextualFootwear,
  getContextualOutfits,
} from "../data";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";
import { characterOptionLabel } from "../display-labels";
import { CLOTHING_CONDITIONS, getPresentationRules, type ClothingCondition } from "../domain/presentation-rules";

const OUTFIT_GROUP_LABELS: Record<OutfitOption["type"], string> = {
  daily_wear:    "Daily Wear",
  work_labour:   "Work & Labour",
  loungewear:    "Home & Rest",
  business_chic: "Office & Work",
  sexy_casual:   "Casual",
  ethnic_glam:   "Traditional / Festive",
  evening_glam:  "Evening",
  athletic:      "Sports",
  resort_summer: "Summer",
  street_rebel:  "Streetwear",
};

export function WardrobeSection({
  character,
  gender,
  onOutfitChange,
  onPaletteChange,
  onFootwearChange,
  onClothingConditionChange,
  onRollWardrobe,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  gender: "male" | "female";
  onOutfitChange: (outfit: OutfitOption) => void;
  onPaletteChange: (palette: ColorPaletteOption) => void;
  onFootwearChange: (footwear: FootwearOption) => void;
  onClothingConditionChange: (condition: ClothingCondition) => void;
  onRollWardrobe: () => void;
  defaultCollapsed?: boolean;
}) {
  const lifestyle = character.socioeconomicStatus || "middle_class";
  const culture = character.culturalContext || "india";
  const outfits = getContextualOutfits(gender, culture, lifestyle);
  const currentOutfit =
    outfits.find((o) => o.label === character.outfitType) || outfits[0];
  const currentPalette =
    CLEAN_COLOR_PALETTES.find((p) => p.label === character.clothingPalette) ||
    CLEAN_COLOR_PALETTES[0];
  const footwear = getContextualFootwear(gender, culture, lifestyle);
  const currentFootwear = footwear.find((item) => item.label === character.footwear) || footwear[0];
  const allowedConditions = getPresentationRules(lifestyle).clothing;
  const clothingConditions = CLOTHING_CONDITIONS.filter((item) => allowedConditions.includes(item.id));

  const groupedOutfits = useMemo(() => {
    const groups: Partial<Record<OutfitOption["type"], OutfitOption[]>> = {};
    for (const outfit of outfits) {
      const list = groups[outfit.type] ?? [];
      list.push(outfit);
      groups[outfit.type] = list;
    }
    return groups;
  }, [outfits]);

  return (
    <CategoryCard
      lockKey="wardrobe"
      title="Clothes"
      icon={Shirt}
      iconColor="#ec4899"
      iconBg="rgba(236, 72, 153, 0.08)"
      onRoll={onRollWardrobe}
      rollTitle="Random clothes"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        <div className="cat-field-row">
          <span className="cat-label">Outfit</span>
          <select
            className="cat-select"
            aria-label="Outfit"
            value={currentOutfit.id}
            onChange={(e) => {
              const found = outfits.find((o) => o.id === e.target.value);
              if (found) onOutfitChange(found);
            }}
          >
            {(Object.keys(groupedOutfits) as OutfitOption["type"][]).map((groupKey) => (
              <optgroup key={groupKey} label={OUTFIT_GROUP_LABELS[groupKey] || groupKey}>
                {groupedOutfits[groupKey]?.map((o) => (
                  <option key={o.id} value={o.id}>
                    {characterOptionLabel(o.id, o.label)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="cat-field-row">
          <div className="flex items-center justify-between">
            <span className="cat-label">Colors</span>
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300"
                style={{ background: currentPalette.hexPreview[0] }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300"
                style={{ background: currentPalette.hexPreview[1] }}
              />
            </div>
          </div>
          <select
            className="cat-select"
            value={currentPalette.id}
            onChange={(e) => {
              const found = CLEAN_COLOR_PALETTES.find((p) => p.id === e.target.value);
              if (found) onPaletteChange(found);
            }}
          >
            {CLEAN_COLOR_PALETTES.map((p) => (
              <option key={p.id} value={p.id}>
                {characterOptionLabel(p.id, p.label)}
              </option>
            ))}
          </select>
        </div>
        <div className="cat-field-row">
          <span className="cat-label">Condition</span>
          <select className="cat-select" value={character.clothingCondition || "old"} onChange={(event) => onClothingConditionChange(event.target.value as ClothingCondition)}>
            {clothingConditions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="cat-field-row">
          <span className="cat-label">Shoes</span>
          <select className="cat-select" aria-label="Shoes" value={currentFootwear.id} onChange={(event) => {
            const selected = footwear.find((item) => item.id === event.target.value);
            if (selected) onFootwearChange(selected);
          }}>
            {footwear.map((item) => <option key={item.id} value={item.id}>{characterOptionLabel(item.id, item.label)}</option>)}
          </select>
        </div>
      </div>
    </CategoryCard>
  );
}
