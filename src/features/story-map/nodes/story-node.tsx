import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { BookOpen, User, MapPin, Volume2, Zap, Clock3, MessageCircle, Package, Lock, Unlock } from "lucide-react";
import type { StoryNodeData } from "./story-node.types";
import type { StoryMapNodeKind } from "@/features/workspaces/types";

export * from "./story-node.types";

const KIND_META: Record<
  StoryMapNodeKind,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; color: string; badgeBg: string }
> = {
  story: { label: "Story", icon: BookOpen, color: "#d97706", badgeBg: "rgba(217, 119, 6, 0.12)" },
  character: { label: "Character", icon: User, color: "#2563eb", badgeBg: "rgba(37, 99, 235, 0.12)" },
  environment: { label: "Location", icon: MapPin, color: "#16a34a", badgeBg: "rgba(22, 163, 74, 0.12)" },
  time: { label: "Time", icon: Clock3, color: "#b45309", badgeBg: "rgba(180, 83, 9, 0.12)" },
  props: { label: "Props", icon: Package, color: "#7c3aed", badgeBg: "rgba(124, 58, 237, 0.12)" },
  narration: { label: "Narration", icon: Volume2, color: "#9333ea", badgeBg: "rgba(147, 51, 234, 0.12)" },
  dialogue: { label: "Dialogue", icon: MessageCircle, color: "#0891b2", badgeBg: "rgba(8, 145, 178, 0.12)" },
  beat: { label: "Beat", icon: Zap, color: "#dc2626", badgeBg: "rgba(220, 38, 38, 0.12)" },
};

export const StoryNode = memo(function StoryNode({
  data,
  selected,
}: {
  data: StoryNodeData;
  selected?: boolean;
}) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const meta = KIND_META[data.kind] || KIND_META.story;
  const Icon = meta.icon;
  const isExpanded = localExpanded;

  return (
    <div
      className={`story-node-box ${isExpanded ? "expanded" : "collapsed"} ${selected ? "selected" : ""}`}
      tabIndex={0}
      onClick={() => setLocalExpanded((prev) => !prev)}
      onBlur={(e) => {
        // Only collapse on blur if the newly focused element isn't inside this node
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setLocalExpanded(false);
        }
      }}
      title="Click to toggle expanded story notes"
    >
      {/* Green Target (IN) Handle at TOP */}
      <Handle
        type="target"
        position={Position.Top}
        className="story-handle handle-in"
        title="Input Connection (Target)"
      />

      <div className="node-header">
        <div
          className="node-kind-badge"
          style={{ background: meta.badgeBg, color: meta.color }}
        >
          <Icon size={12} />
          <span>{meta.label}</span>
        </div>
        {data.onToggleLock ? <button type="button" className="node-lock-btn" onClick={(event) => { event.stopPropagation(); data.onToggleLock?.(); }} title={data.locked ? "Unlock node" : "Lock node"} aria-label={data.locked ? "Unlock node" : "Lock node"}>{data.locked ? <Lock size={11} /> : <Unlock size={11} />}</button> : null}
      </div>

      <div className="node-content">
        <div className="node-title">{data.title || "Untitled Node"}</div>
        {data.tags?.length ? <div className="node-card-tags">{data.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div> : <div className="node-empty-tags">Add tags</div>}
        {isExpanded ? <div className="node-detail-full">{data.detail}</div> : null}
      </div>

      {/* Red Source (OUT) Handle at BOTTOM */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="story-handle handle-out"
        title="Output Connection (Source)"
      />
    </div>
  );
});
