import { sessionDatabase } from '../utils/sessionDatabase.js';

class SessionRecorder {
  constructor() {
    this.currentSession = null;
    this.sessionStartTime = null;
  }

  startSession(mode, plannedDuration, round) {
    if (this.currentSession) {
      this.endSession(false);
    }

    this.sessionStartTime = new Date();
    this.currentSession = {
      type: mode,
      startTime: this.sessionStartTime,
      plannedDuration: plannedDuration,
      round: round,
      completed: false
    };
  }

  async endSession(completed = true, notes = '') {
    if (!this.currentSession || !this.sessionStartTime) {
      return null;
    }

    const endTime = new Date();
    const actualDuration = Math.floor((endTime - this.sessionStartTime) / 1000);

    const sessionRecord = {
      ...this.currentSession,
      endTime: endTime,
      actualDuration: actualDuration,
      completed: completed,
      notes: notes
    };

    try {
      const savedSession = await sessionDatabase.addSession(sessionRecord);
      this.currentSession = null;
      this.sessionStartTime = null;
      return savedSession;
    } catch (error) {
      console.error('Failed to save session:', error);
      this.currentSession = null;
      this.sessionStartTime = null;
      return null;
    }
  }

  async interruptSession(reason = 'manual_stop') {
    if (!this.currentSession) {
      return null;
    }

    return await this.endSession(false, `Interrupted: ${reason}`);
  }

  getCurrentSession() {
    return this.currentSession;
  }

  isSessionActive() {
    return this.currentSession !== null;
  }

  getSessionElapsedTime() {
    if (!this.sessionStartTime) {
      return 0;
    }
    return Math.floor((new Date() - this.sessionStartTime) / 1000);
  }
}

export const sessionRecorder = new SessionRecorder();