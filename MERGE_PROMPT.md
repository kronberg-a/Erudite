# AI System Prompt & Engineering Specification: Merging "chesslines.de" into "Erudite"

> **Target Project:** Unified "Erudite" Web Application (Vocabulary SRS + Interactive Chess Opening Trainer)  
> **Source Repositories:**  
> - `Erudite` (`kronberg-a/Erudite`): React 19 + TypeScript + Vite + Tailwind CSS (Ultra-minimalist design system, Spaced Repetition vocabulary engine).  
> - `chesslines.de` (`kronberg-a/chesslines.de`): Vanilla JS + jQuery + Chessboard.js + Chess.js + Stockfish 17.1 WASM (Comprehensive chess opening line explorer, trainer, Stockfish evaluation, and bot play).

---

## 1. High-Level Mission & Core Invariants

You are tasked with merging the complete functionality of **chesslines.de** into the **Erudite** web application so both live seamlessly in a single unified, responsive website.

### Non-Negotiable Invariants:
1. **Design System Matching:**
   - The design system of **Erudite** (ultra-minimalist, high-contrast, pure practical typography, sharp 1px borders, 150ms transitions, dark/light theme tokens) MUST be applied across the entire chess module.
   - **NO Emojis or Cartoons:** Replace all emojis, cartoon icons, and FontAwesome icons in `chesslines.de` with clean geometric vector icons (Lucide icons or clean SVG stroke icons) or pure typography.
2. **Preserve Complete Chess Functionality Without Regression:**
   - **CRITICAL:** `chesslines.de` possesses a highly sophisticated, tightly coupled file structure (`script.js` with ~2,880 lines, `board.js` with ~610 lines, `stockfish-wrapper.js` with ~680 lines, multiple DOM-dependent functions, global states, and Stockfish multi-part WASM chunk assembly).
   - You MUST act with extreme care: **DO NOT attempt a blind, ground-up rewrite of the chess engine or line management algorithms into idiomatic React state**. Doing so will inevitably break opening tree parsing, move validation, Stockfish evaluation, PGN import, or bot games.
   - Instead, encapsulate the chess workspace cleanly within the Erudite application shell, preserving its battle-tested engine scripts while skinning its DOM with Erudite's design tokens.
3. **Top-Left Mode Switcher Toggle:**
   - Directly underneath the `erudite.` brand mark/icon in the top-left corner, implement a tactile segmented mode toggle:
     `[ Words | Chess ]` (or `[ Vocabulary | Chess ]`).
   - Switching between "Words" and "Chess" must be instantaneous, preserve user state, and persist the active mode in `localStorage`.
4. **Theme Synchronization:**
   - The global Light/Dark theme toggle in the header must instantly synchronize across both the vocabulary system and the chess board, panels, and modals.

---

## 2. In-Depth Analysis of Both Codebases

### A. Erudite (`Erudite/`)
- **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Vitest.
- **Design Tokens (CSS Variables in `src/styles.css`):**
  - **Light Mode:** `--bg: #f8fafc`, `--surface: #ffffff`, `--text: #0f172a`, `--muted: #64748b`, `--border: #e2e8f0`, `--accent: #2563eb`, `--positive: #16a34a`, `--negative: #dc2626`.
  - **Dark Mode:** `--bg: #090d16`, `--surface: #111827`, `--text: #f8fafc`, `--muted: #94a3b8`, `--border: #1f2937`, `--accent: #3b82f6`, `--positive: #22c55e`, `--negative: #ef4444`.
- **Layout Architecture:**
  - Desktop (`>= 768px`): Persistent left sidebar (`brand`, tagline, workspace nav, language pair footer) + main content area.
  - Mobile (`< 768px`): Header topbar with mobile brand + fixed bottom navigation bar (`100dvh` full-height layout).

