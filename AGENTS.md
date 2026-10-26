# AGENTS.md — Project "Erudite" Specification & Agent Directives

> **Project Name:** Erudite  
> **Repository:** `kronberg-a/Erudite`  
> **Role & Objective:** Production-ready, mobile-first, responsive vocabulary learning web application replicating the exact functional and algorithmic logic of the **ReWord** vocabulary app, upgraded with an ultra-minimalist, purely practical design system.

---

## 1. Strict Negative Constraints (Hard Invariants)

All AI agents and developers working on this repository **MUST** adhere strictly to these constraints:

1. **NO Emojis or Cartoons:**
   - Do **NOT** use emojis anywhere in the user interface, icons, category tags, feedback banners, or buttons.
   - Use exclusively clean geometric vector icons (e.g., Lucide React icons, SVG stroke icons) or pure typography.
2. **NO Notifications or Nagging:**
   - Do **NOT** implement push notifications, browser notification APIs, reminder popups, streak-loss warnings, or daily alarm settings.
   - The user studies on their own terms without gamified pressure.
3. **NO Decorative Bloat:**
   - Keep animations fast and functional (`150ms ease-out`).
   - High contrast, sharp 1px borders, subtle elevation shadows, generous whitespace, zero gimmick animations.

---

## 2. System Architecture & Tech Stack

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS with CSS Variables / Tailwind dark mode class (`class` strategy)
- **Icons:** `lucide-react` (clean, 1.5–2px stroke weight)
- **State & Persistence:** Local-first architecture using `localStorage` (with automatic schema versioning and hydration)
- **Audio:** Web Speech API (`window.speechSynthesis`) localized to the target language
- **Translation:** Free zero-config API endpoint (MyMemory Translation API with fallback)

---

## 3. Multi-Language Engine (i18n & Language Pairs)

The application features a dual-layer language architecture:

### 3.1 Supported Languages
- English (`en`)
- Russian (`ru`)
- German (`de`)
- French (`fr`)
- Italian (`it`)
- Spanish (`es`)

### 3.2 Dual-Layer Configuration
1. **Interface Language (UI):**
   - Controls application menus, action buttons, dialogs, statistics, and system messages.
   - Dynamically switchable at any time between the 6 supported languages.
2. **Translation Pair (`sourceLang` -> `targetLang`):**
   - `sourceLang`: Native/base language (for definitions, hints, translations, context translations).
   - `targetLang`: Learning target language (for prompt words, transcriptions, pronunciations, example target sentences).
   - Changing the pair loads or filters the vocabulary repository associated with that pair.

---

## 4. Data Models & TypeScript Definitions

```typescript
export type SupportedLanguage = 'en' | 'ru' | 'de' | 'fr' | 'it' | 'es';

export type WordStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';

export interface SentenceExample {
  targetSentence: string;
  translatedSentence: string;
}

export interface WordCard {
  id: string;
  targetWord: string;
  transcription?: string; // Optional phonetic transcription (e.g., IPA)
  translations: string[]; // Translations in user's base/source language
  examples: SentenceExample[];
  categoryIds: string[]; // Folder / Category IDs
  status: WordStatus;
  step: number; // Short-term learning step (0 to 3)
  interval: number; // Days until next review
  easeFactor: number; // Default: 2.5, Minimum: 1.3
  nextReviewDate: number; // Timestamp in milliseconds
  createdAt: number;
  lastStudiedAt?: number;
}

export interface Category {
  id: string;
  name: Record<SupportedLanguage, string>; // Localized category name
  description?: Record<SupportedLanguage, string>;
  isCustom?: boolean;
  isActiveForStudy: boolean; // Toggled in study queue
}

export interface UserSettings {
  interfaceLanguage: SupportedLanguage;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  dailyNewCardsCap: number; // Default e.g. 10 or 20
  instantMasterOnFirstTry: boolean; // Settings toggle: true -> MASTERED, false -> REVIEW with 7-day interval
  theme: 'light' | 'dark';
}
```

---

## 5. Spaced Repetition System (The ReWord Algorithm)

### 5.1 Queue Construction Logic
When initiating a study session:
1. Filter `WordCard` items belonging to categories where `isActiveForStudy === true`.
2. Determine active mode:
   - **Mixed Mode (Default):**
     - Due `REVIEW` cards: `status === 'REVIEW' && nextReviewDate <= Date.now()`
     - Active `LEARNING` cards: `status === 'LEARNING'`
     - Cap of `NEW` cards: `status === 'NEW'`, up to `dailyNewCardsCap`
   - **New Words Only:** `status === 'NEW'`, sliced to cap.
   - **Review Only:** Due `status === 'REVIEW'` cards + active `LEARNING` cards.

### 5.2 State Transitions

