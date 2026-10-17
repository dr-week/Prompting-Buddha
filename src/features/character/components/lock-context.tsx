"use client";

import { createContext, useContext, useMemo } from "react";

export type CharacterLockKey = "identity" | "body" | "hair" | "grooming" | "face" | "skin" | "wardrobe" | "footwear" | "pose";
type LockContextValue = { locked: Record<CharacterLockKey, boolean>; toggle: (key: CharacterLockKey) => void };

const CharacterLockContext = createContext<LockContextValue | null>(null);

const EMPTY_LOCKS: Record<CharacterLockKey, boolean> = { identity: false, body: false, hair: false, grooming: false, face: false, skin: false, wardrobe: false, footwear: false, pose: false };

export function CharacterLockProvider({ children, locked, onToggle }: { children: React.ReactNode; locked?: Partial<Record<CharacterLockKey, boolean>>; onToggle: (key: CharacterLockKey) => void }) {
  const normalized = useMemo(() => ({ ...EMPTY_LOCKS, ...locked }), [locked]);
  const value = useMemo(() => ({ locked: normalized, toggle: onToggle }), [normalized, onToggle]);
  return <CharacterLockContext.Provider value={value}>{children}</CharacterLockContext.Provider>;
}

export function useCharacterLocks() {
  const value = useContext(CharacterLockContext);
  if (!value) throw new Error("useCharacterLocks must be used inside CharacterLockProvider");
  return value;
}
