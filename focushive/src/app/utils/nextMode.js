import { TIMER_MODES } from './constants.js';

export default function getNextMode(currentMode, round, totalRounds) {
  if (currentMode === TIMER_MODES.FOCUS) {
    return round >= totalRounds
      ? TIMER_MODES.LONG_BREAK
      : TIMER_MODES.SHORT_BREAK;
  }
  return TIMER_MODES.FOCUS;
}
