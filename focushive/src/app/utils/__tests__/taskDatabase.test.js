import { describe, it, expect, beforeEach, vi } from 'vitest';
import { taskDatabase } from '../taskDatabase';

const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
};

const mockRequest = {
  onsuccess: null,
  onerror: null,
  onupgradeneeded: null,
  result: null,
};

const mockDatabase = {
  objectStoreNames: {
    contains: vi.fn(),
  },
  createObjectStore: vi.fn(),
  transaction: vi.fn(),
};

const mockObjectStore = {
  add: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  count: vi.fn(),
  createIndex: vi.fn(),
  index: vi.fn(),
};

const mockTransaction = {
  objectStore: vi.fn(),
};

describe('TaskDatabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    global.indexedDB = mockIndexedDB;
    
    mockIndexedDB.open.mockReturnValue(mockRequest);
    mockDatabase.createObjectStore.mockReturnValue(mockObjectStore);
    mockDatabase.transaction.mockReturnValue(mockTransaction);
    mockTransaction.objectStore.mockReturnValue(mockObjectStore);
    
    taskDatabase.db = null;
  });

  describe('init', () => {
    it('should open IndexedDB connection', async () => {
      const initPromise = taskDatabase.init();
      
      expect(mockIndexedDB.open).toHaveBeenCalledWith('focushive-tasks', 1);
      
      mockRequest.result = mockDatabase;
      mockRequest.onsuccess();
      
      const result = await initPromise;
      expect(result).toBe(mockDatabase);
      expect(taskDatabase.db).toBe(mockDatabase);
    });

    it('should create object stores on upgrade', async () => {
      mockDatabase.objectStoreNames.contains.mockReturnValue(false);
      
      const initPromise = taskDatabase.init();
      
      const upgradeEvent = {
        target: { result: mockDatabase }
      };
      
      mockRequest.onupgradeneeded(upgradeEvent);
      
      expect(mockDatabase.createObjectStore).toHaveBeenCalledWith('tasks', { keyPath: 'id' });
      expect(mockDatabase.createObjectStore).toHaveBeenCalledWith('taskSessions', { keyPath: 'id' });
      expect(mockObjectStore.createIndex).toHaveBeenCalledTimes(9);
    });

    it('should handle IndexedDB unavailable', async () => {
      global.indexedDB = undefined;
      
      await expect(taskDatabase.init()).rejects.toThrow('IndexedDB is not available in this environment');
    });
  });

  describe('addTask', () => {
    beforeEach(async () => {
      mockRequest.result = mockDatabase;
      mockRequest.onsuccess = vi.fn();
      
      const initPromise = taskDatabase.init();
      mockRequest.onsuccess();
      await initPromise;
    });

    it('should add a new task with generated ID', async () => {
      const mockAddRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn() 
      };
      mockObjectStore.add.mockReturnValue(mockAddRequest);
      
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high'
      };
      
      const addPromise = taskDatabase.addTask(taskData);
      
      setTimeout(() => {
        mockAddRequest.onsuccess();
      }, 0);
      
      const result = await addPromise;
      
      expect(result).toMatchObject(taskData);
      expect(result.id).toMatch(/^task_\d+_/);
      expect(mockObjectStore.add).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high',
          status: 'pending',
          totalTimeSpent: 0,
          sessionsCount: 0,
          productivityScore: 0
        })
      );
    });
  });

  describe('updateTask', () => {
    beforeEach(async () => {
      mockRequest.result = mockDatabase;
      mockRequest.onsuccess = vi.fn();
      
      const initPromise = taskDatabase.init();
      mockRequest.onsuccess();
      await initPromise;
    });

    it('should update existing task', async () => {
      const existingTask = {
        id: 'task_123',
        title: 'Original Title',
        status: 'pending',
        updatedAt: new Date('2025-01-01')
      };
      
      const mockGetRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn(), 
        result: existingTask 
      };
      const mockPutRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn() 
      };
      
      mockObjectStore.get.mockReturnValue(mockGetRequest);
      mockObjectStore.put.mockReturnValue(mockPutRequest);
      
      const updatePromise = taskDatabase.updateTask('task_123', { title: 'Updated Title' });
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
        setTimeout(() => {
          mockPutRequest.onsuccess();
        }, 0);
      }, 0);
      
      const result = await updatePromise;
      
      expect(result.title).toBe('Updated Title');
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(mockObjectStore.put).toHaveBeenCalled();
    });

    it('should set completedAt when status changes to completed', async () => {
      const existingTask = {
        id: 'task_123',
        status: 'pending',
        completedAt: null
      };
      
      const mockGetRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn(), 
        result: existingTask 
      };
      const mockPutRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn() 
      };
      
      mockObjectStore.get.mockReturnValue(mockGetRequest);
      mockObjectStore.put.mockReturnValue(mockPutRequest);
      
      const updatePromise = taskDatabase.updateTask('task_123', { status: 'completed' });
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
        setTimeout(() => {
          mockPutRequest.onsuccess();
        }, 0);
      }, 0);
      
      const result = await updatePromise;
      
      expect(result.status).toBe('completed');
      expect(result.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('linkTaskToSession', () => {
    beforeEach(async () => {
      mockRequest.result = mockDatabase;
      mockRequest.onsuccess = vi.fn();
      
      const initPromise = taskDatabase.init();
      mockRequest.onsuccess();
      await initPromise;
    });

    it('should create task session link and update task stats', async () => {
      const existingTask = {
        id: 'task_123',
        totalTimeSpent: 300,
        sessionsCount: 2
      };
      
      const mockAddRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn() 
      };
      const mockGetRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn(), 
        result: existingTask 
      };
      const mockUpdateRequest = { 
        onsuccess: vi.fn(), 
        onerror: vi.fn() 
      };
      
      mockObjectStore.add.mockReturnValue(mockAddRequest);
      mockObjectStore.get.mockReturnValue(mockGetRequest);
      mockObjectStore.put.mockReturnValue(mockUpdateRequest);
      
      const linkPromise = taskDatabase.linkTaskToSession('task_123', 'session_456', 600);
      
      setTimeout(() => {
        mockAddRequest.onsuccess();
        setTimeout(() => {
          mockGetRequest.onsuccess();
          setTimeout(() => {
            mockUpdateRequest.onsuccess();
          }, 0);
        }, 0);
      }, 0);
      
      await linkPromise;
      
      expect(mockObjectStore.add).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'task_123',
          sessionId: 'session_456',
          timeSpent: 600
        })
      );
      
      expect(mockObjectStore.put).toHaveBeenCalledWith(
        expect.objectContaining({
          totalTimeSpent: 900,
          sessionsCount: 3
        })
      );
    });
  });

  describe('calculateProductivityScore', () => {
    beforeEach(async () => {
      mockRequest.result = mockDatabase;
      mockRequest.onsuccess = vi.fn();
      
      const initPromise = taskDatabase.init();
      mockRequest.onsuccess();
      await initPromise;
    });

    it('should calculate score for completed task within estimate', async () => {
      const task = {
        id: 'task_123',
        status: 'completed',
        estimatedDuration: 1800,
        totalTimeSpent: 1800
      };
      
      const sessions = [
        { taskId: 'task_123', timeSpent: 600 },
        { taskId: 'task_123', timeSpent: 600 },
        { taskId: 'task_123', timeSpent: 600 }
      ];
      
      vi.spyOn(taskDatabase, 'getTask').mockResolvedValue(task);
      vi.spyOn(taskDatabase, 'getTaskSessions').mockResolvedValue(sessions);
      
      const score = await taskDatabase.calculateProductivityScore('task_123');
      
      expect(score).toBeGreaterThan(50);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 0 for non-existent task', async () => {
      vi.spyOn(taskDatabase, 'getTask').mockResolvedValue(null);
      vi.spyOn(taskDatabase, 'getTaskSessions').mockResolvedValue([]);
      
      const score = await taskDatabase.calculateProductivityScore('nonexistent');
      
      expect(score).toBe(0);
    });
  });
});