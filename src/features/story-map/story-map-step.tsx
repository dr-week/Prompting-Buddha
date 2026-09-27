"use client";

import { useEffect, useState } from "react";
import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { ArrowRight, LayoutGrid, PanelRightOpen, Redo2, Undo2 } from "lucide-react";
import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";
import { NodePalette } from "./components/node-palette";
import { StoryMapInspector } from "./inspector/story-map-inspector";
import { StoryNode, type StoryNodeData } from "./nodes/story-node";
import { STORY_EDGE_OPTIONS, useStoryMapController } from "./hooks/use-story-map-controller";
import { validateMindMapConnection } from "./data/mind-map-rules";
import type { PropAsset } from "@/features/props/types";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";

const nodeTypes = { storyNode: StoryNode };

export function StoryMapStep({ nodes, edges, propLibrary, characters, storyboardId, onSaveProp, onChange, onAutoBuild, onOrganize, onNext, scopeId }: {
  nodes: StoryMapNode[];
  edges: StoryMapEdge[];
  propLibrary: PropAsset[];
  characters: CharacterConcept[];
  storyboardId: string;
  onSaveProp: (asset: PropAsset) => void;
  onChange: (map: { nodes: StoryMapNode[]; edges: StoryMapEdge[] }) => void;
  onAutoBuild: (tags?: string[]) => void;
  onOrganize?: () => void;
  onNext: () => void;
  scopeId: string;
}) {
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [nodePaletteOpen, setNodePaletteOpen] = useState(false);
  const [nodeSearch, setNodeSearch] = useState("");
  const map = useStoryMapController({ nodes, edges, propLibrary, onChange, scopeId });
  const autoArrange = onOrganize || map.organize;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
      if (event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setNodePaletteOpen(true);
        setNodeSearch("");
      }
      if (event.key === "Escape") setNodePaletteOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <div className="story-map-screen" aria-label="Mind Map">
    <div className="map-stage">
      <div className="map-history-toolbar" aria-label="Map controls">
        <button type="button" onClick={map.undo} title="Undo (Ctrl+Z)" aria-label="Undo"><Undo2 size={14} /></button>
        <button type="button" onClick={map.redo} title="Redo (Ctrl+Shift+Z)" aria-label="Redo"><Redo2 size={14} /></button>
        <span className="map-toolbar-divider" aria-hidden="true" />
        <button type="button" className="auto-arrange-button" onClick={autoArrange} title="Auto-arrange nodes" aria-label="Auto-arrange nodes"><LayoutGrid size={15} /></button>
      </div>
      <ReactFlow<Node<StoryNodeData>, Edge>
        nodes={map.flowNodes}
        edges={map.flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={map.changeNodes}
        onNodeDragStop={(_, node) => map.settleNode(node.id, node.position)}
        onEdgesChange={map.changeEdges}
        onConnect={map.connect}
        isValidConnection={(connection) => Boolean(connection.source && connection.target && validateMindMapConnection(nodes, edges, connection.source, connection.target).allowed)}
        onNodeClick={(_, node) => map.setSelectedId(node.id)}
        onPaneClick={() => map.setSelectedId(null)}
        fitView
        fitViewOptions={{ padding: 0.28, minZoom: 0.7, maxZoom: 1.2 }}
        defaultEdgeOptions={STORY_EDGE_OPTIONS}
      >
        <Background color="#dedbd3" gap={24} size={1} />
        <Controls position="bottom-left" />
        <MiniMap position="bottom-left" style={{ marginBottom: 44 }} nodeColor={(node) => {
          const kind = (node.data as StoryNodeData)?.kind;
          if (kind === "character") return "#2563eb";
          if (kind === "environment") return "#16a34a";
          if (kind === "beat") return "#dc2626";
          if (kind === "narration") return "#9333ea";
          return "#d97706";
        }} />
      </ReactFlow>

      {nodePaletteOpen ? <NodePalette query={nodeSearch} onQueryChange={setNodeSearch} onClose={() => setNodePaletteOpen(false)} onPick={(kind) => { map.addNode(kind); setNodePaletteOpen(false); }} /> : null}

      {inspectorOpen ? <StoryMapInspector
        selected={map.selected}
        onClose={() => setInspectorOpen(false)}
        onAutoBuild={onAutoBuild}
        onOrganize={autoArrange}
        onRandomize={map.randomize}
        onReset={map.reset}
        packetIssues={map.issues}
        onAddNode={map.addNode}
        onUpdateSelected={map.updateSelected}
        onDeleteSelected={map.selected ? map.deleteSelected : undefined}
        propLibrary={propLibrary}
        characters={characters}
        storyboardId={storyboardId}
        onSaveProp={onSaveProp}
        onUseProp={(asset) => map.addNode("props", asset)}
      /> : <button className="pill-button inspector-toggle" onClick={() => setInspectorOpen(true)} aria-label="Expand node inspector"><PanelRightOpen size={14} /><span>Tools</span></button>}

      <footer className="stage-actions">
        <button className="pill-button primary" onClick={onNext} title="Continue to storyboard"><span>Storyboard</span><ArrowRight size={14} /></button>
      </footer>
    </div>
  </div>;
}
