'use client';

import { useState, useEffect } from 'react';
import FocusTaskList from '@/app/components/task-management/FocusTaskList';

export default function TaskListModal({ isOpen, onClose, onTaskSelect, selectedTaskId }) {
  const [currentSelection, setCurrentSelection] = useState(selectedTaskId);
  const [initialSelection, setInitialSelection] = useState(selectedTaskId);

  // Track initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSelection(selectedTaskId);
      setInitialSelection(selectedTaskId);
    }
  }, [isOpen, selectedTaskId]);

  const handleAbort = () => {
    // Revert to initial selection
    if (initialSelection !== currentSelection) {
      onTaskSelect?.(initialSelection ? { id: initialSelection } : null);
    }
    onClose();
  };

  const handleDone = () => {
    // Keep current selection
    onClose();
  };

  const handleTaskSelectLocal = (task) => {
    setCurrentSelection(task?.id || null);
    handleTaskSelect(task);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAbort();
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto w-full">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Task Management</h2>
            <button
              onClick={handleAbort}
              className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
            >
              <img src="/icons/close.svg" alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <FocusTaskList 
            onTaskSelect={handleTaskSelectLocal}
            selectedTaskId={currentSelection}
            isInSidebar={true}
          />
          
          {/* Done Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleDone}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}