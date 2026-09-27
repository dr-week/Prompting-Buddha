import { useCallback, useMemo, useRef, useState } from "react";
import { addEdge, applyEdgeChanges, applyNodeChanges, MarkerType, Position, type Connection, type Edge, type EdgeChange, type Node, type OnNodesChange } from "@xyflow/react";
import type { StoryMapEdge, StoryMapNode, StoryMapNodeKind } from "@/features/workspaces/types";
import type { ShotFraming } from "@/lib/filmmaker-compiler";
import { predictLaya } from "@/lib/laya/client";
import { SHOT_FRAMING_SCHEMA } from "@/lib/laya/schemas";
import { createId } from "@/lib/id";
import { randomizeUnlockedNodes, resetMindMapPreservingLocks } from "../actions/randomize-map";
import { organizeMindMap, repelOverlappingNodes } from "../data/mind-map-layout";
import { NODE_DEFINITIONS } from "../data/node-definitions";
import { sanitizeMindMapEdges, validateMindMap, validateMindMapConnection } from "../data/mind-map-rules";
import { buildScenePacket, validateScenePacket } from "../scene-packet";
import type { StoryNodeData } from "../nodes/story-node";
import { useMapHistory } from "./use-map-history";
import { useMapShortcuts } from "./use-map-shortcuts";
import type { PropAsset } from "@/features/props/types";

export const STORY_EDGE_OPTIONS = {
  type: "smoothstep",
  animated: false,
  zIndex: 1,
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#6b665c" },
  style: { stroke: "#6b665c", strokeWidth: 3, opacity: 1 },
} as const;

const STORY_NODE_GEOMETRY = { width: 220, height: 92, handleSize: 14 } as const;

