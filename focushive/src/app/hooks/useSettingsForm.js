import { useState, useEffect } from 'react';
import { validateDurationInput, convertSecondsToMinutes, convertMinutesToSeconds } from '@/app/utils/settingsValidation';
import useTimerStore from '@/app/stores/timerStore';

export function useSettingsForm() {
  const { 
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    autoTimerStart, 
    toggleAutoTimerStart,
    updateDuration
  } = useTimerStore();
  
  const [localDurations, setLocalDurations] = useState({
    focus: convertSecondsToMinutes(focusDuration),
    shortBreak: convertSecondsToMinutes(shortBreakDuration),
    longBreak: convertSecondsToMinutes(longBreakDuration),
  });
  
  const [localAutoTimerStart, setLocalAutoTimerStart] = useState(autoTimerStart);

  // Only reset local state when the component first mounts or external values change significantly
  useEffect(() => {
    setLocalDurations({
      focus: convertSecondsToMinutes(focusDuration),
      shortBreak: convertSecondsToMinutes(shortBreakDuration),
      longBreak: convertSecondsToMinutes(longBreakDuration),
    });
  }, [focusDuration, shortBreakDuration, longBreakDuration]);

  useEffect(() => {
    setLocalAutoTimerStart(autoTimerStart);
  }, [autoTimerStart]);

  const handleDurationChange = (type, value) => {
    const validatedValue = validateDurationInput(value);
    setLocalDurations({
      ...localDurations,
      [type]: validatedValue
    });
  };

  const handleAutoTimerStartChange = (enabled) => {
    setLocalAutoTimerStart(enabled);
  };

  const handleSave = () => {
    // Apply all duration changes
    Object.entries(localDurations).forEach(([type, value]) => {
      updateDuration(type, convertMinutesToSeconds(value));
    });
    
    // Apply auto timer start change
    if (localAutoTimerStart !== autoTimerStart) {
      toggleAutoTimerStart();
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setLocalDurations({
      focus: convertSecondsToMinutes(focusDuration),
      shortBreak: convertSecondsToMinutes(shortBreakDuration),
      longBreak: convertSecondsToMinutes(longBreakDuration),
    });
    setLocalAutoTimerStart(autoTimerStart);
  };

  const isDirty = () => {
    const originalDurations = {
      focus: convertSecondsToMinutes(focusDuration),
      shortBreak: convertSecondsToMinutes(shortBreakDuration),
      longBreak: convertSecondsToMinutes(longBreakDuration),
    };
    
    return JSON.stringify(localDurations) !== JSON.stringify(originalDurations) ||
           localAutoTimerStart !== autoTimerStart;
  };

  return {
    localDurations,
    localAutoTimerStart,
    handleDurationChange,
    handleAutoTimerStartChange,
    handleSave,
    handleCancel,
    isDirty: isDirty()
  };
}