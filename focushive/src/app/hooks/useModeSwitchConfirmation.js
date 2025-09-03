import { useState } from 'react';
import useTimerStore from '@/app/stores/timerStore';

/**
 * Custom hook to handle mode switch confirmation logic
 * Manages the confirmation modal state and auto-pause/resume functionality
 */
export const useModeSwitchConfirmation = () => {
  const [modeSwitchConfirm, setModeSwitchConfirm] = useState({ 
    isOpen: false, 
    targetMode: null,
    wasAutoPaused: false
  });

  const {
    isActive,
    isPaused,
    switchMode,
    pauseTimer,
    resumeTimer
  } = useTimerStore();

  // Handle mode switch request from Timer component
  const handleModeSwitchRequest = (targetMode) => {
    // Check if timer is currently running (not paused) and auto-pause it
    const shouldAutoPause = isActive && !isPaused;
    
    if (shouldAutoPause) {
      pauseTimer();
    }
    
    setModeSwitchConfirm({
      isOpen: true,
      targetMode: targetMode,
      wasAutoPaused: shouldAutoPause
    });
  };

  // Handle mode switch confirmation
  const handleModeSwitchConfirm = () => {
    if (modeSwitchConfirm.targetMode) {
      switchMode(modeSwitchConfirm.targetMode);
    }
    // Don't resume timer - user is switching modes anyway
    setModeSwitchConfirm({ isOpen: false, targetMode: null, wasAutoPaused: false });
  };

  // Handle mode switch cancellation
  const handleModeSwitchCancel = () => {
    // Resume timer only if we auto-paused it
    if (modeSwitchConfirm.wasAutoPaused) {
      resumeTimer();
    }
    
    setModeSwitchConfirm({ isOpen: false, targetMode: null, wasAutoPaused: false });
  };

  return {
    // State
    modeSwitchConfirm,
    
    // Handlers
    handleModeSwitchRequest,
    handleModeSwitchConfirm,
    handleModeSwitchCancel
  };
};