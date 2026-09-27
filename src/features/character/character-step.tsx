"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, LockKeyhole } from "lucide-react";
import {
  HAIR_STYLES_FEMALE,
  HAIR_STYLES_MALE,
  HAIR_COLORS,
  EYE_COLORS,
  SKIN_COMPLEXIONS,
  FACIAL_STRUCTURE_OPTIONS,
  generateRealisticCharacterName,
  generateProceduralCharacter,
  compileCharacterSheetPrompt,
  type CharacterConcept,
  type ProductionContinuity,
} from "@/lib/filmmaker-compiler";

import {
  BODY_TYPES_FEMALE,
  BODY_TYPES_MALE,
  CLEAN_COLOR_PALETTES,
  MAKEUP_OPTIONS_FEMALE,
  GROOMING_OPTIONS_MALE,
  type CulturalContext,
} from "./data";

import { CharacterToolbar } from "./components/character-toolbar";
import { IdentitySection } from "./components/identity-section";
import { BodySection } from "./components/body-section";
import { HairSection } from "./components/hair-section";
import { MakeupConditionSection } from "./components/makeup-condition-section";
import { FaceSection } from "./components/face-section";
import { WardrobeSection } from "./components/wardrobe-section";
import { getConditions } from "./data/content-mode";
import { randomizeCharacter } from "./actions/randomize-character";
import { findContextualOutfit, resolveCulturalContext, selectContextualWardrobe, wardrobePatch } from "./actions/randomize-wardrobe";
import { CharacterLockProvider, type CharacterLockKey } from "./components/lock-context";
import { CharacterTagInput } from "./components/character-tag-input";
import { CharacterSummaryPanel, CharacterDrawerPanel } from "./components/character-summary-sidebar";
import { detectConflicts, ConflictBadge, type ConflictWarning } from "./components/character-conflict-badge";
import { getPresentationDefaults, getPresentationRules, pickPresentationForLifestyle } from "./domain/presentation-rules";
import { extractSkinTone as skinTone, extractSkinCondition as skinCondition, combineSkin, textureForCondition } from "./domain/skin-utils";

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

type Stage = "core" | "appearance" | "styling" | "review";

const STAGE_LABELS: Record<Stage, string> = {
  core: "Core",
  appearance: "Appearance",
  styling: "Styling",
  review: "Review",
};

const STAGE_LOCK_KEYS: Record<Stage, CharacterLockKey[]> = {
  core: ["identity"],
  appearance: ["body", "face", "hair"],
  styling: ["grooming", "wardrobe"],
  review: [],
};

