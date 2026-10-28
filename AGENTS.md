# AGENTS.md — Project "Erudite" Specification & Agent Directives

> **Project Name:** Erudite  
> **Repository:** `kronberg-a/Erudite`  
> **Role & Objective:** Production-ready, mobile-first, responsive vocabulary learning web application using the user-specified continuous, on-demand recall algorithm with an ultra-minimalist, purely practical design system.

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
  step: number; // Learning sub-step 0–2; REVIEW 3; MASTERED 5
  repCount: number; // Total committed Know/Repeat turns
  lastReviewedOrder: number; // Global relative review-order tick
  createdAt: number;
  lastStudiedAt?: number;
  interval: number;
  nextReviewDate: number;
  easeFactor: number;
  reviewRepetitions: number;
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
  instantMasterOnFirstTry: boolean; // Legacy field, always false and ignored
  studyMode: 'SWIPE_ONLY' | 'TYPE_ONLY' | 'MIXED';
  strictAccents: boolean;
  theme: 'light' | 'dark';
}
```

---

## 5. Calendar Mastery with Unlimited On-Demand Practice (Current Architecture)

This section supersedes the old continuous five-recall mastery algorithm. Calendar dates govern mastery credit only; they never restrict practice. Persist schema version 3 under `erudite:v3`, retaining v1/v2 storage keys as recovery copies. Migrate earlier NEW/LEARNING progress and repetition totals. Earlier REVIEW/MASTERED words begin REVIEW step 3 with a fresh one-day schedule because old mastery has no calendar evidence.

### 5.1 Continuous modes
- All selected words, including Memorized words, remain available for unlimited practice. Explicit practice scopes the stream without changing category preferences.
- Mixed mode interleaves three in-progress words and two NEW words. Review includes LEARNING, REVIEW and MASTERED; prioritize due reviews over future practice.
- When a pool runs out, switch to the remaining mode. Only an actually empty selection offers vocabulary management.

### 5.2 Grading, scheduling and mastery
- Every committed Know or Repeat increments repCount and the global review-order tick synchronously. Undo restores the exact prior card, schedule, queue, mode, counters and tick.
- NEW/LEARNING requires three consecutive unassisted correct recalls. Correct answers advance the learning sub-step; a failure resets to LEARNING step 0 and reinserts after three cards. Short pools cycle immediately.
- At learning step 3, graduate to REVIEW and schedule the first review in one day. Move the card to the end of the practice queue.
- Baseline scheduled intervals are 1, 3, 7, 16, 35 and 90 days. Ease starts at 2.3; a failure lowers it by 0.2 to a floor of 1.3. For repetition index r, use round(baseline[r] * (ease / 2.3)^r), at least one day; extend the baseline geometrically beyond 90 days.
- Only a correct recall on or after nextReviewDate advances the schedule, anchored to the actual recall time. Early correct practice leaves the interval, due date and scheduled repetition count unchanged.
- A successful scheduled review after an interval of at least 90 days automatically marks the word MASTERED (displayed as Memorized). Scheduling a 90-day interval alone does not grant mastery. No manual mastery, upward gesture/shortcut, or instant-mastery setting is available.
- Any committed failure, including early practice and Memorized words, resets learning, interval and scheduled success streak. Assisted recalls preserve progress without earning scheduled credit.
- Individual words/folders can reset to NEW or to REVIEW with a fresh one-day schedule, clearing their practice counters and calendar history.
- Store interval (days), nextReviewDate (timestamp), easeFactor and reviewRepetitions separately from repCount (all practice).

### 5.3 Active recall
Typing mode hides target word, transcription and audio until evaluation. Allow three submitted attempts per turn; only success, the third miss, or explicit Give up reveals the answer. Never commit or advance immediately after typing submission. The revealed card plays audio once and waits for Next, Enter/Space, or a grade override. Retain hints, accent handling, letter tiles, and character differences in all six interface languages.

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
  - Vertical dragging does not grant mastery.
- **Threshold Triggers:**
  - `deltaX > +100px` (or `ArrowRight`): Fly card off-screen to right + Positive SRS transition.
  - `deltaX < -100px` (or `ArrowLeft`): Fly card off-screen to left + Negative SRS transition + Re-queue.
  - No upward grading gesture or keyboard mastery shortcut.
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
  - Word detail drawer/modal: Edit word, reset SRS progress back to `NEW`, or reset to scheduled REVIEW.

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
    `[Space] Reveal` &bull; `[←] Repeat` &bull; `[→] Know` &bull; `[Ctrl+Z] Undo`.
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
