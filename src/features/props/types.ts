export type PropScope = "character" | "scene" | "recurring";
export type PropCategory = "personal" | "furniture" | "food" | "vehicle" | "gadget" | "tool" | "work" | "other";

export interface PropAsset {
  id: string;
  name: string;
  category: PropCategory;
  scope: PropScope;
  description: string;
  material?: string;
  color?: string;
  condition?: string;
  scale?: string;
  ownerCharacterId?: string;
  storyboardId?: string;
  sceneId?: string;
  tags: string[];
  locked: boolean;
  savedToLibrary: boolean;
}
