export const TIMER_MODES = {
  FOCUS: "focus",
  SHORT_BREAK: "shortBreak", 
  LONG_BREAK: "longBreak"
};

export const DEFAULT_DURATIONS = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60
};

export const DEFAULT_SETTINGS = {
  TOTAL_ROUNDS: 4
};

export class TimerLogic {
  static getDurationForMode(mode, durations) {
    const durationMap = {
      [TIMER_MODES.FOCUS]: durations.focusDuration,
      [TIMER_MODES.SHORT_BREAK]: durations.shortBreakDuration,
      [TIMER_MODES.LONG_BREAK]: durations.longBreakDuration
    };
    return durationMap[mode] || durations.focusDuration;
  }

  static getNextMode(currentMode, round, totalRounds) {
    if (currentMode === TIMER_MODES.FOCUS) {
      return round >= totalRounds ? TIMER_MODES.LONG_BREAK : TIMER_MODES.SHORT_BREAK;
    }
    return TIMER_MODES.FOCUS;
  }

  static shouldIncrementRound(currentMode) {
    return currentMode === TIMER_MODES.SHORT_BREAK || currentMode === TIMER_MODES.LONG_BREAK;
  }

  static shouldResetRound(currentMode, round, totalRounds) {
    return currentMode === TIMER_MODES.LONG_BREAK || round >= totalRounds;
  }

  static calculateElapsedTime(lastTick) {
    if (!lastTick) return 0;
    return Math.floor((Date.now() - lastTick) / 1000);
  }

  static calculateProportionalTime(oldDuration, newDuration, currentTimeLeft) {
    const elapsedTime = oldDuration - currentTimeLeft;
    const progressRatio = elapsedTime / oldDuration;
    const newElapsedTime = Math.floor(newDuration * progressRatio);
    const newTimeLeft = newDuration - newElapsedTime;
    return Math.max(0, Math.min(newDuration, newTimeLeft));
  }

  static validateDuration(duration) {
    return typeof duration === 'number' && duration > 0;
  }

  static validateMode(mode) {
    return Object.values(TIMER_MODES).includes(mode);
  }

  static createTimerState(mode, durations) {
    return {
      mode,
      timeLeft: this.getDurationForMode(mode, durations),
      isActive: false,
      isPaused: false,
      lastTick: null
    };
  }

  static completeTimerTransition(currentState) {
    const { mode, round, totalRounds, focusDuration, shortBreakDuration, longBreakDuration } = currentState;
    const durations = { focusDuration, shortBreakDuration, longBreakDuration };
    
    const nextMode = this.getNextMode(mode, round, totalRounds);
    const newRound = this.shouldIncrementRound(mode) 
      ? (this.shouldResetRound(mode, round, totalRounds) ? 1 : round + 1)
      : round;

    return {
      mode: nextMode,
      timeLeft: this.getDurationForMode(nextMode, durations),
      round: newRound,
      isActive: false,
      isPaused: false,
      lastTick: null
    };
  }
}