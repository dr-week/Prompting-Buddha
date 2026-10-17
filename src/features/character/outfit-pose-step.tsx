"use client";

import { useMemo } from "react";
import { Sparkles, Clipboard, Shuffle, ArrowRight } from "lucide-react";
import { CLEAN_COLOR_PALETTES } from "@/features/character/data";
import { WardrobeSection } from "@/features/character/components/wardrobe-section";
import { PoseSection } from "@/features/character/components/pose-section";
import { CharacterLockProvider, type CharacterLockKey } from "@/features/character/components/lock-context";
import { CharacterSummaryPanel } from "@/features/character/components/character-summary-sidebar";
import { selectContextualWardrobe, wardrobePatch, resolveCulturalContext, findContextualOutfit } from "@/features/character/actions/randomize-wardrobe";
import { pickPresentationForLifestyle } from "@/features/character/domain/presentation-rules";
import {
  ACTING_POSES_OPTIONS,
  compileOutfitPosePrompt,
  type ProductionContinuity,
} from "@/lib/filmmaker-compiler";

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export function OutfitPoseStep({
  project,
  activeCharacterId,
  onActiveCharacterChange,
  onChange,
  onCompile,
  onNext,
}: {
  project: ProductionContinuity;
  activeCharacterId?: string;
  onActiveCharacterChange: (characterId: string) => void;
  onChange: (project: ProductionContinuity) => void;
  onCompile: () => void;
  onNext: () => void;
}) {
  const activeCastIdx = Math.max(0, project.cast.findIndex((item) => item.id === activeCharacterId));
  const character = project.cast[activeCastIdx] || project.cast[0];
  const locked = character.locks || {};

  const toggleLock = (key: CharacterLockKey) => {
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = {
      ...character,
      locks: { ...character.locks, [key]: !character.locks?.[key] },
    };
    onChange({ ...project, cast: updatedCast });
  };

  const parsedAge = useMemo(() => {
    const match = character.ageGender?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 25;
  }, [character.ageGender]);

  const gender: "male" | "female" =
    character.ageGender?.toLowerCase().includes("woman") ||
    character.ageGender?.toLowerCase().includes("female")
      ? "female"
      : "male";

  const lifestyle = character.socioeconomicStatus || "middle_class";
  const culture = resolveCulturalContext(character);

  const rollWardrobe = () => {
    if (locked.wardrobe || locked.footwear) return;
    const palette = pickRandom(CLEAN_COLOR_PALETTES);
    const wardrobe = selectContextualWardrobe({ gender, culture, lifestyle });
    const presentation = pickPresentationForLifestyle(lifestyle);
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = {
      ...character,
      ...wardrobePatch(wardrobe, palette),
      clothingCondition: presentation.clothingCondition,
    };
    onChange({ ...project, cast: updatedCast });
  };

  const rollPose = () => {
    if (locked.pose) return;
    const pose = pickRandom(ACTING_POSES_OPTIONS);
    const baseKinesics = character.bodyType ? `${character.bodyType} build.` : "Natural physical posture.";
    const updatedCast = [...project.cast];
    updatedCast[activeCastIdx] = {
      ...character,
      microKinesics: `${baseKinesics} Stance: ${pose.desc}`,
    };
    onChange({ ...project, cast: updatedCast });
  };

  const rollAllOutfitAndPose = () => {
    rollWardrobe();
    rollPose();
  };

  const compiledPrompt = useMemo(() => compileOutfitPosePrompt(character), [character]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(compiledPrompt);
  };

  return (
    <div className="character-foundry-screen">
      <div className="character-top-shell">
        <header className="character-cockpit-toolbar">
          <div className="toolbar-left">
            <div className="cast-tab-group">
              {project.cast.map((char, idx) => (
                <button
                  key={char.id || idx}
                  type="button"
                  className={`cast-tab ${activeCastIdx === idx ? "active" : ""}`}
                  onClick={() => onActiveCharacterChange(char.id)}
                >
                  <span className="cast-tab-dot" />
                  <span className="cast-tab-name">{char.name || `Character ${idx + 1}`}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-random-group" aria-label="Outfit and pose randomization">
              <button
                type="button"
                className="pill-button secondary"
                onClick={rollAllOutfitAndPose}
                title="Randomise unlocked outfit & pose"
                aria-label="Randomise unlocked outfit & pose"
              >
                <Shuffle size={14} />
              </button>
            </div>

            <div className="toolbar-utility-group" aria-label="Tools">
              <button
                type="button"
                className="pill-button secondary"
                onClick={copyPrompt}
                title="Copy outfit & pose prompt"
                aria-label="Copy outfit & pose prompt"
              >
                <Clipboard size={14} />
              </button>

              <button
                type="button"
                className="pill-button secondary"
                onClick={onCompile}
                title="Preview compiled prompt"
                aria-label="Preview compiled prompt"
              >
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        </header>
      </div>

      <CharacterLockProvider locked={locked} onToggle={toggleLock}>
        <div className="character-builder-layout">
          <div className="char-stage-controls">
            <div className="character-stage-panel">
              <WardrobeSection
                character={character}
                gender={gender}
                onOutfitChange={(outfit) => {
                  const palette =
                    CLEAN_COLOR_PALETTES.find((p) => p.label === character.clothingPalette) ||
                    CLEAN_COLOR_PALETTES[0];
                  const updatedCast = [...project.cast];
                  updatedCast[activeCastIdx] = {
                    ...character,
                    outfitType: outfit.label,
                    wardrobeFabric: `${palette.colors}. ${outfit.pieces} ${outfit.fitDesc}`,
                  };
                  onChange({ ...project, cast: updatedCast });
                }}
                onPaletteChange={(palette) => {
                  const currentOutfit = findContextualOutfit(character, gender);
                  const updatedCast = [...project.cast];
                  updatedCast[activeCastIdx] = {
                    ...character,
                    clothingPalette: palette.label,
                    wardrobeFabric: `${palette.colors}. ${currentOutfit.pieces} ${currentOutfit.fitDesc}`,
                  };
                  onChange({ ...project, cast: updatedCast });
                }}
                onFootwearChange={(footwear) => {
                  const updatedCast = [...project.cast];
                  updatedCast[activeCastIdx] = { ...character, footwear: footwear.label };
                  onChange({ ...project, cast: updatedCast });
                }}
                onClothingConditionChange={(condition) => {
                  const updatedCast = [...project.cast];
                  updatedCast[activeCastIdx] = { ...character, clothingCondition: condition };
                  onChange({ ...project, cast: updatedCast });
                }}
                onRollWardrobe={rollWardrobe}
              />

              <PoseSection
                character={character}
                onPoseChange={(microKinesics) => {
                  const updatedCast = [...project.cast];
                  updatedCast[activeCastIdx] = { ...character, microKinesics };
                  onChange({ ...project, cast: updatedCast });
                }}
                onRollPose={rollPose}
              />

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                <button type="button" className="primary-button" onClick={onNext}>
                  <span>Continue to Mind Map</span>
                  <ArrowRight size={14} style={{ marginLeft: "6px" }} />
                </button>
              </div>
            </div>
          </div>

          <div className="char-summary-column">
            <CharacterSummaryPanel
              character={character}
              age={parsedAge}
              gender={gender}
              locked={locked as Record<string, boolean>}
            />
          </div>
        </div>
      </CharacterLockProvider>
    </div>
  );
}
