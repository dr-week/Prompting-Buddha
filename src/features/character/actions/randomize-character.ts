/**
 * Master character randomizer — assembles a full procedural character
 * while respecting locked categories.
 */
import {
  generateProceduralCharacter,
  type CharacterConcept,
} from "@/lib/filmmaker-compiler";
import {
  BODY_TYPES_FEMALE,
  BODY_TYPES_MALE,
  MAKEUP_OPTIONS_FEMALE,
  GROOMING_OPTIONS_MALE,
  CLEAN_COLOR_PALETTES,
} from "../data";
import { getConditions, getMatureConditions, isMatureGrooming } from "../data/content-mode";
import { getGroomingConstraints } from "../domain/character-constraints";
import type { Lifestyle } from "../domain/lifestyle-rules";
import { assertLocksUnchanged, recordLockDiagnostic } from "@/lib/locks/lock-integrity";
import { resolveCulturalContext, selectContextualWardrobe, wardrobePatch } from "./randomize-wardrobe";
import { getPresentationRules, pickPresentationForLifestyle } from "../domain/presentation-rules";
import {
  extractSkinTone as skinTone,
  extractSkinCondition as skinCondition,
  combineSkin,
  textureForCondition,
} from "../domain/skin-utils";

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export interface LockState {
  identity?: boolean;
  body?: boolean;
  hair?: boolean;
  face?: boolean;
  skin?: boolean;
  grooming?: boolean;
  wardrobe?: boolean;
  footwear?: boolean;
}

export interface MasterRandomizeOptions {
  gender: "male" | "female";
  character: CharacterConcept;
  role: CharacterConcept["role"];
  existingNames: string[];
  origin: "all" | "non_indian" | "indian";
  age: number;
  matureContent: boolean;
  mode?: "normal" | "mature";
  locked: LockState;
}

export function randomizeCharacter(options: MasterRandomizeOptions): CharacterConcept {
  const { gender, character, role, existingNames, origin, age, matureContent, mode = "normal", locked } = options;
  const lockSnapshot = structuredClone(character.locks ?? locked);

  const rolled = generateProceduralCharacter({ gender, role, existingNames, origin, age });

  const builds = gender === "female" ? BODY_TYPES_FEMALE : BODY_TYPES_MALE;
  const lifestyle: Lifestyle = character.socioeconomicStatus || "middle_class";
  const culture = resolveCulturalContext(character, origin);
  const groomingList = gender === "female" ? MAKEUP_OPTIONS_FEMALE : GROOMING_OPTIONS_MALE;
  const presentationRules = getPresentationRules(lifestyle);
  const matureGrooming = groomingList.filter((item) => isMatureGrooming(item.id));
  const modeGrooming = mode === "mature" && matureGrooming.length ? matureGrooming : groomingList;
  const groomingConstraints = getGroomingConstraints(lifestyle);
  const lifestyleGrooming = groomingConstraints.allowedIds === "all"
    ? modeGrooming
    : modeGrooming.filter((item) => groomingConstraints.allowedIds.includes(item.id));
  const pickedBuild = pick(builds);
  const pickedPalette = pick(CLEAN_COLOR_PALETTES);
  const pickedGrooming = pick(lifestyleGrooming.length ? lifestyleGrooming : groomingList);
  const conditionPool = (mode === "mature" ? getMatureConditions() : getConditions(matureContent)).filter((item) => presentationRules.conditionIds.includes(item.id));
  const pickedCondition = pick(conditionPool.length ? conditionPool : getConditions(false));
  const wardrobe = selectContextualWardrobe({ gender, culture, lifestyle, mode });
  const presentation = pickPresentationForLifestyle(lifestyle);

  const generated: CharacterConcept = {
    ...rolled,
    // Lifestyle is the controlling affordability tier. Randomization may vary
    // traits inside that tier, but must not silently move the character to a
    // different socioeconomic tier.
    socioeconomicStatus: character.socioeconomicStatus || rolled.socioeconomicStatus,
    culturalContext: culture,
    bodyType: pickedBuild.label,
    ...wardrobePatch(wardrobe, pickedPalette),
    ...presentation,
    makeupStyle: pickedGrooming.desc,
    personCondition: pickedCondition.desc,
    skinTexture: combineSkin(skinTone(rolled.skinTexture), textureForCondition(pickedCondition.id)),
  };

  const randomized = {
    ...generated,
    ...(locked.identity ? { name: character.name, tag: character.tag, ageGender: character.ageGender, role: character.role, rawInput: character.rawInput, socioeconomicStatus: character.socioeconomicStatus, culturalContext: character.culturalContext } : {}),
    ...(locked.body ? { bodyType: character.bodyType, microKinesics: character.microKinesics, archetypeTitle: character.archetypeTitle, presentationLevel: character.presentationLevel } : {}),
    ...(locked.hair ? { hairStyle: character.hairStyle, hairColor: character.hairColor } : {}),
    ...(locked.face ? { facialTopology: character.facialTopology, eyeColor: character.eyeColor, personalityVibe: character.personalityVibe } : {}),
    ...(locked.grooming ? { makeupStyle: character.makeupStyle, groomingLevel: character.groomingLevel, personCondition: character.personCondition } : {}),
    ...(locked.wardrobe ? { outfitType: character.outfitType, clothingPalette: character.clothingPalette, clothingCondition: character.clothingCondition, wardrobeFabric: character.wardrobeFabric, footwear: character.footwear } : {}),
    ...(locked.footwear ? { footwear: character.footwear } : {}),
  };
  const result: CharacterConcept = {
    ...randomized,
    // Randomization may change unlocked traits, but it must never reset the
    // persisted category-lock contract on the character.
    locks: lockSnapshot,
    skinTexture: combineSkin(
      locked.body || locked.skin ? skinTone(character.skinTexture) : skinTone(generated.skinTexture),
      locked.grooming || locked.skin ? skinCondition(character.skinTexture) : skinCondition(generated.skinTexture),
    ),
  };
  const lockedFields: Array<[keyof LockState, Array<keyof CharacterConcept>]> = [
    ["identity", ["name", "tag", "ageGender", "role", "rawInput", "socioeconomicStatus", "culturalContext"]],
    ["body", ["bodyType", "microKinesics", "archetypeTitle", "presentationLevel"]],
    ["hair", ["hairStyle", "hairColor"]],
    ["face", ["facialTopology", "eyeColor", "personalityVibe"]],
    ["grooming", ["makeupStyle", "groomingLevel", "personCondition"]],
    ["wardrobe", ["outfitType", "clothingPalette", "clothingCondition", "wardrobeFabric", "footwear"]],
  ];
  for (const [lock, fields] of lockedFields) {
    if (!lockSnapshot[lock]) continue;
    for (const field of fields) if (result[field] !== character[field]) {
      recordLockDiagnostic({ scope: mode === "mature" ? "mature-character-randomizer" : "character-randomizer", field, message: `Skipped attempted change to locked ${String(field)}.` });
      (result as unknown as Record<string, unknown>)[field] = character[field];
    }
  }
  assertLocksUnchanged(lockSnapshot, result.locks, mode === "mature" ? "mature-character-randomizer" : "character-randomizer");
  return result;
}
