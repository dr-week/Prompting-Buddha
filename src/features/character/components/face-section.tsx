import { Eye } from "lucide-react";
import { CategoryCard } from "./category-card";
import { characterOptionLabel } from "../display-labels";
import {
  EYE_COLORS,
  FACIAL_STRUCTURE_OPTIONS,
  type CharacterConcept,
} from "@/lib/filmmaker-compiler";

export function FaceSection({
  character,
  onEyeColorChange,
  onFacialStructureChange,
  onRollEyesAndFace,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  onEyeColorChange: (colorLabel: string) => void;
  onFacialStructureChange: (topology: string) => void;
  onRollEyesAndFace: () => void;
  defaultCollapsed?: boolean;
}) {
  return (
    <CategoryCard
      lockKey="face"
      title="Face"
      icon={Eye}
      iconColor="#0ea5e9"
      iconBg="rgba(14, 165, 233, 0.08)"
      onRoll={onRollEyesAndFace}
      rollTitle="Random face"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        <div className="cat-field-row">
          <span className="cat-label">Eyes</span>
          <select
            className="cat-select"
            value={character.eyeColor || EYE_COLORS[0].label}
            onChange={(e) => onEyeColorChange(e.target.value)}
          >
            {EYE_COLORS.map((c) => (
              <option key={c.label} value={c.label}>
                {characterOptionLabel(c.id, c.label)}
              </option>
            ))}
          </select>
        </div>

        <div className="cat-field-row">
          <span className="cat-label">Shape</span>
          <select
            className="cat-select"
            value={
              FACIAL_STRUCTURE_OPTIONS.find((f) => character.facialTopology === f.desc)?.id ||
              FACIAL_STRUCTURE_OPTIONS[0].id
            }
            onChange={(e) => {
              const opt = FACIAL_STRUCTURE_OPTIONS.find((f) => f.id === e.target.value);
              if (opt) onFacialStructureChange(opt.desc);
            }}
          >
            {FACIAL_STRUCTURE_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {characterOptionLabel(f.id, f.label)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </CategoryCard>
  );
}
