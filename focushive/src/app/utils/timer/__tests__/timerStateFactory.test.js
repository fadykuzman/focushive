import { describe, it, expect } from 'vitest';
import { createTimerState, createInitialState } from '../timerStateFactory.js';
import { TIMER_MODES, DEFAULT_SETTINGS } from '../constants.js';

describe('Timer State Factory', () => {
  describe('createTimerState', () => {
    const mockDurations = {
      focusDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900
    };

    it('should create state for focus mode', () => {
      const result = createTimerState(TIMER_MODES.FOCUS, mockDurations);
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        timeLeft: 1500,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should create state for short break mode', () => {
      const result = createTimerState(TIMER_MODES.SHORT_BREAK, mockDurations);
      
      expect(result).toEqual({
        mode: TIMER_MODES.SHORT_BREAK,
        timeLeft: 300,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should create state for long break mode', () => {
      const result = createTimerState(TIMER_MODES.LONG_BREAK, mockDurations);
      
      expect(result).toEqual({
        mode: TIMER_MODES.LONG_BREAK,
        timeLeft: 900,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should fallback to focus duration for invalid mode', () => {
      const result = createTimerState('invalid', mockDurations);
      
      expect(result.timeLeft).toBe(1500);
      expect(result.mode).toBe('invalid');
    });
  });

  describe('createInitialState', () => {
    it('should create initial state with default settings', () => {
      const result = createInitialState();
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        round: 1,
        totalRounds: DEFAULT_SETTINGS.TOTAL_ROUNDS,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should create initial state with custom total rounds', () => {
      const customSettings = { totalRounds: 6 };
      const result = createInitialState(customSettings);
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        round: 1,
        totalRounds: 6,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should use default when totalRounds is not provided', () => {
      const customSettings = { otherSetting: 'value' };
      const result = createInitialState(customSettings);
      
      expect(result.totalRounds).toBe(DEFAULT_SETTINGS.TOTAL_ROUNDS);
    });

    it('should handle empty settings object', () => {
      const result = createInitialState({});
      
      expect(result.totalRounds).toBe(DEFAULT_SETTINGS.TOTAL_ROUNDS);
      expect(result.mode).toBe(TIMER_MODES.FOCUS);
      expect(result.round).toBe(1);
    });

    it('should always start with focus mode and round 1', () => {
      const result = createInitialState({ totalRounds: 8 });
      
      expect(result.mode).toBe(TIMER_MODES.FOCUS);
      expect(result.round).toBe(1);
      expect(result.isActive).toBe(false);
      expect(result.isPaused).toBe(false);
      expect(result.lastTick).toBe(null);
    });
  });
});