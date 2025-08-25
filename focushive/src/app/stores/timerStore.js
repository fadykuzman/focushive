import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTimerStore = create(
  persist(
    (set, get) => ({
      // Timer state
      timeLeft: 25 * 60, // 25 minutes in seconds
      isActive: false,
      isPaused: false,
      mode: "focus", 
      round: 1,
      totalRounds: 4,
      lastTick: null, // Track when timer was last updated

      // Timer settings
      focusDuration: 25 * 60,
      // shortBreakDuration: 5 * 60,
      // longBreakDuration: 15 * 60,

      // Timer controls
      startTimer: () => {
        set({ isActive: true, isPaused: false, lastTick: Date.now() });
      },

      pauseTimer: () => {
        set({ isPaused: true });
      },

      resumeTimer: () => {
        set({ isPaused: false, lastTick: Date.now() });
      },

      stopTimer: () => {
        set({
          isActive: false,
          isPaused: false,
          timeLeft: get().focusDuration,
          lastTick: null,
        });
      },

      resetTimer: () => {
        const { mode, focusDuration, shortBreakDuration, longBreakDuration } =
          get();
        let newTime;
        newTime = focusDuration;
        // if (mode === "focus") newTime = focusDuration;
        // else if (mode === "shortBreak") newTime = shortBreakDuration;
        // else newTime = longBreakDuration;

        set({
          isActive: false,
          isPaused: false,
          timeLeft: newTime,
          lastTick: null,
        });
      },

      // Timer progression
      tick: () => {
        const { timeLeft, isActive, isPaused } = get();

        if (isActive && !isPaused && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1, lastTick: Date.now() });
        } else if (timeLeft === 0) {
          get().completeTimer();
        }
      },

      // Restore timer after page reload
      restoreTimer: () => {
        const state = get();
        const { isActive, isPaused, lastTick, timeLeft } = state;

        if (isActive && !isPaused && lastTick) {
          const now = Date.now();
          const elapsed = Math.floor((now - lastTick) / 1000);
          const newTimeLeft = Math.max(0, timeLeft - elapsed);

          if (newTimeLeft <= 0) {
            get().completeTimer();
          } else {
            set({ timeLeft: newTimeLeft, lastTick: now });
          }
        }
      },

      completeTimer: () => {
        const { mode, round, totalRounds } = get();

        set({ isActive: false });

        set({
          mode: "focus",
          timeLeft: get().focusTime,
          // round: mode === "shortBreak" ? round + 1 : round,
          round: round + 1 ,
        });

        // 	if (round >= totalRounds) {
        // 		// Long break after completing all rounds
        // 		set({
        // 			mode: "longBreak",
        // 			timeLeft: get().longBreakTime,
        // 			round: 1,
        // 		});
        // 	} else {
        // 		// Short break
        // 		set({
        // 			mode: "shortBreak",
        // 			timeLeft: get().shortBreakTime,
        // 		});
        // 	}
        // } else {
        // 	// Back to focus mode
        // 	set({
        // 		mode: "focus",
        // 		timeLeft: get().focusTime,
        // 		round: mode === "shortBreak" ? round + 1 : round,
        // 	});
        // }
      },

      // Mode switching
      switchMode: (newMode) => {
        const { focusTime, shortBreakTime, longBreakTime } = get();
        let newTimeLeft;

        newTimeLeft = focusTime;

        // switch (newMode) {
        // 	case "focus":
        // 		newTimeLeft = focusTime;
        // 		break;
        // 	case "shortBreak":
        // 		newTimeLeft = shortBreakTime;
        // 		break;
        // 	case "longBreak":
        // 		newTimeLeft = longBreakTime;
        // 		break;
        // 	default:
        // 		newTimeLeft = focusTime;
        // }

        set({
          // mode: newMode,
		  mode: "focus",
          timeLeft: newTimeLeft,
          isActive: false,
          isPaused: false,
        });
      },

      // Settings
      updateSettings: (settings) => {
        set({
          focusTime: settings.focusTime * 60,
          // shortBreakTime: settings.shortBreakTime * 60,
          // longBreakTime: settings.longBreakTime * 60,
          totalRounds: settings.totalRounds,
        });

        // Update current timeLeft if not active
        if (!get().isActive) {
          get().resetTimer();
        }
      },
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
        // shortBreakDuration: state.shortBreakDuration,
        // longBreakDuration: state.longBreakDuration,
      }),
    },
  ),
);

export default useTimerStore;
