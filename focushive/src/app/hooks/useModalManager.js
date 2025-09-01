import { useState } from 'react';

export function useModalManager() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  
  const openStats = () => setIsStatsOpen(true);
  const closeStats = () => setIsStatsOpen(false);
  
  const openTaskList = () => setIsTaskListOpen(true);
  const closeTaskList = () => setIsTaskListOpen(false);
  
  const openNotes = () => setIsNotesOpen(true);
  const closeNotes = () => setIsNotesOpen(false);

  const closeAllModals = () => {
    setIsSettingsOpen(false);
    setIsStatsOpen(false);
    setIsTaskListOpen(false);
    setIsNotesOpen(false);
  };

  return {
    modals: {
      isSettingsOpen,
      isStatsOpen,
      isTaskListOpen,
      isNotesOpen
    },
    handlers: {
      openSettings,
      closeSettings,
      openStats,
      closeStats,
      openTaskList,
      closeTaskList,
      openNotes,
      closeNotes,
      closeAllModals
    }
  };
}