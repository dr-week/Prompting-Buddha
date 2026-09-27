"use client";

import { type ReactNode, type ButtonHTMLAttributes } from "react";

/**
 * Shared icon-only button with accessible title/aria-label.
 * Use for randomize, lock, copy, collapse actions.
 */
export function IconButton({
  icon,
  label,
  className = "icon-button",
  ...props
}: {
  icon: ReactNode;
  label: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={className}
      title={label}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
