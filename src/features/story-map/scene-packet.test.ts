import { describe, expect, it } from "vitest";
import { buildScenePacket, validateScenePacket } from "./scene-packet";

describe("Scene Packet", () => {
  it("keeps a scene compact and limited to three characters", () => {
    const nodes = [
      { id: "s", kind: "story" as const, label: "Story", detail: "Morning routine", position: { x: 0, y: 0 } },
      { id: "e", kind: "environment" as const, label: "Home", detail: "Old home", position: { x: 0, y: 0 } },
      { id: "props", kind: "props" as const, label: "Props", detail: "Kettle and cup", position: { x: 0, y: 0 } },
      ...["a", "b", "c", "d"].map((id) => ({ id, kind: "character" as const, label: id, detail: id, position: { x: 0, y: 0 } })),
      { id: "beat", kind: "beat" as const, label: "Tea", detail: "Makes tea", position: { x: 0, y: 0 } },
      { id: "orphan-beat", kind: "beat" as const, label: "Wrong", detail: "Must not compile", position: { x: 0, y: 0 } },
    ];
    const packet = buildScenePacket(nodes, [
      { id: "story-env", source: "s", target: "e" },
      { id: "story-props", source: "s", target: "props" },
      ...["a", "b", "c"].map((id) => ({ id: `e-${id}`, source: "e", target: id })),
      { id: "env-beat", source: "e", target: "beat" },
    ]);
    expect(packet.characters).toHaveLength(3);
    expect(packet.characters.map((character) => character.name)).toEqual(["a", "b", "c"]);
    expect(packet.beats).toEqual(["Makes tea"]);
    expect(packet.props).toBe("Kettle and cup");
    expect(validateScenePacket(packet).some((issue) => issue.kind === "error")).toBe(false);
  });
});
