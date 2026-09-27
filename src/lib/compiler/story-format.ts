import { predictLaya } from "@/lib/laya/client";
import { STORY_TONE_SCHEMA } from "@/lib/laya/schemas";

export type StoryMode = "slice_of_life" | "cinematic";
export type CaptureStyle = "raw_vlog" | "cinematic";
export type StoryContinuity = "daily_series" | "standalone";

export interface StoryFormatSpec {
  mode: StoryMode;
  capture: CaptureStyle;
  continuity: StoryContinuity;
  dialogue: "minimal" | "normal";
}

/**
 * Returns a single compact directive string for the given story format.
 * Each instruction appears exactly once — no duplication.
 */
export function buildCaptureDirective(format: StoryFormatSpec): string {
  const lines: string[] = [];

  // EPISODE mode
  if (format.mode === "slice_of_life") {
    lines.push("EPISODE: Ordinary routines, recurring places, familiar props, gentle drama, fresh variation within the same world. No dramatic escalation required.");
  } else {
    lines.push("EPISODE: Deliberate visual composition, motivated camera, clear atmosphere, and purposeful dramatic arc.");
  }

  // CAPTURE style
  if (format.capture === "raw_vlog") {
    lines.push("CAPTURE: Handheld movement, available light, imperfect framing, ambient sound, phone/social-video authenticity. No artificial spectacle.");
  } else {
    lines.push("CAPTURE: Controlled framing, intentional camera movement, shaped light, polished visual rhythm.");
  }

  // CONTINUITY
  if (format.continuity === "daily_series") {
    lines.push("CONTINUITY: Recurring cast, wardrobe logic, locations, and objects stay consistent. Episodes are open-ended, non-linear, and need no conclusion, season chronology, or required viewing order. No artificial dramatic escalation or season ending.");
  } else {
    lines.push("CONTINUITY: Establish world and character state within this sequence.");
  }

  // DIALOGUE
  if (format.dialogue === "minimal") {
    lines.push("DIALOGUE: Let action, glances, gestures, and routine sounds carry the story. Use only brief natural speech when necessary.");
  } else {
    lines.push("DIALOGUE: Natural speech supporting visible action without exposition overload.");
  }

  return lines.join("\n");
}

export function storyFormatGuidance(format?: Partial<StoryFormatSpec>) {
  const mode: StoryMode = format?.mode ?? "cinematic";
  const capture: CaptureStyle = format?.capture ?? "cinematic";
  const continuity: StoryContinuity = format?.continuity ?? "standalone";
  const dialogue = format?.dialogue ?? "normal";
  const spec: StoryFormatSpec = { mode, capture, continuity, dialogue };
  return {
    mode,
    capture,
    continuity,
    dialogue,
    directive: buildCaptureDirective(spec),
  };
}

/**
 * Infer the story format / narrative mode from beat or scene text using Laya.
 * Falls back to heuristic detection or default cinematic mode when Laya is unavailable.
 */
export async function inferStoryFormat(beatText: string): Promise<Partial<StoryFormatSpec>> {
  const trimmed = typeof beatText === "string" ? beatText.trim() : "";
  if (!trimmed) {
    return { mode: "cinematic" };
  }

  const result = await predictLaya(trimmed, STORY_TONE_SCHEMA);
  const choice = result?.answers?.mode?.choice || result?.mode?.choice;

  if (choice === "slice_of_life" || choice === "cinematic") {
    return { mode: choice };
  }

  // Graceful heuristic fallback if Laya is offline / null
  const isSliceOfLife = /\b(daily|routine|ordinary|vlog|morning routine|breakfast|casual|coffee|groceries|commute)\b/i.test(trimmed);
  return {
    mode: isSliceOfLife ? "slice_of_life" : "cinematic",
  };
}
