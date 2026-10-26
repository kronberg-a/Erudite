// Host bridge; repertoire parsing, validation and training remain upstream.
let eruditeResumeSearch = false;
let eruditeDesiredActive = false;
let eruditeStopPromise = Promise.resolve();
const eruditeSendCommand = sendEngineCommand;
sendEngineCommand = function(command) {
    if (!eruditeActive && command.startsWith('go ')) return;
    eruditeSendCommand(command);
};
const eruditeHandleMessage = handleEngineMessage;
handleEngineMessage = function(line) {
    // Stopping a search must not play a move in a hidden bot game.
    if (!eruditeActive && typeof line === 'string' && /^(bestmove|info)/.test(line)) return;
    eruditeHandleMessage(line);
};
async function eruditeSetActive(active) {
    eruditeDesiredActive = active;
    if (active === eruditeActive) return;
    if (!active) {
        eruditeResumeSearch = engineCalculating;
        // Stop immediately; callbacks are frozen below, including the upstream stop delay.
        eruditeStopPromise = stopEngineCalculation();
        engineCalculating = false;
        eruditeSetTimersActive(false);
        audioCtx.suspend();
        return;
    }
    await eruditeStopPromise;
    if (!eruditeDesiredActive) return;
    eruditeSetTimersActive(true);
    board.resize();
    drawShapes();
    if (!engineInitialized) initializeStockfish();
    if (eruditeResumeSearch) {
        eruditeResumeSearch = false;
        if (mode === 'bot' && botGameActive && game.turn() !== currentSide.charAt(0)) makeBotMove();
        else if (analysisActive) runStockfishAnalysis();
        else if (isEngineRunning) startEvaluation();
    }
}
window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.type !== 'erudite-chess-state') return;
    const {active, theme} = event.data;
    if (theme === 'dark' || theme === 'light') {
        userSettings.theme = theme;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.classList.toggle('light-mode', theme === 'light');
        updateSettingsUI();
    }
    eruditeSetActive(active === true);
});
window.addEventListener('pagehide', () => { if (engine) engine.terminate(); });
new ResizeObserver(() => { if (eruditeActive && board) { board.resize(); drawShapes(); } }).observe(document.getElementById('board-area'));
window.parent.postMessage({type: 'erudite-chess-ready'}, '*');

function exportRepertoirePgn() {
    const games = [];
    for (const side of ['white', 'black']) {
        for (const line of repertoire[side]) {
            const parsed = new Chess();
            if (!parsed.load_pgn(line.pgn)) continue;
            parsed.header('Event', line.category || 'Repertoire', 'Orientation', side);
            games.push(parsed.pgn());
        }
    }
    const url = URL.createObjectURL(new Blob([games.join('\n\n')], {type: 'application/x-chess-pgn'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'erudite-repertoire.pgn';
    anchor.click();
    eruditeNativeTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Draw the engine suggestion separately from saved repertoire annotations.
const eruditeDrawShapes = drawShapes;
drawShapes = function() {
    eruditeDrawShapes();
    const suggestion = analysisResults[0]?.uci;
    if (analysisActive && mode === 'add' && currentAnalysisFen === game.fen() && /^[a-h][1-8][a-h][1-8]/.test(suggestion || '')) {
        drawArrow(suggestion.slice(0, 2), suggestion.slice(2, 4), 'blue');
        svgOverlay.lastElementChild?.setAttribute('data-engine-suggestion', 'true');
    }
};
const eruditeHandleAnalysis = handleAnalysisMessage;
handleAnalysisMessage = function(line) {
    eruditeHandleAnalysis(line);
    drawShapes();
};
const eruditeToggleAnalysis = toggleAnalysisMenu;
toggleAnalysisMenu = async function() {
    await eruditeToggleAnalysis();
    drawShapes();
};
