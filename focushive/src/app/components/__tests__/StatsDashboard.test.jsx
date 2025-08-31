import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the useSessionStats hook
const mockStats = {
  daily: {
    date: '2025-08-31',
    totalSessions: 3,
    completedSessions: 3,
    totalFocusTime: 4500,
    completionRate: 100,
    focusSessions: 2,
    shortBreaks: 1,
    longBreaks: 0
  },
  weekly: {
    weekStart: '2025-08-25',
    weekEnd: '2025-08-31',
    totalWeeklyFocusTime: 15000,
    totalWeeklySessions: 10,
    averageDailyFocusTime: 2142,
    weeklyCompletionRate: 85,
    dailyStats: [
      { date: '2025-08-25', totalSessions: 1, totalFocusTime: 1500, completionRate: 100 },
      { date: '2025-08-26', totalSessions: 0, totalFocusTime: 0, completionRate: 0 },
      { date: '2025-08-27', totalSessions: 2, totalFocusTime: 3000, completionRate: 100 },
      { date: '2025-08-28', totalSessions: 1, totalFocusTime: 1200, completionRate: 50 },
      { date: '2025-08-29', totalSessions: 3, totalFocusTime: 4500, completionRate: 67 },
      { date: '2025-08-30', totalSessions: 1, totalFocusTime: 300, completionRate: 0 },
      { date: '2025-08-31', totalSessions: 3, totalFocusTime: 4500, completionRate: 100 }
    ]
  },
  streaks: {
    currentStreak: 5,
    longestStreak: 12,
    lastSessionDate: '2025-08-31'
  },
  overall: {
    totalSessions: 50,
    totalFocusTime: 75000,
    totalCompletedSessions: 42,
    overallCompletionRate: 84,
    averageSessionLength: 1500,
    firstSessionDate: '2025-08-01',
    totalActiveDays: 25
  },
  trends: [
    { date: '2025-08-30', focusTime: 1800, sessions: 2, completionRate: 100 },
    { date: '2025-08-31', focusTime: 4500, sessions: 3, completionRate: 100 }
  ],
  loading: false,
  error: null,
  formatDuration: vi.fn((seconds) => `${Math.floor(seconds / 60)}m`),
  formatTime: vi.fn((seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`),
  refreshStats: vi.fn()
};

vi.mock('../../hooks/useSessionStats', () => ({
  useSessionStats: vi.fn(() => mockStats)
}));

import StatsDashboard from '../StatsDashboard';
import { useSessionStats } from '../../hooks/useSessionStats';

describe('StatsDashboard', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default stats with data
    vi.mocked(useSessionStats).mockReturnValue(mockStats);
  });

  it('should not render when isOpen is false', () => {
    render(<StatsDashboard isOpen={false} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-dashboard-overlay')).not.toBeInTheDocument();
  });

  it('should render loading state', () => {
    const loadingStats = { ...mockStats, loading: true };
    vi.mocked(useSessionStats).mockReturnValue(loadingStats);

    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-loading-message')).toBeInTheDocument();
  });

  it('should render error state with retry button', () => {
    const errorStats = { ...mockStats, loading: false, error: 'Failed to load data' };
    vi.mocked(useSessionStats).mockReturnValue(errorStats);

    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-error-message')).toBeInTheDocument();
    expect(document.getElementById('stats-retry-btn')).toBeInTheDocument();
  });

  it('should show no data message when no sessions exist', () => {
    const noDataStats = {
      ...mockStats,
      daily: { totalSessions: 0 }
    };
    vi.mocked(useSessionStats).mockReturnValue(noDataStats);

    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-no-data-message')).toBeInTheDocument();
    expect(document.getElementById('stats-no-data-subtitle')).toBeInTheDocument();
  });

  it('should display statistics when data is available', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-dashboard-title')).toBeInTheDocument();
    expect(document.getElementById('stats-today-focus')).toBeInTheDocument();
    expect(document.getElementById('stats-current-streak')).toBeInTheDocument();
    expect(document.getElementById('stats-today-rate')).toBeInTheDocument();
    expect(document.getElementById('stats-today-sessions')).toBeInTheDocument();
  });

  it('should display weekly breakdown', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-weekly-breakdown-title')).toBeInTheDocument();
    expect(document.getElementById('stats-today-marker')).toBeInTheDocument();
  });

  it('should display all-time statistics', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-alltime-title')).toBeInTheDocument();
    expect(document.getElementById('stats-alltime-sessions')).toBeInTheDocument();
    expect(document.getElementById('stats-alltime-completion')).toBeInTheDocument();
  });

  it('should display productivity trends when available', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    expect(document.getElementById('stats-trends-title')).toBeInTheDocument();
    expect(document.getElementById('stats-trends-subtitle')).toBeInTheDocument();
  });

  it('should handle close button click', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = document.getElementById('stats-dashboard-close-btn');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should handle overlay click to close', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    const overlay = document.getElementById('stats-dashboard-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should handle refresh button click', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    const refreshButton = document.getElementById('stats-dashboard-refresh-btn');
    fireEvent.click(refreshButton);
    
    expect(mockStats.refreshStats).toHaveBeenCalledOnce();
  });

  it('should not close when clicking inside modal content', () => {
    render(<StatsDashboard isOpen={true} onClose={mockOnClose} />);
    
    const modalContent = document.getElementById('stats-dashboard-modal');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

