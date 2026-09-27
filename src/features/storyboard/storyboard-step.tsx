import { useState } from "react";
import { ArrowRight, SlidersHorizontal, Sparkles, UserRound } from "lucide-react";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";
import { SceneBatchToolbar } from "./components/scene-batch-toolbar";
import { StoryFormatControls } from "./components/story-format-controls";
import { StoryboardPanelList } from "./components/storyboard-panel-list";
import { randomDailyMoment } from "./data/daily-moments";
import { useSceneBatches } from "./hooks/use-scene-batches";
import { copySceneBatch } from "./actions/copy-scene-batch";

export function StoryboardStep({ project, onChange, onCompile, onNext }: {
  project: ProductionContinuity;
  onChange: (project: ProductionContinuity) => void;
  onCompile: () => void;
  onNext: () => void;
}) {
  const { batchSize, batchStart, setBatchSize, addBatch } = useSceneBatches();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copySceneBatch(project, batchStart, batchSize);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <section className="storyboard-stage">
      <header className="storyboard-header">
        <div className="storyboard-title">
          <span className="eyebrow">Storyboard</span>
          <h1>Shots</h1>
          <span className="storyboard-character"><UserRound size={13} />{project.cast[0]?.name || "Character"}</span>
        </div>
        <div className="storyboard-header-actions">
          <button className="secondary-button" type="button" onClick={onCompile}>
            <Sparkles size={16} /> Prompt
          </button>
          <button className="primary-button" type="button" onClick={onNext}>
            Video <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <div className="storyboard-scene">
        <label className="storyboard-moment">
        Moment
        <textarea
          rows={2}
          value={project.sceneBeat}
          onChange={(e) => onChange({ ...project, sceneBeat: e.target.value })}
        />
        </label>
        <label>
          Location
          <input
            value={project.locationLock.geography}
            onChange={(e) => onChange({ ...project, locationLock: { ...project.locationLock, geography: e.target.value } })}
          />
        </label>
        <label>
          Light
          <input
            value={project.locationLock.lightingKeys}
            onChange={(e) => onChange({ ...project, locationLock: { ...project.locationLock, lightingKeys: e.target.value } })}
          />
        </label>
      </div>

      <details className="storyboard-options">
        <summary><SlidersHorizontal size={15} /> Settings</summary>
        <div className="storyboard-options-body">
          <StoryFormatControls
            project={project}
            onChange={onChange}
            onRandomize={() => onChange(randomDailyMoment(project))}
          />
          <SceneBatchToolbar
            batchSize={batchSize}
            batchStart={batchStart}
            totalScenes={project.panels.length}
            copied={copied}
            onBatchSizeChange={setBatchSize}
            onAdd={() => addBatch(project, onChange)}
            onCopy={handleCopy}
          />
        </div>
      </details>

      <StoryboardPanelList
        project={project}
        start={batchStart}
        count={batchSize}
        onChange={onChange}
      />
    </section>
  );
}
