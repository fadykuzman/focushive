'use client';

export default function NotesList({ notes, onEditNote, onDeleteNote }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-600">
        <img src="/icons/document.svg" alt="No notes" className="w-12 h-12 mb-2 opacity-50" />
        <p>No notes yet</p>
        <p className="text-sm">Create your first note to get started</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Title */}
                {note.title && (
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800 truncate">
                    {note.title}
                  </h3>
                )}
                
                {/* Content Preview */}
                <p className="text-gray-700 mb-3 whitespace-pre-wrap text-sm sm:text-base">
                  <span className="sm:hidden">{truncateContent(note.content, 100)}</span>
                  <span className="hidden sm:block">{truncateContent(note.content, 150)}</span>
                </p>
                
                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <span>Created: {formatDate(note.createdAt)}</span>
                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                  )}
                  <div className="flex gap-2">
                    {note.sessionId && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Session Note
                      </span>
                    )}
                    {note.taskId && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Task Note
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 sm:ml-4 self-start">
                <button
                  onClick={() => onEditNote(note)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit note"
                >
                  <img src="/icons/edit.svg" alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete note"
                >
                  <img src="/icons/trash.svg" alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}