"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cloneStoryboardContinuity, createDefaultStoryMap, createWorkspaceProject } from "./defaults";
import {
  listWorkspaces,
  loadWorkspaceDocument,
  removeWorkspace,
  saveWorkspaceDocument,
  saveWorkspaceSummary,
} from "./database";
import { CURRENT_WORKSPACE_SCHEMA_VERSION, type StoryMapEdge, type StoryMapNode, type WorkflowStep, type WorkspaceDocument, type WorkspaceSummary } from "./types";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";
import { createId } from "@/lib/id";
import { normalizeMindMap } from "@/features/story-map/data/mind-map-layout";
import { DEFAULT_WORKSPACE_SETTINGS } from "./schema";
import type { PropAsset } from "@/features/props/types";

const STARTER_NAME = "Scrapyard Dawn";
const STARTER_LOGLINE = "Arjun wakes inside his scrapyard home before dawn and prepares to face the day.";
const STATIC_STARTER_WORKSPACE: WorkspaceSummary = {
  id: "workspace_default",
  name: STARTER_NAME,
  logline: STARTER_LOGLINE,
  createdAt: "2026-09-20T00:00:00.000Z",
  updatedAt: "2026-09-20T00:00:00.000Z"
};

function getStaticStarterDocument(): WorkspaceDocument {
  const project = createWorkspaceProject(STARTER_NAME, STARTER_LOGLINE);
  const storyMap = createDefaultStoryMap(STARTER_NAME, STARTER_LOGLINE, project.cast[0]);
  return {
    schemaVersion: CURRENT_WORKSPACE_SCHEMA_VERSION,
    id: "current",
    workspaceId: STATIC_STARTER_WORKSPACE.id,
    project,
    storyMap,
    propLibrary: [],
    activeStoryboardId: "sb_default",
    storyboards: [{ id: "sb_default", title: "Storyboard 01", project, storyMap }],
    settings: DEFAULT_WORKSPACE_SETTINGS,
    activeStep: "character",
    updatedAt: "2026-09-20T00:00:00.000Z"
  };
}

