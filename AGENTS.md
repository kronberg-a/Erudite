# AGENTS.md — Project "Erudite" (Dual Module: Vocabulary SRS + Chess Opening Trainer)

> **Project Name:** Erudite  
> **Repository:** `kronberg-a/Erudite`  
> **Mission & Scope:** A unified, production-ready, mobile-first responsive web application combining two high-performance learning disciplines into a single minimalist shell:
> 1. **Vocabulary Learning (Words):** Spaced Repetition (SRS) vocabulary learning replicating the exact functional and algorithmic mechanics of **ReWord**, enhanced with typing recall and auto-translation.
> 2. **Chess Opening Trainer (Chess):** Interactive chess repertoire builder, spaced repetition line trainer, Lichess database explorer, and Stockfish 17.1 WASM bot engine (integrated from **chesslines.de**).
> 
> Both modules share a unified, ultra-minimalist, purely practical aesthetic with instant Light/Dark mode theming and a top-left mode toggle.

---

## 1. Strict Negative Constraints (Hard Invariants)

All AI agents and developers working on this codebase **MUST** adhere strictly to these non-negotiable rules:

1. **NO Emojis or Cartoons:**
   - Do **NOT** use emojis anywhere in the user interface, buttons, category tags, feedback banners, victory/defeat cards, or icons.
   - Use exclusively clean geometric vector icons (Lucide React or clean SVG stroke icons) or pure typography.
   - Replace any legacy FontAwesome icons or cartoonish graphics from `chesslines.de` with Lucide SVG icons.
2. **NO Notifications or Nagging:**
   - Do **NOT** implement push notifications, browser notification APIs, reminder popups, streak-loss warnings, or daily alarm settings.
   - The user trains and learns entirely on their own terms.
3. **NO Decorative Bloat:**
   - Keep transitions fast, snappy, and functional (`150ms ease-out`).
   - High contrast, sharp 1px borders, subtle elevation shadows, generous whitespace, zero heavy skeuomorphic gradients.

---

## 2. Core System Architecture & Unified App Shell

- **Framework:** React 19 + TypeScript + Vite + Tailwind CSS.
- **Top-Left Dual-Module Switcher (Words vs. Chess):**
  - Directly underneath the `erudite.` brand mark/icon in the top-left corner, render a prominent, tactile segmented toggle:
    `[ Words | Chess ]` (or `[ Vocabulary | Chess ]`).
  - Active module state (`'words' | 'chess'`) must be persisted in `localStorage` (`erudite_active_app_mode`).
  - Switching between modules is instant, non-destructive to state, and retains active training sessions.
- **Unified Theme Synchronization:**
  - The global Light/Dark mode toggle in the header controls both modules simultaneously.
  - Theme state is persisted in `localStorage` and toggles `.dark` on `document.documentElement`.
- **Responsive Layout:**
  - **Desktop (`>= 768px`):** Persistent left sidebar containing the `erudite.` brand mark, mode toggle, contextual navigation items, and language pair indicators. Main content area centers flashcards or the resizable chess board/control area.
  - **Mobile (`< 768px`):** `100dvh` full-viewport layout preventing URL bar shifting, compact topbar with mode switch, and thumb-friendly controls.

---

## 3. Module 1: Vocabulary Learning Engine ("Words")

Replicates and upgrades the exact algorithmic logic of **ReWord**:

### 3.1 Multi-Language Engine (Dual Layer)
- **Supported Languages:** English (`en`), Russian (`ru`), German (`de`), French (`fr`), Italian (`it`), Spanish (`es`).
- **Layer 1 (Interface Language):** Controls all UI text, menus, buttons, and stats. Switchable at any time.
- **Layer 2 (Translation Pair):** Source (base) language $\rightarrow$ Target (learning) language.

### 3.2 WordCard Schema & State Machine
- `id`: Unique string
- `targetWord`: Word being learned
- `transcription`: Optional phonetic transcription (IPA)
- `translations`: Array of strings in source language
- `examples`: Array of `{ targetSentence, translatedSentence }`
- `categoryIds`: Associated folder IDs
- `status`: `'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED'`
- `step`: Current short-term step ($0 \le \text{step} \le 3$)
- `interval`: Review interval in days
- `easeFactor`: Default `2.5`, minimum `1.3`
- `nextReviewDate`: Timestamp in ms

