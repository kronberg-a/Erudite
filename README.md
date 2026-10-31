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

Deploy the generated `dist/` directory to any static host. Relative asset paths support subdirectory hosting, including GitHub Pages. Article URL importing requires the `/api/article` backend described below; pasted articles work on static hosts and when opened directly.

`pnpm build` refreshes the checked-in `public/standalone/` bundles and packages `dist/`. Commit regenerated bundles with source changes so direct opening stays current. Vite development serves the TypeScript entry instead, with hot reload. The production build uses a classic script bundle rather than browser ES modules, which cannot be loaded reliably from `file://` URLs.

## Deploy on Render

Create a Node Web Service from this repository (or use `render.yaml`). Use
`pnpm install --frozen-lockfile && pnpm build` as the build command and
`pnpm start` as the start command, with Node 22.16 or newer. The production
server binds to `0.0.0.0:$PORT` (default 3000), serves `dist/`, and mounts
the article and optional Gemini APIs at `/api/article` and `/api/gemini`.
Use `/healthz` for the health check. No API key is needed for article extraction.
Optionally set `GEMINI_API_KEY` in Render's environment settings for Gemini.
The APIs share a limit of four concurrent requests and 120 requests per minute
per server instance. Stable frontend assets revalidate on reload.

Open the Render address to use URL import; GitHub Pages remains static.
Export your backup from Settings on the old address and import it on the new
address because browser storage is isolated by origin. Free Render services
sleep when idle; opening the site first lets the server wake before importing.

## Learning

Choose a learning language in the header, and your base and interface languages in Settings. English, Russian, German, French, Italian, and Spanish are supported independently. Every directed language pair has its own words, folders, and progress. A global review-order counter records the relative order of committed grades. A curated set of 32 words with aligned example sentences is generated for each of the 30 pairs. Folder names describe the included starter material; this is not a 500-word corpus.

Start a mixed, new-only, or review-only session. Tap the card, press Space/Enter, or use Reveal to show translations. Drag right or press Right to mark known, left/Left to repeat, and up/Up to master. Buttons offer the same actions. Undo, Ctrl/Cmd+Z, or Backspace restores the previous card and queue, including after session completion. Shortcuts do not intercept form controls. Pointer Events support mouse, pen, and touch; reduced motion preferences are respected.

Learning is continuous and on demand. No review dates, cooldowns, or daily word caps restrict study. Mixed continuous mode interleaves three in-progress words with two new words. Learn New Words serves NEW cards; Practice / Review serves LEARNING and REVIEW cards ordered by lowest step and oldest review order. You can change the queue mode during a session. If a mode-specific pool is exhausted while other non-mastered words remain, the app visibly switches to the remaining pool and immediately continues. Only a completely mastered selection shows completion; a genuinely empty selection offers vocabulary management.

Each committed Know or Repeat increments repCount and lastReviewedOrder. New known words start at step 1 and return after 8 other cards, unless instant mastery is enabled. Learning recalls advance the step and return after 8 × step other cards; step 3 enters REVIEW. A review recall at step 4 returns after 50 other cards; step 5 masters the word. Failure resets step to 0 and returns after 3 cards. Short queues insert at the end and cycle immediately rather than waiting. Master excludes the word immediately at step 5. Grading persists synchronously; CSS-only card transitions do not block the next answer.

Choose a folder in Practice selection, click Practice beside a word/folder, or use Practice saved word after creation. Explicit selections do not change folder inclusion preferences. Words or whole folders can be reset to NEW (step 0) or REVIEW (step 3) at any time. Undo restores the exact card, queue, mode, repetition total, and global order tick.

## Typing and active recall

Choose **Recall mode** in the study header or Settings: **Swipe cards**, **Type every answer**, or **Mixed recall**. Mixed recall requires typing for learning cards; new and review cards retain standard swiping. The header also switches between direct keyboard input and shuffled letter tiles. Tapping an inserted tile returns it to the bank, including repeated letters and spaces.

Typing cards show base-language translations and context without showing the target word, transcription, or pronunciation. Enter or Check evaluates the answer. Each card turn allows three attempts: the first two incorrect submissions keep the answer hidden and show the remaining attempts; a correct answer or the third miss reveals the card for review. Tab supplies the next correct character, and Escape gives up and reveals immediately. Case and outer whitespace are ignored, and grammatical notes in target-word parentheses are excluded. Exact accents are required by default; disable this in Settings to accept base letters.

Final evaluation always pauses on the full revealed card and plays pronunciation once. Green answers default to Know. Amber hinted answers default to Repeat after four other cards, preserving existing learning steps. Red answers show a character-level correction and default to the normal reset to learning step 0. Only Next, Enter/Space, a swipe, an arrow override, or an explicit action button commits a grade and moves the deck. Undo restores that committed mutation and queue. Old v1 vocabulary and progress migrate to the continuous v2 schema.

## Vocabulary and translation

Enable folders for study, search target words and translations, create folders, edit words, reset progress, or mark individual words mastered. Add Word accepts a word in the learning language and translates into the base language after 500ms. Manual translations are editable; alternative results can be added. Optional sentences have a separate translation action. Requests are cancelled or ignored when stale so late responses cannot overwrite manual edits.

MyMemory is a third-party public service with availability and quota limits. Only word/sentence text explicitly entered for translation and the language pair are sent to it. The curated starter dictionary provides an offline fallback for recognized words; otherwise enter translations manually. Pronunciation uses browser speech synthesis and depends on installed voices and browser support.

## Article reader

