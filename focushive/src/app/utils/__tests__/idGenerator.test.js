import { 
  generateSessionId, 
  generateNoteId, 
  generateTaskId, 
  generateTaskSessionId, 
  generateId 
} from '../idGenerator';

describe('idGenerator', () => {
  describe('generateSessionId', () => {
    test('should generate unique session IDs with correct format', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      
      expect(id1).toMatch(/^session_\d+_[a-z0-9]{9}$/);
      expect(id2).toMatch(/^session_\d+_[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateNoteId', () => {
    test('should generate unique note IDs with correct format', () => {
      const id1 = generateNoteId();
      const id2 = generateNoteId();
      
      expect(id1).toMatch(/^note_\d+_[a-z0-9]{9}$/);
      expect(id2).toMatch(/^note_\d+_[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateTaskId', () => {
    test('should generate unique task IDs with correct format', () => {
      const id1 = generateTaskId();
      const id2 = generateTaskId();
      
      expect(id1).toMatch(/^task_\d+_[a-z0-9]{9}$/);
      expect(id2).toMatch(/^task_\d+_[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateTaskSessionId', () => {
    test('should generate unique task session IDs with correct format', () => {
      const id1 = generateTaskSessionId();
      const id2 = generateTaskSessionId();
      
      expect(id1).toMatch(/^tasksession_\d+_[a-z0-9]{9}$/);
      expect(id2).toMatch(/^tasksession_\d+_[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs with custom prefix', () => {
      const id1 = generateId('custom');
      const id2 = generateId('test');
      
      expect(id1).toMatch(/^custom_\d+_[a-z0-9]{9}$/);
      expect(id2).toMatch(/^test_\d+_[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('ID uniqueness', () => {
    test('should generate different IDs across all functions', () => {
      const sessionId = generateSessionId();
      const noteId = generateNoteId();
      const taskId = generateTaskId();
      const taskSessionId = generateTaskSessionId();
      const customId = generateId('custom');
      
      const ids = [sessionId, noteId, taskId, taskSessionId, customId];
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});