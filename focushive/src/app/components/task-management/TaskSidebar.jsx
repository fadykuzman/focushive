'use client';

import { useState } from 'react';
import FocusTaskList from './FocusTaskList';

export default function TaskSidebar({ onTaskSelect, selectedTaskId, mode, isExpanded, onToggle, onOpenNotes }) {
  return (
    <div className={`hidden sm:block fixed left-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-0'}`}>
      {isExpanded && (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200">

          {/* Task List Content */}
          <div className="p-4">
            <h3 className="text-base font-bold text-gray-800 mb-3">Select Focus Task</h3>
            <div className="max-h-96 overflow-y-auto">
              <FocusTaskList 
                onTaskSelect={onTaskSelect}
                selectedTaskId={selectedTaskId}
                isInSidebar={true}
                onOpenNotes={onOpenNotes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}