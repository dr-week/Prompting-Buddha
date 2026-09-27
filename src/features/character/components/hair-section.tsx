import { Scissors } from "lucide-react";
import { CategoryCard } from "./category-card";
import { characterOptionLabel } from "../display-labels";
import {
  HAIR_STYLES_FEMALE,
  HAIR_STYLES_MALE,
  HAIR_COLORS,
  type CharacterConcept,
} from "@/lib/filmmaker-compiler";

export function HairSection({
  character,
  gender,
  onHairStyleChange,
  onHairColorChange,
  onRollHair,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  gender: "male" | "female";
  onHairStyleChange: (styleLabel: string) => void;
  onHairColorChange: (colorLabel: string) => void;
  onRollHair: () => void;
  defaultCollapsed?: boolean;
}) {
  const styles = gender === "female" ? HAIR_STYLES_FEMALE : HAIR_STYLES_MALE;

  return (
    <CategoryCard
      lockKey="hair"
      title="Hair"
      icon={Scissors}
      iconColor="#8b5cf6"
      iconBg="rgba(139, 92, 246, 0.08)"
      onRoll={onRollHair}
      rollTitle="Random hair"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        <div className="cat-field-row">
          <span className="cat-label">Style</span>
          <select
            className="cat-select"
            value={character.hairStyle || styles[0].label}
            onChange={(e) => onHairStyleChange(e.target.value)}
          >
            {styles.map((s) => (
              <option key={s.label} value={s.label}>
                {characterOptionLabel(s.id, s.label)}
              </option>
            ))}
          </select>
        </div>

        <div className="cat-field-row">
          <span className="cat-label">Color</span>
          <select
            className="cat-select"
            value={character.hairColor || HAIR_COLORS[0].label}
            onChange={(e) => onHairColorChange(e.target.value)}
          >
            {HAIR_COLORS.map((c) => (
              <option key={c.label} value={c.label}>
                {characterOptionLabel(c.id, c.label)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </CategoryCard>
  );
}
