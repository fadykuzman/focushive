import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSettingsForm } from '../useSettingsForm';

// Mock the timer store
const mockTimerStore = {
  autoTimerStart: false,
  toggleAutoTimerStart: vi.fn()
};

vi.mock('../../stores/timerStore', () => ({
  default: () => mockTimerStore
}));

describe('useSettingsForm Hook', () => {
  const mockDurations = {
    focus: 1500,      // 25 minutes
    shortBreak: 300,  // 5 minutes
    longBreak: 900    // 15 minutes
  };
  const mockOnDurationChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTimerStore.autoTimerStart = false;
  });

  describe('Initial State', () => {
    it('should initialize with correct duration values in minutes', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      expect(result.current.localDurations).toEqual({
        focus: 25,
        shortBreak: 5,
        longBreak: 15
      });
    });

    it('should initialize with correct autoTimerStart value', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      expect(result.current.localAutoTimerStart).toBe(false);
    });

    it('should not be dirty initially', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('Duration Changes', () => {
    it('should update local duration state', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      act(() => {
        result.current.handleDurationChange('focus', '30');
      });
      
      expect(result.current.localDurations.focus).toBe(30);
      expect(result.current.isDirty).toBe(true);
    });

    it('should validate minimum values', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      act(() => {
        result.current.handleDurationChange('focus', '0');
      });
      
      expect(result.current.localDurations.focus).toBe(1);
    });

    it('should validate maximum values', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      act(() => {
        result.current.handleDurationChange('focus', '150');
      });
      
      expect(result.current.localDurations.focus).toBe(120);
    });
  });

  describe('Auto Timer Start Changes', () => {
    it('should update local auto timer start state', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      act(() => {
        result.current.handleAutoTimerStartChange(true);
      });
      
      expect(result.current.localAutoTimerStart).toBe(true);
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('Save and Cancel', () => {
    it('should save duration changes correctly', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      // First verify we can change values
      act(() => {
        result.current.handleDurationChange('focus', '30');
      });
      
      expect(result.current.localDurations.focus).toBe(30);
      
      act(() => {
        result.current.handleSave();
      });
      
      expect(mockOnDurationChange).toHaveBeenCalledWith('focus', 1800); // 30 * 60
    });

    it('should call toggleAutoTimerStart when auto timer setting changed', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      act(() => {
        result.current.handleAutoTimerStartChange(true);
      });
      
      act(() => {
        result.current.handleSave();
      });
      
      expect(mockTimerStore.toggleAutoTimerStart).toHaveBeenCalledOnce();
    });

    it('should reset to original values when cancelling', () => {
      const { result } = renderHook(() => 
        useSettingsForm(mockDurations, mockOnDurationChange)
      );
      
      act(() => {
        result.current.handleDurationChange('focus', '30');
        result.current.handleAutoTimerStartChange(true);
      });
      
      act(() => {
        result.current.handleCancel();
      });
      
      expect(result.current.localDurations.focus).toBe(25);
      expect(result.current.localAutoTimerStart).toBe(false);
      expect(result.current.isDirty).toBe(false);
    });
  });
});