import { describe, it, expect, vi } from 'vitest';
import { completeTimerTransition, restoreTimer } from '../timerOrchestrator.js';
import { TIMER_MODES } from '../constants.js';

vi.mock('../../timerRestoration.js', () => ({
  TimerRestoration: {
    needsRestoration: vi.fn(),
    wasTimerExpiredOffline: vi.fn(),
    calculateRestoredTimeLeft: vi.fn()
  }
}));

import { TimerRestoration } from '@/app/timerRestoration.js';

describe('Timer Orchestrator', () => {
  describe('completeTimerTransition', () => {
    const mockState = {
      mode: TIMER_MODES.FOCUS,
      round: 2,
      totalRounds: 4,
      focusDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      autoTimerStart: false
    };

    it('should transition from focus to short break', () => {
      const result = completeTimerTransition(mockState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.SHORT_BREAK,
        timeLeft: 300,
        round: 2,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should transition from focus to long break at final round', () => {
      const finalRoundState = { ...mockState, round: 4 };
      const result = completeTimerTransition(finalRoundState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.LONG_BREAK,
        timeLeft: 900,
        round: 4,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should transition from short break to focus and increment round', () => {
      const shortBreakState = { ...mockState, mode: TIMER_MODES.SHORT_BREAK };
      const result = completeTimerTransition(shortBreakState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        timeLeft: 1500,
        round: 3,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should transition from long break to focus and reset round', () => {
      const longBreakState = { 
        ...mockState, 
        mode: TIMER_MODES.LONG_BREAK, 
        round: 4 
      };
      const result = completeTimerTransition(longBreakState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        timeLeft: 1500,
        round: 1,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });

    it('should auto-start timer when autoTimerStart is enabled (focus to break)', () => {
      const autoStartState = { ...mockState, autoTimerStart: true };
      const result = completeTimerTransition(autoStartState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.SHORT_BREAK,
        timeLeft: 300,
        round: 2,
        isActive: true,
        isPaused: false,
        lastTick: expect.any(Number)
      });
    });

    it('should auto-start timer when autoTimerStart is enabled (break to focus)', () => {
      const autoStartState = { 
        ...mockState, 
        mode: TIMER_MODES.SHORT_BREAK,
        autoTimerStart: true 
      };
      const result = completeTimerTransition(autoStartState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        timeLeft: 1500,
        round: 3,
        isActive: true,
        isPaused: false,
        lastTick: expect.any(Number)
      });
    });

    it('should NOT auto-start after long break even when autoTimerStart is enabled', () => {
      const longBreakAutoState = { 
        ...mockState, 
        mode: TIMER_MODES.LONG_BREAK,
        round: 4,
        autoTimerStart: true 
      };
      const result = completeTimerTransition(longBreakAutoState);
      
      expect(result).toEqual({
        mode: TIMER_MODES.FOCUS,
        timeLeft: 1500,
        round: 1,
        isActive: false,
        isPaused: false,
        lastTick: null
      });
    });
  });

  describe('restoreTimer', () => {
    const mockState = {
      mode: TIMER_MODES.FOCUS,
      timeLeft: 1000,
      lastTick: Date.now() - 5000
    };

    it('should return null when restoration is not needed', () => {
      TimerRestoration.needsRestoration.mockReturnValue(false);
      
      const result = restoreTimer(mockState);
      
      expect(result).toBe(null);
      expect(TimerRestoration.needsRestoration).toHaveBeenCalledWith(mockState);
    });

    it('should complete transition when timer expired offline', () => {
      TimerRestoration.needsRestoration.mockReturnValue(true);
      TimerRestoration.wasTimerExpiredOffline.mockReturnValue(true);
      
      const result = restoreTimer(mockState);
      
      expect(result).toHaveProperty('mode');
      expect(result).toHaveProperty('timeLeft');
      expect(result).toHaveProperty('round');
      expect(TimerRestoration.wasTimerExpiredOffline).toHaveBeenCalledWith(mockState);
    });

    it('should restore time when timer did not expire offline', () => {
      const mockRestoredTime = 800;
      TimerRestoration.needsRestoration.mockReturnValue(true);
      TimerRestoration.wasTimerExpiredOffline.mockReturnValue(false);
      TimerRestoration.calculateRestoredTimeLeft.mockReturnValue(mockRestoredTime);
      
      const result = restoreTimer(mockState);
      
      expect(result).toEqual({
        timeLeft: mockRestoredTime,
        lastTick: expect.any(Number)
      });
      expect(TimerRestoration.calculateRestoredTimeLeft).toHaveBeenCalledWith(mockState);
    });

    it('should set current time as lastTick when restoring', () => {
      const mockRestoredTime = 800;
      const beforeTime = Date.now();
      
      TimerRestoration.needsRestoration.mockReturnValue(true);
      TimerRestoration.wasTimerExpiredOffline.mockReturnValue(false);
      TimerRestoration.calculateRestoredTimeLeft.mockReturnValue(mockRestoredTime);
      
      const result = restoreTimer(mockState);
      const afterTime = Date.now();
      
      expect(result.lastTick).toBeGreaterThanOrEqual(beforeTime);
      expect(result.lastTick).toBeLessThanOrEqual(afterTime);
    });
  });
});