class SessionDatabase {
  constructor() {
    this.dbName = 'focushive-sessions';
    this.version = 1;
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    // Check if IndexedDB is available
    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB is not available in this environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          
          sessionStore.createIndex('type', 'type', { unique: false });
          sessionStore.createIndex('startTime', 'startTime', { unique: false });
          sessionStore.createIndex('endTime', 'endTime', { unique: false });
          sessionStore.createIndex('completed', 'completed', { unique: false });
          sessionStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  generateId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async addSession(sessionData) {
    try {
      await this.init();
      
      const session = {
        id: this.generateId(),
        type: sessionData.type,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        plannedDuration: sessionData.plannedDuration,
        actualDuration: sessionData.actualDuration,
        completed: sessionData.completed,
        round: sessionData.round,
        notes: sessionData.notes || '',
        date: new Date(sessionData.startTime).toISOString().split('T')[0] // YYYY-MM-DD for date indexing
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const request = store.add(session);

        request.onsuccess = () => resolve(session);
        request.onerror = () => reject(new Error('Failed to add session'));
      });
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  async getSessionsByDateRange(startDate, endDate) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readonly');
        const store = transaction.objectStore('sessions');
        const index = store.index('startTime');
        
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = index.getAll(range);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get sessions'));
      });
    } catch (error) {
      console.error('Error getting sessions by date range:', error);
      return [];
    }
  }

  async getSessionsByDate(date) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readonly');
        const store = transaction.objectStore('sessions');
        const index = store.index('date');
        
        const request = index.getAll(date);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get sessions by date'));
      });
    } catch (error) {
      console.error('Error getting sessions by date:', error);
      return [];
    }
  }

  async getAllSessions() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readonly');
        const store = transaction.objectStore('sessions');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get all sessions'));
      });
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return [];
    }
  }

  async getRecentSessions(limit = 10) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readonly');
        const store = transaction.objectStore('sessions');
        const index = store.index('startTime');
        
        const sessions = [];
        const request = index.openCursor(null, 'prev'); // Reverse order for recent first

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && sessions.length < limit) {
            sessions.push(cursor.value);
            cursor.continue();
          } else {
            resolve(sessions);
          }
        };

        request.onerror = () => reject(new Error('Failed to get recent sessions'));
      });
    } catch (error) {
      console.error('Error getting recent sessions:', error);
      return [];
    }
  }

  async deleteOldSessions(olderThanDays = 365) {
    try {
      await this.init();
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const index = store.index('startTime');
        
        const range = IDBKeyRange.upperBound(cutoffDate);
        const request = index.openCursor(range);
        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };

        request.onerror = () => reject(new Error('Failed to delete old sessions'));
      });
    } catch (error) {
      console.error('Error deleting old sessions:', error);
      return 0;
    }
  }

  async clearAllSessions() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to clear all sessions'));
      });
    } catch (error) {
      console.error('Error clearing all sessions:', error);
      throw error;
    }
  }

  async getSessionCount() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['sessions'], 'readonly');
        const store = transaction.objectStore('sessions');
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to count sessions'));
      });
    } catch (error) {
      console.error('Error counting sessions:', error);
      return 0;
    }
  }

  async exportSessions() {
    try {
      const sessions = await this.getAllSessions();
      return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        sessions: sessions
      };
    } catch (error) {
      console.error('Error exporting sessions:', error);
      throw error;
    }
  }
}

export const sessionDatabase = new SessionDatabase();