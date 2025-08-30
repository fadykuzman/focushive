import { TIMER_MODES } from "./constants.js";

export function getNextMode(currentMode, round, totalRounds) {
  if (currentMode === TIMER_MODES.FOCUS) {
    return round >= totalRounds ? TIMER_MODES.LONG_BREAK : TIMER_MODES.SHORT_BREAK;
  }
  return TIMER_MODES.FOCUS;
}

export function shouldIncrementRound(currentMode) {
  return currentMode === TIMER_MODES.SHORT_BREAK || currentMode === TIMER_MODES.LONG_BREAK;
}

export function shouldResetRound(currentMode, round, totalRounds) {
  return currentMode === TIMER_MODES.LONG_BREAK || round >= totalRounds;
}

export function calculateNextRound(currentMode, currentRound, totalRounds) {
  if (!shouldIncrementRound(currentMode)) {
    return currentRound;
  }
  
  return shouldResetRound(currentMode, currentRound, totalRounds) ? 1 : currentRound + 1;
}