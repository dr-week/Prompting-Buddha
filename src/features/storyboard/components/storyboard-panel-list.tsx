import { Camera } from "lucide-react";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";

const FRAMINGS = ["ECU", "CU", "MCU", "MS", "WS", "OTS", "POV"] as const;
const ANGLES = ["Eye-level", "Low angle", "High angle", "Dutch tilt", "Overhead"] as const;

export function StoryboardPanelList({ project, start, count, onChange }: { project: ProductionContinuity; start: number; count: number; onChange: (project: ProductionContinuity) => void }) {
  const update = (index: number, patch: object) => onChange({ ...project, panels: project.panels.map((panel, panelIndex) => panelIndex === index ? { ...panel, ...patch } : panel) });
  return <div className="shot-list">
    {project.panels.slice(start, start + count).map((panel, localIndex) => {
      const index = start + localIndex;
      return <article className="shot-card" key={panel.id}>
        <header className="shot-card-header">
          <span className="shot-index">{String(index + 1).padStart(2, "0")}</span>
          <Camera size={14} aria-hidden="true" />
        </header>
        <div className="shot-card-body"><div className="shot-meta">
          <select value={panel.framing} onChange={(event) => update(index, { framing: event.target.value as ProductionContinuity["panels"][number]["framing"] })}>{FRAMINGS.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={panel.angle} onChange={(event) => update(index, { angle: event.target.value as ProductionContinuity["panels"][number]["angle"] })}>{ANGLES.map((item) => <option key={item}>{item}</option>)}</select>
        </div><textarea aria-label={`Shot ${index + 1} action`} rows={3} value={panel.action} onChange={(event) => update(index, { action: event.target.value })} /></div>
      </article>;
    })}
  </div>;
}
