import { Dices } from "lucide-react";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";

type StoryFormat = NonNullable<ProductionContinuity["storyFormat"]>;

export function StoryFormatControls({ project, onChange, onRandomize }: { project: ProductionContinuity; onChange: (project: ProductionContinuity) => void; onRandomize: () => void }) {
  const format: StoryFormat = project.storyFormat || { mode: "slice_of_life", capture: "raw_vlog", continuity: "daily_series", dialogue: "minimal" };
  const update = (patch: Partial<StoryFormat>) => onChange({ ...project, storyFormat: { ...format, ...patch } });
  return <section className="story-format-panel" aria-label="Story format">
    <div className="story-format-heading"><strong>Format</strong><button type="button" className="format-random-button" onClick={onRandomize} title="Randomize format" aria-label="Randomize format"><Dices size={14} /></button></div>
    <div className="story-format-grid">
      <label>Mode<select value={format.mode} onChange={(event) => update({ mode: event.target.value as StoryFormat["mode"] })}><option value="slice_of_life">Daily</option><option value="cinematic">Cinematic</option></select></label>
      <label>Capture<select value={format.capture} onChange={(event) => update({ capture: event.target.value as StoryFormat["capture"] })}><option value="raw_vlog">Raw</option><option value="cinematic">Cinema</option></select></label>
      <label>Frame<select value={project.aspectRatio} onChange={(event) => onChange({ ...project, aspectRatio: event.target.value as ProductionContinuity["aspectRatio"] })}><option value="9:16">Vertical</option><option value="16:9">Landscape</option><option value="2.39:1">Widescreen</option></select></label>
      <label>Continuity<select value={format.continuity} onChange={(event) => update({ continuity: event.target.value as StoryFormat["continuity"] })}><option value="daily_series">Series</option><option value="standalone">Single</option></select></label>
      <label>Dialogue<select value={format.dialogue} onChange={(event) => update({ dialogue: event.target.value as StoryFormat["dialogue"] })}><option value="minimal">Minimal</option><option value="normal">Normal</option></select></label>
    </div>
  </section>;
}
