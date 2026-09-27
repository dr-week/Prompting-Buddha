import { compileStoryboardPrompt, type ProductionContinuity } from "@/lib/filmmaker-compiler";

/**
 * Copies only the selected batch (from batchStart to batchStart+batchSize) to clipboard.
 * Returns true if copied, false if no scenes in range.
 */
export async function copySceneBatch(
  project: ProductionContinuity,
  batchStart: number,
  batchSize: number
): Promise<boolean> {
  const batch = project.panels.slice(batchStart, batchStart + batchSize);
  if (!batch.length) return false;
  await navigator.clipboard.writeText(
    compileStoryboardPrompt({ ...project, panels: batch })
  );
  return true;
}