### 3.3 ReWord Spaced Repetition Algorithm
- **Positive Action ("I Know" / Swipe Right / `→`):**
  - `NEW`: Graduated to `MASTERED` (if instant-master toggle is active) OR moved to `REVIEW` with `interval = 7` days.
  - `LEARNING`: `step = step + 1`. If `step >= 3`, graduate to `REVIEW` with `interval = 1` day.
  - `REVIEW`: `interval = Math.round(interval * easeFactor)`, `easeFactor = easeFactor + 0.1`, `nextReviewDate = now + interval`. If `interval > 90`, status becomes `MASTERED`.
- **Negative Action ("Don't Know" / Swipe Left / `←`):**
  - `status = 'LEARNING'`, `step = 0`, `easeFactor = Math.max(1.3, easeFactor - 0.2)`.
  - **In-Session Re-queue:** Insert card **3 to 5 cards ahead** in the active session so the user must repeat it before finishing.
- **Instant Master ("Already Mastered" / Swipe Up / `↑`):** Immediately sets `status = 'MASTERED'`.
- **Typing Recall Mode:** Allows typing target words with 3 attempts before revealing answers, assisted grading, and audio pronunciation via Web Speech API.
- **Auto-Translator:** 500ms debounced fetching via MyMemory Translation API with alternate translation chips.

---

## 4. Module 2: Chess Opening Trainer ("Chess")

Integrated from **chesslines.de** to provide professional-grade repertoire training.

### 4.1 CRITICAL ARCHITECTURAL WARNING: Delicate File Structure
> [!CAUTION]
> **DO NOT blindly rewrite `script.js` or `board.js` into idiomatic React components from scratch.**  
> `chesslines.de` features a highly sophisticated, tightly coupled procedural architecture:
> - `script.js` (~2,880 lines) manages complex opening tree structures, transpositions, move validation, PGN import/export, and DOM mode swapping.
> - `board.js` (~610 lines) manages SVG arrow canvases, piece drag-and-drop, and coordinates.
> - `stockfish-wrapper.js` (~680 lines) communicates with the Web Worker and drives multi-PV bot games.
> 
> **Mandated Integration Pattern:**
> - Encapsulate the DOM structure of `chesslines.de` inside a dedicated React component (`src/components/chess/ChessView.tsx`).
> - Keep the battle-tested script logic intact.
> - Cleanly manage mounting/resizing lifecycles (`initBoard()`, `board.resize()`) and pause Stockfish calculations (`stopEngineCalculation()`) when switching to Words.

### 4.2 Stockfish 17.1 WASM Multi-Part Engine
- **Chunk Files:** `public/stockfish/` must contain:
  - `stockfish-17.1-single-a496a04.js` (Web Worker loader)
  - `stockfish-17.1-single-a496a04-part-0.wasm` through `part-5.wasm` (6 split chunks)
- At runtime, the loader fetches the 6 chunks via `fetch()`, concatenates them using `new Blob()`, and creates an Object URL for WebAssembly instantiation.
- **Server Headers (COOP / CORP):** Required in `vite.config.ts`:
  ```typescript
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  }
  ```

### 4.3 Key Chess Features
1. **Repertoire Manager & Tree View:** White & Black opening lines, branching lines, move annotations (`!`, `?`, `!?`, `⩲`, `±`, `+-`), and category tagging.
2. **Spaced Repetition Training Loop:** Drill user repertoires with instant feedback on correct/incorrect moves and repetition scheduling.
3. **Lichess Database Explorer:** Live opening statistics from masters and Lichess games for any given board position.
4. **Stockfish Evaluation & Bot Play:**
   - Real-time evaluation bar and best-move arrows.
   - Configurable Bot Game: Elo slider from 500 to 3300 and playstyles (`neutral`, `greedy`, `tactical`, `positional`).
5. **PGN Import / Export:** Bulk PGN import with preview and full export capabilities.

---

## 5. Design System, Theme Tokens & Styling

Both modules MUST be styled using Erudite's unified CSS variable design tokens:

