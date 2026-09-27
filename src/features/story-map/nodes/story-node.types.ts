import type { StoryMapNodeKind } from "@/features/workspaces/types";
import type { ShotFraming } from "@/lib/filmmaker-compiler";

export interface StoryNodeData extends Record<string, unknown> {
  title: string;
  detail: string;
  tags?: string[];
  locked?: boolean;
  referenceId?: string;
  framing?: ShotFraming;
  onToggleLock?: () => void;
  kind: StoryMapNodeKind;
  isExpanded?: boolean;
}