### B. chesslines.de (`chesslines.de/`)
- **Key Files & Roles:**
  - `server.js`: Node.js static server setting COOP/CORP headers (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: cross-origin`).
  - `index.html`: Contains all module layouts (`#main-container`, `#board-area`, `#controls-area`, `#view-mode`, `#add-mode`, `#train-mode`, `#selection-mode`, `#settings-mode`, `#bot-setup-mode`, `#bot-play-mode`, `#import-pgn-mode`, results overlays, move context menus).
  - `board.js` (614 LOC): Manages chessboard rendering, piece themes (`wikipedia`, `alpha`, etc.), square highlights, board flip, coordinate rendering, and SVG arrow/circle canvas overlays.
  - `script.js` (2,881 LOC): Massive state machine managing lines hierarchy, active repertoire, move annotations, opening explorer (Lichess API), PGN parser/exporter, training loop, and UI view switching via DOM manipulation.
  - `stockfish-wrapper.js` (679 LOC): Communicates with Stockfish worker, handles UCI commands, live evaluations, and bot play logic.
  - `stockfish/`: Contains `stockfish-17.1-single-a496a04.js` and 6 split WASM chunks:
    `stockfish-17.1-single-a496a04-part-0.wasm` through `part-5.wasm`. At runtime, the script fetches these 6 chunks via `fetch()`, combines them into a single `Blob`, and initializes WebAssembly.
  - `style.css` (1,447 LOC): Custom layout styles, resizer drag bar, explorer cards, and color variables.
  - External Vendor Libraries: jQuery 3.5.1, Chessboard.js 1.0.0, Chess.js 0.10.3, FontAwesome 6.4.0.

---

## 3. Step-by-Step Architectural Plan for Merging

### Step 1: Asset & Static File Placement
1. **Stockfish WASM Assets:**
   - Copy `stockfish/` directory from `chesslines.de` into `Erudite/public/stockfish/`.
   - Ensure all 6 `*.wasm` parts and `stockfish-17.1-single-a496a04.js` are served verbatim as static assets without any Vite bundling distortion.
2. **Vendor Scripts:**
   - Place jQuery, Chessboard.js, and Chess.js into `index.html` head or `public/vendor/`, or install via npm (`chess.js`, `@chrisoakman/chessboardjs`, `jquery`).
   - Crucial: Ensure `window.$`, `window.jQuery`, `window.Chessboard`, and `window.Chess` are globally defined before `board.js` and `script.js` execute.
3. **Vite Server Headers Configuration:**
   - Update `vite.config.ts` to include COOP and CORP headers required for WebAssembly and workers:
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

### Step 2: Encapsulation of Chess Scripts & DOM Container
To prevent regression in `script.js` and `board.js`:
1. Create a dedicated React container component: `src/components/chess/ChessView.tsx`.
2. Port the DOM elements from `chesslines.de/index.html` (inside `<div class="main-container" id="main-container">...</div>` and modal overlays) into `ChessView.tsx` or a modular sub-structure.
3. Handle Initialization & Lifecycle:
   - Ensure the board container (`#board`) mounts and calls `initBoard()` / `initializeStockfish()` when the Chess view becomes active.
   - When switching from Chess to Words, call `stopEngineCalculation()` and pause board listeners so background worker threads do not consume CPU.
   - Re-trigger `board.resize()` whenever the user switches back into Chess mode or resizes the viewport.

### Step 3: Top-Left Segmented Mode Switcher
In `src/App.tsx`:
1. Add an application-level state:
   ```typescript
   type AppMode = 'words' | 'chess';
   const [appMode, setAppMode] = useState<AppMode>(() => {
     return (localStorage.getItem('erudite_active_app_mode') as AppMode) || 'words';
   });
   ```
2. Render the mode toggle directly under the `brand` header:
   - **In Desktop Sidebar (`src/App.tsx`):**
     Immediately below `<a className="brand" ...>...</a>` and above the navigation links, insert:
     ```tsx
     <div className="mode-switcher-container">
       <div className="segmented-control" role="tablist" aria-label="Application Mode">
         <button
           role="tab"
           aria-selected={appMode === 'words'}
           className={`segmented-tab ${appMode === 'words' ? 'active' : ''}`}
           onClick={() => setAppMode('words')}
         >
           <BookOpen size={14} />
           <span>Words</span>
         </button>
         <button
           role="tab"
           aria-selected={appMode === 'chess'}
           className={`segmented-tab ${appMode === 'chess' ? 'active' : ''}`}
           onClick={() => setAppMode('chess')}
         >
           <Crown size={14} />
           <span>Chess</span>
         </button>
       </div>
     </div>
     ```
   - **In Mobile Topbar:**
     Add a corresponding compact segmented control in the topbar header next to or below `erudite.` so mobile users can switch with a single tap.
3. Render conditional view:
   - If `appMode === 'words'`, render Erudite's current navigation, sidebar footer, and `<StudyView>` / `<CategoryView>` / `<WordForm>` / `<SettingsView>`.
   - If `appMode === 'chess'`, render `<ChessView />` inside the main shell while retaining Erudite's sidebar/header shell and unified theme toggle.

### Step 4: Skinning "chesslines.de" to Match Erudite Design
Transform `chesslines.de`'s visual aesthetic without altering its DOM IDs or JS logic:
1. **Color Tokens Alignment:**
   In CSS, map all legacy chess classes to Erudite's CSS variables:
   - Backgrounds: `background: var(--bg)`
   - Surfaces/Cards/Panels: `background: var(--surface)`, `border: 1px solid var(--border)`
   - Primary Text: `color: var(--text)`
   - Secondary/Muted Text: `color: var(--muted)`
   - Action Buttons: `border-radius: 4px`, `font-size: 13px`, `font-weight: 500`, smooth `150ms ease-out` hover states using `var(--accent)` and `var(--soft)`.
   - Evaluation Bar: Clean geometric bar with high-contrast indicator.
2. **Icon & Visual Modernization (Strict Rule: Zero Emojis / Zero Cartoons):**
   - Replace FontAwesome `<i class="fas ...">` references with Lucide React SVG icons or clean inline SVG strokes.
   - Remove any cartoonish victory/defeat graphics, emojis, or heavy skeuomorphic gradients from results overlays (`#training-results-overlay`, `#bot-results-overlay`).
   - Use clean, sharp typography (Georgia serif for brand highlights and chess titles, clean sans-serif for moves and coordinates).
3. **Responsive Split-Pane & Board Area:**
   - On desktop: Centered layout with resizable pane (`#resizer`), perfectly respecting the left sidebar.
   - On mobile (`< 768px`): Ensure `100dvh` viewport containment, thumb-friendly board controls, and seamless switching between board and move explorer.

---

## 4. Verification & Quality Checklist

Before completing the merge, the AI agent must verify:
- [ ] **Words Module Functionality:** All existing Erudite tests pass (`pnpm test` / `vitest run`). SRS queues, typing recall, card swipe gestures, audio pronunciation, and vocabulary storage remain 100% operational.
- [ ] **Chess Module Functionality:**
  - Board loads correctly with chosen piece theme and colors.
  - Stockfish 17.1 Web Worker initializes without errors (verify WASM multi-part fetching in the Network tab).
  - Line creation, move validation via `chess.js`, and PGN import work accurately.
  - Training loop executes, tracking correct/wrong moves and spaced repetition flags.
  - Bot games at varying Elo ratings and playstyles function smoothly.
  - Lichess database opening explorer successfully fetches candidate moves.
- [ ] **UI & Theme Consistency:**
  - Toggling Light/Dark mode in the top right instantly themes both Erudite and Chesslines elements without page reloads.
  - The top-left segmented toggle cleanly switches between `Words` and `Chess`.
  - Zero emojis or cartoon graphics anywhere in the entire codebase.
  - Constraint check script (`pnpm check:constraints`) passes with 0 violations.
