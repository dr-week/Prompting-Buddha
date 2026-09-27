"use client";

import { X } from "lucide-react";
import type { WorkspaceDocument } from "@/features/workspaces/types";

type Settings = WorkspaceDocument["settings"];

export function SettingsDialog({ settings, onChange, onClose }: { settings: Settings; onChange: (settings: Settings) => void; onClose: () => void }) {
  const toggle = (key: "matureContent" | "negativeGuardrails" | "compactPrompts") => onChange({ ...settings, [key]: !settings[key] });
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog settings-dialog" onMouseDown={(event) => event.stopPropagation()}>
    <header><div><span className="eyebrow">Settings</span><h2>Preferences</h2></div><button className="icon-button" onClick={onClose} aria-label="Close settings"><X size={18} /></button></header>
    <div className="setting-row"><div><strong>Mature</strong><p>Adult dramatic themes.</p></div><button role="switch" aria-label="Mature mode" aria-checked={settings.matureContent} className={`switch ${settings.matureContent ? "on" : ""}`} onClick={() => toggle("matureContent")}><span /></button></div>
    <div className="setting-row"><div><strong>Guardrails</strong><p>Continuity constraints.</p></div><button role="switch" aria-label="Guardrails" aria-checked={settings.negativeGuardrails} className={`switch ${settings.negativeGuardrails ? "on" : ""}`} onClick={() => toggle("negativeGuardrails")}><span /></button></div>
    <div className="setting-row"><div><strong>Compact</strong><p>Concise prompt output.</p></div><button role="switch" aria-label="Compact prompts" aria-checked={settings.compactPrompts} className={`switch ${settings.compactPrompts ? "on" : ""}`} onClick={() => toggle("compactPrompts")}><span /></button></div>
    <footer><button className="primary-button" onClick={onClose}>Done</button></footer>
  </section></div>;
}
