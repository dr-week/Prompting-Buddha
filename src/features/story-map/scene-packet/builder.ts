import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";
import type { PropAsset } from "@/features/props/types";
import type { ScenePacket } from "./types";

const byPosition = (a: StoryMapNode, b: StoryMapNode) => a.position.y - b.position.y || a.position.x - b.position.x;

export function buildScenePacket(nodes: StoryMapNode[], edges: StoryMapEdge[], propLibrary: PropAsset[] = []): ScenePacket {
  const root = nodes.find((node) => node.kind === "story");
  const reachableIds = new Set<string>(root ? [root.id] : []);
  const queue = root ? [root.id] : [];
  while (queue.length > 0) {
    const source = queue.shift();
    if (!source) break;
    edges.filter((edge) => edge.source === source).forEach((edge) => { if (!reachableIds.has(edge.target)) { reachableIds.add(edge.target); queue.push(edge.target); } });
  }
  const connected = nodes.filter((node) => reachableIds.has(node.id));
  const find = (kind: StoryMapNode["kind"]) => connected.find((node) => node.kind === kind);
  const characters = connected.filter((node) => node.kind === "character");
  const beatNodes = connected.filter((node) => node.kind === "beat");
  const beatIds = new Set(beatNodes.map((node) => node.id));
  const indegree = new Map(beatNodes.map((node) => [node.id, 0]));
  edges.forEach((edge) => { if (beatIds.has(edge.source) && beatIds.has(edge.target)) indegree.set(edge.target, (indegree.get(edge.target) || 0) + 1); });
  const pending = beatNodes.filter((node) => indegree.get(node.id) === 0).toSorted(byPosition);
  const beats: StoryMapNode[] = [];
  while (pending.length > 0) {
    const beat = pending.shift();
    if (!beat) break;
    beats.push(beat);
    edges.filter((edge) => edge.source === beat.id && beatIds.has(edge.target)).forEach((edge) => {
      const nextDegree = (indegree.get(edge.target) || 0) - 1;
      indegree.set(edge.target, nextDegree);
      if (nextDegree === 0) {
        const next = beatNodes.find((node) => node.id === edge.target);
        if (next) pending.push(next);
        pending.sort(byPosition);
      }
    });
  }
  const dialogueNode = find("dialogue");
  const speaker = dialogueNode ? characters.find((character) => edges.some((edge) => edge.source === character.id && edge.target === dialogueNode.id)) : undefined;
  return {
    story: find("story")?.detail || "",
    characters: characters.map((node) => ({ referenceId: node.referenceId, name: node.label, detail: node.detail || node.label })),
    environment: find("environment")?.detail || "",
    time: find("time")?.detail || "",
    props: connected.filter((node) => node.kind === "props").map((node) => {
      const asset = propLibrary.find((item) => item.id === node.referenceId);
      if (!asset) return node.detail || node.label;
      return [asset.name, asset.description, asset.material, asset.color, asset.condition, ...(node.tags || [])].filter(Boolean).join(", ");
    }).filter(Boolean).join("; ") || undefined,
    beats: beats.map((node) => node.detail || node.label),
    narration: find("narration")?.detail,
    dialogue: dialogueNode ? { text: dialogueNode.detail, speakerReferenceId: speaker?.referenceId, speakerName: speaker?.label } : undefined,
  };
}
