import { PERSON_CONDITIONS } from "./grooming-makeup";
import type { ConditionOption } from "./types";

const MATURE_CONDITION_IDS = new Set(["cond_seductive_magnetic", "cond_sweaty_heated"]);
const MATURE_GROOMING_IDS = new Set([
  "fem_bold_red_lip", "fem_smokey_kohl", "fem_editorial_wetlook",
  "male_sweaty_athletic", "male_heavy_stubble",
]);

export function getConditions(matureContent: boolean): ConditionOption[] {
  return matureContent ? PERSON_CONDITIONS : PERSON_CONDITIONS.filter((condition) => !MATURE_CONDITION_IDS.has(condition.id));
}

export function getMatureConditions(): ConditionOption[] {
  return PERSON_CONDITIONS.filter((condition) => MATURE_CONDITION_IDS.has(condition.id));
}

export function isMatureGrooming(id: string): boolean {
  return MATURE_GROOMING_IDS.has(id);
}