export function useStoryMapController({ nodes, edges, propLibrary, onChange, scopeId }: {
  nodes: StoryMapNode[];
  edges: StoryMapEdge[];
  propLibrary: PropAsset[];
  onChange: (map: { nodes: StoryMapNode[]; edges: StoryMapEdge[] }) => void;
  scopeId: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generationSeed, setGenerationSeed] = useState(() => Date.now());
  const initialMap = useRef({ nodes, edges });
  const { commit, undo, redo } = useMapHistory({ nodes, edges }, onChange, scopeId);
  const selected = nodes.find((node) => node.id === selectedId);

  const toggleLock = useCallback((nodeId: string) => {
    commit({ nodes: nodes.map((node) => node.id === nodeId ? { ...node, locked: !node.locked } : node), edges });
  }, [commit, edges, nodes]);

  const flowNodes: Node<StoryNodeData>[] = useMemo(() => nodes.map((node) => ({
    id: node.id,
    type: "storyNode",
    position: node.position,
    initialWidth: STORY_NODE_GEOMETRY.width,
    initialHeight: STORY_NODE_GEOMETRY.height,
    handles: [
      { type: "target", position: Position.Top, x: 103, y: -7, width: STORY_NODE_GEOMETRY.handleSize, height: STORY_NODE_GEOMETRY.handleSize },
      { type: "source", position: Position.Bottom, x: 103, y: 85, width: STORY_NODE_GEOMETRY.handleSize, height: STORY_NODE_GEOMETRY.handleSize },
    ],
    data: {
      title: node.label,
      detail: node.detail,
      tags: node.tags,
      locked: node.locked,
      referenceId: node.referenceId,
      framing: node.framing,
      onToggleLock: () => toggleLock(node.id),
      kind: node.kind,
      isExpanded: selectedId === node.id,
    },
  })), [nodes, selectedId, toggleLock]);

  const flowEdges: Edge[] = useMemo(() => edges.map((edge) => ({ ...edge, ...STORY_EDGE_OPTIONS })), [edges]);

  const randomize = useCallback(() => {
    const seed = generationSeed + 1;
    setGenerationSeed(seed);
    commit(randomizeUnlockedNodes(nodes, edges, seed));
  }, [commit, edges, generationSeed, nodes]);

  const reset = useCallback(() => {
    const resetMap = resetMindMapPreservingLocks(nodes, initialMap.current.nodes, initialMap.current.edges);
    commit(organizeMindMap(resetMap.nodes, resetMap.edges));
  }, [commit, nodes]);
  const organize = useCallback(() => commit(organizeMindMap(nodes, edges)), [commit, edges, nodes]);

  const changeNodes: OnNodesChange<Node<StoryNodeData>> = useCallback((changes) => {
    const persistentChanges = changes.filter((change) => change.type === "position" || change.type === "remove" || change.type === "add" || change.type === "replace");
    if (!persistentChanges.length) return;
    const next = applyNodeChanges<Node<StoryNodeData>>(persistentChanges, flowNodes);
    const changedNodes = next.map((node) => ({
      id: node.id,
      kind: node.data.kind,
      label: node.data.title,
      detail: node.data.detail,
      tags: node.data.tags,
      locked: node.data.locked,
      referenceId: node.data.referenceId,
      framing: node.data.framing,
      position: node.position,
    }));
    commit({ nodes: changedNodes, edges: sanitizeMindMapEdges(changedNodes, edges) });
  }, [commit, edges, flowNodes]);

  const settleNode = useCallback((nodeId: string, position: { x: number; y: number }) => {
    const moved = nodes.map((node) => node.id === nodeId ? { ...node, position } : node);
    commit({ nodes: repelOverlappingNodes(moved, nodeId), edges });
  }, [commit, edges, nodes]);

  const changeEdges = useCallback((changes: EdgeChange[]) => {
    const next = applyEdgeChanges(changes, flowEdges);
    commit({ nodes, edges: next.map((edge) => {
      const label = (edge as Edge).label;
      return { id: edge.id, source: edge.source, target: edge.target, label: typeof label === "string" ? label : undefined };
    }) });
  }, [commit, flowEdges, nodes]);

  const connect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || !validateMindMapConnection(nodes, edges, connection.source, connection.target).allowed) return;
    const next = addEdge({ ...connection, id: createId("edge") }, flowEdges);
    commit({ nodes, edges: next.map(({ id, source, target }) => ({ id, source, target })) });
  }, [commit, edges, flowEdges, nodes]);

  const addNode = useCallback((kind: StoryMapNodeKind, asset?: PropAsset) => {
    const definition = NODE_DEFINITIONS[kind];
    const node: StoryMapNode = { id: createId("node"), kind, label: asset?.name || definition.label, detail: asset ? "" : definition.detail, referenceId: asset?.id, position: { x: 220 + (nodes.length % 4) * 50, y: 160 + (nodes.length % 3) * 60 } };
    setSelectedId(node.id);
    commit(organizeMindMap([...nodes, node], edges));
  }, [commit, edges, nodes]);

  const updateSelected = useCallback((field: "label" | "detail" | "tags", value: string | string[]) => {
    if (!selectedId) return;
    commit({ nodes: nodes.map((node) => node.id === selectedId ? { ...node, [field]: value } : node), edges });
  }, [commit, edges, nodes, selectedId]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    commit({ nodes: nodes.filter((node) => node.id !== selectedId), edges: edges.filter((edge) => edge.source !== selectedId && edge.target !== selectedId) });
    setSelectedId(null);
  }, [commit, edges, nodes, selectedId]);

  const autoSelectFraming = useCallback(async (nodeId: string, nodeText: string) => {
    const result = await predictLaya(nodeText, SHOT_FRAMING_SCHEMA);
    const choice = (result?.answers?.framing?.choice || result?.framing?.choice) as ShotFraming | undefined;
    if (!choice) return;
    commit({
      nodes: nodes.map((node) => (node.id === nodeId ? { ...node, framing: choice } : node)),
      edges,
    });
  }, [commit, edges, nodes]);

  useMapShortcuts(undo, redo, selected ? deleteSelected : undefined);

  const issues = useMemo(() => [...validateMindMap(nodes, edges, propLibrary), ...validateScenePacket(buildScenePacket(nodes, edges, propLibrary))].filter((issue, index, all) => all.findIndex((candidate) => candidate.message === issue.message) === index), [edges, nodes, propLibrary]);

  return {
    selected,
    selectedId,
    setSelectedId,
    flowNodes,
    flowEdges,
    undo,
    redo,
    randomize,
    reset,
    organize,
    changeNodes,
    settleNode,
    changeEdges,
    connect,
    addNode,
    updateSelected,
    deleteSelected,
    autoSelectFraming,
    issues,
    hasBlockingIssues: issues.some((issue) => issue.kind === "error"),
  };
}
