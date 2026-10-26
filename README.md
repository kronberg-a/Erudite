# Erudite

A local-first vocabulary application built with React, TypeScript, Vite, Tailwind CSS, and Lucide. No account or API key needed.

## Run

**Open directly:** download/clone the complete repository, then double-click `index.html`. The included `public/standalone/` JavaScript and CSS bundles let it run without Node.js or a local server. Keep these files alongside the HTML. You can also open `dist/index.html` after building. Translation still needs an internet connection; browser support for local-file storage and speech can vary.

**Develop:**

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

`pnpm build` refreshes the checked-in `public/standalone/` bundles and packages `dist/`. Commit regenerated bundles with source changes so direct opening stays current. Vite development serves the TypeScript entry instead, with hot reload. The production build uses a classic script bundle rather than browser ES modules, which cannot be loaded reliably from `file://` URLs.

## Learning

Choose a learning language in the header, and your base and interface languages in Settings. English, Russian, German, French, Italian, and Spanish are supported independently. Every directed language pair has its own words, folders, progress, and daily allowance. A curated set of 32 words with aligned example sentences is generated for each of the 30 pairs. Folder names describe the included starter material; this is not a 500-word corpus.

Start a mixed, new-only, or review-only session. Tap the card, press Space/Enter, or use Reveal to show translations. Drag right or press Right to mark known, left/Left to repeat, and up/Up to master. Buttons offer the same actions. Undo, Ctrl/Cmd+Z, or Backspace restores the previous card and queue, including after session completion. Shortcuts do not intercept form controls. Pointer Events support mouse, pen, and touch; reduced motion preferences are respected.

The scheduling engine follows the supplied ReWord specification: new known words become mastered or receive a seven-day review; learning words require three positive passes; review intervals multiply by ease, with mastery after 90 days; failure resets learning and reduces ease to a minimum of 1.3. Learning cards re-enter after three other cards, or at the end of a shorter queue. New-word caps are enforced across sessions per language pair and local calendar day. Undo restores that allowance.

## Typing and active recall

Choose **Recall mode** in the study header or Settings: **Swipe cards**, **Type every answer**, or **Mixed recall**. Mixed recall requires typing for learning cards; new and review cards retain standard swiping. The header also switches between direct keyboard input and shuffled letter tiles. Tapping an inserted tile returns it to the bank, including repeated letters and spaces.

Typing cards show base-language translations and context without showing the target word, transcription, or pronunciation. Enter or Check evaluates the answer. Each card turn allows three attempts: the first two incorrect submissions keep the answer hidden and show the remaining attempts; a correct answer or the third miss reveals the card for review. Tab supplies the next correct character, and Escape gives up and reveals immediately. Case and outer whitespace are ignored, and grammatical notes in target-word parentheses are excluded. Exact accents are required by default; disable this in Settings to accept base letters.

Final evaluation always pauses on the full revealed card and plays pronunciation once. Green answers default to Know. Amber hinted answers default to Repeat after four other cards, preserving ease and existing learning steps. Red answers show a character-level correction and default to the normal learning reset and ease penalty. Only Next, Enter/Space, a swipe, an arrow override, or an explicit action button commits a grade and moves the deck. Undo restores that committed mutation and queue. Old v1 storage and backups automatically gain the new settings without resetting vocabulary.

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
