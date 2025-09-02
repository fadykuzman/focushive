import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the sessionDatabase
vi.mock('../../utils/sessionDatabase', () => ({
  sessionDatabase: {
    addSession: vi.fn()
  }
}));

import { sessionRecorder } from '../sessionRecorder';
import { sessionDatabase } from '@/app/utils/sessionDatabase';

describe('SessionRecorder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionRecorder.currentSession = null;
    sessionRecorder.sessionStartTime = null;
  });

  describe('Session Lifecycle', () => {
    it('should start a new session correctly', () => {
      const mode = 'focus';
      const plannedDuration = 1500;
      const round = 1;

      sessionRecorder.startSession(mode, plannedDuration, round);

      expect(sessionRecorder.isSessionActive()).toBe(true);
      expect(sessionRecorder.getCurrentSession()).toMatchObject({
        type: mode,
        plannedDuration: plannedDuration,
        round: round,
        completed: false
      });
      expect(sessionRecorder.sessionStartTime).toBeInstanceOf(Date);
    });

    it('should end previous session when starting a new one', () => {
      const mockAddSession = vi.fn().mockResolvedValue({ id: 'session1' });
      sessionDatabase.addSession = mockAddSession;

      // Start first session
      sessionRecorder.startSession('focus', 1500, 1);
      expect(sessionRecorder.isSessionActive()).toBe(true);

      // Start second session (should end the first)
      sessionRecorder.startSession('shortBreak', 300, 1);
      expect(sessionRecorder.isSessionActive()).toBe(true);
      expect(sessionRecorder.getCurrentSession().type).toBe('shortBreak');
    });

    it('should end session with completion status', async () => {
      sessionDatabase.addSession.mockResolvedValue({ id: 'session1' });

      sessionRecorder.startSession('focus', 1500, 1);
      const result = await sessionRecorder.endSession(true, 'Great session!');

      expect(sessionDatabase.addSession).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'focus',
          plannedDuration: 1500,
          completed: true,
          notes: 'Great session!',
          actualDuration: expect.any(Number),
          startTime: expect.any(Date),
          endTime: expect.any(Date)
        })
      );
      expect(sessionRecorder.isSessionActive()).toBe(false);
      expect(result).toEqual({ id: 'session1' });
    });

    it('should handle session recording errors gracefully', async () => {
      sessionDatabase.addSession.mockRejectedValue(new Error('Database error'));

      sessionRecorder.startSession('focus', 1500, 1);
      const result = await sessionRecorder.endSession(true);

      expect(result).toBeNull();
      expect(sessionRecorder.isSessionActive()).toBe(false);
    });
  });

  describe('Session Interruption', () => {
    it('should handle session interruption', async () => {
      sessionDatabase.addSession.mockResolvedValue({ id: 'session1' });

      sessionRecorder.startSession('focus', 1500, 1);
      const result = await sessionRecorder.interruptSession('manual_stop');

      expect(sessionDatabase.addSession).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: false,
          notes: 'Interrupted: manual_stop'
        })
      );
      expect(sessionRecorder.isSessionActive()).toBe(false);
    });

    it('should return null when interrupting non-active session', async () => {
      const result = await sessionRecorder.interruptSession('test');
      expect(result).toBeNull();
      expect(sessionDatabase.addSession).not.toHaveBeenCalled();
    });
  });

  describe('Session State Management', () => {
    it('should track session state correctly', () => {
      expect(sessionRecorder.isSessionActive()).toBe(false);
      expect(sessionRecorder.getCurrentSession()).toBeNull();
      expect(sessionRecorder.getSessionElapsedTime()).toBe(0);

      sessionRecorder.startSession('focus', 1500, 1);

      expect(sessionRecorder.isSessionActive()).toBe(true);
      expect(sessionRecorder.getCurrentSession()).toBeDefined();
      expect(sessionRecorder.getSessionElapsedTime()).toBeGreaterThanOrEqual(0);
    });

    it('should calculate elapsed time correctly', (done) => {
      sessionRecorder.startSession('focus', 1500, 1);
      
      setTimeout(() => {
        const elapsed = sessionRecorder.getSessionElapsedTime();
        expect(elapsed).toBeGreaterThanOrEqual(0);
        expect(elapsed).toBeLessThan(2); // Should be less than 2 seconds
        done();
      }, 100);
    });

    it('should return 0 elapsed time when no session is active', () => {
      expect(sessionRecorder.getSessionElapsedTime()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle ending session when none is active', async () => {
      const result = await sessionRecorder.endSession(true);
      expect(result).toBeNull();
      expect(sessionDatabase.addSession).not.toHaveBeenCalled();
    });

    it('should handle starting session with invalid parameters', () => {
      sessionRecorder.startSession(null, null, null);
      
      const session = sessionRecorder.getCurrentSession();
      expect(session.type).toBeNull();
      expect(session.plannedDuration).toBeNull();
      expect(session.round).toBeNull();
    });
  });
});
