# Erudite

A local-first vocabulary application built with React, TypeScript, Vite, Tailwind CSS, and Lucide. No account or API key needed.

## Run

Requires Node.js 22.12+ and pnpm 11.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. For a production bundle:

```sh
pnpm test
pnpm check:constraints
pnpm build
pnpm preview
```

Deploy the generated `dist/` directory to any static host. Relative asset paths support subdirectory hosting, including GitHub Pages. The app uses no server-side routes.

## Learning

Choose a learning language in the header, and your base and interface languages in Settings. English, Russian, German, French, Italian, and Spanish are supported independently. Every directed language pair has its own words, folders, progress, and daily allowance. A curated set of 32 words with aligned example sentences is generated for each of the 30 pairs. Folder names describe the included starter material; this is not a 500-word corpus.

Start a mixed, new-only, or review-only session. Tap the card, press Space/Enter, or use Reveal to show translations. Drag right or press Right to mark known, left/Left to repeat, and up/Up to master. Buttons offer the same actions. Undo, Ctrl/Cmd+Z, or Backspace restores the previous card and queue, including after session completion. Shortcuts do not intercept form controls. Pointer Events support mouse, pen, and touch; reduced motion preferences are respected.

The scheduling engine follows the supplied ReWord specification: new known words become mastered or receive a seven-day review; learning words require three positive passes; review intervals multiply by ease, with mastery after 90 days; failure resets learning and reduces ease to a minimum of 1.3. Learning cards re-enter after three other cards, or at the end of a shorter queue. New-word caps are enforced across sessions per language pair and local calendar day. Undo restores that allowance.

## Vocabulary and translation

Enable folders for study, search target words and translations, create folders, edit words, reset progress, or mark individual words mastered. Add Word accepts a word in the learning language and translates into the base language after 500ms. Manual translations are editable; alternative results can be added. Optional sentences have a separate translation action. Requests are cancelled or ignored when stale so late responses cannot overwrite manual edits.

MyMemory is a third-party public service with availability and quota limits. Only word/sentence text explicitly entered for translation and the language pair are sent to it. The curated starter dictionary provides an offline fallback for recognized words; otherwise enter translations manually. Pronunciation uses browser speech synthesis and depends on installed voices and browser support.

## Persistence

Versioned data is validated on hydration and stored under `erudite:v1` in localStorage. Data remains in the current browser profile and origin. Use Settings → Export backup to move or protect progress, and Restore backup to import a validated JSON file. Import replaces the current device dataset after confirmation. Unreadable initial storage is not overwritten automatically on page load; an inline error explains recovery options. Subsequent edits save the new dataset. A session deck is transient; all individual card transitions persist immediately after the 150ms exit animation.

## Structure

- `src/core/`: pure scheduling, queue building, speech
- `src/hooks/`: pointer gestures and keyboard handling
- `src/i18n/`: six-language UI and aligned seed vocabulary
- `src/services/`: validated persistence and translation
- `src/components/`: study, library, word form, settings
- `.github/workflows/ci.yml`: tests, source constraint scan, production build

This implementation follows the requested algorithm. It is not affiliated with ReWord and does not claim verification against its private implementation.
