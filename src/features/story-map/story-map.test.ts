import { describe, expect, it } from "vitest";
import { createDefaultStoryMap, createStoryMapFromProject, createWorkspaceProject } from "@/features/workspaces/defaults";
import { MIND_MAP_GRAMMAR, sanitizeMindMapEdges, validateMindMap, validateMindMapConnection } from "./data/mind-map-rules";
import { MIND_MAP_GEOMETRY, organizeMindMap, repelOverlappingNodes } from "./data/mind-map-layout";
import { randomizeUnlockedNodes, resetMindMapPreservingLocks } from "./actions/randomize-map";
import { redoMapHistory, undoMapHistory } from "./hooks/use-map-history";
import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";

describe("Mind Map grammar", () => {
  it("accepts every declared grammar pair and rejects undeclared pairs", () => {
    const kinds = Object.keys(MIND_MAP_GRAMMAR) as Array<keyof typeof MIND_MAP_GRAMMAR>;
    for (const sourceKind of kinds) for (const targetKind of kinds) {
      const nodes = [
        { id: "source", kind: sourceKind, label: sourceKind, detail: sourceKind, position: { x: 0, y: 0 } },
        { id: "target", kind: targetKind, label: targetKind, detail: targetKind, position: { x: 0, y: 0 } },
      ];
      expect(validateMindMapConnection(nodes, [], "source", "target").allowed).toBe(MIND_MAP_GRAMMAR[sourceKind].includes(targetKind));
    }
  });

  it("enforces the three-character environment limit", () => {
    const nodes = [
      { id: "env", kind: "environment" as const, label: "Home", detail: "Home", position: { x: 0, y: 0 } },
      ...["a", "b", "c", "d"].map((id) => ({ id, kind: "character" as const, label: id, detail: id, position: { x: 0, y: 0 } })),
    ];
    const edges = ["a", "b", "c"].map((id) => ({ id: `e-${id}`, source: "env", target: id }));
    expect(validateMindMapConnection(nodes, edges, "env", "d").allowed).toBe(false);
  });

  it("removes legacy invalid, dangling, and duplicate edges without deleting notes", () => {
    const map = createDefaultStoryMap("Story", "A note worth preserving");
    const dirty = [...map.edges, map.edges[0], { id: "legacy", source: "character", target: "story" }, { id: "missing", source: "story", target: "gone" }];
    const cleaned = sanitizeMindMapEdges(map.nodes, dirty);
    expect(cleaned).toHaveLength(map.edges.length);
    expect(map.nodes.find((node) => node.kind === "story")?.detail).toBe("A note worth preserving");
  });

  it("produces grammar-valid default and character-generated maps", () => {
    const defaultMap = createDefaultStoryMap("Story", "A visible moment");
    expect(validateMindMap(defaultMap.nodes, defaultMap.edges).filter((issue) => issue.kind === "error")).toEqual([]);
    const projectMap = createStoryMapFromProject(createWorkspaceProject("Story", "A visible moment"));
    expect(validateMindMap(projectMap.nodes, projectMap.edges).filter((issue) => issue.kind === "error")).toEqual([]);
  });

  it("rejects cycles and reports orphan notes", () => {
    const nodes = [
      { id: "story", kind: "story" as const, label: "Story", detail: "Story", position: { x: 0, y: 0 } },
      { id: "env", kind: "environment" as const, label: "Place", detail: "Place", position: { x: 0, y: 0 } },
      { id: "beat", kind: "beat" as const, label: "Beat", detail: "Beat", position: { x: 0, y: 0 } },
      { id: "orphan", kind: "character" as const, label: "Orphan", detail: "Orphan", position: { x: 0, y: 0 } },
    ];
    const edges = [{ id: "a", source: "story", target: "env" }, { id: "b", source: "env", target: "beat" }];
    expect(validateMindMapConnection(nodes, edges, "beat", "env").allowed).toBe(false);
    expect(validateMindMap(nodes, edges).some((issue) => issue.message.includes("orphan"))).toBe(true);
  });

  it("repairs duplicate singleton roots without removing multiple characters", () => {
    const nodes = [
      { id: "story-a", kind: "story" as const, label: "A", detail: "A", position: { x: 0, y: 0 } },
      { id: "story-b", kind: "story" as const, label: "B", detail: "B", position: { x: 0, y: 0 } },
      ...["a", "b", "c"].map((id) => ({ id, kind: "character" as const, label: id, detail: id, position: { x: 0, y: 0 } })),
    ];
    const result = organizeMindMap(nodes, []);
    expect(result.nodes.filter((node) => node.kind === "story")).toHaveLength(1);
    expect(result.nodes.filter((node) => node.kind === "character")).toHaveLength(3);
  });

  it("organizes every node into a slot with a clear visual gutter", () => {
    const kinds = ["story", "character", "environment", "time", "props", "narration", "dialogue", "beat", "beat"] as const;
    const nodes: StoryMapNode[] = kinds.map((kind, index) => ({ id: `${kind}-${index}`, kind, label: kind, detail: kind, position: { x: 0, y: 0 } }));
    const result = organizeMindMap(nodes, []);
    for (let index = 0; index < result.nodes.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < result.nodes.length; otherIndex += 1) {
        const a = result.nodes[index];
        const b = result.nodes[otherIndex];
        const separatedX = Math.abs(a.position.x - b.position.x) >= MIND_MAP_GEOMETRY.nodeWidth + MIND_MAP_GEOMETRY.horizontalGap;
        const separatedY = Math.abs(a.position.y - b.position.y) >= MIND_MAP_GEOMETRY.nodeHeight + MIND_MAP_GEOMETRY.verticalGap;
        expect(separatedX || separatedY).toBe(true);
      }
    }
  });

  it("repels a dropped node while preserving the dragged position", () => {
    const nodes: StoryMapNode[] = [
      { id: "dragged", kind: "story", label: "Story", detail: "", position: { x: 100, y: 100 } },
      { id: "other", kind: "character", label: "Character", detail: "", position: { x: 120, y: 120 } },
    ];
    const result = repelOverlappingNodes(nodes, "dragged");
    expect(result.find((node) => node.id === "dragged")?.position).toEqual({ x: 100, y: 100 });
    expect(result.find((node) => node.id === "other")?.position).not.toEqual({ x: 120, y: 120 });
  });

  it("randomization preserves every node lock and every locked value", () => {
    const map = createDefaultStoryMap("Story", "Moment");
    const nodes: StoryMapNode[] = map.nodes.map((node) => node.kind === "environment" ? { ...node, locked: true } : node);
    const result = randomizeUnlockedNodes(nodes, map.edges, 42);
    expect(result.nodes.map(({ id, locked }) => ({ id, locked }))).toEqual(nodes.map(({ id, locked }) => ({ id, locked })));
    for (const before of nodes.filter((node) => node.locked)) expect(result.nodes.find((node) => node.id === before.id)).toEqual(before);
  });

  it("repeated randomization never unlocks nodes", () => {
    const map = createDefaultStoryMap("Story", "Moment");
    let state: { nodes: StoryMapNode[]; edges: StoryMapEdge[] } = { ...map, nodes: map.nodes.map((node) => ({ ...node, locked: node.kind === "environment" })) };
    const locks = state.nodes.map(({ id, locked }) => ({ id, locked }));
    for (let seed = 0; seed < 10; seed += 1) state = randomizeUnlockedNodes(state.nodes, state.edges, seed);
    expect(state.nodes.map(({ id, locked }) => ({ id, locked }))).toEqual(locks);
  });

  it("reset preserves current locks", () => {
    const base = createDefaultStoryMap("Story", "Moment");
    const propNode = { id: "prop-node", kind: "props" as const, label: "Phone", detail: "", referenceId: "prop-phone", position: { x: 0, y: 0 } };
    const initial = { ...base, nodes: [...base.nodes, propNode] };
    const current = initial.nodes.map((node) => ({ ...node, locked: node.kind === "props" || node.kind === "environment" }));
    const reset = resetMindMapPreservingLocks(current, initial.nodes, initial.edges);
    expect(reset.nodes.find((node) => node.kind === "props")?.locked).toBe(true);
    expect(reset.nodes.find((node) => node.kind === "environment")?.locked).toBe(true);
  });

  it("undo and redo restore lock snapshots", () => {
    const map = createDefaultStoryMap("Story", "Moment");
    const unlocked = { ...map, nodes: map.nodes.map((node) => ({ ...node, locked: false })) };
    const locked = { ...map, nodes: map.nodes.map((node) => ({ ...node, locked: node.kind === "environment" })) };
    const undone = undoMapHistory({ past: [unlocked], future: [] }, locked);
    expect(undone).not.toBeNull();
    if (!undone) return;
    expect(undone.state.nodes.find((node) => node.kind === "environment")?.locked).toBe(false);
    const redone = redoMapHistory(undone.history, undone.state);
    expect(redone?.state.nodes.find((node) => node.kind === "environment")?.locked).toBe(true);
  });

  it("allows Props only from Story, Environment, Beat, or Character", () => {
    const kinds = ["story", "environment", "beat", "character", "time"] as const;
    const nodes = [...kinds.map((kind) => ({ id: kind, kind, label: kind, detail: kind, position: { x: 0, y: 0 } })), { id: "prop", kind: "props" as const, label: "Phone", detail: "", referenceId: "phone", position: { x: 0, y: 0 } }];
    for (const kind of ["story", "environment", "beat", "character"] as const) expect(validateMindMapConnection(nodes, [], kind, "prop").allowed).toBe(true);
    expect(validateMindMapConnection(nodes, [], "time", "prop").allowed).toBe(false);
  });
});