export function useWorkspaceStudio() {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([STATIC_STARTER_WORKSPACE]);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceSummary | null>(STATIC_STARTER_WORKSPACE);
  const [document, setDocument] = useState<WorkspaceDocument | null>(getStaticStarterDocument);
  const ready = true;
  const [error, setError] = useState<string | null>(null);
  const initializationStarted = useRef(false);

  const refresh = useCallback(async () => setWorkspaces(await listWorkspaces()), []);

  const openWorkspace = useCallback(async (workspace: WorkspaceSummary) => {
    const stored = await loadWorkspaceDocument(workspace.id);
    if (!stored) return;
    const storedMap = stored.storyMap ?? createDefaultStoryMap(workspace.name, workspace.logline, stored.project.cast[0]);
    storedMap.nodes = storedMap.nodes.map((node) => node.kind === "character" && !node.referenceId && stored.project.cast[0] ? { ...node, referenceId: stored.project.cast[0].id } : node);
    const storyMap = normalizeMindMap(storedMap.nodes, storedMap.edges);
    const storyboardId = stored.activeStoryboardId ?? createId("storyboard");
    const storyboards = (stored.storyboards ?? [{ id: storyboardId, title: "Storyboard 01", project: stored.project, storyMap }]).map((storyboard) => ({
      ...storyboard,
      storyMap: normalizeMindMap(
        storyboard.storyMap.nodes.map((node) => node.kind === "character" && !node.referenceId && storyboard.project.cast[0] ? { ...node, referenceId: storyboard.project.cast[0].id } : node),
        storyboard.storyMap.edges,
      ),
    }));
    setActiveWorkspace(workspace);
    const activeStoryboard = storyboards.find((storyboard) => storyboard.id === storyboardId) || storyboards[0];
    setDocument({ ...stored, storyMap: activeStoryboard?.storyMap || storyMap, project: activeStoryboard?.project || stored.project, activeStoryboardId: activeStoryboard?.id || storyboardId, storyboards, settings: stored.settings ?? DEFAULT_WORKSPACE_SETTINGS });
  }, []);

  const createWorkspace = useCallback(async (name: string, logline: string) => {
    const now = new Date().toISOString();
    const workspace: WorkspaceSummary = {
      id: createId("workspace"),
      name: name.trim() || "Untitled story",
      logline: logline.trim(),
      createdAt: now,
      updatedAt: now,
    };
    const project = createWorkspaceProject(workspace.name, workspace.logline);
    const nextDocument: WorkspaceDocument = {
      schemaVersion: CURRENT_WORKSPACE_SCHEMA_VERSION,
      id: "current",
      workspaceId: workspace.id,
      project,
      storyMap: createDefaultStoryMap(workspace.name, workspace.logline, project.cast[0]),
      propLibrary: [],
      activeStoryboardId: "",
      storyboards: [],
      settings: DEFAULT_WORKSPACE_SETTINGS,
      activeStep: "character",
      updatedAt: now,
    };
    const storyboardId = createId("storyboard");
    nextDocument.activeStoryboardId = storyboardId;
    nextDocument.storyboards = [{ id: storyboardId, title: "Storyboard 01", project: nextDocument.project, storyMap: nextDocument.storyMap }];
    await Promise.all([saveWorkspaceSummary(workspace), saveWorkspaceDocument(nextDocument)]);
    await refresh();
    setActiveWorkspace(workspace);
    setDocument(nextDocument);
  }, [refresh]);

  useEffect(() => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;
    async function initialise() {
      try {
        const stored = await listWorkspaces();
        if (stored.length === 0) {
          await Promise.all([saveWorkspaceSummary(STATIC_STARTER_WORKSPACE), saveWorkspaceDocument(getStaticStarterDocument())]);
        } else {
          setWorkspaces(stored);
          await openWorkspace(stored[0]);
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Workspace changes may not persist in this browser.");
      }
    }
    void initialise();
  }, [openWorkspace]);

  useEffect(() => {
    if (!ready || !document) return;
    const timeout = window.setTimeout(() => { void saveWorkspaceDocument(document); }, 500);
    return () => window.clearTimeout(timeout);
  }, [document, ready]);

  const updateProject = useCallback((updater: (project: ProductionContinuity) => ProductionContinuity) => {
    setDocument((current) => {
      if (!current) return current;
      const project = updater(current.project);
      return { ...current, project, storyboards: current.storyboards.map((item) => item.id === current.activeStoryboardId ? { ...item, project } : item), updatedAt: new Date().toISOString() };
    });
  }, []);

  const setStep = useCallback((step: WorkflowStep) => {
    setDocument((current) => current ? { ...current, activeStep: step } : current);
  }, []);

  const updateStoryMap = useCallback((storyMap: { nodes: StoryMapNode[]; edges: StoryMapEdge[] }) => {
    const normalizedMap = normalizeMindMap(storyMap.nodes, storyMap.edges);
    setDocument((current) => current ? { ...current, storyMap: normalizedMap, storyboards: current.storyboards.map((item) => item.id === current.activeStoryboardId ? { ...item, storyMap: normalizedMap } : item), updatedAt: new Date().toISOString() } : current);
  }, []);

  const addStoryboard = useCallback(() => {
    setDocument((current) => {
      if (!current || !activeWorkspace) return current;
      const id = createId("storyboard");
      const title = `Storyboard ${String(current.storyboards.length + 1).padStart(2, "0")}`;
      const { project, storyMap } = cloneStoryboardContinuity(current.project, current.storyMap);
      return { ...current, activeStoryboardId: id, storyboards: [...current.storyboards, { id, title, project, storyMap }], project, storyMap, activeStep: "character", updatedAt: new Date().toISOString() };
    });
  }, [activeWorkspace]);

  const openStoryboard = useCallback((storyboardId: string) => {
    setDocument((current) => {
      const storyboard = current?.storyboards.find((item) => item.id === storyboardId);
      return current && storyboard ? { ...current, activeStoryboardId: storyboardId, project: storyboard.project, storyMap: storyboard.storyMap, activeStep: "character" } : current;
    });
  }, []);

  const updateSettings = useCallback((settings: WorkspaceDocument["settings"]) => {
    setDocument((current) => current ? { ...current, settings, updatedAt: new Date().toISOString() } : current);
  }, []);

  const upsertProp = useCallback((asset: PropAsset) => {
    setDocument((current) => current ? { ...current, propLibrary: [...current.propLibrary.filter((item) => item.id !== asset.id), structuredClone(asset)], updatedAt: new Date().toISOString() } : current);
  }, []);

  const save = useCallback(async () => {
    if (!document || !activeWorkspace) return;
    const now = new Date().toISOString();
    const updatedDocument = { ...document, updatedAt: now };
    const updatedWorkspace = {
      ...activeWorkspace,
      name: document.project.projectTitle,
      logline: document.project.sceneBeat,
      updatedAt: now,
    };
    await Promise.all([saveWorkspaceDocument(updatedDocument), saveWorkspaceSummary(updatedWorkspace)]);
    setDocument(updatedDocument);
    setActiveWorkspace(updatedWorkspace);
    await refresh();
  }, [activeWorkspace, document, refresh]);

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    await removeWorkspace(workspaceId);
    const remaining = await listWorkspaces();
    setWorkspaces(remaining);
    if (activeWorkspace?.id === workspaceId) {
      setActiveWorkspace(null);
      setDocument(null);
      if (remaining[0]) await openWorkspace(remaining[0]);
    }
  }, [activeWorkspace?.id, openWorkspace]);

  return {
    ready, error, workspaces, activeWorkspace, document,
    createWorkspace, openWorkspace, deleteWorkspace,
    updateProject, updateStoryMap, updateSettings, upsertProp, addStoryboard, openStoryboard, setStep, save,
  };
}
