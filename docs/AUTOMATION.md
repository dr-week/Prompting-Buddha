# Prompting Buddha automation plan

## Local quality gate

Every change should run in this order:

1. `npm run lint` — code and React rules.
2. `npm run test` — deterministic compiler tests and golden prompt checks.
3. `npm run build` — Next.js and TypeScript production compilation.
4. `npm run test:e2e` — workspace creation and four-stage browser workflow.

## Storage contract

- `prompting-buddha-registry` stores workspace summaries only.
- Each story uses an isolated `prompting-buddha-workspace-{id}` IndexedDB database.
- A workspace database owns its cast, storyboard, selected workflow step, and compiler state.
- Cloud sync is deliberately deferred. Dexie is the canonical MVP storage layer.

## Module boundaries

- `features/workspaces` owns persistence and workspace lifecycle.
- `features/story-map`, `character`, `storyboard`, `video`, and `auditor` own their stage UI.
- `@xyflow/react` provides the open-source story-logic canvas; only node and edge data is persisted.
- `lib/compiler/*` is the public compiler boundary.
- `lib/filmmaker-compiler.ts` remains the preserved legacy engine while logic is migrated incrementally.
- `lib/cine-database.ts` remains research data, not UI content.

## CI target

Add the local quality gate to GitHub Actions after the first golden prompt fixtures are approved. Browser tests should use one temporary workspace and delete its IndexedDB databases after each run.
