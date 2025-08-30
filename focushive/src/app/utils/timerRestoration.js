export class TimerRestoration {
  static needsRestoration(state) {
    return state.isActive && state.lastTick !== null;
  }

  static wasTimerExpiredOffline(state) {
    if (!state.lastTick) return false;
    const elapsedTime = Math.floor((Date.now() - state.lastTick) / 1000);
    return elapsedTime >= state.timeLeft;
  }

  static calculateRestoredTimeLeft(state) {
    if (!state.lastTick) return state.timeLeft;
    const elapsedTime = Math.floor((Date.now() - state.lastTick) / 1000);
    return Math.max(0, state.timeLeft - elapsedTime);
  }
}