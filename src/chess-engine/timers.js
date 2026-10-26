// Preserve pending procedural callbacks and their remaining delays while hidden.
const eruditeNativeTimeout = window.setTimeout.bind(window);
const eruditeNativeClearTimeout = window.clearTimeout.bind(window);
const eruditeTimers = new Map();
let eruditeTimerId = 0;
let eruditeActive = false;
function eruditeArmTimer(timer) {
    timer.started = performance.now();
    timer.native = eruditeNativeTimeout(() => {
        eruditeTimers.delete(timer.id);
        if (typeof timer.callback === 'function') timer.callback(...timer.args);
    }, timer.remaining);
}
window.setTimeout = (callback, delay = 0, ...args) => {
    const timer = {id: ++eruditeTimerId, callback, remaining: Number(delay), args, native: null, started: 0};
    eruditeTimers.set(timer.id, timer);
    if (eruditeActive) eruditeArmTimer(timer);
    return timer.id;
};
window.clearTimeout = id => {
    const timer = eruditeTimers.get(id);
    if (timer) eruditeNativeClearTimeout(timer.native);
    eruditeTimers.delete(id);
};
function eruditeSetTimersActive(active) {
    if (active === eruditeActive) return;
    eruditeActive = active;
    for (const timer of eruditeTimers.values()) {
        if (active) eruditeArmTimer(timer);
        else {
            eruditeNativeClearTimeout(timer.native);
            timer.remaining = Math.max(0, timer.remaining - (performance.now() - timer.started));
        }
    }
}
