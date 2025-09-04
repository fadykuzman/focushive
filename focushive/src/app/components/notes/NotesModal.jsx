'use client';

import { useClickOutside, useEscapeKey } from '@/app/utils/modalUtils';
import NotesEditor from '@/app/components/notes/NotesEditor';
import NotesList from '@/app/components/notes/NotesList';
import NotesSearch from '@/app/components/notes/NotesSearch';
import NotesModalHeader from '@/app/components/notes/NotesModalHeader';
import { useNotesModal } from '@/app/hooks/useNotesModal';

export default function NotesModal({ 
  isOpen, 
  onClose, 
  sessionId = null, 
  taskId = null,
  initialMode = 'list'
}) {
  const {
    mode,
    filteredNotes,
    loading,
    selectedNote,
    searchTerm,
    selectedTags,
    availableTags,
    setMode,
    setSearchTerm,
    setSelectedTags,
    handleCreateNote,
    handleEditNote,
    handleSaveNote,
    handleDeleteNote,
    handleExportMarkdown,
    handleExportText,
    resetState
  } = useNotesModal(sessionId, taskId, initialMode);

  const modalRef = useClickOutside(() => {
    if (isOpen && mode === 'list') {
      onClose();
    }
  });

  useEscapeKey(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'create') {
        resetState();
      } else {
        onClose();
      }
    }
  });


  if (!isOpen) return null;

  const getModalTitle = () => {
    if (sessionId) return 'Session Notes';
    if (taskId) return 'Task Notes';
    return 'Focus Session Notes';
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden w-full flex flex-col"
      >
        {mode === 'list' ? (
          <>
            <NotesModalHeader
              title={getModalTitle()}
              onClose={onClose}
              onCreateNote={handleCreateNote}
              onExportMarkdown={handleExportMarkdown}
              onExportText={handleExportText}
            />

            {/* Search and Filter */}
            <div className="p-4 sm:p-6 border-b">
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
                  <div className="text-gray-600">Loading notes...</div>
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
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-heading-h2 text-gray-800">
                {mode === 'create' ? 'Create Note' : 'Edit Note'}
              </h2>
              <button
                onClick={resetState}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <img src="/icons/close.svg" alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <NotesEditor
                initialTitle={selectedNote?.title || ''}
                initialContent={selectedNote?.content || ''}
                initialTags={selectedNote?.tags || []}
                onSave={handleSaveNote}
                onCancel={resetState}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}