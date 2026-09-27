import { Sparkles } from "lucide-react";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";

export function VideoStep({ project, selectedShot, onSelectShot, onChange, onCompile }: {
  project: ProductionContinuity;
  selectedShot: number;
  onSelectShot: (shot: number) => void;
  onChange: (project: ProductionContinuity) => void;
  onCompile: () => void;
}) {
  const panel = project.panels[selectedShot];
  const update = (field: string, value: string | number) => onChange({ ...project, panels: project.panels.map((item, index) => index === selectedShot ? { ...item, [field]: value } : item) });
  return (
    <section className="stage-card">
      <div className="stage-heading"><span className="stage-number">03</span><div><span className="eyebrow">Shot</span><h1>Motion</h1></div></div>
      <div className="shot-tabs" role="tablist">{project.panels.slice(0, 4).map((item, index) => <button role="tab" aria-selected={index === selectedShot} className={index === selectedShot ? "active" : ""} key={item.id} onClick={() => onSelectShot(index)}>Shot {index + 1}<small>{item.framing}</small></button>)}</div>
      <div className="form-grid two">
        <label>Start frame<textarea rows={4} value={panel.initialPose || ""} onChange={(e) => update("initialPose", e.target.value)} /></label>
        <label>Visible action<textarea rows={4} value={panel.action} onChange={(e) => update("action", e.target.value)} /></label>
        <label>Camera movement<select value={panel.cameraMovement} onChange={(e) => update("cameraMovement", e.target.value)}>{["Static / Locked Tripod", "Subtle Handheld Breathing", "Slow Push-In (Dolly)", "Slow Pull-Out", "Tracking Pan"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Duration<select value={panel.durationSeconds} onChange={(e) => update("durationSeconds", Number(e.target.value))}>{[4, 6, 8, 10].map((seconds) => <option key={seconds} value={seconds}>{seconds}s</option>)}</select></label>
      </div>
      <label>Audio ambience<input value={panel.audioAmbience} onChange={(e) => update("audioAmbience", e.target.value)} /></label>
      <div className="stage-actions end"><button className="primary-button" onClick={onCompile} title="Compile video prompt"><Sparkles size={17} /> Compile</button></div>
    </section>
  );
}
