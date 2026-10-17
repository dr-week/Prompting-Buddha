import { Activity } from "lucide-react";
import { CategoryCard } from "./category-card";
import { ACTING_POSES_OPTIONS, type CharacterConcept } from "@/lib/filmmaker-compiler";

export function PoseSection({
  character,
  onPoseChange,
  onRollPose,
  defaultCollapsed = false,
}: {
  character: CharacterConcept;
  onPoseChange: (poseDesc: string) => void;
  onRollPose: () => void;
  defaultCollapsed?: boolean;
}) {
  const currentPose =
    ACTING_POSES_OPTIONS.find((p) => character.microKinesics?.includes(p.desc)) ||
    ACTING_POSES_OPTIONS[0];

  return (
    <CategoryCard
      lockKey="pose"
      title="Pose & Stance"
      icon={Activity}
      iconColor="#3b82f6"
      iconBg="rgba(59, 130, 246, 0.08)"
      onRoll={onRollPose}
      rollTitle="Random pose & stance"
      defaultCollapsed={defaultCollapsed}
    >
      <div className="cat-form-grid">
        <div className="cat-field-row">
          <span className="cat-label">Stance</span>
          <select
            className="cat-select"
            aria-label="Pose and Stance"
            value={currentPose.id}
            onChange={(e) => {
              const found = ACTING_POSES_OPTIONS.find((p) => p.id === e.target.value);
              if (found) onPoseChange(found.desc);
            }}
          >
            {ACTING_POSES_OPTIONS.map((pose) => (
              <option key={pose.id} value={pose.id}>
                {pose.label}
              </option>
            ))}
          </select>
        </div>

        <div className="cat-field-row">
          <span className="cat-label">Physical Description</span>
          <textarea
            className="cat-textarea"
            rows={2}
            aria-label="Pose physical kinesics description"
            value={character.microKinesics || ""}
            onChange={(e) => onPoseChange(e.target.value)}
            placeholder="Physical weight, posture, everyday habits, resting center of gravity..."
          />
        </div>
      </div>
    </CategoryCard>
  );
}
