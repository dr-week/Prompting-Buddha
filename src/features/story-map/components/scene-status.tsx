import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ScenePacketIssue } from "../scene-packet";

export function SceneStatus({ issues }: { issues: ScenePacketIssue[] }) {
  const errors = issues.filter((issue) => issue.kind === "error");
  return <div className={`scene-status ${errors.length ? "has-errors" : "ready"}`} role="status">
    {errors.length ? <><AlertCircle size={13} /> <span>{errors[0].message}{errors.length > 1 ? ` +${errors.length - 1}` : ""}</span></> : <><CheckCircle2 size={13} /> <span>Scene ready</span></>}
  </div>;
}