Open Reader to import a public HTTP(S) article or expand **Paste article text** to enter its title and text manually. Click words or highlight phrases to collect up to 50 entries per batch. Translations use the active learning-to-base language pair, with at most two requests at once. Edit translations directly or retry failed requests. Context comes from the selected occurrence's sentence. Save the batch into a new folder, then choose **Practice folder** or **Start another batch**. Existing words gain folder membership while retaining their translations and learning progress.

`server/article.ts` exposes `articleHandler` at `GET /api/article?url=...` through Vite dev and preview middleware. It validates all DNS results, pins the connection to a validated public address, revalidates every redirect, and enforces a 2 MB HTML limit and 15-second network deadline. Scripts and remote subresources are not executed by the extractor. Private addresses, unsupported content, blocked sites, and failed imports offer the paste fallback. It does not bypass paywalls or bot protection.

For deployed URL import, mount this handler in a Node HTTP backend at `/api/article` and route that path to it. Static hosts and direct `file://` opening cannot run the extractor; use pasted text there. Public deployments should apply request rate limits at their gateway. Article URLs are fetched by the backend. Standard translation sends selected words and, when needed, their sentences to Google Translate, then falls back to the curated offline dictionary. The full article remains transient in the reader; collected words and their context sentences persist through the existing local storage flow.

## Optional Gemini analysis

Set `GEMINI_API_KEY` in the server environment or copy `.env.example` to `.env` and fill in the key, then restart `npm run dev` or `npm run preview`. The Vite middleware serves `GET /api/gemini` for availability and `POST /api/gemini` for validated analysis requests. The server key is never bundled or returned to the browser. Deployed applications need to mount `server/gemini.ts` in a Node backend; a static deployment alone cannot supply an environment key.

For standalone `file://` use, enter a personal key in Settings. It is stored in localStorage on that device and excluded from exported backups. This explicit personal-key mode sends requests directly to Google. HTTP applications use the proxy first, forwarding the personal key if supplied, and switch to direct requests only if the proxy returns 404 or 501. Clearing the setting removes the personal key; an available server key continues to work.

Settings shows Gemini's latest connection result. Use **Test connection** to send a small live request, bypassing cached results. The indicator distinguishes an untested key, successful connection, rejected key, exhausted quota and unavailable service. Normal Gemini requests also update it; changing the key clears the previous result.

Gemini uses `gemini-3.5-flash-lite`, structured JSON output and minimal thinking. This replaces the older `gemini-2.5-flash`, whose access is restricted for new projects. The request uses `thinkingLevel` and omits legacy `thinkingBudget` and sampling parameters. One selection request returns the contextual translation, dictionary form, sentence translation and estimated CEFR level. Nouns receive singular dictionary forms and appropriate articles; verb particles are combined and adjectives normalized. Repeated results are cached in memory, with cancellation, deadlines and brief failure backoff. Actual latency and linguistic accuracy depend on the model and network. A model/endpoint 404 is shown separately from authentication and quota failures.

Gemini is the sole source of CEFR highlighting. The full article is analyzed in sequential batches of at most 200 reader tokens and 6,000 characters, preserving exact reader offsets. There are no local lexicon, morphology or UDPipe CEFR grades. Words remain unmarked while analysis runs or if Gemini is unconfigured or fails; the CEFR panel shows the analysis state and offers a retry. A1 and tokens omitted by Gemini stay unmarked. Level filters reuse completed Gemini results without new requests. Word selections retain UDPipe canonicalization and standard translation fallbacks. German noun fallback handles singulars, irregular plurals, orthography, contextual gender features, lexical compound heads and suffixes; unknown genders remain estimates.

CEFR model responses use compact token ids; the app restores the original word strings and offsets locally without assigning any levels itself. An invalid analysis response is retried once. Processing failures and timeouts are shown separately from rejected keys, quota failures and service outages, and do not disable unrelated Gemini translations. CEFR requests have a 45-second client deadline and a 50-second server deadline; caller cancellation still stops them immediately.

Selected text and context sentences, or article excerpts for CEFR analysis, are sent to Google when Gemini is enabled. Free-tier submissions may be used to improve Google's products. See [Gemini pricing and data use](https://ai.google.dev/gemini-api/docs/pricing). Keys, raw model responses and upstream errors are not logged by the middleware. Requests are restricted to the three supported operations and the fixed model.

## Persistence

Versioned data is validated and saved under erudite:v2 in localStorage. Existing erudite:v1 data and v1 JSON backups migrate automatically: NEW stays at step 0, LEARNING retains steps 0–2, REVIEW starts at step 3, and MASTERED stays mastered at step 5. Old dates, intervals, ease factors, and daily ledgers are discarded. Relative recency is migrated from known study timestamps; repetition totals start at zero because old backups did not record them. The old v1 storage key is retained as a recovery copy.

Data stays in the current browser profile and origin. Settings provides JSON backup export and validated restore. Import replaces device data after confirmation. Unreadable storage is reported and is not automatically overwritten on initial load. Card grades and undo persist immediately. The active deck is transient and rebuilt from relative progress after reload; there is no calendar eligibility check.

## Structure

- `src/core/`: pure scheduling, queue building, speech
- `src/hooks/`: pointer gestures and keyboard handling
- `src/i18n/`: six-language UI and aligned seed vocabulary
- `src/services/`: validated persistence and translation
- `src/components/`: study, library, word form, settings
- `.github/workflows/ci.yml`: tests, source constraint scan, production build

This implementation follows the requested algorithm. It is not affiliated with ReWord and does not claim verification against its private implementation.
