import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock IndexedDB for testing
class MockIDBRequest {
  constructor() {
    this.result = null;
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;
  }

  succeed(result = null) {
    this.result = result;
    setTimeout(() => this.onsuccess?.({ target: this }), 0);
  }

  fail(error = new Error('Mock error')) {
    this.error = error;
    setTimeout(() => this.onerror?.({ target: this }), 0);
  }
}

class MockIDBObjectStore {
  constructor() {
    this.data = new Map();
    this.indexes = new Map();
  }

  add(data) {
    const request = new MockIDBRequest();
    setTimeout(() => {
      if (this.data.has(data.id)) {
        request.fail(new Error('Key already exists'));
      } else {
        this.data.set(data.id, data);
        request.succeed(data);
      }
    }, 0);
    return request;
  }

  getAll() {
    const request = new MockIDBRequest();
    setTimeout(() => {
      request.succeed(Array.from(this.data.values()));
    }, 0);
    return request;
  }

  clear() {
    const request = new MockIDBRequest();
    setTimeout(() => {
      this.data.clear();
      request.succeed();
    }, 0);
    return request;
  }

  count() {
    const request = new MockIDBRequest();
    setTimeout(() => {
      request.succeed(this.data.size);
    }, 0);
    return request;
  }

  createIndex(name, keyPath, options) {
    this.indexes.set(name, { name, keyPath, options });
  }

  index(name) {
    return {
      getAll: (range) => {
        const request = new MockIDBRequest();
        setTimeout(() => {
          request.succeed(Array.from(this.data.values()));
        }, 0);
        return request;
      },
      openCursor: (range, direction) => {
        const request = new MockIDBRequest();
        setTimeout(() => {
          request.succeed(null); // Simplified - no cursor iteration
        }, 0);
        return request;
      }
    };
  }
}

class MockIDBTransaction {
  constructor(stores) {
    this.stores = stores;
  }

  objectStore(name) {
    return this.stores[name] || new MockIDBObjectStore();
  }
}

class MockIDBDatabase {
  constructor() {
    this.objectStoreNames = { contains: () => false };
    this.stores = {
      sessions: new MockIDBObjectStore()
    };
  }

  createObjectStore(name, options) {
    const store = new MockIDBObjectStore();
    this.stores[name] = store;
    return store;
  }

  transaction(storeNames, mode) {
    return new MockIDBTransaction(this.stores);
  }
}

// Mock the global indexedDB
const mockIndexedDB = {
  open: (name, version) => {
    const request = new MockIDBRequest();
    const db = new MockIDBDatabase();
    
    setTimeout(() => {
      if (request.onupgradeneeded) {
        request.onupgradeneeded({ target: { result: db } });
      }
      request.succeed(db);
    }, 0);
    
    return request;
  }
};

vi.stubGlobal('indexedDB', mockIndexedDB);

// Import after mocking
import { sessionDatabase } from '../sessionDatabase';

describe('SessionDatabase', () => {
  beforeEach(async () => {
    // Reset the database instance
    sessionDatabase.db = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Database Initialization', () => {
    it('should initialize database successfully', async () => {
      const db = await sessionDatabase.init();
      expect(db).toBeDefined();
    });

    it('should generate unique session IDs', () => {
      const id1 = sessionDatabase.generateId();
      const id2 = sessionDatabase.generateId();
      
      expect(id1).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Session Management', () => {
    it('should add session with correct structure', async () => {
      const sessionData = {
        type: 'focus',
        startTime: new Date('2025-08-31T10:00:00Z'),
        endTime: new Date('2025-08-31T10:25:00Z'),
        plannedDuration: 1500,
        actualDuration: 1500,
        completed: true,
        round: 1,
        notes: 'Test session'
      };

      const result = await sessionDatabase.addSession(sessionData);
      
      expect(result.id).toBeDefined();
      expect(result.type).toBe('focus');
      expect(result.plannedDuration).toBe(1500);
      expect(result.actualDuration).toBe(1500);
      expect(result.completed).toBe(true);
      expect(result.date).toBe('2025-08-31');
    });

    it('should handle add session errors gracefully', async () => {
      // Mock a failing database
      const originalInit = sessionDatabase.init;
      sessionDatabase.init = vi.fn().mockRejectedValue(new Error('DB Error'));

      const sessionData = {
        type: 'focus',
        startTime: new Date(),
        endTime: new Date(),
        plannedDuration: 1500,
        actualDuration: 1500,
        completed: true,
        round: 1
      };

      await expect(sessionDatabase.addSession(sessionData)).rejects.toThrow('DB Error');
      
      // Restore original method
      sessionDatabase.init = originalInit;
    });
  });

  describe('Data Retrieval', () => {
    it('should return empty array when no sessions exist', async () => {
      const sessions = await sessionDatabase.getAllSessions();
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBe(0);
    });

    it('should return empty array for date queries with no data', async () => {
      const sessions = await sessionDatabase.getSessionsByDate('2025-08-31');
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBe(0);
    });

    it('should handle database errors in getSessionsByDate', async () => {
      const originalInit = sessionDatabase.init;
      sessionDatabase.init = vi.fn().mockRejectedValue(new Error('DB Error'));

      const sessions = await sessionDatabase.getSessionsByDate('2025-08-31');
      expect(sessions).toEqual([]);
      
      sessionDatabase.init = originalInit;
    });
  });

  describe('Data Management', () => {
    it('should return 0 when counting empty database', async () => {
      const count = await sessionDatabase.getSessionCount();
      expect(count).toBe(0);
    });

    it('should handle count errors gracefully', async () => {
      const originalInit = sessionDatabase.init;
      sessionDatabase.init = vi.fn().mockRejectedValue(new Error('DB Error'));

      const count = await sessionDatabase.getSessionCount();
      expect(count).toBe(0);
      
      sessionDatabase.init = originalInit;
    });

    it('should export sessions with metadata', async () => {
      const exportData = await sessionDatabase.exportSessions();
      
      expect(exportData).toHaveProperty('exportDate');
      expect(exportData).toHaveProperty('version', '1.0');
      expect(exportData).toHaveProperty('sessions');
      expect(Array.isArray(exportData.sessions)).toBe(true);
    });
  });
});