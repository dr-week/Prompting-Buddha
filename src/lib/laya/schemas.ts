export interface LayaChoiceQuestion {
  type: "choice";
  instructions: string;
  criteria: Record<string, string>;
}

export interface LayaNoulQuestion {
  type: "noul" | "bool";
  instructions: string;
}

export const SHOT_FRAMING_SCHEMA = {
  framing: {
    type: "choice",
    instructions: "Infer the best cinematic camera shot framing for this scene or beat description.",
    criteria: {
      ECU: "Extreme close-up focusing intensely on eyes, mouth, a tiny detail, or fine texture.",
      CU: "Close-up emphasizing the face, facial expression, emotional reaction, or isolated key object.",
      MCU: "Medium close-up from chest or shoulders up, balancing dialogue clarity with subtle performance nuances.",
      MS: "Medium shot from the waist up, capturing character gesture, physical action, and immediate context.",
      WS: "Wide shot establishing character in full body, environment, architecture, landscape, and spatial relationships.",
      OTS: "Over-the-shoulder shot looking past one character toward a focal conversation partner or subject.",
      POV: "First-person point-of-view capturing the scene directly through the subjective eyes of a character.",
    },
  },
} as const;

export const PROMPT_AUDIT_SCHEMA = {
  wardrobe_transition: {
    type: "noul",
    instructions: "Does the prompt instruct a character to switch or change clothes, outfits, or wardrobe mid-scene or within a single shot without an editorial cut?",
  },
  generic_identity: {
    type: "noul",
    instructions: "Does the prompt describe a character using weak, ambiguous, or generic references (such as 'the man', 'the woman', 'the boy', 'the girl') without a stable character anchor tag or proper name?",
  },
  attention_competition: {
    type: "noul",
    instructions: "Does the prompt contain conflicting, contradictory, or duplicated instructions that divide model attention and degrade consistency?",
  },
} as const;

export const STORY_TONE_SCHEMA = {
  mode: {
    type: "choice",
    instructions: "Infer the narrative pacing, storytelling format, and aesthetic intention of this story beat.",
    criteria: {
      slice_of_life: "Grounded everyday routines, realistic life rhythms, relatable casual encounters, subtle drama, no grand cinematic spectacle.",
      cinematic: "Heightened dramatic stakes, structured narrative tension, deliberate visual composition, dynamic camera movement, cinematic conflict.",
    },
  },
} as const;
