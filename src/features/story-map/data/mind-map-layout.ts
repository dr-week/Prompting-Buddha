import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";
import { createId } from "@/lib/id";
import { sanitizeMindMapEdges } from "./mind-map-rules";

const ORDER = ["story", "character", "environment", "time", "props", "narration", "dialogue", "beat"] as const;

export const MIND_MAP_GEOMETRY = {
  nodeWidth: 220,
  nodeHeight: 110,
  horizontalGap: 48,
  verticalGap: 56,
} as const;

const SLOT_X = MIND_MAP_GEOMETRY.nodeWidth + MIND_MAP_GEOMETRY.horizontalGap;
const SLOT_Y = MIND_MAP_GEOMETRY.nodeHeight + MIND_MAP_GEOMETRY.verticalGap;

function nodesConflict(a: StoryMapNode, b: StoryMapNode) {
  return Math.abs(a.position.x - b.position.x) < SLOT_X && Math.abs(a.position.y - b.position.y) < SLOT_Y;
}

/** Keeps every node inside a visual slot with a guaranteed clear gutter. */
export function repelOverlappingNodes(nodes: StoryMapNode[], anchoredNodeId?: string) {
  const anchored = anchoredNodeId ? nodes.find((node) => node.id === anchoredNodeId) : undefined;
  const ordered = anchored ? [anchored, ...nodes.filter((node) => node.id !== anchoredNodeId)] : nodes;
  const placed: StoryMapNode[] = [];

  for (const node of ordered) {
    let candidate = { ...node, position: { ...node.position } };
    if (placed.some((other) => nodesConflict(candidate, other))) {
      const origin = node.position;
      const candidates: Array<{ x: number; y: number }> = [];
      for (let radius = 1; radius <= Math.max(6, nodes.length); radius += 1) {
        for (let offset = -radius; offset <= radius; offset += 1) {
          candidates.push(
            { x: origin.x + offset * SLOT_X, y: origin.y - radius * SLOT_Y },
            { x: origin.x + offset * SLOT_X, y: origin.y + radius * SLOT_Y },
          );
        }
        for (let offset = -radius + 1; offset < radius; offset += 1) {
          candidates.push(
            { x: origin.x - radius * SLOT_X, y: origin.y + offset * SLOT_Y },
            { x: origin.x + radius * SLOT_X, y: origin.y + offset * SLOT_Y },
          );
        }
      }
      const free = candidates.find((position) => !placed.some((other) => nodesConflict({ ...candidate, position }, other)));
      if (free) candidate = { ...candidate, position: free };
    }
    placed.push(candidate);
  }

  const positions = new Map(placed.map((node) => [node.id, node.position]));
  return nodes.map((node) => ({ ...node, position: positions.get(node.id) || node.position }));
}

export function normalizeMindMap(nodes: StoryMapNode[], edges: StoryMapEdge[]) {
  const singletonKinds = new Set(["story", "environment", "time", "props", "narration"]);
  const seenKinds = new Set<string>();
  const keptNodes = nodes.filter((node) => {
    if (!singletonKinds.has(node.kind)) return true;
    if (seenKinds.has(node.kind)) return false;
    seenKinds.add(node.kind);
    return true;
  });
  const keptIds = new Set(keptNodes.map((node) => node.id));
  const cleanEdges = sanitizeMindMapEdges(keptNodes, edges.filter((edge) => keptIds.has(edge.source) && keptIds.has(edge.target)));
  return { nodes: keptNodes, edges: cleanEdges };
}

export function organizeMindMap(nodes: StoryMapNode[], edges: StoryMapEdge[]) {
  const normalized = normalizeMindMap(nodes, edges);
  const keptNodes = normalized.nodes;
  edges = normalized.edges;
  const ordered = keptNodes.toSorted((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  const rowForKind: Record<string, number> = { story: 0, character: 1, environment: 1, time: 1, props: 2, narration: 2, dialogue: 2, beat: 3 };
  const rowGroups = new Map<number, StoryMapNode[]>();
  ordered.forEach((node) => {
    const row = rowForKind[node.kind] ?? 5;
    rowGroups.set(row, [...(rowGroups.get(row) || []), node]);
  });
  const positioned = ordered.map((node) => {
    const row = rowForKind[node.kind] ?? 5;
    const group = rowGroups.get(row) || [];
    const column = group.findIndex((item) => item.id === node.id);
    const rowWidth = (group.length - 1) * SLOT_X;
    return { ...node, position: { x: 500 - rowWidth / 2 + column * SLOT_X, y: 60 + row * SLOT_Y } };
  });
  const existing = new Set(edges.map((edge) => `${edge.source}:${edge.target}`));
  const additions: StoryMapEdge[] = [];
  const story = positioned.find((node) => node.kind === "story") || positioned[0];
  if (story) positioned.filter((node) => node.id !== story.id && ["environment", "narration"].includes(node.kind)).forEach((node) => {
    const key = `${story.id}:${node.id}`;
    if (!existing.has(key)) additions.push({ id: createId("edge"), source: story.id, target: node.id, label: "defines" });
  });
  const environment = positioned.find((node) => node.kind === "environment");
  const time = positioned.find((node) => node.kind === "time");
  if (environment && time && !existing.has(`${environment.id}:${time.id}`)) {
    additions.push({ id: createId("edge"), source: environment.id, target: time.id, label: "at" });
  }
  const props = positioned.find((node) => node.kind === "props");
  if (story && props && !existing.has(`${story.id}:${props.id}`)) {
    additions.push({ id: createId("edge"), source: story.id, target: props.id, label: "uses" });
  }
  if (environment) positioned.filter((node) => node.kind === "character").slice(0, 3).forEach((node) => {
    const key = `${environment.id}:${node.id}`;
    if (!existing.has(key)) additions.push({ id: createId("edge"), source: environment.id, target: node.id, label: "present" });
  });
  const beats = positioned.filter((node) => node.kind === "beat");
  const context = positioned.find((node) => node.kind === "narration") || environment || positioned.find((node) => node.kind === "character");
  beats.forEach((beat, index) => {
    const source = index === 0 ? context : beats[index - 1];
    if (!source) return;
    const key = `${source.id}:${beat.id}`;
    if (!existing.has(key)) additions.push({ id: createId("edge"), source: source.id, target: beat.id, label: index === 0 ? "starts" : "then" });
  });
  return { nodes: repelOverlappingNodes(positioned), edges: [...edges, ...additions] };
}
