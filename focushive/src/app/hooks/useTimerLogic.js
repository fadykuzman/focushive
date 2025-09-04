import { useEffect } from "react";
import useTimerStore from "@/app/stores/timerStore";
import { useTodayStats } from "@/app/hooks/useSessionStats";
import { useTimerEffects } from "@/app/hooks/useTimerEffects";
import { useTaskIntegration } from "@/app/hooks/useTaskIntegration";
import { getDurationForMode } from "@/app/utils/timer";

export function useTimerLogic(onRequestModeSwitch) {
  const {
    timeLeft,
    isActive,
    isPaused,
    mode,
    round,
    totalRounds,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    linkedTaskId,
    pauseTimer,
    resumeTimer,
    resetTimer,
    switchMode,
    updateDuration,
    setLinkedTask,
    clearLinkedTask,
    startTimer,
    tick,
    restoreTimer,
    completeTimer,
    resetRounds,
  } = useTimerStore();

  const { focusTime, sessions, completionRate } = useTodayStats();
  const { smoothProgress } = useTimerEffects({
    timeLeft,
    isActive,
    isPaused,
    mode,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    tick,
    completeTimer
  });

  const { currentTask, handleTaskSelect, handleStartTimer } = useTaskIntegration(
    linkedTaskId,
    setLinkedTask,
    clearLinkedTask,
    startTimer
  );

  // Restore timer on component mount
  useEffect(() => {
    // restoreTimer(); // Currently commented out in original
  }, [restoreTimer]);

  // Handle duration changes
  const handleDurationChange = (durationType, newDurationInSeconds) => {
    updateDuration(durationType, newDurationInSeconds);
  };

  // Check if mode switch needs confirmation
  const needsConfirmation = (targetMode) => {
    if (targetMode === mode) return false;
    
    const originalDuration = getDurationForMode(mode, {
      focusDuration,
      shortBreakDuration,
      longBreakDuration
    });
    
    const hasProgress = timeLeft < originalDuration;
    const isRunning = isActive && !isPaused;
    const isPausedWithProgress = isPaused && hasProgress;
    
    return isRunning || isPausedWithProgress;
  };

  // Handle mode switch request internally
  const handleModeSwitch = (targetMode) => {
    if (needsConfirmation(targetMode)) {
      onRequestModeSwitch(targetMode);
    } else {
      switchMode(targetMode);
    }
  };

  // Get style classes based on mode
  const getStyleClasses = (currentMode) => {
    switch (currentMode) {
      case "focus":
        return {
          background: "bg-focus-500",
          container: "bg-focus-600"
        };
      case "shortBreak":
        return {
          background: "bg-break-500", 
          container: "bg-break-600"
        };
      case "longBreak":
        return {
          background: "bg-longbreak-500",
          container: "bg-longbreak-600" 
        };
      default:
        return {
          background: "bg-danger-500",
          container: "bg-danger-600"
        };
    }
  };

  return {
    // Timer state
    timeLeft,
    isActive,
    isPaused,
    mode,
    round,
    totalRounds,
    smoothProgress,
    
    // Stats
    focusTime,
    sessions,
    completionRate,
    
    // Task integration
    currentTask,
    linkedTaskId,
    
    // Duration config
    durationsConfig: {
      focus: focusDuration,
      shortBreak: shortBreakDuration,
      longBreak: longBreakDuration,
    },
    
    // Actions
    pauseTimer,
    resumeTimer,
    resetTimer,
    resetRounds,
    handleStartTimer,
    handleTaskSelect,
    handleModeSwitch,
    handleDurationChange,
    
    // Styling
    styles: getStyleClasses(mode)
  };
}