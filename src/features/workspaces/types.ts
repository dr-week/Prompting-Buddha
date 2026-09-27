import type { ProductionContinuity, ShotFraming } from "@/lib/filmmaker-compiler";
import type { PropAsset } from "@/features/props/types";

export const CURRENT_WORKSPACE_SCHEMA_VERSION = 3 as const;

export type WorkflowStep = "storymap" | "character" | "storyboard" | "video" | "auditor";

export type StoryMapNodeKind = "story" | "character" | "environment" | "time" | "props" | "narration" | "dialogue" | "beat";

export interface StoryMapNode {
  id: string;
  kind: StoryMapNodeKind;
  label: string;
  detail: string;
  tags?: string[];
  locked?: boolean;
  referenceId?: string;
  framing?: ShotFraming;
  position: { x: number; y: number };
}

export interface StoryMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  logline: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDocument {
  schemaVersion: typeof CURRENT_WORKSPACE_SCHEMA_VERSION;
  id: "current";
  workspaceId: string;
  project: ProductionContinuity;
  storyMap: { nodes: StoryMapNode[]; edges: StoryMapEdge[] };
  propLibrary: PropAsset[];
  activeStoryboardId: string;
  storyboards: Array<{
    id: string;
    title: string;
    project: ProductionContinuity;
    storyMap: { nodes: StoryMapNode[]; edges: StoryMapEdge[] };
  }>;
  settings: {
    targetAI: "google_flow" | "veo" | "kling" | "runway_gen4";
    matureContent: boolean;
    negativeGuardrails: boolean;
    compactPrompts: boolean;
  };
  activeStep: WorkflowStep;
  updatedAt: string;
}
