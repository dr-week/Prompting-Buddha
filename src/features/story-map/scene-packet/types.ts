export interface ScenePacket {
  story: string;
  characters: Array<{ referenceId?: string; name: string; detail: string }>;
  environment: string;
  time: string;
  props?: string;
  beats: string[];
  narration?: string;
  dialogue?: { text: string; speakerReferenceId?: string; speakerName?: string };
}

export interface ScenePacketIssue { kind: "error" | "warning"; message: string; }
