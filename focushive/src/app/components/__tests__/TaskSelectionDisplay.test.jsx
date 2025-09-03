import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Timer from '@/app/components/Timer';
import useTimerStore from '@/app/stores/timerStore';
import useTaskStore from '@/app/stores/taskStore';

// Mock the stores
vi.mock('@/app/stores/timerStore');
vi.mock('@/app/stores/taskStore');

// Mock child components
vi.mock('@/app/components/timer/TimerLayout', () => ({
  default: ({ currentTask, mode, linkedTaskId, onTaskSelect }) => (
    <div data-testid="timer-layout">
      <div data-testid="timer-mode">{mode}</div>
      <div data-testid="linked-task-id">{linkedTaskId || 'none'}</div>
      {currentTask && (
        <div data-testid="active-task-display">
          <span data-testid="current-task-title">{currentTask.title}</span>
        </div>
      )}
      <button 
        data-testid="select-task-button" 
        onClick={() => onTaskSelect({ id: 'task-123', title: 'Test Task' })}
      >
        Select Task
      </button>
    </div>
  )
}));

describe('Task Selection and Display Integration', () => {
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
    linkedTaskId: null,
    setLinkedTask: vi.fn(),
    clearLinkedTask: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    resetTimer: vi.fn(),
    switchMode: vi.fn(),
    updateDuration: vi.fn(),
    startTimer: vi.fn(),
    tick: vi.fn(),
    restoreTimer: vi.fn(),
    completeTimer: vi.fn(),
    resetRounds: vi.fn()
  };

  const mockTaskStore = {
    tasks: [
      { id: 'task-123', title: 'Test Task', status: 'pending' },
      { id: 'task-456', title: 'Another Task', status: 'in_progress' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTimerStore.mockReturnValue(mockTimerStore);
    useTaskStore.mockReturnValue(mockTaskStore);
  });

  it('should display no task when no task is linked', () => {
    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    expect(screen.getByTestId('linked-task-id')).toHaveTextContent('none');
    expect(screen.queryByTestId('active-task-display')).not.toBeInTheDocument();
  });

  it('should display linked task when task is selected', () => {
    // Mock a linked task
    const timerStoreWithLinkedTask = {
      ...mockTimerStore,
      linkedTaskId: 'task-123'
    };
    useTimerStore.mockReturnValue(timerStoreWithLinkedTask);

    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    expect(screen.getByTestId('linked-task-id')).toHaveTextContent('task-123');
    expect(screen.getByTestId('active-task-display')).toBeInTheDocument();
    expect(screen.getByTestId('current-task-title')).toHaveTextContent('Test Task');
  });

  it('should handle task selection through handleTaskSelect', async () => {
    const user = userEvent.setup();

    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    const selectButton = screen.getByTestId('select-task-button');
    await user.click(selectButton);

    expect(mockTimerStore.setLinkedTask).toHaveBeenCalledWith('task-123');
  });

  it('should clear linked task when deselecting current task', async () => {
    const user = userEvent.setup();
    
    // Start with a linked task
    const timerStoreWithLinkedTask = {
      ...mockTimerStore,
      linkedTaskId: 'task-123'
    };
    useTimerStore.mockReturnValue(timerStoreWithLinkedTask);

    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    const selectButton = screen.getByTestId('select-task-button');
    await user.click(selectButton);

    // Should clear the task since it's already selected
    expect(mockTimerStore.clearLinkedTask).toHaveBeenCalled();
  });

  it('should handle task selection with null task (deselection)', async () => {
    const user = userEvent.setup();

    // Mock TimerLayout to test null task selection
    const MockTimerLayoutWithNull = ({ onTaskSelect }) => (
      <div>
        <button 
          data-testid="deselect-task-button" 
          onClick={() => onTaskSelect(null)}
        >
          Deselect Task
        </button>
      </div>
    );

    vi.doMock('@/app/components/timer/TimerLayout', () => ({
      default: MockTimerLayoutWithNull
    }));

    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    const deselectButton = screen.getByTestId('deselect-task-button');
    await user.click(deselectButton);

    expect(mockTimerStore.clearLinkedTask).toHaveBeenCalled();
  });

  it('should display current task from useTaskIntegration hook', () => {
    // Mock a scenario where task exists in store
    const timerStoreWithLinkedTask = {
      ...mockTimerStore,
      linkedTaskId: 'task-456'
    };
    useTimerStore.mockReturnValue(timerStoreWithLinkedTask);

    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    expect(screen.getByTestId('current-task-title')).toHaveTextContent('Another Task');
  });

  it('should handle missing task gracefully', () => {
    // Mock a scenario where linkedTaskId exists but task is not found in store
    const timerStoreWithMissingTask = {
      ...mockTimerStore,
      linkedTaskId: 'missing-task-id'
    };
    useTimerStore.mockReturnValue(timerStoreWithMissingTask);

    render(
      <Timer
        onRequestModeSwitch={vi.fn()}
        onOpenTasks={vi.fn()}
        onOpenStats={vi.fn()}
        onOpenSettings={vi.fn()}
        onOpenNotes={vi.fn()}
      />
    );

    expect(screen.getByTestId('linked-task-id')).toHaveTextContent('missing-task-id');
    expect(screen.queryByTestId('active-task-display')).not.toBeInTheDocument();
  });
});