import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notesDatabase } from '../notesDatabase';

class MockIDBDatabase {
  constructor() {
    this.objectStoreNames = { contains: vi.fn(() => false) };
    this.createObjectStore = vi.fn(() => ({
      createIndex: vi.fn()
    }));
    this.transaction = vi.fn(() => ({
      objectStore: vi.fn(() => ({
        add: vi.fn(() => ({ onsuccess: null, onerror: null })),
        put: vi.fn(() => ({ onsuccess: null, onerror: null })),
        get: vi.fn(() => ({ onsuccess: null, onerror: null })),
        getAll: vi.fn(() => ({ onsuccess: null, onerror: null })),
        delete: vi.fn(() => ({ onsuccess: null, onerror: null })),
        clear: vi.fn(() => ({ onsuccess: null, onerror: null })),
        count: vi.fn(() => ({ onsuccess: null, onerror: null })),
        index: vi.fn(() => ({
          getAll: vi.fn(() => ({ onsuccess: null, onerror: null }))
        }))
      }))
    }));
  }
}

class MockIDBRequest {
  constructor(result = null) {
    this.result = result;
    this.onsuccess = null;
    this.onerror = null;
    this.onupgradeneeded = null;
    
    setTimeout(() => {
      if (this.onsuccess) {
        this.onsuccess({ target: this });
      }
    }, 0);
  }
}

const mockIndexedDB = {
  open: vi.fn(() => new MockIDBRequest())
};

Object.defineProperty(global, 'indexedDB', {
  value: mockIndexedDB,
  writable: true
});

