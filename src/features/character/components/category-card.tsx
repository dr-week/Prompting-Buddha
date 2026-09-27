import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lock, Unlock, Shuffle } from "lucide-react";
import { useCharacterLocks, type CharacterLockKey } from "./lock-context";

export function CategoryCard({
  title,
  icon: Icon,
  onRoll,
  rollTitle = "Randomise section",
  defaultCollapsed = false,
  children,
  className = "",
  lockKey,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onRoll?: () => void;
  rollTitle?: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
  className?: string;
  lockKey: CharacterLockKey;
  // Legacy props — accepted but ignored so callers don't break
  iconColor?: string;
  iconBg?: string;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const { locked, toggle } = useCharacterLocks();
  const isLocked = !!locked[lockKey];

  return (
    <div className={`character-cat-card${isLocked ? " locked-stage-tint" : ""}${collapsed ? " collapsed" : ""} ${className}`}>
      <div className="cat-card-header">
        <button
          type="button"
          className="cat-card-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
        >
          <div className="cat-card-icon">
            <Icon size={13} />
          </div>
          <span className="cat-card-title">{title}</span>
          {isLocked && <Lock size={10} className="cat-locked-indicator" aria-label="Locked" />}
        </button>
        <div className="cat-card-actions">
          <button
            type="button"
            className={`cat-lock-btn${isLocked ? " locked" : ""}`}
            onClick={() => toggle(lockKey)}
            title={isLocked ? `Unlock ${title}` : `Lock ${title}`}
            aria-label={isLocked ? `Unlock ${title}` : `Lock ${title}`}
          >
            {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
          {onRoll && (
            <button
              type="button"
              className="cat-roll-btn"
              onClick={onRoll}
              title={rollTitle}
              aria-label={rollTitle}
            >
              <Shuffle size={11} />
            </button>
          )}
          <button
            type="button"
            className="cat-collapse-btn"
            onClick={() => setCollapsed((prev) => !prev)}
            title={collapsed ? "Expand section" : "Collapse section"}
            aria-label={collapsed ? "Expand section" : "Collapse section"}
          >
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>
      {!collapsed && <div className="cat-card-body">{children}</div>}
    </div>
  );
}
