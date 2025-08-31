import { useState, useEffect } from 'react';
import { validateDurationInput, convertSecondsToMinutes, convertMinutesToSeconds } from '../utils/settingsValidation';
import useTimerStore from '../stores/timerStore';

export function useSettingsForm(durations, onDurationChange) {
  const { autoTimerStart, toggleAutoTimerStart } = useTimerStore();
  
  const [localDurations, setLocalDurations] = useState({
    focus: convertSecondsToMinutes(durations.focus),
    shortBreak: convertSecondsToMinutes(durations.shortBreak),
    longBreak: convertSecondsToMinutes(durations.longBreak),
  });
  
  const [localAutoTimerStart, setLocalAutoTimerStart] = useState(autoTimerStart);

  // Only reset local state when the component first mounts or external values change significantly
  useEffect(() => {
    setLocalDurations({
      focus: convertSecondsToMinutes(durations.focus),
      shortBreak: convertSecondsToMinutes(durations.shortBreak),
      longBreak: convertSecondsToMinutes(durations.longBreak),
    });
  }, [durations.focus, durations.shortBreak, durations.longBreak]);

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
      onDurationChange(type, convertMinutesToSeconds(value));
    });
    
    // Apply auto timer start change
    if (localAutoTimerStart !== autoTimerStart) {
      toggleAutoTimerStart();
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setLocalDurations({
      focus: convertSecondsToMinutes(durations.focus),
      shortBreak: convertSecondsToMinutes(durations.shortBreak),
      longBreak: convertSecondsToMinutes(durations.longBreak),
    });
    setLocalAutoTimerStart(autoTimerStart);
  };

  const isDirty = () => {
    const originalDurations = {
      focus: convertSecondsToMinutes(durations.focus),
      shortBreak: convertSecondsToMinutes(durations.shortBreak),
      longBreak: convertSecondsToMinutes(durations.longBreak),
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