#### Positive Action ("I Know / Remembered" — Swipe Right / `→`)
- **If `status === 'NEW'` (First Encounter):**
  - If `settings.instantMasterOnFirstTry === true`:
    - `status = 'MASTERED'`
    - Excluded from future review queues.
  - If `settings.instantMasterOnFirstTry === false`:
    - `status = 'REVIEW'`
    - `interval = 7`
    - `nextReviewDate = Date.now() + 7 * 86400000`
- **If `status === 'LEARNING'`:**
  - `step = step + 1`
  - If `step >= 3`:
    - Graduate to `REVIEW`: `status = 'REVIEW'`, `interval = 1`, `nextReviewDate = Date.now() + 1 * 86400000`
  - Else:
    - Remains in `LEARNING`, queue moves forward.
- **If `status === 'REVIEW'`:**
  - `interval = Math.round(interval * easeFactor)`
  - `easeFactor = easeFactor + 0.1`
  - `nextReviewDate = Date.now() + interval * 86400000`
  - If `interval > 90`:
    - `status = 'MASTERED'`

#### Negative Action ("Don't Know / Repeat" — Swipe Left / `←`)
- `status = 'LEARNING'`
- `step = 0`
- `easeFactor = Math.max(1.3, easeFactor - 0.2)`
- **Session Re-queue:** Re-insert the card into the current active session queue **3 to 5 cards ahead** (or at the end if fewer cards remain) so the user must repeat and pass it before completing the session.

#### Instant Master Action ("Already Mastered / Exclude" — Swipe Up / `↑`)
- `status = 'MASTERED'`
- Card is permanently excluded from regular learning queues (can be manually reset in Category Management).

#### Undo Action (Undo Button / `Ctrl+Z` / `Backspace`)
- Maintains an undo stack of `{ cardId, previousCardState, previousQueueIndex }`.
- Restores the previous card state and places it back at the front of the session deck with smooth reverse animation.

---

## 6. Card Interaction, Gesture Physics & Navigation

### 6.1 Visual Card States
- **State A (Front / Prompt):**
  - Displays `targetWord` in prominent, high-contrast typography.
  - Displays `transcription` (if available).
  - Audio Pronunciation Button (`speechSynthesis` matching target language locale).
  - Subtle hint/tap prompt to reveal (e.g. `[Space / Tap to reveal]`).
  - Translations and examples are hidden.
- **State B (Revealed):**
  - Tapping anywhere on the card body, pressing `Spacebar`, or pressing `Enter` reveals:
    - Primary and alternate `translations`.
    - `examples` (target language sentence + translated sentence).
  - Smooth 150ms expand or fast 180-degree flip.

### 6.2 Gesture & Drag Mechanics
Support Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) & Touch Events:
- Track `deltaX` and `deltaY` from pointer start.
- Apply dynamic transform during drag:
  - `translateX = deltaX`
  - `translateY = deltaY`
  - `rotation = (deltaX / 100) * 8` degrees (subtle tilt)
- **Visual Threshold Feedback:**
  - `deltaX > 0`: Green border tint & "KNOW" indicator badge opacity scales from `0` to `1` as `deltaX` approaches `+100px`.
  - `deltaX < 0`: Red/amber border tint & "REPEAT" indicator badge opacity scales from `0` to `1` as `deltaX` approaches `-100px`.
  - `deltaY < -40px`: Subtle upward indicator badge ("MASTER") fades in as `deltaY` approaches `-100px`.
- **Threshold Triggers:**
  - `deltaX > +100px` (or `ArrowRight`): Fly card off-screen to right + Positive SRS transition.
  - `deltaX < -100px` (or `ArrowLeft`): Fly card off-screen to left + Negative SRS transition + Re-queue.
  - `deltaY < -100px` (or `ArrowUp`): Fly card off-screen upward + Master transition.
  - Releasing before threshold: Snap card back to center (`transform: translate(0, 0) rotate(0)` with spring/ease transition).

### 6.3 Accessible Action Bar
Directly below the flashcard stack, render clean tactile buttons:
- **[ Repeat (←) ]** (Left button / Red accent on active)
- **[ Reveal (Space) ]** (Center button / Neutral outline)
- **[ Know (→) ]** (Right button / Green accent on active)
- Top-left bar: **[ Undo (Ctrl+Z) ]** and current session progress counter `(e.g., 14 / 28)`.

---

## 7. Built-in Auto-Translator & Word Creation

### 7.1 Word Creation Modal
- **Source/Target Word Input:** Immediate user typing.
- **Debounced Translation:** Triggers 500ms after user stops typing, plus a manual "Translate" button.
- **Endpoint:**
  ```text
  GET https://api.mymemory.translated.net/get?q={word}&langpair={source}|{target}
  ```
  *(With network error handling and sanitization).*
- **Fields:**
  - Auto-populated primary translation in editable input.
  - Selectable chips for alternate translations (matches `matches[].translation`).
  - Context sentence input + "Auto-translate sentence" helper button.
  - Category / Folder picker dropdown (assign to existing or new custom folder).
  - "Save to Vocabulary" action.

