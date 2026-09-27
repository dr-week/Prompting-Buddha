import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";
import { pickSeeded } from "@/lib/random/seeded-random";
import { assertLocksUnchanged, preserveNodeLocks } from "@/lib/locks/lock-integrity";

const VARIANTS: Record<string, string[]> = {
  story: ["A small everyday change", "An ordinary morning", "A familiar routine"],
  character: ["The familiar lead", "A tired worker", "A quiet observer"],
  environment: ["Familiar home", "Nearby market", "Quiet roadside place"],
  time: ["Morning", "Late afternoon", "Early evening"],
  narration: ["Quiet observation", "Warm everyday detail", "Natural ambient life"],
  dialogue: ["Silent", "Brief humble exchange", "Teasing remark"],
  beat: ["Notices a small problem", "Waits for a moment", "Continues the routine"],
};

export function randomizeUnlockedNodes(nodes: StoryMapNode[], edges: StoryMapEdge[], seed: number) {
  const lockSnapshot = nodes.map(({ id, locked }) => ({ id, locked }));
  const randomized = nodes.map((node) => {
      if (node.locked) return node;
      const value = pickSeeded(VARIANTS[node.kind] || [], `${seed}:${node.id}`);
      return value ? { ...node, label: value, detail: value, tags: [value.toLowerCase()] } : node;
    });
  const preserved = preserveNodeLocks(nodes, randomized, "mind-map-randomizer");
  assertLocksUnchanged(lockSnapshot, preserved.map(({ id, locked }) => ({ id, locked })), "mind-map-randomizer");
  return {
    nodes: preserved,
    edges,
  };
}

export function resetMindMapPreservingLocks(current: StoryMapNode[], initial: StoryMapNode[], edges: StoryMapEdge[]) {
  const locks = new Map(current.map((node) => [node.id, node.locked]));
  return {
    nodes: initial.map((node) => ({ ...structuredClone(node), locked: locks.get(node.id) ?? node.locked })),
    edges: structuredClone(edges),
  };
}
