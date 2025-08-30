import { describe, it, expect } from 'vitest';
import { 
  getNextMode, 
  shouldIncrementRound, 
  shouldResetRound, 
  calculateNextRound 
} from '../modeTransition.js';
import { TIMER_MODES } from '../constants.js';

describe('Mode Transition', () => {
  describe('getNextMode', () => {
    it('should transition from focus to short break when not at total rounds', () => {
      const result = getNextMode(TIMER_MODES.FOCUS, 2, 4);
      expect(result).toBe(TIMER_MODES.SHORT_BREAK);
    });

    it('should transition from focus to long break when at total rounds', () => {
      const result = getNextMode(TIMER_MODES.FOCUS, 4, 4);
      expect(result).toBe(TIMER_MODES.LONG_BREAK);
    });

    it('should transition from short break to focus', () => {
      const result = getNextMode(TIMER_MODES.SHORT_BREAK, 2, 4);
      expect(result).toBe(TIMER_MODES.FOCUS);
    });

    it('should transition from long break to focus', () => {
      const result = getNextMode(TIMER_MODES.LONG_BREAK, 4, 4);
      expect(result).toBe(TIMER_MODES.FOCUS);
    });
  });

  describe('shouldIncrementRound', () => {
    it('should increment round after short break', () => {
      const result = shouldIncrementRound(TIMER_MODES.SHORT_BREAK);
      expect(result).toBe(true);
    });

    it('should increment round after long break', () => {
      const result = shouldIncrementRound(TIMER_MODES.LONG_BREAK);
      expect(result).toBe(true);
    });

    it('should not increment round after focus', () => {
      const result = shouldIncrementRound(TIMER_MODES.FOCUS);
      expect(result).toBe(false);
    });
  });

  describe('shouldResetRound', () => {
    it('should reset round after long break', () => {
      const result = shouldResetRound(TIMER_MODES.LONG_BREAK, 4, 4);
      expect(result).toBe(true);
    });

    it('should reset round when round exceeds total', () => {
      const result = shouldResetRound(TIMER_MODES.SHORT_BREAK, 5, 4);
      expect(result).toBe(true);
    });

    it('should not reset round after short break within limits', () => {
      const result = shouldResetRound(TIMER_MODES.SHORT_BREAK, 2, 4);
      expect(result).toBe(false);
    });

    it('should not reset round during focus', () => {
      const result = shouldResetRound(TIMER_MODES.FOCUS, 3, 4);
      expect(result).toBe(false);
    });
  });

  describe('calculateNextRound', () => {
    it('should not change round during focus mode', () => {
      const result = calculateNextRound(TIMER_MODES.FOCUS, 2, 4);
      expect(result).toBe(2);
    });

    it('should increment round after short break', () => {
      const result = calculateNextRound(TIMER_MODES.SHORT_BREAK, 2, 4);
      expect(result).toBe(3);
    });

    it('should reset to 1 after long break', () => {
      const result = calculateNextRound(TIMER_MODES.LONG_BREAK, 4, 4);
      expect(result).toBe(1);
    });

    it('should reset to 1 when exceeding total rounds', () => {
      const result = calculateNextRound(TIMER_MODES.SHORT_BREAK, 5, 4);
      expect(result).toBe(1);
    });

    it('should handle edge case at exactly total rounds', () => {
      const result = calculateNextRound(TIMER_MODES.SHORT_BREAK, 4, 4);
      expect(result).toBe(1);
    });
  });
});