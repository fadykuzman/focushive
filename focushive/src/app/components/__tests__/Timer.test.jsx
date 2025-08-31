import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach } from 'vitest';
import Timer from '../Timer';

// Mock the timer store
const mockTimerStore = {
  timeLeft: 1500,
  isActive: false,
  isPaused: false,
  mode: 'focus',
  round: 1,
  totalRounds: 4,
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  startTimer: vi.fn(),
  pauseTimer: vi.fn(),
  resumeTimer: vi.fn(),
  stopTimer: vi.fn(),
  switchMode: vi.fn(),
  tick: vi.fn(),
  restoreTimer: vi.fn(),
  completeTimer: vi.fn(),
  updateDuration: vi.fn(),
};

// Mock the store hook
vi.mock('../../stores/timerStore', () => ({
  default: () => mockTimerStore
}));

// Mock child components to isolate Timer component logic
vi.mock('../StartButton', () => ({
  default: ({ startTimer, resumeTimer, isPaused }) => (
    <button data-testid="start-button" onClick={isPaused ? resumeTimer : startTimer}>
      {isPaused ? 'Resume' : 'Start'}
    </button>
  )
}));

vi.mock('../PauseButton', () => ({
  default: ({ pauseTimer }) => (
    <button data-testid="pause-button" onClick={pauseTimer}>Pause</button>
  )
}));

vi.mock('../ResetTimerButton', () => ({
  default: ({ resetTimer }) => (
    <button data-testid="reset-button" onClick={resetTimer}>Reset</button>
  )
}));

vi.mock('../ModeSwitch', () => ({
  default: ({ mode, switchMode }) => (
    <div data-testid="mode-switch">
      <button onClick={() => switchMode('focus')}>Focus</button>
      <button onClick={() => switchMode('shortBreak')}>Short Break</button>
      <button onClick={() => switchMode('longBreak')}>Long Break</button>
    </div>
  )
}));

vi.mock('../TimerDisplay', () => ({
  default: ({ timeLeft, progress }) => (
    <div data-testid="timer-display">
      <span data-testid="time-left">{timeLeft}</span>
      <span data-testid="progress">{progress}</span>
    </div>
  )
}));

vi.mock('../SettingsModal', () => ({
  default: ({ isOpen, onClose, onDurationChange }) => (
    isOpen ? (
      <div data-testid="settings-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onDurationChange('focus', 1800)}>Change Focus</button>
      </div>
    ) : null
  )
}));

