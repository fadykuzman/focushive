import { create } from "zustand";

const useTimerStore = create((set, get) => ({
  // Timer state
  timeLeft: 25 * 60, // 25 minutes in seconds
  isActive: false,
  isPaused: false,
  mode: "focus", // 'focus', 'shortBreak', 'longBreak'
  round: 1,
  totalRounds: 4,

  // Timer settings
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,

  // Timer controls
  startTimer: () => {
    set({ isActive: true, isPaused: false });
  },

  pauseTimer: () => {
    set({ isPaused: true });
  },

  resumeTimer: () => {
    set({ isPaused: false });
  },

  stopTimer: () => {
    set({
      isActive: false,
      isPaused: false,
      timeLeft: get().focusDuration,
    });
  },

  resetTimer: () => {
    const { mode, focusDuration, shortBreakDuration, longBreakDuration } =
      get();
    let newTime;
    if (mode === "focus") newTime = focusDuration;
    else if (mode === "shortBreak") newTime = shortBreakDuration;
    else newTime = longBreakDuration;

    set({
      isActive: false,
      isPaused: false,
      timeLeft: newTime,
    });
  },

  resetTimer: () => {
    const { mode, focusDuration, shortBreakDuration, longBreakDuration } =
      get();
    let newTime;
    if (mode === "focus") newTime = focusDuration;
    else if (mode === "shortBreak") newTime = shortBreakDuration;
    else newTime = longBreakDuration;

    set({
      isActive: false,
      isPaused: false,
      timeLeft: newTime,
    });
  },

  // Timer progression
  tick: () => {
    const { timeLeft, isActive, isPaused } = get();

    if (isActive && !isPaused && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (timeLeft === 0) {
      get().completeTimer();
    }
  },

  completeTimer: () => {
    const { mode, round, totalRounds } = get();

    set({ isActive: false });

    // Determine next mode
    if (mode === "focus") {
      if (round >= totalRounds) {
        // Long break after completing all rounds
        set({
          mode: "longBreak",
          timeLeft: get().longBreakTime,
          round: 1,
        });
      } else {
        // Short break
        set({
          mode: "shortBreak",
          timeLeft: get().shortBreakTime,
        });
      }
    } else {
      // Back to focus mode
      set({
        mode: "focus",
        timeLeft: get().focusTime,
        round: mode === "shortBreak" ? round + 1 : round,
      });
    }
  },

  // Mode switching
  switchMode: (newMode) => {
    const { focusTime, shortBreakTime, longBreakTime } = get();
    let newTimeLeft;

    switch (newMode) {
      case "focus":
        newTimeLeft = focusTime;
        break;
      case "shortBreak":
        newTimeLeft = shortBreakTime;
        break;
      case "longBreak":
        newTimeLeft = longBreakTime;
        break;
      default:
        newTimeLeft = focusTime;
    }

    set({
      mode: newMode,
      timeLeft: newTimeLeft,
      isActive: false,
      isPaused: false,
    });
  },

  // Settings
  updateSettings: (settings) => {
    set({
      focusTime: settings.focusTime * 60,
      shortBreakTime: settings.shortBreakTime * 60,
      longBreakTime: settings.longBreakTime * 60,
      totalRounds: settings.totalRounds,
    });

    // Update current timeLeft if not active
    if (!get().isActive) {
      get().resetTimer();
    }
  },
}));

export default useTimerStore;
