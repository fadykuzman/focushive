import { describe, it, expect } from 'vitest';
import { validateDuration, validateMode, validateTimerState } from '../timerValidation.js';
import { TIMER_MODES } from '../constants.js';

describe('Timer Validation', () => {
  describe('validateDuration', () => {
    it('should return true for positive numbers', () => {
      expect(validateDuration(1)).toBe(true);
      expect(validateDuration(1500)).toBe(true);
      expect(validateDuration(0.5)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(validateDuration(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(validateDuration(-1)).toBe(false);
      expect(validateDuration(-100)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(validateDuration('100')).toBe(false);
      expect(validateDuration(null)).toBe(false);
      expect(validateDuration(undefined)).toBe(false);
      expect(validateDuration({})).toBe(false);
      expect(validateDuration([])).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(validateDuration(NaN)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(validateDuration(Infinity)).toBe(false);
      expect(validateDuration(-Infinity)).toBe(false);
    });
  });

  describe('validateMode', () => {
    it('should return true for valid timer modes', () => {
      expect(validateMode(TIMER_MODES.FOCUS)).toBe(true);
      expect(validateMode(TIMER_MODES.SHORT_BREAK)).toBe(true);
      expect(validateMode(TIMER_MODES.LONG_BREAK)).toBe(true);
    });

    it('should return false for invalid strings', () => {
      expect(validateMode('invalid')).toBe(false);
      expect(validateMode('FOCUS')).toBe(false);
      expect(validateMode('')).toBe(false);
    });

    it('should return false for non-strings', () => {
      expect(validateMode(null)).toBe(false);
      expect(validateMode(undefined)).toBe(false);
      expect(validateMode(123)).toBe(false);
      expect(validateMode({})).toBe(false);
      expect(validateMode([])).toBe(false);
    });
  });

  describe('validateTimerState', () => {
    const validState = {
      mode: TIMER_MODES.FOCUS,
      timeLeft: 1500,
      isActive: false,
      isPaused: false,
      lastTick: null
    };

    it('should return true for valid timer state', () => {
      expect(validateTimerState(validState)).toBe(true);
    });

    it('should return true for valid state with lastTick', () => {
      const stateWithTick = { ...validState, lastTick: Date.now() };
      expect(validateTimerState(stateWithTick)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(validateTimerState(null)).toBe(false);
      expect(validateTimerState(undefined)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(validateTimerState('state')).toBe(false);
      expect(validateTimerState(123)).toBe(false);
      expect(validateTimerState([])).toBe(false);
    });

    it('should return false for missing required fields', () => {
      expect(validateTimerState({ mode: TIMER_MODES.FOCUS })).toBe(false);
      expect(validateTimerState({ timeLeft: 1500 })).toBe(false);
      expect(validateTimerState({ isActive: false })).toBe(false);
      expect(validateTimerState({ isPaused: false })).toBe(false);
    });

    it('should return false for invalid mode', () => {
      const invalidModeState = { ...validState, mode: 'invalid' };
      expect(validateTimerState(invalidModeState)).toBe(false);
    });

    it('should return false for invalid timeLeft', () => {
      const invalidTimeState = { ...validState, timeLeft: -1 };
      expect(validateTimerState(invalidTimeState)).toBe(false);
    });

    it('should return false for non-boolean isActive', () => {
      const invalidActiveState = { ...validState, isActive: 'true' };
      expect(validateTimerState(invalidActiveState)).toBe(false);
    });

    it('should return false for non-boolean isPaused', () => {
      const invalidPausedState = { ...validState, isPaused: 1 };
      expect(validateTimerState(invalidPausedState)).toBe(false);
    });
  });
});