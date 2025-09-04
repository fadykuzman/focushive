export default function NotesExportTools({ onExportMarkdown, onExportText }) {
  return (
    <div className="flex gap-2">
      <button
        id="export-markdown-button"
        onClick={onExportMarkdown}
        className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
        title="Export as Markdown"
      >
        <img src="/icons/download.svg" alt="Download" className="w-3 h-3 sm:w-4 sm:h-4" />
        .md
      </button>
      <button
        id="export-text-button"
        onClick={onExportText}
        className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
        title="Export as Text"
      >
        <img src="/icons/download.svg" alt="Download" className="w-3 h-3 sm:w-4 sm:h-4" />
        .txt
      </button>
    </div>
  );
}