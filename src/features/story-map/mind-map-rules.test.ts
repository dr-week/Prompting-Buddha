import { describe, expect, it } from "vitest";
import {
  validateMindMapConnection,
  sanitizeMindMapEdges,
  validateMindMap,
} from "./data/mind-map-rules";
import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";
import type { PropAsset } from "@/features/props/types";

describe("Mind Map Rules & Grammar", () => {
  const storyNode: StoryMapNode = { id: "n_story", kind: "story", label: "Story", detail: "", position: { x: 0, y: 0 } };
  const envNode: StoryMapNode = { id: "n_env", kind: "environment", label: "Cafe", detail: "", position: { x: 100, y: 0 } };
  const charNode: StoryMapNode = { id: "n_char", kind: "character", label: "Priya", detail: "", position: { x: 200, y: 0 } };
  const beat1: StoryMapNode = { id: "n_beat1", kind: "beat", label: "Order tea", detail: "", position: { x: 300, y: 0 } };
  const beat2: StoryMapNode = { id: "n_beat2", kind: "beat", label: "Sip tea", detail: "", position: { x: 400, y: 0 } };
  const propNode: StoryMapNode = { id: "n_prop", kind: "props", label: "Teacup", detail: "", referenceId: "prop_cup", position: { x: 500, y: 0 } };

  const propAsset: PropAsset = {
    id: "prop_cup",
    name: "Ceramic Teacup",
    category: "food",
    scope: "scene",
    description: "Ceramic teacup with chipped rim",
    tags: ["teacup", "chipped"],
    locked: false,
    savedToLibrary: true,
  };

  it("permits valid transitions defined in grammar", () => {
    const nodes = [storyNode, envNode, charNode];
    const edges: StoryMapEdge[] = [];

    // Story -> Environment is allowed
    const res1 = validateMindMapConnection(nodes, edges, "n_story", "n_env");
    expect(res1.allowed).toBe(true);

    // Environment -> Character is allowed
    const res2 = validateMindMapConnection(nodes, edges, "n_env", "n_char");
    expect(res2.allowed).toBe(true);
  });

  it("blocks direct connections that violate grammar", () => {
    const nodes = [storyNode, charNode];
    const edges: StoryMapEdge[] = [];

    // Story cannot connect directly to Character in grammar
    const res = validateMindMapConnection(nodes, edges, "n_story", "n_char");
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("cannot connect directly");
  });

  it("detects and prevents cycles / loops", () => {
    const nodes = [beat1, beat2];
    const edges: StoryMapEdge[] = [{ id: "e1", source: "n_beat1", target: "n_beat2" }];

    // Connecting beat2 back to beat1 creates a cycle
    const res = validateMindMapConnection(nodes, edges, "n_beat2", "n_beat1");
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("create a story loop");
  });

  it("sanitizes duplicate and illegal edges", () => {
    const nodes = [storyNode, envNode, charNode];
    const edges: StoryMapEdge[] = [
      { id: "e1", source: "n_story", target: "n_env" },
      { id: "e1_dup", source: "n_story", target: "n_env" }, // duplicate
      { id: "e_illegal", source: "n_story", target: "n_char" }, // illegal grammar
      { id: "e_self", source: "n_story", target: "n_story" }, // self loop
    ];

    const clean = sanitizeMindMapEdges(nodes, edges);
    expect(clean).toHaveLength(1);
    expect(clean[0].id).toBe("e1");
  });

  it("validates orphan nodes and prop dependencies", () => {
    const nodes = [storyNode, envNode, propNode];
    // Missing edge to propNode
    const edges: StoryMapEdge[] = [{ id: "e1", source: "n_story", target: "n_env" }];

    const issues = validateMindMap(nodes, edges, [propAsset]);
    // Orphan node detected
    expect(issues.some((i) => i.message.includes("orphan node"))).toBe(true);
    // Prop connection required
    expect(issues.some((i) => i.message.includes("must connect to"))).toBe(true);
  });
});