---

## 8. Category & Folder Management

- **Pre-seeded Categories:**
  - Top 500 Core Words
  - Essential Verbs & Action Words
  - Travel & Daily Life
  - Abstract & Intellectual Concepts
- **Folder Statistics:**
  - Total words in category
  - Learning count (`status === 'LEARNING' || status === 'NEW'`)
  - Mastered count (`status === 'MASTERED'`)
  - Checkbox toggle: Include/exclude category in active study sessions.
- **Search & Word Management:**
  - Full-text search across all words (target word + translation).
  - Word detail drawer/modal: Edit word, reset SRS progress back to `NEW`, or toggle `MASTERED`.

---

## 9. Design System, Theme Tokens & Responsive Layout

### 9.1 Theme Tokens
| Token | Light Mode (`theme === 'light'`) | Dark Mode (`theme === 'dark'`) |
| :--- | :--- | :--- |
| **Background** | `#F8FAFC` (Slate 50) | `#090D16` (Deep Obsidian) |
| **Card Surface** | `#FFFFFF` (Pure White) | `#111827` (Gray 900) |
| **Primary Text** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) |
| **Muted Text** | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) |
| **Border** | `#E2E8F0` (Slate 200) | `#1F2937` (Gray 800) |
| **Positive / Know** | `#16A34A` (Green 600) | `#22C55E` (Green 500) |
| **Negative / Repeat** | `#DC2626` (Red 600) | `#EF4444` (Red 500) |
| **Accent / Focus** | `#2563EB` (Blue 600) | `#3B82F6` (Blue 500) |

### 9.2 Responsive Architecture
- **Mobile (`< 768px`):**
  - Exact `100dvh` viewport height to prevent mobile browser URL bar jumping.
  - Fixed bottom navigation bar: `Learn`, `Categories`, `Add Word`, `Settings`.
  - Flashcard occupies 70% of vertical height for comfortable single-thumb operation.
- **Desktop / Laptop (`>= 768px`):**
  - Persistent left sidebar navigation.
  - Centered flashcard container (`max-w-lg`).
  - Subtle keyboard shortcut labels below the flashcard:
    `[Space] Reveal` &bull; `[←] Repeat` &bull; `[→] Know` &bull; `[↑] Master` &bull; `[Ctrl+Z] Undo`.
  - Multi-column grid for Category and Word library management.

---

## 10. Suggested File & Folder Structure

```text
Erudite/
├── AGENTS.md                 # This file (AI instructions & project spec)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   ├── vocabulary.ts     # WordCard, Category, SRS types
│   │   └── settings.ts       # Language, Theme, UserPreferences
│   ├── core/
│   │   ├── srsEngine.ts      # ReWord SRS calculation functions
│   │   ├── queueManager.ts   # Session queue builder & in-session re-queue
│   │   └── speech.ts         # Web Speech API wrapper
│   ├── services/
│   │   ├── translator.ts     # MyMemory / Lingva translation integration
│   │   └── storage.ts        # LocalStorage persistence & migration
│   ├── i18n/
│   │   ├── translations.ts   # UI text in 6 languages
│   │   └── seedData/         # Pre-seeded starter vocabulary across language pairs
│   ├── hooks/
│   │   ├── useSwipeGesture.ts# Physics-based swipe/pointer tracking hook
│   │   └── useKeyboard.ts    # Keyboard shortcut listener
│   └── components/
│       ├── layout/
│       │   ├── Shell.tsx
│       │   ├── Sidebar.tsx
│       │   └── BottomNav.tsx
│       ├── study/
│       │   ├── StudyView.tsx
│       │   ├── CardStack.tsx
│       │   ├── Flashcard.tsx
│       │   └── ActionButtons.tsx
│       ├── categories/
│       │   ├── CategoryListView.tsx
│       │   └── WordTable.tsx
│       ├── words/
│       │   └── AddWordModal.tsx
│       └── settings/
│           └── SettingsModal.tsx
```

---

## 11. AI Agent Work Plan & Implementation Guidelines

When an AI agent is instructed to implement features or the complete codebase:
1. **Initialize Project Skeleton:** Set up Vite + React + TypeScript + Tailwind CSS + Lucide Icons without unnecessary dependencies.
2. **Implement Type Definitions & SRS Logic:** Write unit tests for `srsEngine.ts` to ensure mathematically precise transitions for NEW, LEARNING, REVIEW, and MASTERED states.
3. **Seed Vocabulary:** Provide clean, high-quality starter words across the 6 supported languages and pairs.
4. **Implement Gesture Physics:** Use pointer events with strict boundary checks so swiping feels native on mobile touchscreens and desktop trackpads/mice.
5. **Verify Constraints:** Run automated checks ensuring zero emojis exist in the codebase and no notification APIs are referenced.
