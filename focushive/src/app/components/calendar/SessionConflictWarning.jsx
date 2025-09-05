'use client';

import { useState } from 'react';
import BaseModal from '@/app/components/shared/BaseModal';

export default function SessionConflictWarning({ 
  isOpen, 
  onClose, 
  conflictData,
  onStartAnyway,
  onStartShorter,
  onViewCalendar 
}) {
  const [isStarting, setIsStarting] = useState(false);

  if (!isOpen || !conflictData?.hasConflicts) return null;

  const handleStartAnyway = async () => {
    setIsStarting(true);
    await onStartAnyway();
    setIsStarting(false);
    onClose();
  };

  const handleStartShorter = async () => {
    setIsStarting(true);
    await onStartShorter();
    setIsStarting(false);
    onClose();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calculateOptimalLength = () => {
    const now = new Date();
    const firstConflict = conflictData.conflicts
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
    
    const timeUntilConflict = new Date(firstConflict.startTime) - now;
    const minutesUntilConflict = Math.floor(timeUntilConflict / (60 * 1000));
    
    // Leave 5-minute buffer
    const suggestedLength = Math.max(5, minutesUntilConflict - 5);
    
    // Round to common durations
    const commonLengths = [15, 25, 30, 45];
    return commonLengths.find(length => length <= suggestedLength) || 15;
  };

  const optimalLength = calculateOptimalLength();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="⚠️ Calendar Conflict"
      size="md"
    >
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-400 text-xl">⚠️</div>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">
                Session Conflicts with Calendar
              </h3>
              <p className="text-yellow-700 text-sm">
                {conflictData.warningMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Conflicting Events */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-800">Conflicting Events:</h4>
          {conflictData.conflicts.map(event => (
            <div key={event.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-red-800">{event.safeTitle}</h5>
                  <p className="text-sm text-red-600">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                  {event.location && (
                    <p className="text-sm text-red-600">📍 {event.location}</p>
                  )}
                </div>
                <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                  Conflict
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Session Timeline */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-800 mb-2">Your Planned Session:</h4>
          <div className="text-sm text-gray-600">
            <p>Start: {formatTime(conflictData.sessionStart)}</p>
            <p>End: {formatTime(conflictData.sessionEnd)}</p>
            <p>Duration: {Math.round((conflictData.sessionEnd - conflictData.sessionStart) / (60 * 1000))} minutes</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Recommended Action */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Recommended</h4>
                <p className="text-sm text-green-700">
                  Start a {optimalLength}-minute session instead
                </p>
              </div>
              <button
                onClick={handleStartShorter}
                disabled={isStarting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isStarting ? 'Starting...' : `Start ${optimalLength}m`}
              </button>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleStartAnyway}
              disabled={isStarting}
              className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {isStarting ? 'Starting...' : 'Start Anyway'}
            </button>
            
            <button
              onClick={onViewCalendar}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Calendar
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel Session
          </button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 text-center">
          💡 Tip: You can adjust notification timing in Settings → Calendar Integration
        </div>
      </div>
    </BaseModal>
  );
}