import { Search, X } from "lucide-react";
import type { StoryMapNodeKind } from "@/features/workspaces/types";
import { NODE_DEFINITIONS, NODE_KINDS } from "../data/node-definitions";

export function NodePalette({ query, onQueryChange, onPick, onClose }: { query: string; onQueryChange: (value: string) => void; onPick: (kind: StoryMapNodeKind) => void; onClose: () => void }) {
  const results = NODE_KINDS.map((kind) => ({ kind, ...NODE_DEFINITIONS[kind] })).filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="node-palette" role="dialog" aria-label="Add mind map node">
    <div className="node-palette-header"><strong>Add node</strong><button type="button" onClick={onClose} aria-label="Close node search"><X size={14} /></button></div>
    <label className="node-palette-search"><Search size={14} /><input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search nodes…" aria-label="Search node types" /></label>
    <div className="node-palette-results">{results.map((item) => <button type="button" key={item.kind} onClick={() => onPick(item.kind)}><span>{item.label}</span><small>{item.hint}</small></button>)}{!results.length ? <span className="node-palette-empty">No matching node</span> : null}</div>
    <small className="node-palette-hint">Shift + A to open</small>
  </div>;
}
