import { describe, it, expect } from 'vitest';
import { StatisticsCalculator } from '../statisticsCalculator';

describe('StatisticsCalculator', () => {
  const mockSessions = [
    {
      id: '1',
      type: 'focus',
      startTime: new Date('2025-08-31T10:00:00Z'),
      endTime: new Date('2025-08-31T10:25:00Z'),
      plannedDuration: 1500,
      actualDuration: 1500,
      completed: true,
      round: 1,
      date: '2025-08-31'
    },
    {
      id: '2',
      type: 'shortBreak',
      startTime: new Date('2025-08-31T10:25:00Z'),
      endTime: new Date('2025-08-31T10:30:00Z'),
      plannedDuration: 300,
      actualDuration: 300,
      completed: true,
      round: 1,
      date: '2025-08-31'
    },
    {
      id: '3',
      type: 'focus',
      startTime: new Date('2025-08-30T14:00:00Z'),
      endTime: new Date('2025-08-30T14:20:00Z'),
      plannedDuration: 1500,
      actualDuration: 1200,
      completed: false,
      round: 2,
      date: '2025-08-30'
    }
  ];

  describe('calculateDailyStats', () => {
    it('should calculate correct daily statistics', () => {
      const stats = StatisticsCalculator.calculateDailyStats(mockSessions, new Date('2025-08-31'));
      
      expect(stats.date).toBe('2025-08-31');
      expect(stats.totalSessions).toBe(2);
      expect(stats.completedSessions).toBe(2);
      expect(stats.totalFocusTime).toBe(1500);
      expect(stats.totalBreakTime).toBe(300);
      expect(stats.completionRate).toBe(100);
      expect(stats.focusSessions).toBe(1);
      expect(stats.shortBreaks).toBe(1);
      expect(stats.longBreaks).toBe(0);
    });

    it('should return empty stats for date with no sessions', () => {
      const stats = StatisticsCalculator.calculateDailyStats(mockSessions, new Date('2025-08-29'));
      
      expect(stats.totalSessions).toBe(0);
      expect(stats.completedSessions).toBe(0);
      expect(stats.totalFocusTime).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    it('should calculate correct completion rate with mixed results', () => {
      const stats = StatisticsCalculator.calculateDailyStats(mockSessions, new Date('2025-08-30'));
      
      expect(stats.totalSessions).toBe(1);
      expect(stats.completedSessions).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe('calculateWeeklyStats', () => {
    it('should calculate weekly statistics correctly', () => {
      const stats = StatisticsCalculator.calculateWeeklyStats(mockSessions, new Date('2025-08-31'));
      
      expect(stats.weekStart).toBeDefined();
      expect(stats.weekEnd).toBeDefined();
      expect(stats.dailyStats).toHaveLength(7);
      expect(stats.totalWeeklyFocusTime).toBeGreaterThan(0);
      expect(stats.totalWeeklySessions).toBeGreaterThan(0);
    });

    it('should include all 7 days in weekly breakdown', () => {
      const stats = StatisticsCalculator.calculateWeeklyStats(mockSessions, new Date('2025-08-31'));
      
      expect(stats.dailyStats).toHaveLength(7);
      stats.dailyStats.forEach(day => {
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('totalSessions');
        expect(day).toHaveProperty('totalFocusTime');
      });
    });
  });

  describe('calculateMonthlyStats', () => {
    it('should calculate monthly statistics correctly', () => {
      const stats = StatisticsCalculator.calculateMonthlyStats(mockSessions, new Date('2025-08-31T12:00:00Z'));
      
      expect(stats.month).toBe('2025-08');
      expect(stats.totalSessions).toBe(3);
      expect(stats.completedSessions).toBe(2);
      expect(stats.totalFocusTime).toBe(2700); // 1500 + 1200
      expect(stats.totalBreakTime).toBe(300);
      expect(stats.activeDays).toBe(2);
    });

    it('should return zero stats for empty month', () => {
      const stats = StatisticsCalculator.calculateMonthlyStats([], new Date('2025-08-31'));
      
      expect(stats.totalSessions).toBe(0);
      expect(stats.completedSessions).toBe(0);
      expect(stats.completionRate).toBe(0);
      expect(stats.activeDays).toBe(0);
    });
  });

  describe('calculateStreaks', () => {
    it('should return zero streaks for empty sessions', () => {
      const streaks = StatisticsCalculator.calculateStreaks([]);
      
      expect(streaks.currentStreak).toBe(0);
      expect(streaks.longestStreak).toBe(0);
      expect(streaks.lastSessionDate).toBeNull();
    });

    it('should return zero streaks when no completed focus sessions', () => {
      const incompleteSessions = [
        {
          type: 'focus',
          completed: false,
          date: '2025-08-31'
        }
      ];
      
      const streaks = StatisticsCalculator.calculateStreaks(incompleteSessions);
      
      expect(streaks.currentStreak).toBe(0);
      expect(streaks.longestStreak).toBe(0);
    });

    it('should calculate streaks correctly for consecutive days', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const consecutiveSessions = [
        {
          type: 'focus',
          completed: true,
          date: today,
          startTime: new Date()
        },
        {
          type: 'focus',
          completed: true,
          date: yesterday,
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ];
      
      const streaks = StatisticsCalculator.calculateStreaks(consecutiveSessions);
      
      expect(streaks.currentStreak).toBeGreaterThan(0);
      expect(streaks.longestStreak).toBeGreaterThan(0);
    });
  });

  describe('calculateOverallStats', () => {
    it('should calculate overall statistics correctly', () => {
      const stats = StatisticsCalculator.calculateOverallStats(mockSessions);
      
      expect(stats.totalSessions).toBe(3);
      expect(stats.totalCompletedSessions).toBe(2);
      expect(stats.overallCompletionRate).toBe(67); // 2/3 * 100 rounded
      expect(stats.totalFocusTime).toBe(2700);
      expect(stats.totalActiveDays).toBe(2);
    });

    it('should return zero stats for empty session list', () => {
      const stats = StatisticsCalculator.calculateOverallStats([]);
      
      expect(stats.totalSessions).toBe(0);
      expect(stats.totalFocusTime).toBe(0);
      expect(stats.overallCompletionRate).toBe(0);
      expect(stats.firstSessionDate).toBeNull();
    });
  });

  describe('calculateProductivityTrends', () => {
    it('should calculate trends for specified number of days', () => {
      const trends = StatisticsCalculator.calculateProductivityTrends(mockSessions, 7);
      
      expect(trends).toHaveLength(7);
      trends.forEach(day => {
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('focusTime');
        expect(day).toHaveProperty('sessions');
        expect(day).toHaveProperty('completionRate');
      });
    });

    it('should include recent data in trends', () => {
      const trends = StatisticsCalculator.calculateProductivityTrends(mockSessions, 3);
      
      expect(trends).toHaveLength(3);
      
      // Check that recent dates are included
      const todayStr = new Date().toISOString().split('T')[0];
      const hasTodayOrRecent = trends.some(day => day.date >= '2025-08-29');
      expect(hasTodayOrRecent).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('should format duration correctly', () => {
      expect(StatisticsCalculator.formatDuration(3600)).toBe('1h 0m');
      expect(StatisticsCalculator.formatDuration(3900)).toBe('1h 5m');
      expect(StatisticsCalculator.formatDuration(1800)).toBe('30m');
      expect(StatisticsCalculator.formatDuration(0)).toBe('0m');
    });

    it('should format time correctly', () => {
      expect(StatisticsCalculator.formatTime(3600)).toBe('60:00');
      expect(StatisticsCalculator.formatTime(1500)).toBe('25:00');
      expect(StatisticsCalculator.formatTime(65)).toBe('1:05');
      expect(StatisticsCalculator.formatTime(5)).toBe('0:05');
    });

    it('should calculate average completion rate correctly', () => {
      const dailyStats = [
        { totalSessions: 4, completionRate: 100 },
        { totalSessions: 2, completionRate: 50 },
        { totalSessions: 0, completionRate: 0 }, // Should be excluded
        { totalSessions: 3, completionRate: 67 }
      ];
      
      const avgRate = StatisticsCalculator.calculateAverageCompletionRate(dailyStats);
      expect(avgRate).toBe(72); // (100 + 50 + 67) / 3 = 72.33, rounded to 72
    });

    it('should return 0 for average completion rate with no sessions', () => {
      const dailyStats = [
        { totalSessions: 0, completionRate: 0 },
        { totalSessions: 0, completionRate: 0 }
      ];
      
      const avgRate = StatisticsCalculator.calculateAverageCompletionRate(dailyStats);
      expect(avgRate).toBe(0);
    });
  });
});