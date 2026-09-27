import type { StoryMapNodeKind } from "@/features/workspaces/types";

export interface NodeDefinition {
  label: string;
  detail: string;
  hint: string;
  placeholder: string;
  suggestions: string[];
}

export const NODE_DEFINITIONS: Record<StoryMapNodeKind, NodeDefinition> = {
  story: { label: "Story", detail: "Central story premise or everyday situation.", hint: "Scene premise", placeholder: "What is this moment about?", suggestions: ["routine", "ordinary", "small change", "open-ended"] },
  character: { label: "Character", detail: "Person present in the scene.", hint: "Person in the scene", placeholder: "Who is present?", suggestions: ["male", "female", "poor", "middle class", "rich", "quiet"] },
  environment: { label: "Environment", detail: "Where and under what conditions the scene happens.", hint: "Where it happens", placeholder: "Where does it happen?", suggestions: ["home", "school", "market", "road", "garden", "scrapyard"] },
  time: { label: "Time", detail: "When this moment happens.", hint: "When it happens", placeholder: "When does it happen?", suggestions: ["morning", "afternoon", "evening", "night", "dawn"] },
  props: { label: "Props", detail: "Objects used or visible in this moment.", hint: "Objects in the scene", placeholder: "Which objects are used?", suggestions: ["kettle", "phone", "bag", "bicycle", "toolbox", "book"] },
  narration: { label: "Narration", detail: "What the audience understands or hears.", hint: "Audience context", placeholder: "What does the audience understand?", suggestions: ["observational", "quiet", "warm", "lonely", "hopeful"] },
  dialogue: { label: "Dialogue", detail: "Optional words spoken by a connected character.", hint: "Optional spoken words", placeholder: "What is said, if anything?", suggestions: ["angry", "afraid", "humble", "teasing", "uncertain", "silent"] },
  beat: { label: "Beat", detail: "One visible action or change in the scene.", hint: "Visible action", placeholder: "What visible thing happens next?", suggestions: ["arrives", "waits", "searches", "eats", "leaves", "notices"] },
};

export const NODE_KINDS = Object.keys(NODE_DEFINITIONS) as StoryMapNodeKind[];
