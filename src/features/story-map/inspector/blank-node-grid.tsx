import { useState } from "react";
import { BookOpen, User, MapPin, Volume2, Zap, Plus, ChevronDown, ChevronRight, Clock3, MessageCircle, Package } from "lucide-react";
import type { StoryMapNodeKind } from "@/features/workspaces/types";

export const NODE_KIND_BUTTONS: Array<{
  kind: StoryMapNodeKind;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
}> = [
  { kind: "story", label: "Story", icon: BookOpen, color: "#d97706" },
  { kind: "character", label: "Character", icon: User, color: "#2563eb" },
  { kind: "environment", label: "Location", icon: MapPin, color: "#16a34a" },
  { kind: "time", label: "Time", icon: Clock3, color: "#b45309" },
  { kind: "props", label: "Props", icon: Package, color: "#7c3aed" },
  { kind: "narration", label: "Narration", icon: Volume2, color: "#9333ea" },
  { kind: "dialogue", label: "Dialogue", icon: MessageCircle, color: "#0891b2" },
  { kind: "beat", label: "Beat", icon: Zap, color: "#dc2626" },
];

export function BlankNodeGrid({
  onAddNode,
}: {
  onAddNode: (kind: StoryMapNodeKind) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="inspector-section">
      <button
        type="button"
        className="inspector-section-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle Add Nodes section"
      >
        <span className="inspector-label">
          <Plus size={11} className="inline mr-1 text-slate-500" />
          Add
        </span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="node-kind-grid-modern">
          {NODE_KIND_BUTTONS.filter(({ kind }) => kind !== "props").map(({ kind, label, icon: Icon, color }) => (
            <button
              key={kind}
              type="button"
              className="node-kind-btn"
              onClick={() => onAddNode(kind)}
              title={`Add blank ${label} node to canvas`}
              aria-label={`Add ${label} node`}
            >
              <Icon size={12} style={{ color }} />
              <span className="node-kind-label">{label}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
