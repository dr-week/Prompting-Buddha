/**
 * Public compiler API
 * Import from "@/lib/compiler" to use any compiler function or type.
 * The original filmmaker-compiler.ts remains the source of truth while
 * incremental extraction progresses.
 */

// Types
export type {
  CharacterConcept,
  StoryboardPanel,
  ProductionContinuity,
  PromptAuditIssue,
  HumanArchetypePreset,
  ProceduralTraitOption,
  CinematicShotSpec,
  ShotFraming,
  CameraAngle,
  CameraMovement,
  DialogueType,
} from "./types";

// Settings
export type { CompilerSettings } from "./settings";
export { DEFAULT_COMPILER_SETTINGS } from "./settings";

// Character
export {
  compileCharacterSheetPrompt,
  compileOutfitPosePrompt,
  parseRoughCharacterInput,
  generateRealisticCharacterName,
  generateProceduralCharacter,
  RANDOM_CHARACTER_IDEAS,
  FIRST_NAMES_MALE,
  FIRST_NAMES_FEMALE,
  HUMAN_ARCHETYPES,
  HAIR_STYLES_FEMALE,
  HAIR_STYLES_MALE,
  HAIR_COLORS,
  EYE_COLORS,
  BODY_BUILDS_FEMALE,
  BODY_BUILDS_MALE,
  SKIN_COMPLEXIONS,
  SKIN_TEXTURES,
  OCULAR_EYE_OPTIONS,
  FACIAL_STRUCTURE_OPTIONS,
} from "./character";

// Storyboard
export { compileStoryboardPrompt } from "./storyboard";

// Video
export { compileVideoPrompts } from "./video";

// Auditor
export { auditPromptContinuity } from "./auditor";

// Safety
export { detectPhysicalSafetyDirectives } from "./safety";

// Composition
export { deriveCinematicCompositionPlanes } from "./composition";

// Presets
export { PRODUCTION_PRESETS } from "./presets";

// Story format
export { storyFormatGuidance, buildCaptureDirective } from "./story-format";
export type { StoryFormatSpec, StoryMode, CaptureStyle, StoryContinuity } from "./story-format";
export { applyPromptProfile } from "./prompt-profile";
export type { PlatformSyntax, PromptStage } from "./prompt-profile";
export { auditPromptText, correctPromptText } from "./prompt-auditor";
