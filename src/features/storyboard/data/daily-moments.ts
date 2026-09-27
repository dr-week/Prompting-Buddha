import type { ProductionContinuity, StoryboardPanel } from "@/lib/filmmaker-compiler";

const DAILY_MOMENTS = [
  { title: "A small breakfast delay", place: "a familiar kitchen or roadside stall", actions: ["The character notices the tea is already cold.", "A spoon, packet, or cup is searched for in the usual place.", "A neighbor or family member passes through without stopping.", "The character leaves the small problem unresolved and continues the day."] },
  { title: "An ordinary errand", place: "a nearby market, shop, or street", actions: ["The character checks a short list on a phone or folded paper.", "A familiar vendor recognizes them without ceremony.", "A small choice is made between two ordinary items.", "The character walks away as the street routine continues around them."] },
  { title: "Waiting for transport", place: "a bus stop, station, or building entrance", actions: ["The character checks the road and then checks the time.", "A passing sound briefly changes their attention.", "Someone nearby shares the same wait without speaking.", "The expected transport arrives or the character decides to walk instead."] },
  { title: "A quiet room reset", place: "the character's familiar room", actions: ["A small object is returned to its usual place.", "Sunlight or street noise shifts across the room.", "The character sits, scrolls, folds, repairs, or watches for a moment.", "The room settles back into its normal rhythm."] },
  { title: "A familiar meal outside", place: "a modest cafe, canteen, or food stall", actions: ["The character chooses a regular order.", "A small sound from the kitchen or street becomes the focus.", "A brief exchange happens without explaining the whole relationship.", "The character returns attention to the meal and the world keeps moving."] },
] as const;

const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

/** Returns a template panel for generating new scenes. Uses first existing panel as base. */
function basePanel(project: ProductionContinuity): StoryboardPanel {
  return project.panels[0] ?? {
    id: "base",
    panelNumber: 1,
    framing: "MS",
    angle: "Eye-level",
    action: "An ordinary moment unfolds.",
    screenDirection: "Screen-left",
    durationSeconds: 4,
  };
}

export function randomDailyMoment(project: ProductionContinuity): ProductionContinuity {
  const moment = pick(DAILY_MOMENTS);
  return {
    ...project,
    sceneBeat: `${moment.title} in ${moment.place}. A small everyday moment with no final conclusion.`,
    panels: project.panels.slice(0, 4).map((panel, index) => ({
      ...panel,
      action: moment.actions[index] ?? panel.action,
      dialogue: undefined,
      dialogueSpeaker: undefined,
      dialogueType: "silent" as const,
    })),
    storyFormat: { mode: "slice_of_life", capture: "raw_vlog", continuity: "daily_series", dialogue: "minimal" },
  };
}

/**
 * Appends `count` new scenes to the project without overwriting existing panels.
 * Generates unique IDs for every new panel.
 * Supports 3, 4, 5, and 9 scene batches (and unlimited next-scene generation).
 */
export function appendDailyScenes(project: ProductionContinuity, count: number): ProductionContinuity {
  const moment = pick(DAILY_MOMENTS);
  const start = project.panels.length;
  const template = basePanel(project);
  const ts = Date.now();

  const additions: StoryboardPanel[] = Array.from({ length: count }, (_, i) => ({
    ...template,
    id: `scene-${start + i + 1}-${ts}-${i}`,
    panelNumber: start + i + 1,
    action: moment.actions[i % moment.actions.length] ?? "An ordinary moment continues.",
    dialogue: undefined,
    dialogueSpeaker: undefined,
    dialogueType: "silent" as const,
  }));

  return { ...project, panels: [...project.panels, ...additions] };
}
