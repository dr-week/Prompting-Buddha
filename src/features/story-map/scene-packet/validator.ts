import type { ScenePacket, ScenePacketIssue } from "./types";

export function validateScenePacket(packet: ScenePacket): ScenePacketIssue[] {
  const issues: ScenePacketIssue[] = [];
  if (!packet.story) issues.push({ kind: "error", message: "Add a story idea." });
  if (!packet.characters.length) issues.push({ kind: "error", message: "Add at least one character." });
  if (packet.characters.length > 3) issues.push({ kind: "error", message: "Use no more than three characters." });
  if (!packet.environment) issues.push({ kind: "error", message: "Choose one environment." });
  if (!packet.time) issues.push({ kind: "warning", message: "Add a time for continuity." });
  if (!packet.beats.length) issues.push({ kind: "error", message: "Add one visible beat." });
  if (packet.dialogue && !packet.dialogue.speakerName && !packet.dialogue.speakerReferenceId) issues.push({ kind: "error", message: "Connect dialogue to its speaker." });
  return issues;
}
