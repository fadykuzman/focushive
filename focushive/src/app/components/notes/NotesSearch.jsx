'use client';

import { useState } from 'react';

export default function NotesSearch({ 
  searchTerm, 
  onSearchChange, 
  selectedTags, 
  onTagsChange, 
  availableTags 
}) {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onTagsChange([]);
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          id="notes-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes by title, content, or tags..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <img src="/icons/search.svg" alt="Search" className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="relative">
            <button
              id="tag-filter-button"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-700"
            >
              <img src="/icons/tag.svg" alt="Tag" className="w-4 h-4" />
              <span>Tags {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
              <img src="/icons/chevron-down.svg" alt="Dropdown" className={`w-4 h-4 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTagDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                {availableTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            id="clear-filters-button"
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Clear filters
          </button>
        )}

        {/* Active Filters Display */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}