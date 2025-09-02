import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the session database
vi.mock('../../utils/sessionDatabase', () => ({
  sessionDatabase: {
    getAllSessions: vi.fn()
  }
}));

// Mock StatisticsCalculator
vi.mock('../../utils/statisticsCalculator', () => ({
  StatisticsCalculator: {
    calculateDailyStats: vi.fn(),
    calculateWeeklyStats: vi.fn(),
    calculateMonthlyStats: vi.fn(),
    calculateStreaks: vi.fn(),
    calculateOverallStats: vi.fn(),
    calculateProductivityTrends: vi.fn(),
    formatDuration: vi.fn((seconds) => `${Math.floor(seconds / 60)}m`),
    formatTime: vi.fn((seconds) => `${Math.floor(seconds / 60)}:${seconds % 60}`)
  }
}));

import { useSessionStats, useTodayStats } from '../useSessionStats';
import { sessionDatabase } from '@/app/utils/sessionDatabase';
import { StatisticsCalculator } from '@/app/utils/statisticsCalculator';

describe('useSessionStats', () => {
  const mockSessions = [
    {
      id: '1',
      type: 'focus',
      startTime: new Date('2025-08-31T10:00:00Z'),
      actualDuration: 1500,
      completed: true,
      date: '2025-08-31'
    }
  ];

  const mockStats = {
    daily: { totalSessions: 1, totalFocusTime: 1500, completionRate: 100 },
    weekly: { totalWeeklySessions: 2, totalWeeklyFocusTime: 3000 },
    monthly: { totalSessions: 5, totalFocusTime: 7500 },
    streaks: { currentStreak: 3, longestStreak: 5 },
    overall: { totalSessions: 10, totalFocusTime: 15000 },
    trends: [{ date: '2025-08-31', focusTime: 1500, sessions: 1 }]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    sessionDatabase.getAllSessions.mockResolvedValue(mockSessions);
    StatisticsCalculator.calculateDailyStats.mockReturnValue(mockStats.daily);
    StatisticsCalculator.calculateWeeklyStats.mockReturnValue(mockStats.weekly);
    StatisticsCalculator.calculateMonthlyStats.mockReturnValue(mockStats.monthly);
    StatisticsCalculator.calculateStreaks.mockReturnValue(mockStats.streaks);
    StatisticsCalculator.calculateOverallStats.mockReturnValue(mockStats.overall);
    StatisticsCalculator.calculateProductivityTrends.mockReturnValue(mockStats.trends);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useSessionStats());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should load and calculate statistics', async () => {
    const { result } = renderHook(() => useSessionStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.daily).toEqual(mockStats.daily);
    expect(result.current.weekly).toEqual(mockStats.weekly);
    expect(result.current.monthly).toEqual(mockStats.monthly);
    expect(result.current.streaks).toEqual(mockStats.streaks);
    expect(result.current.overall).toEqual(mockStats.overall);
    expect(result.current.trends).toEqual(mockStats.trends);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    sessionDatabase.getAllSessions.mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => useSessionStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load statistics');
    expect(result.current.daily).toBeNull();
  });

  it('should provide refresh functionality', async () => {
    const { result } = renderHook(() => useSessionStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear previous calls
    vi.clearAllMocks();
    sessionDatabase.getAllSessions.mockResolvedValue(mockSessions);

    // Trigger refresh
    result.current.refreshStats();

    await waitFor(() => {
      expect(sessionDatabase.getAllSessions).toHaveBeenCalled();
    });
  });

  it('should provide utility functions', async () => {
    const { result } = renderHook(() => useSessionStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.formatDuration).toBe('function');
    expect(typeof result.current.formatTime).toBe('function');
  });
});

describe('useTodayStats', () => {
  const mockTodayStats = {
    totalFocusTime: 3600,
    totalSessions: 3,
    completionRate: 85
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mock implementations
    sessionDatabase.getAllSessions.mockResolvedValue([]);
    StatisticsCalculator.calculateDailyStats.mockReturnValue(mockTodayStats);
  });

  it('should initialize with loading state and default values', () => {
    const { result } = renderHook(() => useTodayStats());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.focusTime).toBe(0);
    expect(result.current.sessions).toBe(0);
    expect(result.current.completionRate).toBe(0);
  });

  it('should load today stats correctly', async () => {
    const { result } = renderHook(() => useTodayStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.focusTime).toBe(3600);
    expect(result.current.sessions).toBe(3);
    expect(result.current.completionRate).toBe(85);
  });

  it('should handle errors gracefully', async () => {
    // Override the mock for this specific test
    sessionDatabase.getAllSessions.mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => useTodayStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should maintain default values on error
    expect(result.current.focusTime).toBe(0);
    expect(result.current.sessions).toBe(0);
    expect(result.current.completionRate).toBe(0);
  });

  it('should provide refresh functionality', async () => {
    const { result } = renderHook(() => useTodayStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Reset the mock for refresh test
    sessionDatabase.getAllSessions.mockResolvedValue([]);

    // Trigger refresh
    result.current.refresh();

    await waitFor(() => {
      expect(sessionDatabase.getAllSessions).toHaveBeenCalled();
    });
  });

  it('should provide format utility function', async () => {
    const { result } = renderHook(() => useTodayStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.formatDuration).toBe('function');
  });
});