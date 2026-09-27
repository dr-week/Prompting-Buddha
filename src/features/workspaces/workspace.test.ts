import { describe, expect, it } from "vitest";
import { cloneStoryboardContinuity, createDefaultStoryMap, createWorkspaceProject } from "./defaults";
import { migrateWorkspaceDocument, validateWorkspaceDocument, DEFAULT_WORKSPACE_SETTINGS } from "./schema";
import { CURRENT_WORKSPACE_SCHEMA_VERSION } from "./types";
import { validateMindMap } from "@/features/story-map/data/mind-map-rules";

describe("workspace persistence contract & data flow", () => {
  it("migrates an unversioned workspace without discarding its story", () => {
    const project = createWorkspaceProject("Test story", "One observable moment");
    const storyMap = createDefaultStoryMap("Test story", "One observable moment", project.cast[0]);
    const legacy = {
      id: "current",
      workspaceId: "workspace_test",
      project,
      storyMap,
      activeStoryboardId: "storyboard_1",
      storyboards: [{ id: "storyboard_1", title: "Storyboard 01", project, storyMap }],
      settings: { targetAI: "google_flow", matureContent: false, negativeGuardrails: true, compactPrompts: true },
      activeStep: "character",
      updatedAt: new Date().toISOString(),
    };
    const migrated = migrateWorkspaceDocument(legacy);
    expect(migrated.schemaVersion).toBe(CURRENT_WORKSPACE_SCHEMA_VERSION);
    expect(migrated.project.sceneBeat).toBe("One observable moment");
    expect(migrated.propLibrary).toEqual([]);
    expect(validateWorkspaceDocument(migrated).success).toBe(true);
  });

  it("safely fills default settings when legacy settings are missing or partial", () => {
    const project = createWorkspaceProject("Partial settings story", "Minimal logline");
    const storyMap = createDefaultStoryMap("Partial settings story", "Minimal logline", project.cast[0]);
    const partialDoc = {
      id: "current",
      workspaceId: "workspace_partial",
      project,
      storyMap,
      activeStoryboardId: "sb_1",
      storyboards: [{ id: "sb_1", title: "Storyboard 01", project, storyMap }],
      activeStep: "storymap",
      updatedAt: new Date().toISOString(),
    };
    const migrated = migrateWorkspaceDocument(partialDoc);
    expect(migrated.settings).toEqual(DEFAULT_WORKSPACE_SETTINGS);
    expect(validateWorkspaceDocument(migrated).success).toBe(true);
  });

  it("throws a descriptive error when input is null, undefined or not an object", () => {
    expect(() => migrateWorkspaceDocument(null)).toThrow("Workspace document is missing or unreadable.");
    expect(() => migrateWorkspaceDocument(undefined)).toThrow("Workspace document is missing or unreadable.");
    expect(() => migrateWorkspaceDocument("string_data")).toThrow("Workspace document is missing or unreadable.");
  });

  it("clones a storyboard while preserving continuity and isolating entity ids", () => {
    const project = createWorkspaceProject("Test story", "One observable moment");
    const storyMap = createDefaultStoryMap("Test story", "One observable moment", project.cast[0]);
    const cloned = cloneStoryboardContinuity(project, storyMap);
    expect(cloned.project.cast).toEqual(project.cast);
    expect(cloned.project.sceneBeat).toBe(project.sceneBeat);
    expect(cloned.project.panels[0].id).not.toBe(project.panels[0].id);
    expect(cloned.storyMap.nodes[0].id).not.toBe(storyMap.nodes[0].id);
    expect(
      cloned.storyMap.edges.every(
        (edge) =>
          cloned.storyMap.nodes.some((node) => node.id === edge.source) &&
          cloned.storyMap.nodes.some((node) => node.id === edge.target)
      )
    ).toBe(true);
  });

  it("createWorkspaceProject creates valid primary character and panels", () => {
    const project = createWorkspaceProject("Night Shift", "Sunita finishes her shift");
    expect(project.projectTitle).toBe("Night Shift");
    expect(project.sceneBeat).toBe("Sunita finishes her shift");
    expect(project.cast.length).toBeGreaterThanOrEqual(1);
    expect(project.cast[0].tag).toMatch(/^@CHAR_[A-Z0-9_]+$/);
    expect(project.panels.length).toBe(4);
    expect(project.panels[0].panelNumber).toBe(1);
    expect(project.panels[3].panelNumber).toBe(4);
  });

  it("createDefaultStoryMap produces a connected, valid graph with 0 blocking issues", () => {
    const project = createWorkspaceProject("Dawn Call", "Early morning coffee");
    const map = createDefaultStoryMap("Dawn Call", "Early morning coffee", project.cast[0]);
    const issues = validateMindMap(map.nodes, map.edges, []);
    const errors = issues.filter((i) => i.kind === "error");
    expect(errors).toHaveLength(0);
    expect(map.nodes.some((n) => n.kind === "story")).toBe(true);
    expect(map.nodes.some((n) => n.kind === "character")).toBe(true);
  });
});
