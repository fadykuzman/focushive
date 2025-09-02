import { TIMER_MODES } from "@/app/utils/timer/constants.js";

export function validateDuration(duration) {
  return typeof duration === 'number' && duration > 0 && isFinite(duration);
}

export function validateMode(mode) {
  return Object.values(TIMER_MODES).includes(mode);
}

export function validateTimerState(state) {
  if (!state || typeof state !== 'object') {
    return false;
  }

  const requiredFields = ['mode', 'timeLeft', 'isActive', 'isPaused'];
  return requiredFields.every(field => field in state) &&
    validateMode(state.mode) &&
    validateDuration(state.timeLeft) &&
    typeof state.isActive === 'boolean' &&
    typeof state.isPaused === 'boolean';
}