import { Sparkles } from "lucide-react";
import { CategoryCard } from "./category-card";
import {
  MAKEUP_OPTIONS_FEMALE,
  GROOMING_OPTIONS_MALE,
  PERSON_CONDITIONS,
  type GroomingOption,
  type ConditionOption,
} from "../data";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";
import { characterOptionLabel } from "../display-labels";
import { GROOMING_LEVELS, getPresentationRules, type GroomingLevel } from "../domain/presentation-rules";

export function MakeupConditionSection({
  character,
  gender,
  onGroomingChange,
  onGroomingLevelChange,
  onConditionChange,
  onRollGrooming,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  gender: "male" | "female";
  onGroomingChange: (grooming: GroomingOption) => void;
  onGroomingLevelChange: (level: GroomingLevel) => void;
  onConditionChange: (condition: ConditionOption) => void;
  onRollGrooming: () => void;
  defaultCollapsed?: boolean;
}) {
  const lifestyleRules = getPresentationRules(character.socioeconomicStatus || "middle_class");
  const allGrooming = gender === "female" ? MAKEUP_OPTIONS_FEMALE : GROOMING_OPTIONS_MALE;
  const groomingList = lifestyleRules.groomingStyleIds === "all"
    ? allGrooming
    : allGrooming.filter((item) => lifestyleRules.groomingStyleIds.includes(item.id));
  const conditions = PERSON_CONDITIONS.filter((item) => lifestyleRules.conditionIds.includes(item.id));
  const careLevels = GROOMING_LEVELS.filter((item) => lifestyleRules.grooming.includes(item.id));

  return (
    <CategoryCard
      lockKey="grooming"
      title="Grooming"
      icon={Sparkles}
      iconColor="#ec4899"
      iconBg="rgba(236, 72, 153, 0.08)"
      onRoll={onRollGrooming}
      rollTitle="Random grooming"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        <div className="cat-field-row">
          <span className="cat-label">Care</span>
          <select className="cat-select" value={character.groomingLevel || "regular"} onChange={(event) => onGroomingLevelChange(event.target.value as GroomingLevel)}>
            {careLevels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="cat-field-row">
          <span className="cat-label">{gender === "female" ? "Makeup" : "Beard"}</span>
          <select
            className="cat-select"
            value={
              groomingList.find((g) => g.desc === character.makeupStyle)?.id ||
              groomingList[0].id
            }
            onChange={(e) => {
              const found = groomingList.find((g) => g.id === e.target.value);
              if (found) onGroomingChange(found);
            }}
          >
            {groomingList.map((g) => (
              <option key={g.id} value={g.id}>
                {characterOptionLabel(g.id, g.label)}
              </option>
            ))}
          </select>
        </div>

        <div className="cat-field-row">
          <span className="cat-label">Condition</span>
          <select
            className="cat-select"
            value={
              conditions.find((c) => c.desc === character.personCondition)?.id ||
              conditions[0].id
            }
            onChange={(e) => {
              const found = conditions.find((c) => c.id === e.target.value);
              if (found) onConditionChange(found);
            }}
          >
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {characterOptionLabel(c.id, c.label)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </CategoryCard>
  );
}
