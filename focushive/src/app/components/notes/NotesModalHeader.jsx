import NotesExportTools from './NotesExportTools';

export default function NotesModalHeader({ 
  title, 
  onClose, 
  onCreateNote, 
  onExportMarkdown, 
  onExportText 
}) {
  return (
    <div className="p-4 sm:p-6 border-b">
      {/* Title and Close Button Row */}
      <div className="flex items-center justify-between mb-4 sm:mb-0">
        <h2 className="text-heading-h2 text-gray-800">{title}</h2>
        <button
          id="notes-modal-close-button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <img src="/icons/close.svg" alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
        <NotesExportTools 
          onExportMarkdown={onExportMarkdown}
          onExportText={onExportText}
        />
        
        {/* Add Note Button */}
        <button
          id="add-note-button"
          onClick={onCreateNote}
          className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}