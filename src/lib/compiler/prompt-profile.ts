export type PromptStage = "character" | "storyboard" | "video";
export type PlatformSyntax = "google_flow" | "veo" | "kling" | "runway_gen4" | "generic";

export function applyPromptProfile(prompt: string, stage: PromptStage, platform: PlatformSyntax = "google_flow", compact = false) {
  let profiled = prompt;
  if (stage === "video") {
    const target = platform === "runway_gen4" ? "RUNWAY GEN-4" : platform === "kling" ? "KLING" : platform === "veo" ? "VEO" : platform === "generic" ? "GENERIC VIDEO MODEL" : "GOOGLE FLOW";
    profiled = profiled
      .replaceAll("GOOGLE FLOW SETTING:", `${target} SETTING:`)
      .replaceAll("FLOW INGREDIENTS:", platform === "google_flow" ? "FLOW INGREDIENTS:" : "REFERENCE ASSETS:")
      .replaceAll("reference ingredient", platform === "google_flow" ? "reference ingredient" : "reference image")
      .replaceAll("Reference ingredient", platform === "google_flow" ? "Reference ingredient" : "Reference image");
  }
  if (!compact) return profiled;
  return profiled
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => !/^[-═─]{8,}$/.test(line.trim()))
    .filter((line) => !line.includes("Section Allocation:"))
    .filter((line) => !line.includes("Affordability Budget:"))
    .filter((line) => !line.includes("Budget Rule:"))
    .filter((line, index, lines) => line.trim() !== "" || lines[index - 1]?.trim() !== "")
    .join("\n")
    .trim();
}
