import { getNextMode, calculateNextRound } from "@/app/utils/timer/modeTransition.js";
import { getDurationForMode } from "@/app/utils/timer/durationUtils.js";
import { TimerRestoration } from "@/app/utils/timerRestoration.js";

export function completeTimerTransition(currentState) {
  const { mode, round, totalRounds, focusDuration, shortBreakDuration, longBreakDuration, autoTimerStart } = currentState;
  const durations = { focusDuration, shortBreakDuration, longBreakDuration };
  
  const nextMode = getNextMode(mode, round, totalRounds);
  const newRound = calculateNextRound(mode, round, totalRounds);
  
  // Auto-start next timer if enabled, but not after long break
  const shouldAutoStart = autoTimerStart && mode !== 'longBreak';

  return {
    mode: nextMode,
    timeLeft: getDurationForMode(nextMode, durations),
    round: newRound,
    isActive: shouldAutoStart,
    isPaused: false,
    lastTick: shouldAutoStart ? Date.now() : null
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