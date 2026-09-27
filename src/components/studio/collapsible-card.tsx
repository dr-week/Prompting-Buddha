"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * Shared collapsible card with a compact header and icon toggle.
 * Replaces ad-hoc collapse patterns across character and story-map sections.
 */
export function CollapsibleCard({
  label,
  defaultOpen = true,
  headerRight,
  children,
}: {
  label: ReactNode;
  defaultOpen?: boolean;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-card">
      <button
        type="button"
        className="collapsible-card-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="collapsible-card-label">{label}</span>
        <span className="collapsible-card-actions" onClick={(e) => e.stopPropagation()}>
          {headerRight}
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
      </button>
      {open && <div className="collapsible-card-body">{children}</div>}
    </div>
  );
}
