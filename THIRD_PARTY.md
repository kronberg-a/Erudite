# Third-party components

The chess integration is derived from `kronberg-a/chesslines.de`, commit `1cbbdc223e0870861752025b4b43453b7fbe45c7`. Its original repository is preserved. Imported source adaptations are confined to Erudite: geometric SVG icons, theme and lifecycle integration, local asset URLs, the authenticated explorer endpoint, and PGN export.

- jQuery 3.5.1: https://github.com/jquery/jquery/tree/3.5.1 — MIT, `public/vendor/jquery-LICENSE.txt`.
- Chessboard.js 1.0.0: https://github.com/oakmac/chessboardjs/tree/v1.0.0 — MIT, `public/vendor/chessboard-LICENSE.txt`.
- Chess.js 0.10.3: https://github.com/jhlywa/chess.js/tree/v0.10.3 — BSD-2-Clause, `public/vendor/chess-LICENSE.txt`.
- Piece artwork: https://github.com/lichess-org/lila/tree/master/public/piece — cburnett, alpha, california, merida, maestro, leipzig, tatiana and cardinal sets. Lila's copyright and artwork attribution notes are reproduced at `public/vendor/pieces/LICENSE.txt`.
- Stockfish.js 17.1: https://github.com/nmrugg/stockfish.js — GPLv3, `public/stockfish/COPYING.txt`. The loader and six WASM chunks are copied byte-for-byte from chesslines.de. Versioned source distribution: https://registry.npmjs.org/stockfish/-/stockfish-17.1.0.tgz.

The six WASM chunks and loader retain their original names. No remote script or piece CDN is needed at runtime. External network requests are limited to the existing vocabulary translator and authenticated Lichess explorer when those features are used.
