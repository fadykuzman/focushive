import { describe, it, expect } from 'vitest';
import * as timerModule from '../index.js';

describe('Timer Module Index', () => {
  describe('Constants Exports', () => {
    it('should export TIMER_MODES', () => {
      expect(timerModule.TIMER_MODES).toBeDefined();
      expect(timerModule.TIMER_MODES.FOCUS).toBe('focus');
    });

    it('should export DEFAULT_DURATIONS', () => {
      expect(timerModule.DEFAULT_DURATIONS).toBeDefined();
      expect(timerModule.DEFAULT_DURATIONS.FOCUS).toBeGreaterThan(0);
    });

    it('should export DEFAULT_SETTINGS', () => {
      expect(timerModule.DEFAULT_SETTINGS).toBeDefined();
      expect(timerModule.DEFAULT_SETTINGS.TOTAL_ROUNDS).toBeGreaterThan(0);
    });
  });

  describe('Duration Utils Exports', () => {
    it('should export getDurationForMode', () => {
      expect(typeof timerModule.getDurationForMode).toBe('function');
    });

    it('should export calculateProportionalTime', () => {
      expect(typeof timerModule.calculateProportionalTime).toBe('function');
    });
  });

  describe('Mode Transition Exports', () => {
    it('should export getNextMode', () => {
      expect(typeof timerModule.getNextMode).toBe('function');
    });

    it('should export shouldIncrementRound', () => {
      expect(typeof timerModule.shouldIncrementRound).toBe('function');
    });

    it('should export shouldResetRound', () => {
      expect(typeof timerModule.shouldResetRound).toBe('function');
    });

    it('should export calculateNextRound', () => {
      expect(typeof timerModule.calculateNextRound).toBe('function');
    });
  });

  describe('Time Calculation Exports', () => {
    it('should export calculateElapsedTime', () => {
      expect(typeof timerModule.calculateElapsedTime).toBe('function');
    });

    it('should export createTimeProvider', () => {
      expect(typeof timerModule.createTimeProvider).toBe('function');
    });
  });

  describe('Timer Validation Exports', () => {
    it('should export validateDuration', () => {
      expect(typeof timerModule.validateDuration).toBe('function');
    });

    it('should export validateMode', () => {
      expect(typeof timerModule.validateMode).toBe('function');
    });

    it('should export validateTimerState', () => {
      expect(typeof timerModule.validateTimerState).toBe('function');
    });
  });

  describe('Timer State Factory Exports', () => {
    it('should export createTimerState', () => {
      expect(typeof timerModule.createTimerState).toBe('function');
    });

    it('should export createInitialState', () => {
      expect(typeof timerModule.createInitialState).toBe('function');
    });
  });

  describe('Timer Orchestrator Exports', () => {
    it('should export completeTimerTransition', () => {
      expect(typeof timerModule.completeTimerTransition).toBe('function');
    });

    it('should export restoreTimer', () => {
      expect(typeof timerModule.restoreTimer).toBe('function');
    });
  });

  describe('API Completeness', () => {
    it('should export all expected functions', () => {
      const expectedExports = [
        'TIMER_MODES',
        'DEFAULT_DURATIONS', 
        'DEFAULT_SETTINGS',
        'getDurationForMode',
        'calculateProportionalTime',
        'getNextMode',
        'shouldIncrementRound',
        'shouldResetRound',
        'calculateNextRound',
        'calculateElapsedTime',
        'createTimeProvider',
        'validateDuration',
        'validateMode',
        'validateTimerState',
        'createTimerState',
        'createInitialState',
        'completeTimerTransition',
        'restoreTimer'
      ];

      expectedExports.forEach(exportName => {
        expect(timerModule).toHaveProperty(exportName);
      });
    });
  });
});