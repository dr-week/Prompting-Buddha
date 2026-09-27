export type SocioeconomicStatus = "poor" | "middle_class" | "rich";

export function socioeconomicGuidance(status: SocioeconomicStatus = "middle_class") {
  if (status === "poor") return {
    label: "Poor / limited resources",
    directive: "Show limited resources through practical, repaired, reused, faded, or locally sourced clothing; basic grooming; few accessories; and believable signs of everyday wear where the story supports them. Do not equate poverty with dirt, neglect, or caricature."
  };
  if (status === "rich") return {
    label: "Rich / high resources",
    directive: "Show wealth through tailored fit, quality materials, precise grooming, maintained clothing, selected accessories, and quiet confidence. Avoid excessive logos or generic luxury stereotypes."
  };
  return {
    label: "Middle class / moderate resources",
    directive: "Use practical, well-maintained clothing, accessible grooming, ordinary accessories, and realistic signs of regular use. Keep the character specific rather than generic."
  };
}
