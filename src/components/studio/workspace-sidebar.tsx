"use client";

import { ChevronLeft, ChevronRight, Plus, Save, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { WorkspaceTree } from "./workspace-tree";
import type { WorkspaceDocument, WorkspaceSummary } from "@/features/workspaces/types";

export function WorkspaceSidebar({
  workspaces,
  activeId,
  onOpen,
  onCreate,
  collapsed,
  onToggle,
  targetAI,
  onTargetChange,
  onSave,
  onSettings,
  workflowNavigation,
  storyboards,
  activeStoryboardId,
  onAddStoryboard,
  onOpenStoryboard,
}: {
  workspaces: WorkspaceSummary[];
  activeId?: string;
  onOpen: (workspace: WorkspaceSummary) => void;
  onCreate: () => void;
  collapsed: boolean;
  onToggle: () => void;
  targetAI: string;
  onTargetChange: (target: "google_flow" | "veo" | "kling" | "runway_gen4") => void;
  onSave: () => void;
  onSettings: () => void;
  workflowNavigation: ReactNode;
  storyboards: WorkspaceDocument["storyboards"];
  activeStoryboardId?: string;
  onAddStoryboard: () => void;
  onOpenStoryboard: (storyboardId: string) => void;
}) {
  return (
    <aside className={`workspace-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand"><span className="brand-mark"><BrandMark size={19} /></span><span>Prompting<br />Buddha</span></div>
      <button className="sidebar-collapse" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}</button>
      <button className="new-workspace" onClick={onCreate} title="New workspace"><Plus size={18} /><span>New</span></button>
      <div className="sidebar-section sidebar-workspaces">
        <p className="sidebar-label">Workspaces</p>
        <WorkspaceTree workspaces={workspaces} activeWorkspaceId={activeId} storyboards={storyboards} activeStoryboardId={activeStoryboardId} onOpenWorkspace={onOpen} onOpenStoryboard={onOpenStoryboard} onAddStoryboard={onAddStoryboard} />
      </div>
      <div className="sidebar-section sidebar-workflow"><p className="sidebar-label">Workflow</p>{workflowNavigation}</div>
      <div className="sidebar-tools">
        <p className="sidebar-label">Target</p>
        <label className="sidebar-target"><span>Model</span><select value={targetAI} onChange={(event) => onTargetChange(event.target.value as "google_flow" | "veo" | "kling" | "runway_gen4")}><option value="google_flow">Flow</option><option value="veo">Veo</option><option value="kling">Kling</option><option value="runway_gen4">Runway</option></select></label>
        <button onClick={onSave} title="Save workspace"><Save size={17} /><span>Save</span></button>
        <button onClick={onSettings} title="Settings"><Settings size={17} /><span>Settings</span></button>
      </div>
    </aside>
  );
}
