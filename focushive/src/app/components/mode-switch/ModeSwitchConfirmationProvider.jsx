'use client';

import React, { createContext, useContext } from 'react';
import { useModeSwitchConfirmation } from '@/app/hooks/useModeSwitchConfirmation';
import ModeSwitchConfirmModal from '@/app/components/ModeSwitchConfirmModal';
import useTimerStore from '@/app/stores/timerStore';

// Create context for mode switch confirmation
const ModeSwitchConfirmationContext = createContext();

/**
 * Provider component that combines mode switch confirmation logic with modal rendering
 * Provides a clean interface for other components to trigger mode switch confirmations
 */
export const ModeSwitchConfirmationProvider = ({ children }) => {
  const { 
    modeSwitchConfirm, 
    handleModeSwitchRequest, 
    handleModeSwitchConfirm, 
    handleModeSwitchCancel 
  } = useModeSwitchConfirmation();

  const {
    timeLeft,
    isActive,
    isPaused,
    mode
  } = useTimerStore();

  const contextValue = {
    requestModeSwitch: handleModeSwitchRequest
  };

  return (
    <ModeSwitchConfirmationContext.Provider value={contextValue}>
      {children}
      
      {/* Mode Switch Confirmation Modal */}
      <ModeSwitchConfirmModal
        isOpen={modeSwitchConfirm.isOpen}
        onConfirm={handleModeSwitchConfirm}
        onCancel={handleModeSwitchCancel}
        targetMode={modeSwitchConfirm.targetMode}
        currentMode={mode}
        timeLeft={timeLeft}
        isActive={isActive}
        isPaused={isPaused}
      />
    </ModeSwitchConfirmationContext.Provider>
  );
};

/**
 * Hook to access mode switch confirmation functionality
 */
export const useModeSwitchConfirmationContext = () => {
  const context = useContext(ModeSwitchConfirmationContext);
  if (!context) {
    throw new Error('useModeSwitchConfirmationContext must be used within a ModeSwitchConfirmationProvider');
  }
  return context;
};