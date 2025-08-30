import { describe, it, expect } from 'vitest';
import { getDurationForMode, calculateProportionalTime } from '../durationUtils.js';
import { TIMER_MODES } from '../constants.js';

describe('Duration Utils', () => {
  describe('getDurationForMode', () => {
    const mockDurations = {
      focusDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900
    };

    it('should return correct duration for focus mode', () => {
      const result = getDurationForMode(TIMER_MODES.FOCUS, mockDurations);
      expect(result).toBe(1500);
    });

    it('should return correct duration for short break mode', () => {
      const result = getDurationForMode(TIMER_MODES.SHORT_BREAK, mockDurations);
      expect(result).toBe(300);
    });

    it('should return correct duration for long break mode', () => {
      const result = getDurationForMode(TIMER_MODES.LONG_BREAK, mockDurations);
      expect(result).toBe(900);
    });

    it('should fallback to focus duration for invalid mode', () => {
      const result = getDurationForMode('invalid_mode', mockDurations);
      expect(result).toBe(1500);
    });

    it('should fallback to focus duration for undefined mode', () => {
      const result = getDurationForMode(undefined, mockDurations);
      expect(result).toBe(1500);
    });
  });

  describe('calculateProportionalTime', () => {
    it('should calculate proportional time correctly for 50% progress', () => {
      const result = calculateProportionalTime(1000, 2000, 500);
      expect(result).toBe(1000);
    });

    it('should calculate proportional time correctly for 25% progress', () => {
      const result = calculateProportionalTime(1000, 2000, 750);
      expect(result).toBe(1500);
    });

    it('should calculate proportional time correctly for 75% progress', () => {
      const result = calculateProportionalTime(1000, 2000, 250);
      expect(result).toBe(500);
    });

    it('should handle no progress (100% time left)', () => {
      const result = calculateProportionalTime(1000, 2000, 1000);
      expect(result).toBe(2000);
    });

    it('should handle completed timer (0% time left)', () => {
      const result = calculateProportionalTime(1000, 2000, 0);
      expect(result).toBe(0);
    });

    it('should not return negative values', () => {
      const result = calculateProportionalTime(1000, 500, 1000);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should not exceed new duration', () => {
      const result = calculateProportionalTime(1000, 500, 900);
      expect(result).toBeLessThanOrEqual(500);
    });

    it('should handle duration scaling down', () => {
      const result = calculateProportionalTime(1000, 500, 500);
      expect(result).toBe(250);
    });
  });
});