export function CharacterStep({
  project,
  matureContent = false,
  onChange,
  onCompile,
  isOutputOpen = false,
  onNext,
  activeCharacterId,
  onActiveCharacterChange,
}: {
  project: ProductionContinuity;
  matureContent?: boolean;
  onChange: (project: ProductionContinuity) => void;
  onCompile: () => void;
  isOutputOpen?: boolean;
  onNext: () => void;
  activeCharacterId?: string;
  onActiveCharacterChange: (characterId: string) => void;
}) {
  const activeCastIdx = Math.max(0, project.cast.findIndex((item) => item.id === activeCharacterId));
  const character = project.cast[activeCastIdx] || project.cast[0];
  const locked = character.locks || {};

  const toggleLock = (key: CharacterLockKey) => {
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, locks: { ...character.locks, [key]: !character.locks?.[key] } };
    onChange({ ...project, cast: updatedCast });
  };

  const saveCharacter = () =>
    onChange({ ...project, savedCharacters: [...(project.savedCharacters || []).filter((item) => item.id !== character.id), structuredClone(character)] });

  const loadCharacter = (saved: CharacterConcept) =>
    onChange({ ...project, cast: project.cast.map((item, index) => index === activeCastIdx ? structuredClone(saved) : item) });

  const addCharacter = () => {
    if (project.cast.length >= 3) return;
    const next = generateProceduralCharacter({ role: "supporting", existingNames: project.cast.map((item) => item.name) });
    onChange({ ...project, cast: [...project.cast, next] });
    onActiveCharacterChange(next.id);
  };

  const duplicateCharacter = () => {
    if (project.cast.length >= 3) return;
    const duped: CharacterConcept = { ...structuredClone(character), id: `char-${Date.now()}`, name: `${character.name} (copy)`, tag: `@CHAR_${character.name.toUpperCase().replace(/[^A-Z0-9]/g, "")}2` };
    onChange({ ...project, cast: [...project.cast, duped] });
    onActiveCharacterChange(duped.id);
  };

  const removeCharacter = (idx: number) => {
    if (project.cast.length <= 1) return;
    const updatedCast = project.cast.filter((_, i) => i !== idx);
    onChange({ ...project, cast: updatedCast });
    onActiveCharacterChange(updatedCast[Math.max(0, idx - 1)].id);
  };

  const parsedAge = useMemo(() => {
    const match = character.ageGender?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 25;
  }, [character.ageGender]);

  const age = parsedAge;
  const [nameOrigin, setNameOrigin] = useState<"all" | "non_indian" | "indian">(() => character.culturalContext === "western" ? "non_indian" : "indian");
  const [activeStage, setActiveStage] = useState<Stage>("core");

  const gender: "male" | "female" = (
    character.ageGender?.toLowerCase().includes("woman") ||
      character.ageGender?.toLowerCase().includes("female")
      ? "female"
      : "male"
  );

  const conflicts = useMemo(() => detectConflicts(character, gender), [character, gender]);

  const updateCharacterField = (field: keyof CharacterConcept, value: string) => {
    const updatedCast = [...project.cast];
    const previousName = updatedCast[activeCastIdx]?.name;
    if (updatedCast[activeCastIdx]) {
      const updated = { ...updatedCast[activeCastIdx], [field]: value };
      if (field === "name") {
        const cleanName = value.split(" ")[0].trim() || "CHARACTER";
        updated.tag = `@CHAR_${cleanName.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
      }
      updatedCast[activeCastIdx] = updated;
    }
    const rename = (text: string) => field === "name" && previousName
      ? text.replace(new RegExp(`\\b${previousName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), value)
      : text;
    onChange({
      ...project,
      sceneBeat: rename(project.sceneBeat),
      panels: project.panels.map((panel) => ({ ...panel, action: rename(panel.action), charactersInFrame: panel.charactersInFrame.map(rename) })),
      cast: updatedCast,
      primaryCharacter:
        activeCastIdx === 0
          ? {
              ...project.primaryCharacter,
              name: updatedCast[0].name,
              tag: updatedCast[0].tag,
              description: `${updatedCast[0].facialTopology}. ${updatedCast[0].skinTexture}`,
              ethnicityAge: updatedCast[0].ageGender,
              expression: updatedCast[0].personalityVibe,
            }
          : project.primaryCharacter,
    });
  };

  const applyWardrobeContext = (lifestyle: "poor" | "middle_class" | "rich", culture: CulturalContext, patch: Partial<CharacterConcept> = {}) => {
    const updatedCast = [...project.cast];
    const next = { ...character, ...patch, socioeconomicStatus: lifestyle, culturalContext: culture };
    const presentation = getPresentationDefaults(lifestyle);
    if (!locked.wardrobe && !locked.footwear) {
      const palette = CLEAN_COLOR_PALETTES.find((item) => item.label === character.clothingPalette) || CLEAN_COLOR_PALETTES[0];
      Object.assign(next, wardrobePatch(selectContextualWardrobe({ gender, culture, lifestyle, strategy: "first" }), palette));
    }
    if (!locked.wardrobe) next.clothingCondition = presentation.clothingCondition;
    if (!locked.grooming) {
      const rules = getPresentationRules(lifestyle);
      const allGrooming = gender === "female" ? MAKEUP_OPTIONS_FEMALE : GROOMING_OPTIONS_MALE;
      const groomingOptions = rules.groomingStyleIds === "all" ? allGrooming : allGrooming.filter((item) => rules.groomingStyleIds.includes(item.id));
      const condition = getConditions(matureContent).find((item) => rules.conditionIds.includes(item.id));
      const grooming = groomingOptions[0];
      next.groomingLevel = presentation.groomingLevel;
      if (grooming) next.makeupStyle = grooming.desc;
      if (condition) {
        next.personCondition = condition.desc;
        if (!locked.skin) next.skinTexture = combineSkin(skinTone(character.skinTexture), textureForCondition(condition.id));
      }
    }
    if (!locked.body) next.presentationLevel = presentation.presentationLevel;
    updatedCast[activeCastIdx] = next;
    onChange({ ...project, cast: updatedCast });
  };

  const handleCultureChange = (origin: "all" | "non_indian" | "indian") => {
    setNameOrigin(origin);
    const culture: CulturalContext = origin === "non_indian" ? "western" : "india";
    applyWardrobeContext(character.socioeconomicStatus || "middle_class", culture);
  };

  const rollNameOnly = () => {
    const existing = project.cast.map((c) => c.name);
    const newName = generateRealisticCharacterName(gender, existing, nameOrigin);
    updateCharacterField("name", newName);
  };

  const rollIdentity = () => {
    const rolledGender: "male" | "female" = Math.random() > 0.5 ? "female" : "male";
    const rolledAge = Math.floor(Math.random() * 48) + 18;
    const existing = project.cast.map((c) => c.name);
    const newName = generateRealisticCharacterName(rolledGender, existing, nameOrigin);
    const builds = rolledGender === "female" ? BODY_TYPES_FEMALE : BODY_TYPES_MALE;
    const pickedBuild = pickRandom(builds);
    const newAgeGender = `${rolledAge}-year-old ${rolledGender === "female" ? "woman" : "man"}, ${pickedBuild.label.toLowerCase()}`;
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, name: newName, tag: `@CHAR_${newName.toUpperCase().replace(/[^A-Z0-9]/g, "")}`, ageGender: newAgeGender, bodyType: pickedBuild.label };
    onChange({ ...project, cast: updatedCast });
  };

  const rollBody = () => {
    if (locked.body || locked.skin) return;
    const builds = gender === "female" ? BODY_TYPES_FEMALE : BODY_TYPES_MALE;
    const build = pickRandom(builds);
    const complexion = pickRandom(SKIN_COMPLEXIONS);
    const newAgeGender = `${age}-year-old ${gender === "female" ? "woman" : "man"}, ${build.label.toLowerCase()}`;
    const newKinesics = `${build.desc} Stature: ${build.label}. Natural center of gravity.`;
    const updatedCast = [...project.cast];
    const presentation = pickPresentationForLifestyle(character.socioeconomicStatus || "middle_class");
    updatedCast[activeCastIdx] = { ...character, ageGender: newAgeGender, bodyType: build.label, microKinesics: newKinesics, archetypeTitle: `${character.name} — ${build.label}`, skinTexture: combineSkin(complexion.label, skinCondition(character.skinTexture)), presentationLevel: presentation.presentationLevel };
    onChange({ ...project, cast: updatedCast });
  };

  const rollHair = () => {
    if (locked.hair) return;
    const styles = gender === "female" ? HAIR_STYLES_FEMALE : HAIR_STYLES_MALE;
    const style = pickRandom(styles);
    const color = pickRandom(HAIR_COLORS);
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, hairStyle: style.label, hairColor: color.label };
    onChange({ ...project, cast: updatedCast });
  };

  const rollGrooming = () => {
    if (locked.grooming || locked.skin) return;
    const lifestyle = character.socioeconomicStatus || "middle_class";
    const rules = getPresentationRules(lifestyle);
    const allGrooming = gender === "female" ? MAKEUP_OPTIONS_FEMALE : GROOMING_OPTIONS_MALE;
    const groomingList = rules.groomingStyleIds === "all" ? allGrooming : allGrooming.filter((item) => rules.groomingStyleIds.includes(item.id));
    const pickedGrooming = pickRandom(groomingList);
    const allowedConditions = getConditions(matureContent).filter((item) => rules.conditionIds.includes(item.id));
    const pickedCondition = pickRandom(allowedConditions);
    const presentation = pickPresentationForLifestyle(lifestyle);
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, makeupStyle: pickedGrooming.desc, groomingLevel: presentation.groomingLevel, personCondition: pickedCondition.desc, skinTexture: combineSkin(skinTone(character.skinTexture), textureForCondition(pickedCondition.id)) };
    onChange({ ...project, cast: updatedCast });
  };

  const rollEyesAndFace = () => {
    if (locked.face) return;
    const eyeColor = pickRandom(EYE_COLORS);
    const face = pickRandom(FACIAL_STRUCTURE_OPTIONS);
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, eyeColor: eyeColor.label, facialTopology: face.desc };
    onChange({ ...project, cast: updatedCast });
  };

  const rollWardrobe = () => {
    if (locked.wardrobe || locked.footwear) return;
    const lifestyle = character.socioeconomicStatus || "middle_class";
    const culture = resolveCulturalContext(character, nameOrigin);
    const palette = pickRandom(CLEAN_COLOR_PALETTES);
    const wardrobe = selectContextualWardrobe({ gender, culture, lifestyle });
    const presentation = pickPresentationForLifestyle(lifestyle);
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, ...wardrobePatch(wardrobe, palette), clothingCondition: presentation.clothingCondition };
    onChange({ ...project, cast: updatedCast });
  };

  const rollMasterCharacter = (mode: "normal" | "mature" = "normal") => {
    const generated = randomizeCharacter({
      gender,
      character,
      role: character.role,
      existingNames: project.cast.filter((_, i) => i !== activeCastIdx).map((c) => c.name),
      origin: nameOrigin,
      age,
      matureContent,
      mode,
      locked,
    });
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = generated;
    onChange({ ...project, cast: updatedCast });
  };

  const handleAgeChange = (newAge: number) => {
    const buildMatch = character.bodyType ? ` ${character.bodyType.toLowerCase()}` : character.ageGender?.split(",")[1] || " athletic build";
    const newAgeGender = `${newAge}-year-old ${gender === "female" ? "woman" : "man"},${buildMatch}`;
    updateCharacterField("ageGender", newAgeGender);
  };

  const handleGenderChange = (newGender: "male" | "female") => {
    const builds = newGender === "female" ? BODY_TYPES_FEMALE : BODY_TYPES_MALE;
    const defaultBuild = builds[0];
    const newAgeGender = `${age}-year-old ${newGender === "female" ? "woman" : "man"}, ${defaultBuild.label.toLowerCase()}`;
    const hairStyles = newGender === "female" ? HAIR_STYLES_FEMALE : HAIR_STYLES_MALE;
    const defaultHair = hairStyles[0];
    const lifestyle = character.socioeconomicStatus || "middle_class";
    const culture = resolveCulturalContext(character, nameOrigin);
    const defaultWardrobe = selectContextualWardrobe({ gender: newGender, culture, lifestyle, strategy: "first" });
    const groomingList = newGender === "female" ? MAKEUP_OPTIONS_FEMALE : GROOMING_OPTIONS_MALE;
    const defaultGrooming = groomingList[0];
    const palette = CLEAN_COLOR_PALETTES[0];
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = { ...character, ageGender: newAgeGender, bodyType: defaultBuild.label, hairStyle: defaultHair.label, ...wardrobePatch(defaultWardrobe, palette), makeupStyle: defaultGrooming.desc };
    onChange({ ...project, cast: updatedCast });
  };

  const compiledTurnaroundPrompt = useMemo(() => compileCharacterSheetPrompt(character), [character]);
  const copyPrompt = async () => { await navigator.clipboard.writeText(compiledTurnaroundPrompt); };

  // Lock badge counts per stage tab
  const stageLockCount = (stage: Stage) =>
    STAGE_LOCK_KEYS[stage].filter((k) => locked[k]).length;

  return (
    <div className="character-foundry-screen">
      <div className="character-top-shell">
        <CharacterToolbar
          cast={project.cast}
          activeIdx={activeCastIdx}
          onSelectCast={(index) => onActiveCharacterChange(project.cast[index].id)}
          onRollMaster={rollMasterCharacter}
          onRollMature={() => rollMasterCharacter("mature")}
          matureContent={matureContent}
          onCopy={copyPrompt}
          onCompile={onCompile}
          isOutputOpen={isOutputOpen}
          onAddCharacter={addCharacter}
        />

        <nav className="character-stage-tabs" aria-label="Character builder stages">
          {(["core", "appearance", "styling", "review"] as Stage[]).map((stage, index) => {
            const lockCount = stageLockCount(stage);
            return (
              <button
                type="button"
                key={stage}
                className={activeStage === stage ? "active" : ""}
                onClick={() => setActiveStage(stage)}
              >
                <span className="stage-tab-number">0{index + 1}</span>
                <span>{STAGE_LABELS[stage]}</span>
                {lockCount > 0 && (
                  <span className="stage-tab-lock-badge" aria-label={`${lockCount} locked`}>
                    <LockKeyhole size={11} aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main two-column layout */}
      <CharacterLockProvider locked={locked} onToggle={toggleLock}>
        <div className="character-builder-layout">
          {/* LEFT — stage controls */}
          <div className="char-stage-controls">
            {activeStage === "core" && (
              <div className="character-stage-panel">
                <CharacterTagInput onApply={(tags) => updateCharacterField("rawInput", tags.join(", "))} />
                <IdentitySection
                  character={character}
                  gender={gender}
                  age={age}
                  nameOrigin={nameOrigin}
                  onNameChange={(val) => updateCharacterField("name", val)}
                  onRollName={rollNameOnly}
                  onNameOriginChange={handleCultureChange}
                  onGenderChange={handleGenderChange}
                  onAgeChange={handleAgeChange}
                  onRoleChange={(val) => updateCharacterField("role", val)}
                  onLifestyleChange={(val) => applyWardrobeContext(val, character.culturalContext || (nameOrigin === "non_indian" ? "western" : "india"))}
                  onRollIdentity={rollIdentity}
                />
              </div>
            )}

            {activeStage === "appearance" && (
              <div className="character-stage-panel">
                <BodySection
                  character={character}
                  gender={gender}
                  onBodyBuildChange={(build) => {
                    const newAgeGender = `${age}-year-old ${gender === "female" ? "woman" : "man"}, ${build.label.toLowerCase()}`;
                    const newKinesics = `${build.desc} Stature: ${build.label}. Natural center of gravity.`;
                    const updatedCast = [...project.cast];
                    updatedCast[activeCastIdx] = { ...character, ageGender: newAgeGender, bodyType: build.label, microKinesics: newKinesics, archetypeTitle: `${character.name} — ${build.label}` };
                    onChange({ ...project, cast: updatedCast });
                  }}
                  onSkinToneChange={(tone) => updateCharacterField("skinTexture", combineSkin(tone, skinCondition(character.skinTexture)))}
                  onPresentationChange={(presentationLevel) => updateCharacterField("presentationLevel", presentationLevel)}
                  onRollBody={rollBody}
                />
                <FaceSection
                  character={character}
                  onEyeColorChange={(colorLabel) => { const updatedCast = [...project.cast]; updatedCast[activeCastIdx] = { ...character, eyeColor: colorLabel }; onChange({ ...project, cast: updatedCast }); }}
                  onFacialStructureChange={(topology) => updateCharacterField("facialTopology", topology)}
                  onRollEyesAndFace={rollEyesAndFace}
                />
                <HairSection
                  character={character}
                  gender={gender}
                  onHairStyleChange={(styleLabel) => { const updatedCast = [...project.cast]; updatedCast[activeCastIdx] = { ...character, hairStyle: styleLabel }; onChange({ ...project, cast: updatedCast }); }}
                  onHairColorChange={(colorLabel) => { const updatedCast = [...project.cast]; updatedCast[activeCastIdx] = { ...character, hairColor: colorLabel }; onChange({ ...project, cast: updatedCast }); }}
                  onRollHair={rollHair}
                />
              </div>
            )}

            {activeStage === "styling" && (
              <div className="character-stage-panel">
                <MakeupConditionSection
                  character={character}
                  gender={gender}
                  onGroomingLevelChange={(groomingLevel) => updateCharacterField("groomingLevel", groomingLevel)}
                  onGroomingChange={(grooming) => { const updatedCast = [...project.cast]; updatedCast[activeCastIdx] = { ...character, makeupStyle: grooming.desc }; onChange({ ...project, cast: updatedCast }); }}
                  onConditionChange={(condition) => { const updatedCast = [...project.cast]; updatedCast[activeCastIdx] = { ...character, personCondition: condition.desc, skinTexture: combineSkin(skinTone(character.skinTexture), textureForCondition(condition.id)) }; onChange({ ...project, cast: updatedCast }); }}
                  onRollGrooming={rollGrooming}
                />
                {conflicts.length > 0 && (
                  <div className="stage-conflict-row">
                    {conflicts.map((c: ConflictWarning) => (
                      <ConflictBadge key={`${c.field}-${c.message}`} warnings={conflicts} field={c.field} />
                    ))}
                    <span className="stage-conflict-text">{conflicts.map((c: ConflictWarning) => c.message).join(" · ")}</span>
                  </div>
                )}
                <WardrobeSection
                  character={character}
                  gender={gender}
                  onOutfitChange={(outfit) => {
                    const palette = CLEAN_COLOR_PALETTES.find((p) => p.label === character.clothingPalette) || CLEAN_COLOR_PALETTES[0];
                    const updatedCast = [...project.cast];
                    updatedCast[activeCastIdx] = { ...character, outfitType: outfit.label, wardrobeFabric: `${palette.colors}. ${outfit.pieces} ${outfit.fitDesc}` };
                    onChange({ ...project, cast: updatedCast });
                  }}
                  onPaletteChange={(palette) => {
                    const currentOutfit = findContextualOutfit(character, gender, nameOrigin);
                    const updatedCast = [...project.cast];
                    updatedCast[activeCastIdx] = { ...character, clothingPalette: palette.label, wardrobeFabric: `${palette.colors}. ${currentOutfit.pieces} ${currentOutfit.fitDesc}` };
                    onChange({ ...project, cast: updatedCast });
                  }}
                  onFootwearChange={(footwear) => updateCharacterField("footwear", footwear.label)}
                  onClothingConditionChange={(clothingCondition) => updateCharacterField("clothingCondition", clothingCondition)}
                  onRollWardrobe={rollWardrobe}
                />
              </div>
            )}

            {activeStage === "review" && (
              <div className="character-stage-panel character-review-panel">
                <div className="character-summary-card">
                  <div className="eyebrow"><span className="summary-eyebrow-icon" aria-hidden="true"><LockKeyhole size={12} /></span>Review</div>
                  <h2>{character.name || "Unnamed character"}</h2>
                  <p>{age} · {gender} · {character.role || "role not set"}</p>
                  <p>{character.bodyType || "body"} · {skinTone(character.skinTexture)} · {character.hairStyle || "hair"}</p>
                  <p>{character.outfitType || "outfit"} · {character.personCondition?.split(".")[0] || "condition"}</p>
                  <div className="character-lock-summary">
                    {Object.entries(locked).filter(([, value]) => value).map(([key]) => (
                      <span key={key}>{key} locked</span>
                    ))}
                  </div>
                </div>
                {conflicts.length > 0 && (
                  <div className="stage-conflict-row">
                    <span className="stage-conflict-text"><AlertTriangle size={13} aria-hidden="true" />{conflicts.map((c: ConflictWarning) => c.message).join(" · ")}</span>
                  </div>
                )}
                <button type="button" className="primary-button" onClick={onNext}>
                  Continue to Mind Map
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — live summary + characters drawer */}
          <div className="char-summary-column">
            <CharacterSummaryPanel
              character={character}
              age={age}
              gender={gender}
              locked={locked}
            />
            <CharacterDrawerPanel
              cast={project.cast}
              activeIdx={activeCastIdx}
              savedCharacters={project.savedCharacters || []}
              onSelectCast={(idx: number) => onActiveCharacterChange(project.cast[idx].id)}
              onAddCharacter={addCharacter}
              onSave={saveCharacter}
              onLoad={loadCharacter}
              onDuplicate={duplicateCharacter}
              onRemove={removeCharacter}
            />
          </div>
        </div>
      </CharacterLockProvider>
    </div>
  );
}
