import { renderHook, act } from '@testing-library/react';
import { useModeSwitchConfirmation } from '../useModeSwitchConfirmation';
import useTimerStore from '@/app/stores/timerStore';

// Mock the timer store
vi.mock('@/app/stores/timerStore');

describe('useModeSwitchConfirmation', () => {
  const mockTimerStore = {
    isActive: false,
    isPaused: false,
    switchMode: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTimerStore.mockReturnValue(mockTimerStore);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useModeSwitchConfirmation());

    expect(result.current.modeSwitchConfirm).toEqual({
      isOpen: false,
      targetMode: null,
      wasAutoPaused: false
    });
  });

  it('should handle mode switch request when timer is inactive', () => {
    mockTimerStore.isActive = false;
    mockTimerStore.isPaused = false;

    const { result } = renderHook(() => useModeSwitchConfirmation());

    act(() => {
      result.current.handleModeSwitchRequest('shortBreak');
    });

    expect(mockTimerStore.pauseTimer).not.toHaveBeenCalled();
    expect(result.current.modeSwitchConfirm).toEqual({
      isOpen: true,
      targetMode: 'shortBreak',
      wasAutoPaused: false
    });
  });

  it('should auto-pause timer when mode switch requested during active session', () => {
    mockTimerStore.isActive = true;
    mockTimerStore.isPaused = false;

    const { result } = renderHook(() => useModeSwitchConfirmation());

    act(() => {
      result.current.handleModeSwitchRequest('shortBreak');
    });

    expect(mockTimerStore.pauseTimer).toHaveBeenCalledOnce();
    expect(result.current.modeSwitchConfirm).toEqual({
      isOpen: true,
      targetMode: 'shortBreak',
      wasAutoPaused: true
    });
  });

  it('should not auto-pause when timer is already paused', () => {
    mockTimerStore.isActive = true;
    mockTimerStore.isPaused = true;

    const { result } = renderHook(() => useModeSwitchConfirmation());

    act(() => {
      result.current.handleModeSwitchRequest('shortBreak');
    });

    expect(mockTimerStore.pauseTimer).not.toHaveBeenCalled();
    expect(result.current.modeSwitchConfirm.wasAutoPaused).toBe(false);
  });

  it('should switch mode on confirmation', () => {
    const { result } = renderHook(() => useModeSwitchConfirmation());

    // First open the modal
    act(() => {
      result.current.handleModeSwitchRequest('shortBreak');
    });

    // Then confirm
    act(() => {
      result.current.handleModeSwitchConfirm();
    });

    expect(mockTimerStore.switchMode).toHaveBeenCalledWith('shortBreak');
    expect(result.current.modeSwitchConfirm.isOpen).toBe(false);
  });

  it('should resume timer on cancel if auto-paused', () => {
    mockTimerStore.isActive = true;
    mockTimerStore.isPaused = false;

    const { result } = renderHook(() => useModeSwitchConfirmation());

    // Open modal (this will auto-pause)
    act(() => {
      result.current.handleModeSwitchRequest('shortBreak');
    });

    // Cancel
    act(() => {
      result.current.handleModeSwitchCancel();
    });

    expect(mockTimerStore.resumeTimer).toHaveBeenCalledOnce();
    expect(result.current.modeSwitchConfirm.isOpen).toBe(false);
  });

  it('should not resume timer on cancel if not auto-paused', () => {
    mockTimerStore.isActive = false;
    mockTimerStore.isPaused = false;

    const { result } = renderHook(() => useModeSwitchConfirmation());

    // Open modal (this will NOT auto-pause)
    act(() => {
      result.current.handleModeSwitchRequest('shortBreak');
    });

    // Cancel
    act(() => {
      result.current.handleModeSwitchCancel();
    });

    expect(mockTimerStore.resumeTimer).not.toHaveBeenCalled();
    expect(result.current.modeSwitchConfirm.isOpen).toBe(false);
  });
});