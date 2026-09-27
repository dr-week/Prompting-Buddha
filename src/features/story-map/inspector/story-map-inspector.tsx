import { useState } from "react";
import { Dices, LayoutPanelTop, PanelRightClose, Plus, RotateCcw, X } from "lucide-react";
import type { StoryMapNode, StoryMapNodeKind } from "@/features/workspaces/types";
import { BlankNodeGrid } from "./blank-node-grid";
import { SelectedNodeEditor } from "./selected-node-editor";
import type { ScenePacketIssue } from "../scene-packet";
import { SceneStatus } from "../components/scene-status";
import { PropsLibraryPanel } from "@/features/props/props-library-panel";
import type { PropAsset } from "@/features/props/types";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";

export function StoryMapInspector({
  selected,
  onClose,
  onAutoBuild,
  onOrganize,
  onRandomize,
  onReset,
  onAddNode,
  onUpdateSelected,
  onDeleteSelected,
  packetIssues,
  propLibrary,
  characters,
  storyboardId,
  onSaveProp,
  onUseProp,
}: {
  selected?: StoryMapNode;
  onClose: () => void;
  onAutoBuild: (tags: string[]) => void;
  onOrganize?: () => void;
  onRandomize: () => void;
  onReset: () => void;
  onAddNode: (kind: StoryMapNodeKind) => void;
  onUpdateSelected: (field: "label" | "detail" | "tags", value: string | string[]) => void;
  onDeleteSelected?: () => void;
  packetIssues: ScenePacketIssue[];
  propLibrary: PropAsset[];
  characters: CharacterConcept[];
  storyboardId: string;
  onSaveProp: (asset: PropAsset) => void;
  onUseProp: (asset: PropAsset) => void;
}) {
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const addTag = (value: string) => { const tag = value.trim().replace(/\s+/g, " "); if (tag && !tags.includes(tag)) setTags((current) => [...current, tag]); setDraft(""); };
  return (
    <aside className="node-inspector">
      <header className="inspector-hdr">
        <div className="hdr-title-group">
          <span className="eyebrow">Mind Map</span>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Collapse node inspector">
          <PanelRightClose size={16} />
        </button>
      </header>
      <SceneStatus issues={packetIssues} />
      <div className="mind-map-flow-guide"><span>Story</span><b>→</b><span>Context</span><b>→</b><span>Beat</span></div>
      <div className="mind-map-tagbox">
        <label htmlFor="mind-map-tags">Scene tags</label>
        <div className="mind-map-tags">
          {tags.map((tag) => <button type="button" key={tag} className="mind-map-tag" onClick={() => setTags((current) => current.filter((item) => item !== tag))} title={`Remove ${tag}`}>{tag}<X size={11} /></button>)}
          <input id="mind-map-tags" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addTag(draft); } }} onBlur={() => draft.trim() && addTag(draft)} placeholder="morning, poor, male..." aria-label="Scene tags" />
        </div>
        <button type="button" className="mind-map-build-tags" onClick={() => onAutoBuild(tags)} disabled={!tags.length} title="Build workflow from tags"><Plus size={13} /> Build</button>
      </div>
      {onOrganize ? <button type="button" className="inspector-action-card compact-template-card" onClick={onOrganize} title="Arrange nodes by story role"><div className="action-icon-box bg-sky-50 text-sky-600"><LayoutPanelTop size={14} /></div><div className="action-meta"><strong>Arrange</strong></div></button> : null}
      <div className="mind-map-primary-actions"><button type="button" onClick={onRandomize} title="Randomize unlocked nodes"><Dices size={14} /> Random</button><button type="button" onClick={onReset} title="Reset to default scene graph"><RotateCcw size={14} /> Reset</button></div>

      <BlankNodeGrid onAddNode={onAddNode} />
      <PropsLibraryPanel assets={propLibrary} characters={characters} storyboardId={storyboardId} onSave={onSaveProp} onUse={onUseProp} />

      {/* Selected node details */}
      {selected ? <SelectedNodeEditor
        selected={selected}
        onUpdateSelected={onUpdateSelected}
        onDeleteSelected={onDeleteSelected}
      /> : null}
    </aside>
  );
}
