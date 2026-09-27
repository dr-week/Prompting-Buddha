import type { StoryMapNodeKind } from "@/features/workspaces/types";
import { NODE_DEFINITIONS } from "./node-definitions";

export const NODE_KIND_GUIDE: Record<StoryMapNodeKind, { label: string; placeholder: string; suggestions: string[] }> = Object.fromEntries(
  Object.entries(NODE_DEFINITIONS).map(([kind, definition]) => [kind, {
    label: definition.label,
    placeholder: definition.placeholder,
    suggestions: definition.suggestions,
  }])
) as Record<StoryMapNodeKind, { label: string; placeholder: string; suggestions: string[] }>;
