import { z } from "zod";
import {
  CURRENT_WORKSPACE_SCHEMA_VERSION,
  type WorkspaceDocument,
} from "./types";

const positionSchema = z.object({ x: z.number().finite(), y: z.number().finite() });
const storyMapNodeSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["story", "character", "environment", "time", "props", "narration", "dialogue", "beat"]),
  label: z.string(),
  detail: z.string(),
  tags: z.array(z.string()).optional(),
  locked: z.boolean().optional(),
  referenceId: z.string().optional(),
  position: positionSchema,
});
const storyMapEdgeSchema = z.object({ id: z.string().min(1), source: z.string().min(1), target: z.string().min(1), label: z.string().optional() });
const storyMapSchema = z.object({ nodes: z.array(storyMapNodeSchema), edges: z.array(storyMapEdgeSchema) });
const propAssetSchema = z.object({
  id: z.string().min(1), name: z.string().min(1),
  category: z.enum(["personal", "furniture", "food", "vehicle", "gadget", "tool", "work", "other"]),
  scope: z.enum(["character", "scene", "recurring"]), description: z.string(),
  material: z.string().optional(), color: z.string().optional(), condition: z.string().optional(), scale: z.string().optional(),
  ownerCharacterId: z.string().optional(), storyboardId: z.string().optional(), sceneId: z.string().optional(),
  tags: z.array(z.string()), locked: z.boolean(), savedToLibrary: z.boolean(),
});

const projectSchema = z.object({
  projectTitle: z.string(),
  sceneBeat: z.string(),
  cast: z.array(z.object({ id: z.string().min(1), name: z.string(), tag: z.string() }).passthrough()).min(1),
  panels: z.array(z.object({ id: z.string().min(1), panelNumber: z.number().int().positive(), action: z.string() }).passthrough()).min(1),
  locationLock: z.object({ geography: z.string(), lightingKeys: z.string() }).passthrough(),
}).passthrough();

const settingsSchema = z.object({
  targetAI: z.enum(["google_flow", "veo", "kling", "runway_gen4"]),
  matureContent: z.boolean(),
  negativeGuardrails: z.boolean(),
  compactPrompts: z.boolean(),
});

const workspaceDocumentSchema = z.object({
  schemaVersion: z.literal(CURRENT_WORKSPACE_SCHEMA_VERSION),
  id: z.literal("current"),
  workspaceId: z.string().min(1),
  project: projectSchema,
  storyMap: storyMapSchema,
  propLibrary: z.array(propAssetSchema),
  activeStoryboardId: z.string().min(1),
  storyboards: z.array(z.object({ id: z.string().min(1), title: z.string(), project: projectSchema, storyMap: storyMapSchema })).min(1),
  settings: settingsSchema,
  activeStep: z.enum(["storymap", "character", "outfit-pose", "storyboard", "video", "auditor"]),
  updatedAt: z.string(),
});

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceDocument["settings"] = {
  targetAI: "google_flow",
  matureContent: false,
  negativeGuardrails: true,
  compactPrompts: true,
};

export function migrateWorkspaceDocument(input: unknown): WorkspaceDocument {
  if (!input || typeof input !== "object") throw new Error("Workspace document is missing or unreadable.");
  const legacy = input as Partial<WorkspaceDocument>;
  const migrated = {
    ...legacy,
    schemaVersion: CURRENT_WORKSPACE_SCHEMA_VERSION,
    settings: { ...DEFAULT_WORKSPACE_SETTINGS, ...legacy.settings },
    propLibrary: legacy.propLibrary || [],
  };
  return workspaceDocumentSchema.parse(migrated) as unknown as WorkspaceDocument;
}

export function validateWorkspaceDocument(input: unknown) {
  return workspaceDocumentSchema.safeParse(input);
}
