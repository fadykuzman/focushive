'use client';

import { useState, useEffect } from 'react';
import { useClickOutside, useEscapeKey } from '../../utils/modalUtils';
import NotesEditor from './NotesEditor';
import NotesList from './NotesList';
import NotesSearch from './NotesSearch';
import { notesDatabase } from '../../utils/notesDatabase';

export default function NotesModal({ 
  isOpen, 
  onClose, 
  sessionId = null, 
  taskId = null,
  initialMode = 'list'
}) {
  const [mode, setMode] = useState(initialMode);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const modalRef = useClickOutside(() => {
    if (isOpen && mode === 'list') {
      onClose();
    }
  });

  useEscapeKey(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'create') {
        setMode('list');
        setSelectedNote(null);
      } else {
        onClose();
      }
    }
  });

  useEffect(() => {
    if (isOpen) {
      loadNotes();
      loadTags();
    }
  }, [isOpen, sessionId, taskId]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, selectedTags]);

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

  if (!isOpen) return null;

  const getModalTitle = () => {
    if (sessionId) return 'Session Notes';
    if (taskId) return 'Task Notes';
    return 'Focus Session Notes';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden w-full flex flex-col"
      >
        {mode === 'list' ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{getModalTitle()}</h2>
              <div className="flex items-center gap-3">
                {/* Export Buttons */}
                <div className="flex gap-2">
                  <button
                    id="export-markdown-button"
                    onClick={handleExportMarkdown}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Export as Markdown"
                  >
                    .md
                  </button>
                  <button
                    id="export-text-button"
                    onClick={handleExportText}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Export as Text"
                  >
                    .txt
                  </button>
                </div>
                
                {/* Add Note Button */}
                <button
                  id="add-note-button"
                  onClick={handleCreateNote}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Note
                </button>
                
                {/* Close Button */}
                <button
                  id="notes-modal-close-button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="p-6 border-b">
              <NotesSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                availableTags={availableTags}
              />
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-500">Loading notes...</div>
                </div>
              ) : (
                <NotesList
                  notes={filteredNotes}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Editor Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">
                {mode === 'create' ? 'Create Note' : 'Edit Note'}
              </h2>
              <button
                onClick={() => {
                  setMode('list');
                  setSelectedNote(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-auto p-6">
              <NotesEditor
                initialTitle={selectedNote?.title || ''}
                initialContent={selectedNote?.content || ''}
                initialTags={selectedNote?.tags || []}
                onSave={handleSaveNote}
                onCancel={() => {
                  setMode('list');
                  setSelectedNote(null);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}