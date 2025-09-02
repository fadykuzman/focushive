import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  getDurationForMode, 
  calculateProportionalTime, 
  completeTimerTransition, 
  validateMode, 
  validateDuration,
  DEFAULT_DURATIONS, 
  DEFAULT_SETTINGS 
} from '@/app/utils/timer';
import { soundAlert } from '@/app/utils/soundAlerts';
import { browserNotifications } from '@/app/utils/notifications';
import { sessionRecorder } from '@/app/services/sessionRecorder';

const useTimerStore = create(
  persist(
    (set, get) => ({
      timeLeft: DEFAULT_DURATIONS.FOCUS,
      isActive: false,
      isPaused: false,
      mode: "focus",
      round: 1,
      totalRounds: DEFAULT_SETTINGS.TOTAL_ROUNDS,
      lastTick: null,
      focusDuration: DEFAULT_DURATIONS.FOCUS,
      shortBreakDuration: DEFAULT_DURATIONS.SHORT_BREAK,
      longBreakDuration: DEFAULT_DURATIONS.LONG_BREAK,
      autoTimerStart: false,
      linkedTaskId: null,

      startTimer: (taskId = null) => {
        browserNotifications.requestPermission();
        const currentState = get();
        const plannedDuration = getDurationForMode(currentState.mode, {
          focusDuration: currentState.focusDuration,
          shortBreakDuration: currentState.shortBreakDuration,
          longBreakDuration: currentState.longBreakDuration
        });
        
        sessionRecorder.startSession(currentState.mode, plannedDuration, currentState.round, taskId);
        
        set({ 
          isActive: true, 
          isPaused: false, 
          lastTick: Date.now(),
          linkedTaskId: taskId
        });
      },

      pauseTimer: () => {
        set({ isPaused: true });
      },

      resumeTimer: () => {
        set({ 
          isPaused: false, 
          lastTick: Date.now() 
        });
      },

      stopTimer: () => {
        const currentState = get();
        
        if (sessionRecorder.isSessionActive()) {
          sessionRecorder.interruptSession('manual_stop');
        }
        
        const timeLeft = getDurationForMode(currentState.mode, {
          focusDuration: currentState.focusDuration,
          shortBreakDuration: currentState.shortBreakDuration,
          longBreakDuration: currentState.longBreakDuration
        });
        
        set({
          isActive: false,
          isPaused: false,
          timeLeft,
          lastTick: null,
          linkedTaskId: null,
        });
      },

      resetTimer: () => {
        const currentState = get();
        
        if (sessionRecorder.isSessionActive()) {
          sessionRecorder.interruptSession('manual_reset');
        }
        
        const timeLeft = getDurationForMode(currentState.mode, {
          focusDuration: currentState.focusDuration,
          shortBreakDuration: currentState.shortBreakDuration,
          longBreakDuration: currentState.longBreakDuration
        });

        set({
          isActive: false,
          isPaused: false,
          timeLeft,
          lastTick: null,
          linkedTaskId: null,
        });
      },

      tick: () => {
        const currentState = get();
        const { timeLeft, isActive, isPaused, mode } = currentState;

        if (isActive && !isPaused && timeLeft > 0) {
          set({ 
            timeLeft: timeLeft - 1, 
            lastTick: Date.now() 
          });
        } else if (timeLeft === 0) {
          soundAlert.playModeAlert(mode);
          browserNotifications.showNotification(mode);
          const transitionState = completeTimerTransition(currentState);
          set(transitionState);
        }
      },

      // restoreTimer: () => {
      //   const currentState = get();
      //   const restorationResult = TimerLogic.restoreTimer(currentState);
      //   if (restorationResult) {
      //     set(restorationResult);
      //   }
      // },

      completeTimer: () => {
        const currentState = get();
        
        if (sessionRecorder.isSessionActive()) {
          sessionRecorder.endSession(true);
        }
        
        soundAlert.playModeAlert(currentState.mode);
        browserNotifications.showNotification(currentState.mode);
        const transitionState = completeTimerTransition(currentState);
        
        if (transitionState.isActive && sessionRecorder) {
          const plannedDuration = getDurationForMode(transitionState.mode, {
            focusDuration: currentState.focusDuration,
            shortBreakDuration: currentState.shortBreakDuration,
            longBreakDuration: currentState.longBreakDuration
          });
          const taskIdForNextSession = transitionState.mode === 'focus' ? currentState.linkedTaskId : null;
          sessionRecorder.startSession(transitionState.mode, plannedDuration, transitionState.round, taskIdForNextSession);
          transitionState.linkedTaskId = taskIdForNextSession;
        }
        
        set(transitionState);
      },

      switchMode: (newMode) => {
        if (!validateMode(newMode)) return;
        
        const currentState = get();
        
        if (sessionRecorder.isSessionActive()) {
          sessionRecorder.interruptSession('manual_mode_switch');
        }
        
        const timeLeft = getDurationForMode(newMode, {
          focusDuration: currentState.focusDuration,
          shortBreakDuration: currentState.shortBreakDuration,
          longBreakDuration: currentState.longBreakDuration
        });

        set({
          mode: newMode,
          timeLeft,
          isActive: false,
          isPaused: false,
          lastTick: null
        });
      },

      updateDuration: (durationType, newDurationInSeconds) => {
        if (!validateDuration(newDurationInSeconds)) return;
        
        const currentState = get();
        const { mode, timeLeft, isActive } = currentState;
        
        const durationMap = {
          focus: 'focusDuration',
          shortBreak: 'shortBreakDuration', 
          longBreak: 'longBreakDuration'
        };
        
        const storeProperty = durationMap[durationType];
        if (!storeProperty) return;
        
        const oldDuration = currentState[storeProperty];
        
        set({ [storeProperty]: newDurationInSeconds });
        
        const currentModeType = mode === 'focus' ? 'focus' : 
                               mode === 'shortBreak' ? 'shortBreak' : 'longBreak';
        
        if (durationType === currentModeType) {
          if (isActive) {
            const adjustedTimeLeft = calculateProportionalTime(
              oldDuration, 
              newDurationInSeconds, 
              timeLeft
            );
            
            set({ 
              timeLeft: adjustedTimeLeft,
              lastTick: Date.now()
            });
          } else {
            set({ 
              timeLeft: newDurationInSeconds
            });
          }
        }
      },

      resetRounds: () => {
        const currentState = get();
        const timeLeft = getDurationForMode('focus', {
          focusDuration: currentState.focusDuration,
          shortBreakDuration: currentState.shortBreakDuration,
          longBreakDuration: currentState.longBreakDuration
        });
        
        set({
          round: 1,
          mode: 'focus',
          timeLeft,
          isActive: false,
          isPaused: false,
          lastTick: null,
        });
      },

      updateSettings: (settings) => {
        set({
          focusDuration: settings.focusTime * 60,
          shortBreakDuration: settings.shortBreakTime * 60,
          longBreakDuration: settings.longBreakTime * 60,
          totalRounds: settings.totalRounds,
        });

        const currentState = get();
        if (!currentState.isActive) {
          const timeLeft = getDurationForMode(currentState.mode, {
            focusDuration: currentState.focusDuration,
            shortBreakDuration: currentState.shortBreakDuration,
            longBreakDuration: currentState.longBreakDuration
          });
          
          set({
            isActive: false,
            isPaused: false,
            timeLeft,
            lastTick: null,
          });
        }
      },

      toggleAutoTimerStart: () => {
        const currentState = get();
        set({ autoTimerStart: !currentState.autoTimerStart });
      },

      setLinkedTask: (taskId) => {
        set({ linkedTaskId: taskId });
      },

      clearLinkedTask: () => {
        set({ linkedTaskId: null });
      }
    }),
    {
      name: "focushive-timer",
      partialize: (state) => ({
        timeLeft: state.timeLeft,
        isActive: state.isActive,
        isPaused: state.isPaused,
        mode: state.mode,
        round: state.round,
        totalRounds: state.totalRounds,
        lastTick: state.lastTick,
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        autoTimerStart: state.autoTimerStart,
        linkedTaskId: state.linkedTaskId,
      }),
    }
  )
);

export default useTimerStore;
