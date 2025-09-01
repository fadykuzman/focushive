class NotesDatabase {
  constructor() {
    this.dbName = 'focushive-notes';
    this.version = 1;
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB is not available in this environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB for notes'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          
          noteStore.createIndex('sessionId', 'sessionId', { unique: false });
          noteStore.createIndex('taskId', 'taskId', { unique: false });
          noteStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          noteStore.createIndex('createdAt', 'createdAt', { unique: false });
          noteStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          noteStore.createIndex('date', 'date', { unique: false });
          noteStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  generateId() {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async addNote(noteData) {
    try {
      await this.init();
      
      const note = {
        id: this.generateId(),
        title: noteData.title || '',
        content: noteData.content || '',
        htmlContent: noteData.htmlContent || '',
        type: noteData.type || 'session',
        sessionId: noteData.sessionId || null,
        taskId: noteData.taskId || null,
        tags: noteData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date().toISOString().split('T')[0]
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        const request = store.add(note);

        request.onsuccess = () => resolve(note);
        request.onerror = () => reject(new Error('Failed to add note'));
      });
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  async updateNote(noteId, updates) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        const getRequest = store.get(noteId);

        getRequest.onsuccess = () => {
          const note = getRequest.result;
          if (!note) {
            reject(new Error('Note not found'));
            return;
          }

          const updatedNote = {
            ...note,
            ...updates,
            updatedAt: new Date()
          };

          const updateRequest = store.put(updatedNote);
          updateRequest.onsuccess = () => resolve(updatedNote);
          updateRequest.onerror = () => reject(new Error('Failed to update note'));
        };

        getRequest.onerror = () => reject(new Error('Failed to get note for update'));
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(noteId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        const request = store.delete(noteId);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to delete note'));
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  async getNote(noteId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.get(noteId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get note'));
      });
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }

  async getAllNotes() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result.sort((a, b) => b.updatedAt - a.updatedAt));
        request.onerror = () => reject(new Error('Failed to get all notes'));
      });
    } catch (error) {
      console.error('Error getting all notes:', error);
      return [];
    }
  }

  async getNotesBySession(sessionId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('sessionId');
        const request = index.getAll(sessionId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get notes by session'));
      });
    } catch (error) {
      console.error('Error getting notes by session:', error);
      return [];
    }
  }

  async getNotesByTask(taskId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('taskId');
        const request = index.getAll(taskId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get notes by task'));
      });
    } catch (error) {
      console.error('Error getting notes by task:', error);
      return [];
    }
  }

  async getNotesByTag(tag) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('tags');
        const request = index.getAll(tag);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get notes by tag'));
      });
    } catch (error) {
      console.error('Error getting notes by tag:', error);
      return [];
    }
  }

  async searchNotes(searchTerm) {
    try {
      const allNotes = await this.getAllNotes();
      const searchTermLower = searchTerm.toLowerCase();
      
      return allNotes.filter(note => 
        note.title.toLowerCase().includes(searchTermLower) ||
        note.content.toLowerCase().includes(searchTermLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  }

  async getNotesByDateRange(startDate, endDate) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('date');
        
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = index.getAll(range);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get notes by date range'));
      });
    } catch (error) {
      console.error('Error getting notes by date range:', error);
      return [];
    }
  }

  async getAllTags() {
    try {
      const allNotes = await this.getAllNotes();
      const tagSet = new Set();
      
      allNotes.forEach(note => {
        note.tags.forEach(tag => tagSet.add(tag));
      });
      
      return Array.from(tagSet).sort();
    } catch (error) {
      console.error('Error getting all tags:', error);
      return [];
    }
  }

  async exportNotes() {
    try {
      const notes = await this.getAllNotes();
      return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        notes: notes
      };
    } catch (error) {
      console.error('Error exporting notes:', error);
      throw error;
    }
  }

  async exportNotesAsMarkdown() {
    try {
      const notes = await this.getAllNotes();
      let markdown = `# Focus Session Notes\n\nExported on: ${new Date().toLocaleDateString()}\n\n`;
      
      notes.forEach(note => {
        markdown += `## ${note.title || 'Untitled Note'}\n\n`;
        markdown += `**Created:** ${new Date(note.createdAt).toLocaleDateString()}\n`;
        
        if (note.tags.length > 0) {
          markdown += `**Tags:** ${note.tags.join(', ')}\n`;
        }
        
        if (note.sessionId) {
          markdown += `**Session ID:** ${note.sessionId}\n`;
        }
        
        if (note.taskId) {
          markdown += `**Task ID:** ${note.taskId}\n`;
        }
        
        markdown += '\n';
        markdown += note.content;
        markdown += '\n\n---\n\n';
      });
      
      return markdown;
    } catch (error) {
      console.error('Error exporting notes as markdown:', error);
      throw error;
    }
  }

  async exportNotesAsText() {
    try {
      const notes = await this.getAllNotes();
      let text = `Focus Session Notes\n\nExported on: ${new Date().toLocaleDateString()}\n\n`;
      
      notes.forEach(note => {
        text += `${note.title || 'Untitled Note'}\n`;
        text += `Created: ${new Date(note.createdAt).toLocaleDateString()}\n`;
        
        if (note.tags.length > 0) {
          text += `Tags: ${note.tags.join(', ')}\n`;
        }
        
        if (note.sessionId) {
          text += `Session ID: ${note.sessionId}\n`;
        }
        
        if (note.taskId) {
          text += `Task ID: ${note.taskId}\n`;
        }
        
        text += '\n';
        text += note.content;
        text += '\n\n' + '='.repeat(50) + '\n\n';
      });
      
      return text;
    } catch (error) {
      console.error('Error exporting notes as text:', error);
      throw error;
    }
  }

  async clearAllNotes() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to clear all notes'));
      });
    } catch (error) {
      console.error('Error clearing all notes:', error);
      throw error;
    }
  }

  async getNotesCount() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to count notes'));
      });
    } catch (error) {
      console.error('Error counting notes:', error);
      return 0;
    }
  }
}

export const notesDatabase = new NotesDatabase();