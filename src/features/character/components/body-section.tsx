import { Scale } from "lucide-react";
import { CategoryCard } from "./category-card";
import {
  BODY_TYPES_FEMALE,
  BODY_TYPES_MALE,
  type BodyTypeOption,
} from "../data";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";
import { characterOptionLabel } from "../display-labels";
import { SKIN_COMPLEXIONS } from "@/lib/filmmaker-compiler";
import { PRESENTATION_LEVELS, getPresentationRules, type PresentationLevel } from "../domain/presentation-rules";

export function BodySection({
  character,
  gender,
  onBodyBuildChange,
  onSkinToneChange,
  onPresentationChange,
  onRollBody,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  gender: "male" | "female";
  onBodyBuildChange: (option: BodyTypeOption) => void;
  onSkinToneChange: (tone: string) => void;
  onPresentationChange: (level: PresentationLevel) => void;
  onRollBody: () => void;
  defaultCollapsed?: boolean;
}) {
  const builds = gender === "female" ? BODY_TYPES_FEMALE : BODY_TYPES_MALE;
  const currentBuild = builds.find((b) => b.label === character.bodyType) || builds[0];
  const allowedLooks = getPresentationRules(character.socioeconomicStatus || "middle_class").presentation;
  const looks = PRESENTATION_LEVELS.filter((item) => allowedLooks.includes(item.id));

  return (
    <CategoryCard
      lockKey="body"
      title="Body"
      icon={Scale}
      iconColor="#10b981"
      iconBg="rgba(16, 185, 129, 0.08)"
      onRoll={onRollBody}
      rollTitle="Random body and skin tone"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        <div className="cat-field-row">
          <span className="cat-label">Body</span>
          <select
            className="cat-select"
            value={currentBuild.id}
            onChange={(e) => {
              const found = builds.find((b) => b.id === e.target.value);
              if (found) onBodyBuildChange(found);
            }}
          >
            {builds.map((b) => (
              <option key={b.id} value={b.id}>
                {characterOptionLabel(b.id, b.label)}
              </option>
            ))}
          </select>
        </div>
        <div className="cat-field-row">
          <span className="cat-label">Skin</span>
          <select
            className="cat-select"
            value={SKIN_COMPLEXIONS.find((item) => character.skinTexture?.includes(item.label))?.id || SKIN_COMPLEXIONS[0].id}
            onChange={(event) => {
              const selected = SKIN_COMPLEXIONS.find((item) => item.id === event.target.value);
              if (selected) onSkinToneChange(selected.label);
            }}
          >
            {SKIN_COMPLEXIONS.map((item) => <option key={item.id} value={item.id}>{characterOptionLabel(item.id, item.label)}</option>)}
          </select>
        </div>
        <div className="cat-field-row">
          <span className="cat-label">Look</span>
          <select className="cat-select" value={character.presentationLevel || "everyday"} onChange={(event) => onPresentationChange(event.target.value as PresentationLevel)}>
            {looks.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
      </div>
    </CategoryCard>
  );
}
