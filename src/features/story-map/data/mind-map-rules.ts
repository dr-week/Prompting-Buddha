import type { StoryMapEdge, StoryMapNode, StoryMapNodeKind } from "@/features/workspaces/types";
import type { PropAsset } from "@/features/props/types";

export const MIND_MAP_GRAMMAR: Record<StoryMapNode["kind"], StoryMapNode["kind"][]> = {
  story: ["environment", "narration", "props"],
  environment: ["character", "time", "dialogue", "beat", "props"],
  character: ["dialogue", "beat", "props"],
  time: ["environment", "beat"],
  props: [],
  dialogue: ["character"],
  narration: ["beat"],
  beat: ["beat", "environment", "props"],
};

export function validateMindMapConnection(nodes: StoryMapNode[], edges: StoryMapEdge[], sourceId: string, targetId: string) {
  const source = nodes.find((node) => node.id === sourceId);
  const target = nodes.find((node) => node.id === targetId);
  if (!source || !target || sourceId === targetId) return { allowed: false, reason: "Choose two different nodes." };
  if (!MIND_MAP_GRAMMAR[source.kind].includes(target.kind)) return { allowed: false, reason: `${source.kind} cannot connect directly to ${target.kind}.` };
  if (edges.some((edge) => edge.source === sourceId && edge.target === targetId)) return { allowed: false, reason: "That connection already exists." };
  const pathQueue = [targetId];
  const visited = new Set<string>();
  while (pathQueue.length > 0) {
    const current = pathQueue.shift();
    if (!current) break;
    if (current === sourceId) return { allowed: false, reason: "That connection would create a story loop." };
    if (visited.has(current)) continue;
    visited.add(current);
    edges.filter((edge) => edge.source === current).forEach((edge) => pathQueue.push(edge.target));
  }
  if (source.kind === "story" && ["environment", "narration", "props"].includes(target.kind)) {
    const alreadyHasOne = edges.some((edge) => edge.source === sourceId && nodes.find((node) => node.id === edge.target)?.kind === target.kind);
    if (alreadyHasOne) return { allowed: false, reason: `A story can have one ${target.kind} node.` };
  }
  if (source.kind === "environment" && target.kind === "character") {
    const count = edges.filter((edge) => edge.source === sourceId && nodes.find((node) => node.id === edge.target)?.kind === "character").length;
    if (count >= 3 && !edges.some((edge) => edge.source === sourceId && edge.target === targetId)) return { allowed: false, reason: "An environment supports up to 3 characters." };
  }
  return { allowed: true as const };
}

export interface MindMapIssue { kind: "error" | "warning"; message: string }

export function sanitizeMindMapEdges(nodes: StoryMapNode[], edges: StoryMapEdge[]) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const seen = new Set<string>();
  const clean: StoryMapEdge[] = [];
  edges.forEach((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    const key = `${edge.source}:${edge.target}`;
    if (!source || !target || source.id === target.id || seen.has(key) || !MIND_MAP_GRAMMAR[source.kind].includes(target.kind)) return;
    const pathQueue = [target.id];
    const visited = new Set<string>();
    while (pathQueue.length > 0) {
      const current = pathQueue.shift();
      if (!current) break;
      if (current === source.id) return;
      if (visited.has(current)) continue;
      visited.add(current);
      clean.filter((candidate) => candidate.source === current).forEach((candidate) => pathQueue.push(candidate.target));
    }
    seen.add(key);
    clean.push(edge);
  });
  return clean;
}

export function validateMindMap(nodes: StoryMapNode[], edges: StoryMapEdge[], propLibrary: PropAsset[] = []): MindMapIssue[] {
  const issues: MindMapIssue[] = [];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const storyNodes = nodes.filter((node) => node.kind === "story");
  if (storyNodes.length !== 1) issues.push({ kind: "error", message: storyNodes.length ? "Keep one story root." : "Add one story root." });
  for (const kind of ["environment", "time", "narration"] as const) {
    if (nodes.filter((node) => node.kind === kind).length > 1) issues.push({ kind: "error", message: `Keep one ${kind} node.` });
  }
  for (const node of nodes.filter((item) => item.kind === "props")) {
    const asset = propLibrary.find((item) => item.id === node.referenceId);
    if (!node.referenceId || !asset) {
      issues.push({ kind: "error", message: `Choose a saved Prop for ${node.label || "the Props node"}.` });
      continue;
    }
    const parentKinds = edges.filter((edge) => edge.target === node.id).map((edge) => nodeById.get(edge.source)?.kind).filter((kind): kind is StoryMapNodeKind => kind !== undefined);
    if (!parentKinds.some((kind) => ["story", "environment", "beat", "character"].includes(kind))) issues.push({ kind: "error", message: `${asset.name} must connect to Story, Environment, Beat, or Character.` });
    if (asset.scope === "character" && !parentKinds.includes("character")) issues.push({ kind: "error", message: `${asset.name} is character-owned and must connect to its Character.` });
    if (asset.scope === "recurring" && !parentKinds.includes("story")) issues.push({ kind: "error", message: `${asset.name} is recurring and must connect to Story.` });
    if (asset.scope === "scene" && !parentKinds.some((kind) => kind === "environment" || kind === "beat")) issues.push({ kind: "error", message: `${asset.name} is scene-specific and must connect to Environment or Beat.` });
  }
  const seen = new Set<string>();
  edges.forEach((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    const key = `${edge.source}:${edge.target}`;
    if (!source || !target) issues.push({ kind: "error", message: "Remove a connection to a missing node." });
    else if (!MIND_MAP_GRAMMAR[source.kind].includes(target.kind)) issues.push({ kind: "error", message: `${source.kind} cannot connect to ${target.kind}.` });
    if (seen.has(key)) issues.push({ kind: "warning", message: "Remove a duplicate connection." });
    seen.add(key);
  });
  const root = storyNodes[0];
  if (root) {
    const reachable = new Set([root.id]);
    const queue = [root.id];
    while (queue.length > 0) {
      const source = queue.shift();
      if (!source) break;
      edges.filter((edge) => edge.source === source).forEach((edge) => {
        if (!reachable.has(edge.target)) {
          reachable.add(edge.target);
          queue.push(edge.target);
        }
      });
    }
    const unreachable = nodes.filter((node) => node.id !== root.id && !reachable.has(node.id));
    if (unreachable.length) issues.push({ kind: "error", message: `Connect ${unreachable.length} orphan node${unreachable.length === 1 ? "" : "s"} to the story.` });
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const cycle = edges.filter((edge) => edge.source === id).some((edge) => hasCycle(edge.target));
    visiting.delete(id); visited.add(id);
    return cycle;
  };
  if (nodes.some((node) => hasCycle(node.id))) issues.push({ kind: "error", message: "Remove the story loop." });
  return issues;
}
