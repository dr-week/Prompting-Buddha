import type { StoryMapNodeKind } from "@/features/workspaces/types";
import { NODE_DEFINITIONS } from "./node-definitions";

export const DEFAULT_SCENE_NODE_KINDS: StoryMapNodeKind[] = ["story", "character", "environment", "time", "narration", "dialogue", "beat"];

export const DEFAULT_SCENE_NODE_LABELS: Record<StoryMapNodeKind, string> = Object.fromEntries(
  Object.entries(NODE_DEFINITIONS).map(([kind, definition]) => [kind, definition.label])
) as Record<StoryMapNodeKind, string>;
