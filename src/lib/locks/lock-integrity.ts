export interface LockDiagnostic {
  scope: string;
  field?: string;
  message: string;
}

const diagnostics: LockDiagnostic[] = [];

export function recordLockDiagnostic(event: LockDiagnostic) {
  diagnostics.push(event);
}

export function readLockDiagnostics() {
  return [...diagnostics];
}

export function clearLockDiagnostics() {
  diagnostics.length = 0;
}

export function assertLocksUnchanged<T>(before: T, after: T, scope = "randomizer") {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  const event = { scope, message: "Randomization changed the lock state." };
  recordLockDiagnostic(event);
  if (process.env.NODE_ENV !== "production") throw new Error(`${scope}: ${event.message}`);
}

export function preserveNodeLocks<T extends { id: string; locked?: boolean }>(
  before: T[],
  after: T[],
  scope = "node-randomizer",
) {
  if (before.length !== after.length) recordLockDiagnostic({ scope, message: "Randomization changed the node collection while preserving locks." });
  const lockById = new Map(before.map((item) => [item.id, item.locked]));
  return after.map((item) => ({ ...item, locked: lockById.get(item.id) }));
}
