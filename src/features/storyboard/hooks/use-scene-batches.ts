import { useState } from "react";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";
import { appendDailyScenes } from "../data/daily-moments";

export interface SceneBatchState {
  batchSize: number;
  batchStart: number;
  setBatchSize: (size: number) => void;
  setBatchStart: (start: number) => void;
  addBatch: (project: ProductionContinuity, onChange: (p: ProductionContinuity) => void) => void;
}

export function useSceneBatches(): SceneBatchState {
  const [batchSize, setBatchSizeState] = useState(4);
  const [batchStart, setBatchStart] = useState(0);

  const setBatchSize = (size: number) => {
    setBatchSizeState(size);
    setBatchStart(0);
  };

  const addBatch = (
    project: ProductionContinuity,
    onChange: (p: ProductionContinuity) => void
  ) => {
    onChange(appendDailyScenes(project, batchSize));
    setBatchStart(project.panels.length);
  };

  return { batchSize, batchStart, setBatchSize, setBatchStart, addBatch };
}
