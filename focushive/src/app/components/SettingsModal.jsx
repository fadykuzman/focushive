'use client';

import { useState } from 'react';

export default function SettingsModal({ isOpen, onClose, durations, onDurationChange }) {
  const [localDurations, setLocalDurations] = useState({
    focus: Math.floor(durations.focus / 60),
    shortBreak: Math.floor(durations.shortBreak / 60),
    longBreak: Math.floor(durations.longBreak / 60),
  });

  const handleChange = (type, value) => {
    const newValue = Math.max(1, Math.min(120, parseInt(value) || 1)); // Min 1, Max 120 minutes
    const newDurations = {
      ...localDurations,
      [type]: newValue
    };
    setLocalDurations(newDurations);
    
    // Live update - convert to seconds and apply immediately
    onDurationChange(type, newValue * 60);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Timer Durations</h3>
            
            {/* Focus Duration */}
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-medium">Focus</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localDurations.focus}
                  onChange={(e) => handleChange('focus', e.target.value)}
                  className="w-16 px-2 py-1 text-gray-700 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500 text-sm">min</span>
              </div>
            </div>

            {/* Short Break Duration */}
            <div className="flex items-center justify-between">
              <label className="text-gray-600 font-medium">Short Break</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localDurations.shortBreak}
                  onChange={(e) => handleChange('shortBreak', e.target.value)}
                  className="w-16 px-2 py-1 text-gray-700  border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-500 text-sm">min</span>
              </div>
            </div>

            {/* Long Break Duration */}
            <div className="flex items-center justify-between">
              <label className="text-gray-600 font-medium">Long Break</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localDurations.longBreak}
                  onChange={(e) => handleChange('longBreak', e.target.value)}
                  className="w-16 px-2 py-1 text-gray-700  border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500 text-sm">min</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