describe('NotesDatabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    notesDatabase.db = null;
  });

  describe('init', () => {
    it('should initialize the database', async () => {
      const mockDB = new MockIDBDatabase();
      mockIndexedDB.open.mockReturnValue(new MockIDBRequest(mockDB));
      
      const result = await notesDatabase.init();
      
      expect(mockIndexedDB.open).toHaveBeenCalledWith('focushive-notes', 1);
      expect(result).toBe(mockDB);
    });

    it('should return existing database if already initialized', async () => {
      const mockDB = new MockIDBDatabase();
      notesDatabase.db = mockDB;
      
      const result = await notesDatabase.init();
      
      expect(mockIndexedDB.open).not.toHaveBeenCalled();
      expect(result).toBe(mockDB);
    });

    it('should throw error if IndexedDB is not available', async () => {
      const originalIndexedDB = global.indexedDB;
      delete global.indexedDB;
      
      await expect(notesDatabase.init()).rejects.toThrow(
        'IndexedDB is not available in this environment'
      );
      
      global.indexedDB = originalIndexedDB;
    });
  });

  describe('generateId', () => {
    it('should generate a unique ID with note prefix', () => {
      const id1 = notesDatabase.generateId();
      const id2 = notesDatabase.generateId();
      
      expect(id1).toMatch(/^note_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^note_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('addNote', () => {
    it('should add a note with default values', async () => {
      const mockDB = new MockIDBDatabase();
      const mockTransaction = {
        objectStore: vi.fn(() => ({
          add: vi.fn(() => {
            const request = { onsuccess: null, onerror: null };
            setTimeout(() => request.onsuccess?.(), 0);
            return request;
          })
        }))
      };
      
      mockDB.transaction.mockReturnValue(mockTransaction);
      notesDatabase.db = mockDB;
      
      const noteData = {
        title: 'Test Note',
        content: 'Test content'
      };
      
      const result = await notesDatabase.addNote(noteData);
      
      expect(result.title).toBe('Test Note');
      expect(result.content).toBe('Test content');
      expect(result.type).toBe('session');
      expect(result.tags).toEqual([]);
      expect(result.id).toMatch(/^note_\d+_[a-z0-9]+$/);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should add a note with custom session and task IDs', async () => {
      const mockDB = new MockIDBDatabase();
      const mockTransaction = {
        objectStore: vi.fn(() => ({
          add: vi.fn(() => {
            const request = { onsuccess: null, onerror: null };
            setTimeout(() => request.onsuccess?.(), 0);
            return request;
          })
        }))
      };
      
      mockDB.transaction.mockReturnValue(mockTransaction);
      notesDatabase.db = mockDB;
      
      const noteData = {
        title: 'Task Note',
        content: 'Task-specific content',
        sessionId: 'session123',
        taskId: 'task456',
        tags: ['important', 'work']
      };
      
      const result = await notesDatabase.addNote(noteData);
      
      expect(result.sessionId).toBe('session123');
      expect(result.taskId).toBe('task456');
      expect(result.tags).toEqual(['important', 'work']);
    });
  });

  describe('searchNotes', () => {
    it('should filter notes by content', async () => {
      const mockNotes = [
        { 
          id: '1', 
          title: 'React Notes', 
          content: 'Learning React hooks', 
          tags: ['react', 'learning'] 
        },
        { 
          id: '2', 
          title: 'Vue Notes', 
          content: 'Vue composition API', 
          tags: ['vue', 'api'] 
        },
        { 
          id: '3', 
          title: 'JavaScript', 
          content: 'Arrow functions and React', 
          tags: ['javascript'] 
        }
      ];
      
      vi.spyOn(notesDatabase, 'getAllNotes').mockResolvedValue(mockNotes);
      
      const results = await notesDatabase.searchNotes('react');
      
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('3');
    });

    it('should filter notes by tags', async () => {
      const mockNotes = [
        { 
          id: '1', 
          title: 'Note 1', 
          content: 'Content 1', 
          tags: ['work', 'important'] 
        },
        { 
          id: '2', 
          title: 'Note 2', 
          content: 'Content 2', 
          tags: ['personal'] 
        }
      ];
      
      vi.spyOn(notesDatabase, 'getAllNotes').mockResolvedValue(mockNotes);
      
      const results = await notesDatabase.searchNotes('work');
      
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('1');
    });
  });

  describe('getAllTags', () => {
    it('should return unique tags from all notes', async () => {
      const mockNotes = [
        { 
          id: '1', 
          tags: ['react', 'frontend', 'work'] 
        },
        { 
          id: '2', 
          tags: ['vue', 'frontend'] 
        },
        { 
          id: '3', 
          tags: ['backend', 'work'] 
        }
      ];
      
      vi.spyOn(notesDatabase, 'getAllNotes').mockResolvedValue(mockNotes);
      
      const tags = await notesDatabase.getAllTags();
      
      expect(tags.sort()).toEqual(['backend', 'frontend', 'react', 'vue', 'work']);
    });

    it('should return empty array when no notes exist', async () => {
      vi.spyOn(notesDatabase, 'getAllNotes').mockResolvedValue([]);
      
      const tags = await notesDatabase.getAllTags();
      
      expect(tags).toEqual([]);
    });
  });

  describe('exportNotesAsMarkdown', () => {
    it('should export notes in markdown format', async () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Test Note',
          content: 'This is test content',
          tags: ['test', 'important'],
          sessionId: 'session123',
          createdAt: new Date('2024-01-01')
        }
      ];
      
      vi.spyOn(notesDatabase, 'getAllNotes').mockResolvedValue(mockNotes);
      
      const markdown = await notesDatabase.exportNotesAsMarkdown();
      
      expect(markdown).toContain('# Focus Session Notes');
      expect(markdown).toContain('## Test Note');
      expect(markdown).toContain('This is test content');
      expect(markdown).toContain('**Tags:** test, important');
      expect(markdown).toContain('**Session ID:** session123');
    });
  });

  describe('exportNotesAsText', () => {
    it('should export notes in plain text format', async () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Test Note',
          content: 'This is test content',
          tags: ['test'],
          createdAt: new Date('2024-01-01')
        }
      ];
      
      vi.spyOn(notesDatabase, 'getAllNotes').mockResolvedValue(mockNotes);
      
      const text = await notesDatabase.exportNotesAsText();
      
      expect(text).toContain('Focus Session Notes');
      expect(text).toContain('Test Note');
      expect(text).toContain('This is test content');
      expect(text).toContain('Tags: test');
    });
  });
});