import { getDurationForMode } from "./durationUtils.js";
import { DEFAULT_SETTINGS, TIMER_MODES } from "./constants.js";

export function createTimerState(mode, durations) {
  return {
    mode,
    timeLeft: getDurationForMode(mode, durations),
    isActive: false,
    isPaused: false,
    lastTick: null
  };
}

export function createInitialState(settings = {}) {
  const { totalRounds = DEFAULT_SETTINGS.TOTAL_ROUNDS } = settings;
  
  return {
    mode: TIMER_MODES.FOCUS,
    round: 1,
    totalRounds,
    isActive: false,
    isPaused: false,
    lastTick: null
  };
}