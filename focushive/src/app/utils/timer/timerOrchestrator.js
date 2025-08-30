import { getNextMode, calculateNextRound } from "./modeTransition.js";
import { getDurationForMode } from "./durationUtils.js";
import { TimerRestoration } from "../timerRestoration.js";

export function completeTimerTransition(currentState) {
  const { mode, round, totalRounds, focusDuration, shortBreakDuration, longBreakDuration } = currentState;
  const durations = { focusDuration, shortBreakDuration, longBreakDuration };
  
  const nextMode = getNextMode(mode, round, totalRounds);
  const newRound = calculateNextRound(mode, round, totalRounds);

  return {
    mode: nextMode,
    timeLeft: getDurationForMode(nextMode, durations),
    round: newRound,
    isActive: false,
    isPaused: false,
    lastTick: null
  };
}

export function restoreTimer(currentState) {
  if (!TimerRestoration.needsRestoration(currentState)) {
    return null;
  }

  if (TimerRestoration.wasTimerExpiredOffline(currentState)) {
    return completeTimerTransition(currentState);
  }

  const restoredTimeLeft = TimerRestoration.calculateRestoredTimeLeft(currentState);
  return {
    timeLeft: restoredTimeLeft,
    lastTick: Date.now()
  };
}