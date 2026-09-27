export interface BodyTypeOption {
  id: string;
  label: string;
  desc: string;
  category: "alluring" | "athletic" | "slender" | "curvy" | "rugged" | "natural";
}

export interface OutfitOption {
  id: string;
  label: string;
  type: "sexy_casual" | "evening_glam" | "athletic" | "business_chic" | "resort_summer" | "street_rebel" | "loungewear" | "ethnic_glam" | "daily_wear" | "work_labour";
  pieces: string;
  fitDesc: string;
  matureOnly?: boolean;
  culture?: "india" | "western";
  lifestyle?: "poor" | "middle_class" | "rich";
}

export interface ColorPaletteOption {
  id: string;
  label: string;
  colors: string;
  hexPreview: [string, string];
}

export interface GroomingOption {
  id: string;
  label: string;
  desc: string;
}

export interface ConditionOption {
  id: string;
  label: string;
  desc: string;
}
