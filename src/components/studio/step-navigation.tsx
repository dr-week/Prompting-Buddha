import { Check, Film, Network, ScanFace, ShieldCheck, Video } from "lucide-react";
import type { WorkflowStep } from "@/features/workspaces/types";

const steps: Array<{ id: WorkflowStep; label: string; icon: typeof Film }> = [
  { id: "character", label: "Character", icon: ScanFace },
  { id: "storymap", label: "Mindmap", icon: Network },
  { id: "storyboard", label: "Storyboard", icon: Film },
  { id: "video", label: "Video", icon: Video },
  { id: "auditor", label: "Auditor", icon: ShieldCheck },
];

export function StepNavigation({
  active,
  onChange,
}: {
  active: WorkflowStep;
  onChange: (step: WorkflowStep) => void;
}) {
  const activeIndex = steps.findIndex((item) => item.id === active);
  return (
    <nav className="step-nav" aria-label="Prompt workflow">
      {steps.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`step ${active === item.id ? "active" : ""}`}
            onClick={() => onChange(item.id)}
            title={item.label}
          >
            <span className="step-icon">
              {index < activeIndex ? <Check size={16} /> : <Icon size={16} />}
            </span>
            <span className="step-label"><strong>{item.label}</strong></span>
          </button>
        );
      })}
    </nav>
  );
}
