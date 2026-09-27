import { User, Dices } from "lucide-react";
import { CategoryCard } from "./category-card";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";

const ARCHETYPES = [
  "Protagonist",
  "Reluctant Hero",
  "Antagonist",
  "Mentor",
  "Confidant",
  "Rival",
  "Outsider",
  "Informant",
];

export function IdentitySection({
  character,
  gender,
  age,
  nameOrigin,
  onNameChange,
  onRollName,
  onNameOriginChange,
  onGenderChange,
  onAgeChange,
  onRoleChange,
  onLifestyleChange,
  onRollIdentity,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  gender: "male" | "female";
  age: number;
  nameOrigin: "all" | "non_indian" | "indian";
  onNameChange: (val: string) => void;
  onRollName: () => void;
  onNameOriginChange: (val: "all" | "non_indian" | "indian") => void;
  onGenderChange: (val: "male" | "female") => void;
  onAgeChange: (val: number) => void;
  onRoleChange: (val: string) => void;
  onLifestyleChange: (val: "poor" | "middle_class" | "rich") => void;
  onRollIdentity: () => void;
  defaultCollapsed?: boolean;
}) {
  return (
    <CategoryCard
      lockKey="identity"
      title="Identity"
      icon={User}
      iconColor="#2563eb"
      iconBg="rgba(37, 99, 235, 0.08)"
      onRoll={onRollIdentity}
      rollTitle="Random identity"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        {/* Name Input with inline dice and origin pills */}
        <div className="cat-field-row">
          <div className="flex items-center justify-between mb-1">
            <span className="cat-label">Culture</span>
            <div className="origin-filter-pills" role="group" aria-label="Culture">
              <button
                type="button"
                className={`origin-pill ${nameOrigin === "indian" ? "active" : ""}`}
                onClick={() => onNameOriginChange("indian")}
                title="Indian names"
              >
                India
              </button>
              <button
                type="button"
                className={`origin-pill ${nameOrigin === "non_indian" ? "active" : ""}`}
                onClick={() => onNameOriginChange("non_indian")}
                title="Western names"
              >
                Western
              </button>
            </div>
          </div>
          <div className="cat-input-with-button">
            <input
              type="text"
              className="cat-text-input"
              value={character.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Name"
            />
            <button
              type="button"
              className="cat-inline-roll"
              onClick={onRollName}
              title="Random name"
            >
              <Dices size={12} />
            </button>
          </div>
        </div>

        {/* Gender Icons + Age Slider */}
        <div className="cat-dual-fields">
          <div className="cat-field-col">
            <span className="cat-label">Gender</span>
            <div className="gender-toggle-group">
              <button
                type="button"
                className={`gender-btn ${gender === "female" ? "active" : ""}`}
                onClick={() => onGenderChange("female")}
                title="Female"
              >
                <span>Female</span>
              </button>
              <button
                type="button"
                className={`gender-btn ${gender === "male" ? "active" : ""}`}
                onClick={() => onGenderChange("male")}
                title="Male"
              >
                <span>Male</span>
              </button>
            </div>
          </div>

          <div className="cat-field-col">
            <div className="flex items-center justify-between">
              <span className="cat-label">Age</span>
              <span className="age-display-badge">{age}</span>
            </div>
            <input
              type="range"
              min={18}
              max={80}
              value={age}
              onChange={(e) => onAgeChange(parseInt(e.target.value, 10))}
              className="age-slider"
            />
          </div>
        </div>

        {/* Archetype / Role */}
        <div className="cat-field-row">
          <span className="cat-label">Role</span>
          <select
            className="cat-select"
            value={character.role || "Protagonist"}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            {ARCHETYPES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="cat-field-row">
          <span className="cat-label">Lifestyle</span>
          <select
            className="cat-select"
            aria-label="Lifestyle"
            value={character.socioeconomicStatus || "middle_class"}
            onChange={(event) => onLifestyleChange(event.target.value as "poor" | "middle_class" | "rich")}
          >
            <option value="poor">Poor</option>
            <option value="middle_class">Middle class</option>
            <option value="rich">Rich</option>
          </select>
        </div>
      </div>
    </CategoryCard>
  );
}
