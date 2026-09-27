import { useState } from "react";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { StoryMapNode } from "@/features/workspaces/types";
import { NODE_KIND_BUTTONS } from "./blank-node-grid";
import { NODE_KIND_GUIDE } from "../data/node-kinds";

export function SelectedNodeEditor({
  selected,
  onUpdateSelected,
  onDeleteSelected,
}: {
  selected?: StoryMapNode;
  onUpdateSelected: (field: "label" | "detail" | "tags", value: string | string[]) => void;
  onDeleteSelected?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const nodeMeta = selected ? NODE_KIND_BUTTONS.find((b) => b.kind === selected.kind) : null;
  const guide = selected ? NODE_KIND_GUIDE[selected.kind] : null;
  const [tagDraft, setTagDraft] = useState("");
  const addTag = () => { if (!selected || !tagDraft.trim()) return; const tag = tagDraft.trim().replace(/\s+/g, " "); onUpdateSelected("tags", [...(selected.tags || []), tag]); setTagDraft(""); };

  return (
    <section className="inspector-section selected-node-section">
      <button
        type="button"
        className="inspector-section-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle Selected Node section"
      >
        <span className="inspector-label">
          {selected ? selected.label.slice(0, 18) + (selected.label.length > 18 ? "…" : "") : "Selected Node"}
        </span>
        <span className="flex items-center gap-1">
          {selected && onDeleteSelected ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDeleteSelected(); }}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
              title="Delete node"
              aria-label="Delete selected node"
            >
              <Trash2 size={12} />
            </button>
          ) : null}
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>

      {open && (
        <>
          {selected ? (
            <div className="selected-node-form">
              <div
                className="node-badge-indicator"
                style={{ borderLeftColor: nodeMeta?.color || "#666" }}
              >
                <span className="kind-tag">{guide?.label}</span>
              </div>

              {selected.kind !== "props" ? <label className="dense-input-label">
                <span>Name</span>
                <input
                  value={selected.label}
                  onChange={(event) => onUpdateSelected("label", event.target.value)}
                  placeholder={guide?.placeholder}
                />
              </label> : null}

              {selected.kind !== "props" ? <label className="dense-input-label">
                <span>Note</span>
                <textarea
                  rows={3}
                  value={selected.detail}
                  onChange={(event) => onUpdateSelected("detail", event.target.value)}
                  placeholder={guide?.placeholder}
                />
              </label> : <div className="linked-prop-note">Linked asset: {selected.label}</div>}
              <div className="node-tags-editor"><span>Tags</span><div className="node-tags-row">{(selected.tags || []).map((tag) => <button type="button" key={tag} className="node-tag" onClick={() => onUpdateSelected("tags", (selected.tags || []).filter((item) => item !== tag))}>{tag} ×</button>)}<input value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter" || event.key === ",") { event.preventDefault(); addTag(); } }} onBlur={addTag} placeholder="type a tag" /></div><div className="node-suggestions">{guide?.suggestions.slice(0, 4).map((tag) => <button type="button" key={tag} onClick={() => { if (!selected.tags?.includes(tag)) onUpdateSelected("tags", [...(selected.tags || []), tag]); }}>{tag}</button>)}</div></div>

            </div>
          ) : (
            <div className="inspector-empty">
              <span>Click a node to edit.</span>
            </div>
          )}
        </>
      )}
    </section>
  );
}