### 5.1 Theme Tokens
| Token | Light Mode (`theme === 'light'`) | Dark Mode (`theme === 'dark'`) |
| :--- | :--- | :--- |
| **`--bg`** | `#f8fafc` (Slate 50) | `#090d16` (Deep Obsidian) |
| **`--surface`** | `#ffffff` (Pure White) | `#111827` (Gray 900) |
| **`--text`** | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) |
| **`--muted`** | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) |
| **`--border`** | `#e2e8f0` (Slate 200) | `#1f2937` (Gray 800) |
| **`--accent`** | `#2563eb` (Blue 600) | `#3b82f6` (Blue 500) |
| **`--positive`** | `#16a34a` (Green 600) | `#22c55e` (Green 500) |
| **`--negative`** | `#dc2626` (Red 600) | `#ef4444` (Red 500) |
| **`--soft`** | `#f1f5f9` (Slate 100) | `#182131` (Slate 850) |

### 5.2 Modernizing Chesslines UI
- Skin `#board-area`, `#controls-area`, `#lines-list`, and modal overlays with `var(--bg)`, `var(--surface)`, `var(--border)`, and `var(--text)`.
- Replace all skeuomorphic shadows with 1px borders and subtle elevations.
- Ensure the resizer divider (`#resizer`) integrates smoothly with the layout.

---

## 6. Project Directory Structure

```text
Erudite/
├── AGENTS.md                     # This file (AI directives and system specification)
├── MERGE_PROMPT.md               # Detailed merger reference and migration instructions
├── package.json
├── tsconfig.json
├── vite.config.ts                # Vite config with COOP/CORP headers
├── tailwind.config.js
├── index.html                    # Root HTML with vendor dependencies
├── public/
│   ├── favicon.svg
│   ├── stockfish/                # 6 WASM parts + Stockfish JS worker
│   │   ├── stockfish-17.1-single-a496a04.js
│   │   └── stockfish-17.1-single-a496a04-part-[0-5].wasm
│   └── vendor/                   # jQuery, Chessboard.js, Chess.js
├── src/
│   ├── main.tsx
│   ├── App.tsx                   # Unified Shell with top-left Words/Chess switcher
│   ├── styles.css                # Design tokens & unified CSS
│   ├── types.ts                  # TypeScript types for words, chess, settings
│   ├── components/
│   │   ├── StudyView.tsx         # Vocabulary SRS flashcard view
│   │   ├── CategoryView.tsx      # Vocabulary categories & word library
│   │   ├── WordForm.tsx          # Word creation & auto-translation
│   │   ├── SettingsView.tsx      # App settings & data backup
│   │   ├── TypingCard.tsx        # Recall typing mode
│   │   └── chess/
│   │       ├── ChessView.tsx     # Encapsulated Chesslines container
│   │       ├── ChessControls.tsx # Lines, database, and bot panels
│   │       └── ResultsOverlay.tsx# Minimalist game results
│   ├── core/
│   │   ├── srsEngine.ts          # ReWord SRS algorithm
│   │   ├── queueManager.ts       # Vocabulary session queues
│   │   ├── typing.ts             # Typing grading logic
│   │   └── speech.ts             # Web Speech API wrapper
│   ├── chess-engine/             # Ported chesslines scripts (preserved logic)
│   │   ├── board.js              # Board drawing, highlights, SVG arrows
│   │   ├── script.js             # Opening lines & repertoire logic
│   │   └── stockfish-wrapper.js  # UCI engine & bot communication
│   ├── i18n/
│   │   ├── translations.ts       # 6-language UI dictionary
│   │   └── seedData.ts           # Pre-seeded starter vocabulary
│   └── services/
│       ├── storage.ts            # LocalStorage persistence
│       └── translator.ts         # Free MyMemory API integration
└── scripts/
    └── check-constraints.mjs     # Automated linter verifying zero emojis & no notifications
```

---

## 7. AI Agent Execution & Verification Directives

When implementing changes or adding features:
1. **Never Break Existing Erudite Tests:** Run `pnpm test` (`vitest run`) to verify that vocabulary SRS, typing recall, and seed data remain intact.
2. **Never Break Chesslines Functionality:**
   - Verify opening lines can be added, edited, saved, and imported from PGN.
   - Verify the Stockfish Web Worker starts up and correctly downloads all 6 WASM parts.
   - Test Bot games and Lichess database queries.
3. **Enforce Design Consistency:**
   - Verify that toggling Light/Dark mode seamlessly styles both the Vocabulary view and the Chessboard/panels.
   - Check that the top-left toggle cleanly switches between `Words` and `Chess`.
4. **Enforce Hard Constraints:**
   - Run `pnpm check:constraints` (or `node scripts/check-constraints.mjs`) to verify 0 emojis and no notification code.
