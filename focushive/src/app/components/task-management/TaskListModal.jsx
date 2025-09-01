'use client';

import FocusTaskList from './FocusTaskList';

export default function TaskListModal({ isOpen, onClose, onTaskSelect, selectedTaskId }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto w-full">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Task Management</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
            >
              <img src="/icons/close.svg" alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <FocusTaskList 
            onTaskSelect={(task) => {
              onTaskSelect?.(task);
              onClose();
            }}
            selectedTaskId={selectedTaskId}
            isInSidebar={true}
          />
        </div>
      </div>
    </div>
  );
}