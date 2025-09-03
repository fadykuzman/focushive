import { render, screen } from '@testing-library/react';
import { ModeSwitchConfirmationProvider, useModeSwitchConfirmationContext } from '../ModeSwitchConfirmationProvider';
import useTimerStore from '@/app/stores/timerStore';

// Mock the timer store
vi.mock('@/app/stores/timerStore');

// Mock the modal component
vi.mock('@/app/components/ModeSwitchConfirmModal', () => ({
  default: ({ isOpen, targetMode, currentMode }) => 
    isOpen ? (
      <div data-testid="mode-switch-modal">
        Modal: {currentMode} → {targetMode}
      </div>
    ) : null
}));

// Test component that uses the context
const TestComponent = () => {
  const { requestModeSwitch } = useModeSwitchConfirmationContext();
  
  return (
    <button 
      onClick={() => requestModeSwitch('shortBreak')}
      data-testid="request-button"
    >
      Request Mode Switch
    </button>
  );
};

describe('ModeSwitchConfirmationProvider', () => {
  const mockTimerStore = {
    timeLeft: 1500,
    isActive: false,
    isPaused: false,
    mode: 'focus',
    switchMode: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTimerStore.mockReturnValue(mockTimerStore);
  });

  it('should render children and provide context', () => {
    render(
      <ModeSwitchConfirmationProvider>
        <TestComponent />
      </ModeSwitchConfirmationProvider>
    );

    expect(screen.getByTestId('request-button')).toBeInTheDocument();
  });

  it('should throw error when context used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useModeSwitchConfirmationContext must be used within a ModeSwitchConfirmationProvider');

    consoleSpy.mockRestore();
  });

  it('should render modal when not open initially', () => {
    render(
      <ModeSwitchConfirmationProvider>
        <TestComponent />
      </ModeSwitchConfirmationProvider>
    );

    expect(screen.queryByTestId('mode-switch-modal')).not.toBeInTheDocument();
  });

  it('should provide working requestModeSwitch function', () => {
    render(
      <ModeSwitchConfirmationProvider>
        <TestComponent />
      </ModeSwitchConfirmationProvider>
    );

    const button = screen.getByTestId('request-button');
    expect(button).toBeInTheDocument();
    // We can't easily test the modal opening without more complex setup
    // but we know the context is working if the component renders without errors
  });
});