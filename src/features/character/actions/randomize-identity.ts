import {
  generateRealisticCharacterName,
  OCULAR_EYE_OPTIONS,
  EYE_COLORS,
  FACIAL_STRUCTURE_OPTIONS,
  SKIN_COMPLEXIONS,
  SKIN_TEXTURES,
  HAIR_STYLES_FEMALE,
  HAIR_STYLES_MALE,
  HAIR_COLORS,
  type CharacterConcept,
} from "@/lib/filmmaker-compiler";
import type { BodyTypeOption } from "../data";
import { BODY_TYPES_FEMALE, BODY_TYPES_MALE } from "../data";

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export interface RandomizeIdentityOptions {
  character: CharacterConcept;
  activeCastIdx: number;
  project: { cast: CharacterConcept[] };
  nameOrigin: "all" | "non_indian" | "indian";
}

export function randomizeIdentity(options: RandomizeIdentityOptions): Partial<CharacterConcept> {
  const { activeCastIdx, project, nameOrigin } = options;
  const rolledGender: "male" | "female" = Math.random() > 0.5 ? "female" : "male";
  const rolledAge = Math.floor(Math.random() * 48) + 18;
  const existing = project.cast.map((c) => c.name).filter((_, i) => i !== activeCastIdx);
  const newName = generateRealisticCharacterName(rolledGender, existing, nameOrigin);
  const builds: BodyTypeOption[] = rolledGender === "female" ? BODY_TYPES_FEMALE : BODY_TYPES_MALE;
  const pickedBuild = pick(builds);
  const newAgeGender = `${rolledAge}-year-old ${rolledGender === "female" ? "woman" : "man"}, ${pickedBuild.label.toLowerCase()}`;

  return {
    name: newName,
    tag: `@CHAR_${newName.toUpperCase().replace(/[^A-Z0-9]/g, "")}`,
    ageGender: newAgeGender,
    bodyType: pickedBuild.label,
  };
}

export function randomizeAppearance(gender: "male" | "female"): Partial<CharacterConcept> {
  const eye = pick(OCULAR_EYE_OPTIONS);
  const eyeColor = pick(EYE_COLORS);
  const face = pick(FACIAL_STRUCTURE_OPTIONS);
  const complexion = pick(SKIN_COMPLEXIONS);
  const texture = pick(SKIN_TEXTURES);
  const styles = gender === "female" ? HAIR_STYLES_FEMALE : HAIR_STYLES_MALE;
  const style = pick(styles);
  const color = pick(HAIR_COLORS);

  return {
    eyeColor: eyeColor.label,
    facialTopology: `${face.desc}. ${eye.desc}`,
    skinTexture: `${complexion.label} complexion, ${texture.desc}`,
    hairStyle: style.label,
    hairColor: color.label,
  };
}
