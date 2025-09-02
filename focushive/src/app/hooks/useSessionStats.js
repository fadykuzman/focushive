import { useState, useEffect, useCallback } from 'react';
import { sessionDatabase } from '@/app/utils/sessionDatabase.js';
import { StatisticsCalculator } from '@/app/utils/statisticsCalculator.js';

export function useSessionStats() {
  const [stats, setStats] = useState({
    daily: null,
    weekly: null,
    monthly: null,
    streaks: null,
    overall: null,
    trends: null,
    loading: true,
    error: null
  });

  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const calculateStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const sessions = await sessionDatabase.getAllSessions();
      const today = new Date();

      const dailyStats = StatisticsCalculator.calculateDailyStats(sessions, today);
      const weeklyStats = StatisticsCalculator.calculateWeeklyStats(sessions, today);
      const monthlyStats = StatisticsCalculator.calculateMonthlyStats(sessions, today);
      const streakStats = StatisticsCalculator.calculateStreaks(sessions);
      const overallStats = StatisticsCalculator.calculateOverallStats(sessions);
      const trendStats = StatisticsCalculator.calculateProductivityTrends(sessions, 30);

      setStats({
        daily: dailyStats,
        weekly: weeklyStats,
        monthly: monthlyStats,
        streaks: streakStats,
        overall: overallStats,
        trends: trendStats,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error calculating statistics:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message.includes('IndexedDB') ? 'Statistics not available in this environment' : 'Failed to load statistics'
      }));
    }
  }, []);

  const refreshStats = useCallback(() => {
    setLastRefresh(Date.now());
    calculateStats();
  }, [calculateStats]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats, lastRefresh]);

  // Auto-refresh stats when a session might have been completed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh stats when user returns to tab
        setTimeout(refreshStats, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshStats]);

  return {
    ...stats,
    refreshStats,
    formatDuration: StatisticsCalculator.formatDuration,
    formatTime: StatisticsCalculator.formatTime
  };
}

export function useTodayStats() {
  const [todayStats, setTodayStats] = useState({
    focusTime: 0,
    sessions: 0,
    completionRate: 0,
    loading: true
  });

  const refreshTodayStats = useCallback(async () => {
    try {
      const sessions = await sessionDatabase.getAllSessions();
      const daily = StatisticsCalculator.calculateDailyStats(sessions, new Date());
      
      setTodayStats({
        focusTime: daily.totalFocusTime,
        sessions: daily.totalSessions,
        completionRate: daily.completionRate,
        loading: false
      });
    } catch (error) {
      console.error('Error loading today stats:', error);
      setTodayStats(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refreshTodayStats();
    
    // Refresh every minute to keep stats current
    const interval = setInterval(refreshTodayStats, 60000);
    return () => clearInterval(interval);
  }, [refreshTodayStats]);

  return {
    ...todayStats,
    refresh: refreshTodayStats,
    formatDuration: StatisticsCalculator.formatDuration
  };
}