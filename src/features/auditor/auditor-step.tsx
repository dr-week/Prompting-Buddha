import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles, TriangleAlert, WandSparkles } from "lucide-react";
import { auditPromptContinuity } from "@/lib/compiler/auditor";
import type { ProductionContinuity } from "@/lib/filmmaker-compiler";
import { auditPromptText, correctPromptText } from "@/lib/compiler/prompt-auditor";
import type { PlatformSyntax } from "@/lib/compiler/prompt-profile";

export function AuditorStep({ project, prompt, platform, onCompile }: { project: ProductionContinuity; prompt: string; platform: PlatformSyntax; onCompile: (prompt?: string) => void }) {
  const [draft, setDraft] = useState(prompt);
  const issues = useMemo(() => [...auditPromptContinuity(project), ...auditPromptText(draft, platform)], [draft, platform, project]);
  const corrected = useMemo(() => correctPromptText(draft, issues), [draft, issues]);
  return (
    <section className="stage-card">
      <div className="stage-heading"><span className="stage-number">04</span><div><span className="eyebrow">Audit</span><h1>Continuity</h1></div></div>
      <label>Prompt to audit<textarea rows={8} value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
      {issues.length === 0 ? <div className="empty-state"><CheckCircle2 size={28} /><strong>Clean</strong><span>Sequence is coherent.</span></div> : <div className="audit-list">{issues.map((issue) => <article key={issue.id} className={`audit-item ${issue.severity}`}><TriangleAlert size={18} /><div><strong>{issue.title}</strong><p>{issue.explanation}</p><small>{issue.recommendation}</small></div></article>)}</div>}
      <div className="stage-actions end"><button className="secondary-button" onClick={() => setDraft(corrected)} title="Apply safe corrections"><WandSparkles size={17} /> Fix</button><button className="primary-button" onClick={() => onCompile(corrected)} title="Review corrected prompt"><Sparkles size={17} /> Review</button></div>
    </section>
  );
}
