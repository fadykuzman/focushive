'use client';

import { useSettingsForm } from '@/app/hooks/useSettingsForm';
import { useClickOutside, useEscapeKey } from '@/app/utils/modalUtils';
import DurationInputGroup from '@/app/components/settings/DurationInputGroup';
import AutomationSection from '@/app/components/settings/AutomationSection';
import ModalButtons from '@/app/components/ModalButtons';

export default function SettingsModal({ isOpen, onClose }) {
  const {
    localDurations,
    localAutoTimerStart,
    handleDurationChange,
    handleAutoTimerStartChange,
    handleSave,
    handleCancel,
    isDirty
  } = useSettingsForm();

  const modalRef = useClickOutside(() => {
    if (isOpen) {
      handleCancel();
      onClose();
    }
  });

  useEscapeKey(() => {
    if (isOpen) {
      handleCancel();
      onClose();
    }
  });

  const onSave = () => {
    handleSave();
    onClose();
  };

  const onCancel = () => {
    handleCancel();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="settings-modal-overlay" 
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50" 
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        id="settings-modal-content" 
        data-testid="settings-modal"
        className="bg-white rounded-lg p-6 w-[480px] max-w-90vw shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="settings-modal-title" className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            id="settings-close-button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Timer Durations Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Timer Durations</h3>
            
            <DurationInputGroup
              label="Focus"
              value={localDurations.focus}
              onChange={(value) => handleDurationChange('focus', value)}
              inputId="focus-duration-input"
              focusColor="blue"
            />

            <DurationInputGroup
              label="Short Break"
              value={localDurations.shortBreak}
              onChange={(value) => handleDurationChange('shortBreak', value)}
              inputId="short-break-duration-input"
              focusColor="green"
            />

            <DurationInputGroup
              label="Long Break"
              value={localDurations.longBreak}
              onChange={(value) => handleDurationChange('longBreak', value)}
              inputId="long-break-duration-input"
              focusColor="blue"
            />
          </div>

          {/* Automation Section */}
          <AutomationSection 
            autoTimerStart={localAutoTimerStart}
            onToggle={handleAutoTimerStartChange}
          />

          {/* Save/Cancel Buttons */}
          <ModalButtons 
            onSave={onSave}
            onCancel={onCancel}
            isDirty={isDirty}
          />
        </div>
      </div>
    </div>
  );
}