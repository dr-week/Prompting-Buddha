import { PRODUCTION_PRESETS, type CharacterConcept, type ProductionContinuity } from "@/lib/filmmaker-compiler";
import { createId } from "@/lib/id";
import { DEFAULT_SCENE_NODE_LABELS } from "@/features/story-map/data/default-scene-graph";
import type { StoryMapEdge, StoryMapNode } from "./types";

export function createWorkspaceProject(name: string, logline: string): ProductionContinuity {
  const base = structuredClone(PRODUCTION_PRESETS.scrapyard_dawn);
  return {
    ...base,
    projectTitle: name,
    sceneBeat: logline || "Describe one observable moment for this story.",
    storyFormat: { mode: "slice_of_life" as const, capture: "raw_vlog" as const, continuity: "daily_series" as const, dialogue: "minimal" as const },
    aspectRatio: "9:16" as const,
    cast: [base.cast[0]],
    panels: base.panels.slice(0, 4).map((panel, index) => ({
      ...panel,
      id: createId("panel"),
      panelNumber: index + 1,
      charactersInFrame: [base.cast[0].name],
    })),
  };
}

export function createDefaultStoryMap(name: string, logline: string, character?: Pick<CharacterConcept, "id" | "name" | "rawInput">) {
  const project = createWorkspaceProject(name, logline);
  const canonicalProject = character ? { ...project, cast: [{ ...project.cast[0], ...character }] } : project;
  return createStoryMapFromProject(canonicalProject);
}

export function createStoryMapFromProject(project: ProductionContinuity) {
  const characters = project.cast.slice(0, 3);
  const narration = project.panels.find((panel) => panel.dialogue)?.dialogue || "Define what is heard, remembered, or left unsaid.";
  const ids = { characters: characters.map(() => createId("character")), story: createId("story"), environment: createId("environment"), time: createId("time"), narration: createId("narration"), beat: createId("beat") };
  return {
    nodes: [
      ...characters.map((castMember, index) => ({ id: ids.characters[index], kind: "character" as const, label: castMember.name || DEFAULT_SCENE_NODE_LABELS.character, detail: castMember.rawInput, referenceId: castMember.id, tags: [castMember.ageGender, castMember.socioeconomicStatus || "middle class"].filter(Boolean), position: { x: 40 + index * 280, y: 150 } })),
      { id: ids.story, kind: "story" as const, label: project.projectTitle || DEFAULT_SCENE_NODE_LABELS.story, detail: project.sceneBeat, tags: [project.storyFormat?.mode || "daily life"], position: { x: 330, y: 40 } },
      { id: ids.environment, kind: "environment" as const, label: DEFAULT_SCENE_NODE_LABELS.environment, detail: project.locationLock.geography, tags: [project.locationLock.tag || "familiar place"], position: { x: 330, y: 270 } },
      { id: ids.time, kind: "time" as const, label: DEFAULT_SCENE_NODE_LABELS.time, detail: project.locationLock.lightingKeys || "Choose a time of day.", tags: ["morning"], position: { x: 610, y: 40 } },
      { id: ids.narration, kind: "narration" as const, label: DEFAULT_SCENE_NODE_LABELS.narration, detail: narration, tags: ["observational"], position: { x: 620, y: 150 } },
      { id: ids.beat, kind: "beat" as const, label: DEFAULT_SCENE_NODE_LABELS.beat, detail: project.panels[0]?.action || "Define the first observable action.", tags: ["routine"], position: { x: 610, y: 350 } },
    ],
    edges: [
      { id: createId("edge"), source: ids.story, target: ids.environment, label: "happens in" },
      { id: createId("edge"), source: ids.story, target: ids.narration, label: "expressed by" },
      ...ids.characters.map((characterId) => ({ id: createId("edge"), source: ids.environment, target: characterId, label: "includes" })),
      { id: createId("edge"), source: ids.environment, target: ids.time, label: "at" },
      { id: createId("edge"), source: ids.narration, target: ids.beat, label: "starts" },
    ],
  };
}

export function createStoryMapFromTags(project: ProductionContinuity, tags: string[]) {
  const normalized = tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const has = (...values: string[]) => values.some((value) => normalized.includes(value));
  const subject = has("male", "man", "boy") ? "A man" : has("female", "woman", "girl") ? "A woman" : "The character";
  const classLabel = has("poor", "poverty") ? "with very limited resources" : has("rich", "wealthy") ? "with abundant resources" : has("middle", "middle-class") ? "with an ordinary middle-class life" : "";
  const time = has("morning", "dawn") ? "Morning" : has("night", "evening") ? "Night" : "Everyday";
  const routine = has("routine", "daily", "breakfast", "tea") ? "A small daily routine" : "An ordinary moment";
  const place = has("home", "room", "house") ? "A familiar home" : has("market", "shop") ? "A nearby market" : "A familiar everyday place";
  const beat = has("work", "job", "commute", "travel") ? "The routine is interrupted by a small practical need." : "A small detail changes the rhythm of the routine.";
  const taggedProject = { ...project, sceneBeat: `${time}: ${routine}. Tags: ${normalized.join(", ")}.` };
  const map = createStoryMapFromProject(taggedProject);
  return {
    ...map,
    nodes: map.nodes.map((node) => {
      if (node.kind === "story") return { ...node, label: `${time} routine`, detail: taggedProject.sceneBeat };
      if (node.kind === "character") return { ...node, label: subject, detail: `${subject} ${classLabel}. Keep the same person throughout.` };
      if (node.kind === "environment") return { ...node, label: place, detail: `${place}. Use familiar objects and lived-in details.` };
      if (node.kind === "narration") return { ...node, label: "Ambient life", detail: "Use natural sounds and minimal dialogue." };
      if (node.kind === "beat") return { ...node, label: routine, detail: beat };
      return node;
    }),
  };
}

export function cloneStoryboardContinuity(project: ProductionContinuity, storyMap: { nodes: StoryMapNode[]; edges: StoryMapEdge[] }) {
  const clonedProject = structuredClone(project);
  clonedProject.panels = clonedProject.panels.map((panel, index) => ({ ...panel, id: createId("panel"), panelNumber: index + 1 }));
  const nodeIds = new Map(storyMap.nodes.map((node) => [node.id, createId("node")]));
  return {
    project: clonedProject,
    storyMap: {
      nodes: storyMap.nodes.map((node) => ({ ...structuredClone(node), id: nodeIds.get(node.id) ?? createId("node") })),
      edges: storyMap.edges.map((edge) => ({
        ...structuredClone(edge),
        id: createId("edge"),
        source: nodeIds.get(edge.source) ?? edge.source,
        target: nodeIds.get(edge.target) ?? edge.target,
      })),
    },
  };
}
