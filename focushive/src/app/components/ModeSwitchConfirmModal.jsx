'use client';

import BaseModal from '@/app/components/shared/BaseModal';

export default function ModeSwitchConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  targetMode, 
  currentMode,
  timeLeft,
  isActive,
  isPaused 
}) {

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeDisplayName = (mode) => {
    switch (mode) {
      case 'focus':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return mode;
    }
  };

  const getCurrentStateMessage = () => {
    if (isActive && !isPaused) {
      return `You have ${formatTime(timeLeft)} remaining in your ${getModeDisplayName(currentMode).toLowerCase()} session.`;
    } else if (isPaused && timeLeft > 0) {
      return `You have ${formatTime(timeLeft)} remaining in your paused ${getModeDisplayName(currentMode).toLowerCase()} session.`;
    } else if (!isActive && timeLeft > 0) {
      return `You have ${formatTime(timeLeft)} remaining in your ${getModeDisplayName(currentMode).toLowerCase()} session.`;
    }
    return '';
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      title="Switch Mode?"
      size="auto"
      id="mode-switch-modal"
    >
      <div className="mb-6">
          <p className="text-gray-600 mb-3">
            {getCurrentStateMessage()}
          </p>
          <p className="text-gray-800 font-medium">
            Are you sure you want to switch to <span className="font-bold">{getModeDisplayName(targetMode)}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will reset your current progress and start fresh with the new mode.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            id="mode-switch-cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-warning-500 text-white rounded-lg hover:bg-warning-600 transition-colors font-medium"
            id="mode-switch-confirm"
          >
            Switch Mode
          </button>
      </div>
    </BaseModal>
  );
}