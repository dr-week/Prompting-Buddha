"use client";

import { ChevronDown, ChevronRight, Film, Plus } from "lucide-react";
import { useState } from "react";
import type { WorkspaceDocument, WorkspaceSummary } from "@/features/workspaces/types";

type Storyboard = WorkspaceDocument["storyboards"][number];

export function WorkspaceTree({ workspaces, activeWorkspaceId, storyboards, activeStoryboardId, onOpenWorkspace, onOpenStoryboard, onAddStoryboard }: {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId?: string;
  storyboards: Storyboard[];
  activeStoryboardId?: string;
  onOpenWorkspace: (workspace: WorkspaceSummary) => void;
  onOpenStoryboard: (storyboardId: string) => void;
  onAddStoryboard: () => void;
}) {
  const [expandedWorkspaceId, setExpandedWorkspaceId] = useState(activeWorkspaceId);
  const openWorkspace = (workspace: WorkspaceSummary) => { onOpenWorkspace(workspace); setExpandedWorkspaceId(workspace.id); };

  return <div className="workspace-tree">{workspaces.map((workspace) => {
    const active = workspace.id === activeWorkspaceId;
    const expanded = active && expandedWorkspaceId === workspace.id;
    return <div className={`workspace-branch ${active ? "active" : ""}`} key={workspace.id}>
      <div className="workspace-row">
        <button className="workspace-toggle" type="button" onClick={() => active ? setExpandedWorkspaceId(expanded ? undefined : workspace.id) : openWorkspace(workspace)} aria-label={`${expanded ? "Collapse" : "Expand"} ${workspace.name}`}>{expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
        <button className="workspace-name" type="button" onClick={() => openWorkspace(workspace)}><Film size={16} /><strong>{workspace.name}</strong></button>
      </div>
      {expanded ? <div className="storyboard-list">
        {storyboards.map((storyboard) => <button className={`storyboard-row ${storyboard.id === activeStoryboardId ? "active" : ""}`} type="button" key={storyboard.id} onClick={() => onOpenStoryboard(storyboard.id)}><span className="storyboard-dot" /><span>{storyboard.title}</span></button>)}
        <button className="add-storyboard" type="button" onClick={onAddStoryboard} title="Add storyboard"><Plus size={14} /><span>New</span></button>
      </div> : null}
    </div>;
  })}</div>;
}
