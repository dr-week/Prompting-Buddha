# Prompting Buddha (PROMTINGBUDHA)

> **Cinematic Multi-Character Visual Continuity & Prompt Engineering Studio**  
> Build deterministic, production-grade story continuity, mind maps, character sheets, and image/video prompts for Google Flow, Veo, Kling, and Runway Gen-4.

---

## Overview

**Prompting Buddha** is a Next.js 16 (Turbopack) & React 19 visual studio for generative film directors, animators, and AI storytellers. It solves one of the hardest problems in generative AI: **cross-scene visual continuity, multi-character identity locking, and physical plausibility**.

The studio provides a 5-step production pipeline:
1. **Character Foundry**: Procedural character creation, cultural & socioeconomic authenticity, granular category locks, and mononym cast management (up to 3 actors).
2. **Story Map (Mind Map)**: Graph-based narrative logic using `@xyflow/react`. Visually connect Premise $\to$ Environment $\to$ Characters $\to$ Props $\to$ Beats $\to$ Narration $\to$ Dialogue. Supports category locking, deterministic layout arrangement, and fast seed variations.
3. **Storyboard**: Shot framing (ECU, CU, MCU, MS, WS, OTS, POV), camera angles, spatial blocking, scene moment descriptions, and batch script compilation.
4. **Video**: Shot-by-shot Image-to-Video compilation (Ingredients Mode vs Start Frame Mode) with strict physical collision and anti-hallucination guardrails.
5. **Auditor**: Static prompt inspection detecting wardrobe transitions, character identity collisions, ambiguous references, and platform syntax discrepancies.

---

## How Laya Decision Engine is Used

**Laya** is our **sub-150ms System-1 cognitive decision engine** integrated into the studio workflow. It acts as an ultra-fast, lightweight inference layer that classifies and validates narrative prompts without slowing down user interactions.

### Architecture & Capabilities:
- **Location**: [`src/lib/laya/`](./src/lib/laya/)
- **Core Function**: `predictLaya(text, schema)`
  - Sub-150ms timeout enforced via `AbortController`.
  - In-memory LRU cache (`MAX_CACHE_SIZE = 500`) for zero-latency duplicate queries.
  - Fail-safe fallback returning `null` so network or local daemon timeouts never block UI execution.

### Integrated Schemas:
1. **Camera Framing (`SHOT_FRAMING_SCHEMA`)**: Automatically analyzes node descriptions or story beats to infer the optimal cinematic camera framing (`ECU`, `CU`, `MCU`, `MS`, `WS`, `OTS`, `POV`).
2. **Prompt Integrity & Safety (`PROMPT_AUDIT_SCHEMA`)**: Real-time auditing for:
   - `wardrobe_transition`: Flags mid-scene costume swaps lacking an editorial cut.
   - `generic_identity`: Catches weak descriptors like "the man" or "the woman" lacking a locked character tag.
   - `attention_competition`: Detects contradictory or repetitive prompt tokens that cause generative diffusion models to hallucinate extra limbs or distorted faces.
3. **Narrative Tone (`STORY_TONE_SCHEMA`)**: Inactive/active categorization between grounded Slice-of-Life pacing vs. high-stakes Cinematic drama.

---

## Tech Stack & Architecture

- **Framework**: Next.js 16.3.5 (Turbopack, App Router)
- **Frontend**: React 19, TypeScript 5, Tailwind CSS 4, Lucide React
- **Graph Canvas**: `@xyflow/react` (React Flow)
- **Persistence**: Dexie (IndexedDB) with schema versioning for zero-friction local persistence
- **Testing**: Vitest (Unit & Integration, 95+ passing tests) & Playwright (E2E)
- **Linter**: Oxlint & ESLint 9

---

## Project Structure

```
├── docs/                 # Architectural specifications and automation blueprints
├── public/               # Static assets & icons
├── scripts/              # Launch scripts (PowerShell & Batch)
├── src/
│   ├── app/              # Next.js App Router (layout, globals.css, main studio page)
│   ├── components/       # Studio chrome (StepNavigation, WorkspaceSidebar, Dialogs)
│   ├── features/
│   │   ├── auditor/      # Prompt auditing & fix recommendation engine
│   │   ├── character/    # Character foundry, ethnic/cultural wardrobe & locks
│   │   ├── props/        # Prop asset library & scene association
│   │   ├── story-map/    # Mind map graph, grammar validation, node inspector
│   │   ├── storyboard/   # Shot list, batch controls, daily moments
│   │   ├── video/        # Single-shot image-to-video generation directives
│   │   └── workspaces/   # Workspace lifecycle, Dexie storage, defaults
│   ├── lib/
│   │   ├── compiler/     # Deterministic prompt compilers & platform profiles
│   │   ├── laya/         # Laya System-1 fast decision client & schemas
│   │   ├── locks/        # Diagnostic lock integrity contracts
│   │   └── random/       # Seeded deterministic RNG
│   └── styles/           # Stage-specific modular styles
└── tests/                # Playwright end-to-end test suites
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
git clone https://github.com/dr-week/Prompting-Buddha.git
cd Prompting-Buddha
npm install
```

### Development Server
```bash
npm run dev
# or specify port 3001 if port 3000 is occupied:
npx next dev -p 3001
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser.

### Quality Verification
```bash
# Run Oxlint
npm run lint:oxlint

# Run Vitest test suite (95 tests)
npm test

# Run Next.js production build
npm run build
```

---

## Key Features & Quality Contracts

- **Zero Unicode Emojis**: Crisp, clean single-word labels paired exclusively with vector icons from `lucide-react`.
- **Character Locking Contract**: Lock traits across Identity, Body, Hair, Face, Grooming, and Wardrobe. Randomization respects locked traits deterministically without altering locked categories.
- **Story Continuity Propagation**: Changes to characters, locations, or props dynamically ripple across Story Map nodes, Storyboard panels, and compiled video prompts.
- **Anti-Hallucination Directives**: Auto-injection of physics constraints (e.g., thermal insulation for hot metal, T=0 frozen-pose consistency, anti-prop-magnet defocus).

---

## License

MIT © Prompting Buddha Contributors
