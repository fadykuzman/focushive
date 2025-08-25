import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimerLogic, TIMER_MODES, DEFAULT_DURATIONS, DEFAULT_SETTINGS } from "../utils/timerLogic";

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

      startTimer: () => {
        set({ 
          isActive: true, 
          isPaused: false, 
          lastTick: Date.now() 
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
        const timeLeft = TimerLogic.getDurationForMode(currentState.mode, {
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
      },

      resetTimer: () => {
        const currentState = get();
        const timeLeft = TimerLogic.getDurationForMode(currentState.mode, {
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
      },

      tick: () => {
        const currentState = get();
        const { timeLeft, isActive, isPaused } = currentState;

        if (isActive && !isPaused && timeLeft > 0) {
          set({ 
            timeLeft: timeLeft - 1, 
            lastTick: Date.now() 
          });
        } else if (timeLeft === 0) {
          const transitionState = TimerLogic.completeTimerTransition(currentState);
          set(transitionState);
        }
      },

      restoreTimer: () => {
        const currentState = get();
        const { isActive, isPaused, lastTick, timeLeft } = currentState;

        if (isActive && !isPaused && lastTick) {
          const elapsed = TimerLogic.calculateElapsedTime(lastTick);
          const newTimeLeft = Math.max(0, timeLeft - elapsed);

          if (newTimeLeft <= 0) {
            const transitionState = TimerLogic.completeTimerTransition(currentState);
            set(transitionState);
          } else {
            set({ 
              timeLeft: newTimeLeft, 
              lastTick: Date.now() 
            });
          }
        }
      },

      completeTimer: () => {
        const currentState = get();
        const transitionState = TimerLogic.completeTimerTransition(currentState);
        set(transitionState);
      },

      switchMode: (newMode) => {
        if (!TimerLogic.validateMode(newMode)) return;
        
        const currentState = get();
        const timeLeft = TimerLogic.getDurationForMode(newMode, {
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
        if (!TimerLogic.validateDuration(newDurationInSeconds)) return;
        
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
        
        if (isActive && durationType === currentModeType) {
          const adjustedTimeLeft = TimerLogic.calculateProportionalTime(
            oldDuration, 
            newDurationInSeconds, 
            timeLeft
          );
          
          set({ 
            timeLeft: adjustedTimeLeft,
            lastTick: Date.now()
          });
        }
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
          const timeLeft = TimerLogic.getDurationForMode(currentState.mode, {
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
      }),
    }
  )
);

export default useTimerStore;
