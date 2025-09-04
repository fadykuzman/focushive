import { useState, useEffect } from 'react';
import { notesDatabase } from '@/app/utils/notesDatabase';

export function useNotesModal(sessionId, taskId, initialMode = 'list') {
  const [mode, setMode] = useState(initialMode);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      let loadedNotes;
      if (sessionId) {
        loadedNotes = await notesDatabase.getNotesBySession(sessionId);
      } else if (taskId) {
        loadedNotes = await notesDatabase.getNotesByTask(taskId);
      } else {
        loadedNotes = await notesDatabase.getAllNotes();
      }
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await notesDatabase.getAllTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    setFilteredNotes(filtered);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setMode('create');
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setMode('edit');
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (mode === 'create') {
        await notesDatabase.addNote({
          ...noteData,
          sessionId,
          taskId
        });
      } else if (mode === 'edit' && selectedNote) {
        await notesDatabase.updateNote(selectedNote.id, noteData);
      }
      
      await loadNotes();
      await loadTags();
      setMode('list');
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesDatabase.deleteNote(noteId);
      await loadNotes();
      await loadTags();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleExportMarkdown = async () => {
    try {
      const markdown = await notesDatabase.exportNotesAsMarkdown();
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focus-notes-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export notes:', error);
    }
  };

  const handleExportText = async () => {
    try {
      const text = await notesDatabase.exportNotesAsText();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focus-notes-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export notes:', error);
    }
  };

  const resetState = () => {
    setMode('list');
    setSelectedNote(null);
  };

  // Load notes and tags when dependencies change
  useEffect(() => {
    loadNotes();
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, taskId]);

  // Filter notes when search criteria change
  useEffect(() => {
    filterNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, searchTerm, selectedTags]);

  return {
    // State
    mode,
    notes,
    filteredNotes,
    loading,
    selectedNote,
    searchTerm,
    selectedTags,
    availableTags,
    
    // Setters
    setMode,
    setSearchTerm,
    setSelectedTags,
    
    // Actions
    handleCreateNote,
    handleEditNote,
    handleSaveNote,
    handleDeleteNote,
    handleExportMarkdown,
    handleExportText,
    resetState,
    loadNotes,
    loadTags
  };
}