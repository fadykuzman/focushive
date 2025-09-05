'use client';

import { useSettingsForm } from '@/app/hooks/useSettingsForm';
import BaseModal from '@/app/components/shared/BaseModal';
import DurationInputGroup from '@/app/components/settings/DurationInputGroup';
import AutomationSection from '@/app/components/settings/AutomationSection';
import CalendarIntegrationSection from '@/app/components/settings/CalendarIntegrationSection';
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

  const onSave = () => {
    handleSave();
    onClose();
  };

  const onCancel = () => {
    handleCancel();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      title="Settings"
      size="md"
      id="settings-modal"
    >
      <div className="space-y-6">
        {/* Calendar Integration Section */}
        <CalendarIntegrationSection />

        {/* Timer Durations Section */}
          <div className="space-y-4">
            <h3 className="text-heading-h4 text-gray-700">Timer Durations</h3>
            
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
    </BaseModal>
  );
}