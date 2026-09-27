import { Check, Copy, Plus } from "lucide-react";

export function SceneBatchToolbar({ batchSize, batchStart, totalScenes, copied, onBatchSizeChange, onAdd, onCopy }: {
  batchSize: number;
  batchStart: number;
  totalScenes: number;
  copied: boolean;
  onBatchSizeChange: (size: number) => void;
  onAdd: () => void;
  onCopy: () => void;
}) {
  return <div className="scene-batch-toolbar" aria-label="Shot batch">
    <label>Shots<select value={batchSize} onChange={(event) => onBatchSizeChange(Number(event.target.value))}><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option><option value={9}>9</option></select></label>
    <button className="secondary-button" type="button" onClick={onAdd} title="Add set of scenes"><Plus size={16} /> Add</button>
    <button className="secondary-button" type="button" onClick={onCopy} title={`Copy scenes ${batchStart + 1}–${Math.min(batchStart + batchSize, totalScenes)}`}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}</button>
  </div>;
}
