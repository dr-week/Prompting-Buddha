import type { ProductionContinuity } from "@/lib/filmmaker-compiler";
import type { ScenePacket } from "./types";

export function applyScenePacket(project: ProductionContinuity, packet: ScenePacket): ProductionContinuity {
  const cast = project.cast;
  const currentText = (value: string) => packet.characters.reduce((text, mapped) => {
    const character = cast.find((item) => item.id === mapped.referenceId);
    if (!character || !mapped.name || character.name === mapped.name) return text;
    return text.replace(new RegExp(`\\b${mapped.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), character.name);
  }, value);
  const dialogueSpeaker = packet.dialogue ? cast.find((character) => character.id === packet.dialogue?.speakerReferenceId)?.name || packet.dialogue.speakerName || cast[0]?.name : undefined;
  return {
    ...project,
    sceneBeat: currentText(`${packet.story}${packet.props ? ` Props: ${packet.props}.` : ""}`),
    cast,
    locationLock: packet.environment ? { ...project.locationLock, geography: packet.environment } : project.locationLock,
    panels: project.panels.map((panel, index) => ({ ...panel, action: currentText(packet.beats[index] || panel.action), charactersInFrame: panel.charactersInFrame.map((name) => currentText(name)), audioAmbience: packet.time ? `${packet.time}. ${panel.audioAmbience}` : panel.audioAmbience, dialogue: index === 0 ? packet.dialogue?.text : panel.dialogue, dialogueSpeaker: index === 0 && packet.dialogue ? dialogueSpeaker : panel.dialogueSpeaker, dialogueType: index === 0 && packet.dialogue ? "spoken_dialogue" as const : panel.dialogueType })),
  };
}