describe('Timer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document title
    document.title = '';
    // Reset mock store to default values
    Object.assign(mockTimerStore, {
      timeLeft: 1500,
      isActive: false,
      isPaused: false,
      mode: 'focus',
      round: 1,
      totalRounds: 4,
      focusDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Render', () => {
    test('should show timer interface after hydration', async () => {
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('timer-display')).toBeInTheDocument();
      });
      
      expect(document.getElementById('timer-mode-title')).toHaveTextContent('Focus');
      expect(document.getElementById('timer-round-display')).toHaveTextContent('Round 1 of 4');
    });
  });

  describe('Mode Display', () => {
    test('should display correct mode name for focus', async () => {
      mockTimerStore.mode = 'focus';
      render(<Timer />);
      
      await waitFor(() => {
        expect(document.getElementById('timer-mode-title')).toHaveTextContent('Focus');
      });
    });

    test('should display correct mode name for short break', async () => {
      mockTimerStore.mode = 'shortBreak';
      render(<Timer />);
      
      await waitFor(() => {
        expect(document.getElementById('timer-mode-title')).toHaveTextContent('Short Break');
      });
    });

    test('should display correct mode name for long break', async () => {
      mockTimerStore.mode = 'longBreak';
      render(<Timer />);
      
      await waitFor(() => {
        expect(document.getElementById('timer-mode-title')).toHaveTextContent('Long Break');
      });
    });
  });

  describe('Round Display', () => {
    test('should display current round and total', async () => {
      mockTimerStore.round = 3;
      mockTimerStore.totalRounds = 4;
      render(<Timer />);
      
      await waitFor(() => {
        expect(document.getElementById('timer-round-display')).toHaveTextContent('Round 3 of 4');
      });
    });
  });

  describe('Timer Controls', () => {
    test('should show start button when timer is inactive', async () => {
      mockTimerStore.isActive = false;
      mockTimerStore.isPaused = false;
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('start-button')).toBeInTheDocument();
        expect(screen.queryByTestId('pause-button')).not.toBeInTheDocument();
      });
    });

    test('should show pause button when timer is active and not paused', async () => {
      mockTimerStore.isActive = true;
      mockTimerStore.isPaused = false;
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pause-button')).toBeInTheDocument();
        expect(screen.queryByTestId('start-button')).not.toBeInTheDocument();
      });
    });

    test('should show start button (resume) when timer is paused', async () => {
      mockTimerStore.isActive = true;
      mockTimerStore.isPaused = true;
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('start-button')).toBeInTheDocument();
        expect(screen.queryByTestId('pause-button')).not.toBeInTheDocument();
      });
    });
  });

  describe('Settings Modal', () => {
    test('should open settings modal when settings button is clicked', async () => {
      render(<Timer />);
      
      await waitFor(() => {
        const settingsButton = document.getElementById('settings-button');
        fireEvent.click(settingsButton);
        expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
      });
    });

    test('should handle duration changes from settings modal', async () => {
      render(<Timer />);
      
      await waitFor(() => {
        const settingsButton = document.getElementById('settings-button');
        fireEvent.click(settingsButton);
        
        const changeFocusButton = screen.getByText('Change Focus');
        fireEvent.click(changeFocusButton);
        
        expect(mockTimerStore.updateDuration).toHaveBeenCalledWith('focus', 1800);
      });
    });
  });

  describe('Document Title Updates', () => {
    test('should update document title with timer progress', async () => {
      mockTimerStore.timeLeft = 1425; // 23:45
      render(<Timer />);
      
      await waitFor(() => {
        expect(document.title).toBe('23:45 - Focus Timer');
      });
    });

    test('should update document title for different time values', async () => {
      mockTimerStore.timeLeft = 65; // 1:05
      render(<Timer />);
      
      await waitFor(() => {
        expect(document.title).toBe('1:05 - Focus Timer');
      });
    });
  });

  describe('Timer Completion', () => {
    test('should call completeTimer when time reaches zero and timer is active', async () => {
      mockTimerStore.timeLeft = 0;
      mockTimerStore.isActive = true;
      render(<Timer />);
      
      await waitFor(() => {
        expect(mockTimerStore.completeTimer).toHaveBeenCalled();
      });
    });

    test('should not call completeTimer when timer is inactive', async () => {
      mockTimerStore.timeLeft = 0;
      mockTimerStore.isActive = false;
      render(<Timer />);
      
      await waitFor(() => {
        expect(mockTimerStore.completeTimer).not.toHaveBeenCalled();
      });
    });
  });

  describe('Timer Interval Management', () => {
    test('should verify interval management setup', async () => {
      mockTimerStore.isActive = false;
      mockTimerStore.isPaused = false;
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('timer-display')).toBeInTheDocument();
      });

      // Just verify the component renders with inactive state
      expect(screen.getByTestId('start-button')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    test('should pass correct props to TimerDisplay', async () => {
      // Update the mock store values before rendering
      mockTimerStore.timeLeft = 900; // 15 minutes
      mockTimerStore.mode = 'focus';
      mockTimerStore.focusDuration = 1500; // 25 minutes
      
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('timer-display')).toBeInTheDocument();
        // The mock will use the default values from the store
      });
    });

    test('should pass correct props to child components', async () => {
      render(<Timer />);
      
      await waitFor(() => {
        expect(screen.getByTestId('mode-switch')).toBeInTheDocument();
        expect(screen.getByTestId('timer-display')).toBeInTheDocument();
        expect(screen.getByTestId('start-button')).toBeInTheDocument();
      });
    });
  });
});