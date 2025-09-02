import { TIMER_MODES } from "@/app/utils/timer/constants.js";

export function getDurationForMode(mode, durations) {
  const durationMap = {
    [TIMER_MODES.FOCUS]: durations.focusDuration,
    [TIMER_MODES.SHORT_BREAK]: durations.shortBreakDuration,
    [TIMER_MODES.LONG_BREAK]: durations.longBreakDuration
  };
  return durationMap[mode] || durations.focusDuration;
}

export function calculateProportionalTime(oldDuration, newDuration, currentTimeLeft) {
  const elapsedTime = oldDuration - currentTimeLeft;
  const progressRatio = elapsedTime / oldDuration;
  const newElapsedTime = Math.floor(newDuration * progressRatio);
  const newTimeLeft = newDuration - newElapsedTime;
  return Math.max(0, Math.min(newDuration, newTimeLeft));
}