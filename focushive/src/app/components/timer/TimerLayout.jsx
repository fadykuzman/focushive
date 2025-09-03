'use client';

import TimerDisplay from '@/app/components/TimerDisplay';
import StartButton from '@/app/components/StartButton';
import PauseButton from '@/app/components/PauseButton';
import ResetRoundsButton from '@/app/components/ResetRoundsButton';
import ModeSwitch from '@/app/components/ModeSwitch';
import FocusTaskList from '@/app/components/task-management/FocusTaskList';
import TimerControls from '@/app/components/timer/TimerControls';

export default function TimerLayout({
  mode,
  styles,
  timeLeft,
  smoothProgress,
  resetTimer,
  isActive,
  isPaused,
  round,
  totalRounds,
  resetRounds,
  focusTime,
  sessions,
  completionRate,
  currentTask,
  onStartTimer,
  pauseTimer,
  resumeTimer,
  switchMode,
  onRequestModeSwitch,
  onTaskSelect,
  linkedTaskId,
  onOpenTasks,
  onOpenStats,
  onOpenSettings
}) {
  const isFocusMode = mode === 'focus' && isActive && !isPaused;
  
  // Get mode display name
  const getModeDisplayName = (mode) => {
    switch (mode) {
      case "focus":
        return "Focus";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Focus Time";
    }
  };

  return (
    <div
      className={`min-h-screen ${styles.background} flex items-center justify-center transition-colors duration-500`}
    >
      <div className="text-center">
        <div
          className={`${styles.container} rounded-lg p-8 shadow-2xl w-full max-w-lg mx-auto relative`}
          style={{ minHeight: '600px', width: '32rem' }}
        >
          {/* Top Controls - Hide in focus mode */}
          <div style={{ minHeight: '48px' }}>
            {!isFocusMode && (
              <TimerControls
                onOpenTasks={onOpenTasks}
                onOpenStats={onOpenStats}
                onOpenSettings={onOpenSettings}
              />
            )}
          </div>

          {/* Title and Round Info - Reserve space in focus mode */}
          <div className="mb-4 mt-12 sm:mt-8" style={{ minHeight: '120px' }}>
            {!isFocusMode && (
              <>
                <h1 id="timer-mode-title" className="text-white text-heading-h1 mb-2">
                  {getModeDisplayName(mode)}
                </h1>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <p id="timer-round-display" className="text-white/80 text-body-lg font-medium">
                    Round {round} of {totalRounds}
                  </p>
                  <ResetRoundsButton
                    resetRounds={resetRounds}
                    mode={mode}
                  />
                </div>

                {/* Today's Stats Preview */}
                {focusTime > 0 && (
                  <div id="timer-stats-preview" className="text-center mb-4">
                    <div id="timer-stats-preview-text" className="text-white/60 text-body-sm">
                      Today: {Math.floor(focusTime / 60)}m focus • {sessions} sessions • {completionRate}% rate
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Timer Display - Fixed positioning */}
          <div className="flex justify-center mb-6">
            <TimerDisplay 
              timeLeft={timeLeft} 
              progress={smoothProgress} 
              resetTimer={resetTimer}
              isRunning={isActive && !isPaused}
              mode={mode}
            />
          </div>

          {/* Timer Controls - Fixed height */}
          <div id="timer-controls" className="flex gap-2 mb-6 justify-center" style={{ minHeight: '48px' }}>
            {isActive && !isPaused ? (
              <PauseButton
                pauseTimer={pauseTimer}
                mode={mode}
              />
            ) : (
              <StartButton
                startTimer={onStartTimer}
                resumeTimer={resumeTimer}
                isPaused={isPaused}
                mode={mode}
              />
            )}
          </div>

          {/* Mode Switch - Reserve space in focus mode */}
          <div id="mode-switch-container" className="mb-6" style={{ minHeight: '64px' }}>
            {!isFocusMode && (
              <ModeSwitch
                mode={mode}
                switchMode={switchMode}
                onRequestModeSwitch={onRequestModeSwitch}
              />
            )}
          </div>

          {/* Active Task Display - Under mode switch */}
          <div className="mb-6 px-4" style={{ minHeight: '60px' }}>
            {currentTask && (
              <div id="active-task-display" className="flex items-center justify-center gap-3 p-3 rounded-lg text-white" style={{ backgroundColor: '#3F88C5' }}>
                <span className="text-white font-medium">{currentTask.title}</span>
              </div>
            )}
          </div>

          {/* Mobile Focus Task List - Hide in focus mode */}
          <div className="mb-4 px-4 sm:hidden" style={{ minHeight: mode === 'focus' && !isActive ? 'auto' : '0' }}>
            {!isFocusMode && mode === 'focus' && !isActive && (
              <FocusTaskList 
                onTaskSelect={onTaskSelect}
                selectedTaskId={linkedTaskId}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}