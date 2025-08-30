import { describe, it, expect } from 'vitest';
import { TIMER_MODES, DEFAULT_DURATIONS, DEFAULT_SETTINGS } from '../constants.js';

describe('Timer Constants', () => {
  describe('TIMER_MODES', () => {
    it('should have correct string values', () => {
      expect(TIMER_MODES.FOCUS).toBe('focus');
      expect(TIMER_MODES.SHORT_BREAK).toBe('shortBreak');
      expect(TIMER_MODES.LONG_BREAK).toBe('longBreak');
    });

    it('should have all required modes', () => {
      expect(Object.keys(TIMER_MODES)).toHaveLength(3);
      expect(TIMER_MODES).toHaveProperty('FOCUS');
      expect(TIMER_MODES).toHaveProperty('SHORT_BREAK');
      expect(TIMER_MODES).toHaveProperty('LONG_BREAK');
    });
  });

  describe('DEFAULT_DURATIONS', () => {
    it('should have positive numeric values', () => {
      expect(DEFAULT_DURATIONS.FOCUS).toBe(25 * 60);
      expect(DEFAULT_DURATIONS.SHORT_BREAK).toBe(5 * 60);
      expect(DEFAULT_DURATIONS.LONG_BREAK).toBe(15 * 60);
    });

    it('should have all required durations', () => {
      expect(Object.keys(DEFAULT_DURATIONS)).toHaveLength(3);
      expect(DEFAULT_DURATIONS).toHaveProperty('FOCUS');
      expect(DEFAULT_DURATIONS).toHaveProperty('SHORT_BREAK');
      expect(DEFAULT_DURATIONS).toHaveProperty('LONG_BREAK');
    });

    it('should have reasonable duration values', () => {
      expect(DEFAULT_DURATIONS.FOCUS).toBeGreaterThan(0);
      expect(DEFAULT_DURATIONS.SHORT_BREAK).toBeGreaterThan(0);
      expect(DEFAULT_DURATIONS.LONG_BREAK).toBeGreaterThan(0);
      expect(DEFAULT_DURATIONS.LONG_BREAK).toBeGreaterThan(DEFAULT_DURATIONS.SHORT_BREAK);
    });
  });

  describe('DEFAULT_SETTINGS', () => {
    it('should have correct total rounds value', () => {
      expect(DEFAULT_SETTINGS.TOTAL_ROUNDS).toBe(4);
    });

    it('should have positive total rounds', () => {
      expect(DEFAULT_SETTINGS.TOTAL_ROUNDS).toBeGreaterThan(0);
    });
  });
});