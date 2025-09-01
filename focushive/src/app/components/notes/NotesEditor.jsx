'use client';

import { useState, useRef, useEffect } from 'react';

export default function NotesEditor({ 
  initialContent = '', 
  initialTitle = '', 
  initialTags = [],
  onSave, 
  onCancel, 
  placeholder = 'Add your session notes...',
  titlePlaceholder = 'Note title (optional)'
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave?.({
        title: title.trim(),
        content: content.trim(),
        tags: tags
      });
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasContent = content.trim() || title.trim();

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="p-6">
        {/* Title Input */}
        <input
          id="note-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={titlePlaceholder}
          className="w-full text-lg font-semibold mb-3 p-2 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none"
          onKeyDown={handleKeyDown}
        />

        {/* Content Textarea */}
        <textarea
          id="note-content-textarea"
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full h-48 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-vertical"
          onKeyDown={handleKeyDown}
        />

        {/* Tags Section */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="note-tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              placeholder="Add tags..."
              className="text-sm border-0 focus:outline-none min-w-20 flex-1"
            />
          </div>
          <div className="text-xs text-gray-500">
            Press Enter or comma to add tags
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            id="note-cancel-button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            id="note-save-button"
            onClick={handleSave}
            disabled={!hasContent || isSaving}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <kbd>Cmd+Enter</kbd> to save • <kbd>Esc</kbd> to cancel
        </div>
      </div>
    </div>
  );
}