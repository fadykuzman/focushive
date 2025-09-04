'use client';

import { useState, useEffect } from 'react';
import BaseModal from '@/app/components/shared/BaseModal';
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
    onTaskSelect?.(task);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleAbort}
      title="Task Management"
      size="xl"
      id="task-list-modal"
    >
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
    </BaseModal>
  );
}