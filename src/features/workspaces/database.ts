import Dexie, { type EntityTable } from "dexie";
import type { WorkspaceDocument, WorkspaceSummary } from "./types";
import { migrateWorkspaceDocument, validateWorkspaceDocument } from "./schema";

const REGISTRY_NAME = "prompting-buddha-registry";
const WORKSPACE_PREFIX = "prompting-buddha-workspace-";

class WorkspaceRegistry extends Dexie {
  workspaces!: EntityTable<WorkspaceSummary, "id">;

  constructor() {
    super(REGISTRY_NAME);
    this.version(1).stores({ workspaces: "id, updatedAt, createdAt" });
  }
}

class WorkspaceDatabase extends Dexie {
  documents!: EntityTable<WorkspaceDocument, "id">;

  constructor(workspaceId: string) {
    super(`${WORKSPACE_PREFIX}${workspaceId}`);
    this.version(1).stores({ documents: "id, workspaceId, updatedAt" });
  }
}

export const workspaceRegistry = new WorkspaceRegistry();

export function openWorkspaceDatabase(workspaceId: string) {
  return new WorkspaceDatabase(workspaceId);
}

export async function listWorkspaces() {
  const items = await workspaceRegistry.workspaces.orderBy("updatedAt").toArray();
  return items.toReversed();
}

export async function saveWorkspaceSummary(summary: WorkspaceSummary) {
  await workspaceRegistry.workspaces.put(summary);
}

export async function removeWorkspace(workspaceId: string) {
  await workspaceRegistry.workspaces.delete(workspaceId);
  const database = openWorkspaceDatabase(workspaceId);
  database.close();
  await Dexie.delete(`${WORKSPACE_PREFIX}${workspaceId}`);
}

export async function loadWorkspaceDocument(workspaceId: string) {
  const database = openWorkspaceDatabase(workspaceId);
  try {
    const stored = await database.documents.get("current");
    return stored ? migrateWorkspaceDocument(stored) : undefined;
  } finally {
    database.close();
  }
}

export async function saveWorkspaceDocument(document: WorkspaceDocument) {
  const validation = validateWorkspaceDocument(document);
  if (!validation.success) throw new Error(`Workspace validation failed: ${validation.error.issues[0]?.message || "invalid document"}`);
  const database = openWorkspaceDatabase(document.workspaceId);
  try {
    await database.documents.put(document);
  } finally {
    database.close();
  }
}
