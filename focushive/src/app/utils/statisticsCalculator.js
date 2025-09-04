import { formatDuration, formatTime } from '@/app/utils/timeUtils';

export class StatisticsCalculator {
  static calculateDailyStats(sessions, targetDate = new Date()) {
    const dateStr = targetDate.toISOString().split('T')[0];
    const daySessions = sessions.filter(session => session.date === dateStr);
    
    const stats = {
      date: dateStr,
      totalSessions: daySessions.length,
      completedSessions: daySessions.filter(s => s.completed).length,
      totalFocusTime: 0,
      totalBreakTime: 0,
      averageSessionDuration: 0,
      completionRate: 0,
      focusSessions: 0,
      shortBreaks: 0,
      longBreaks: 0
    };

    if (daySessions.length === 0) {
      return stats;
    }

    let totalDuration = 0;
    
    daySessions.forEach(session => {
      totalDuration += session.actualDuration;
      
      if (session.type === 'focus') {
        stats.focusSessions++;
        stats.totalFocusTime += session.actualDuration;
      } else if (session.type === 'shortBreak') {
        stats.shortBreaks++;
        stats.totalBreakTime += session.actualDuration;
      } else if (session.type === 'longBreak') {
        stats.longBreaks++;
        stats.totalBreakTime += session.actualDuration;
      }
    });

    stats.averageSessionDuration = Math.round(totalDuration / daySessions.length);
    stats.completionRate = Math.round((stats.completedSessions / stats.totalSessions) * 100);

    return stats;
  }

  static calculateWeeklyStats(sessions, targetDate = new Date()) {
    const weekStart = new Date(targetDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      dailyStats.push(this.calculateDailyStats(sessions, day));
    }

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      dailyStats,
      totalWeeklyFocusTime: dailyStats.reduce((sum, day) => sum + day.totalFocusTime, 0),
      totalWeeklySessions: dailyStats.reduce((sum, day) => sum + day.totalSessions, 0),
      averageDailyFocusTime: dailyStats.reduce((sum, day) => sum + day.totalFocusTime, 0) / 7,
      weeklyCompletionRate: this.calculateAverageCompletionRate(dailyStats)
    };
  }

  static calculateMonthlyStats(sessions, targetDate = new Date()) {
    const monthStart = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), 1));
    const monthEnd = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    const monthSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= monthStart && sessionDate <= monthEnd;
    });

    return {
      month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
      totalSessions: monthSessions.length,
      completedSessions: monthSessions.filter(s => s.completed).length,
      totalFocusTime: monthSessions
        .filter(s => s.type === 'focus')
        .reduce((sum, s) => sum + s.actualDuration, 0),
      totalBreakTime: monthSessions
        .filter(s => s.type === 'shortBreak' || s.type === 'longBreak')
        .reduce((sum, s) => sum + s.actualDuration, 0),
      averageSessionDuration: monthSessions.length > 0 ? 
        Math.round(monthSessions.reduce((sum, s) => sum + s.actualDuration, 0) / monthSessions.length) : 0,
      completionRate: monthSessions.length > 0 ? 
        Math.round((monthSessions.filter(s => s.completed).length / monthSessions.length) * 100) : 0,
      activeDays: new Set(monthSessions.map(s => s.date)).size
    };
  }

  static calculateStreaks(sessions) {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastSessionDate: null };
    }

    const sortedSessions = sessions
      .filter(s => s.completed && s.type === 'focus')
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    if (sortedSessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastSessionDate: null };
    }

    const uniqueDates = [...new Set(sortedSessions.map(s => s.date))].sort().reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Calculate current streak
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      let expectedDate = uniqueDates[0] === today ? today : yesterday;
      
      for (const date of uniqueDates) {
        if (date === expectedDate) {
          currentStreak++;
          const prevDate = new Date(expectedDate);
          prevDate.setDate(prevDate.getDate() - 1);
          expectedDate = prevDate.toISOString().split('T')[0];
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    const allDates = uniqueDates.sort();
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(allDates[i]);
        const prevDate = new Date(allDates[i - 1]);
        const dayDiff = Math.floor((currentDate - prevDate) / (24 * 60 * 60 * 1000));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      lastSessionDate: sortedSessions[0]?.date || null
    };
  }

  static calculateProductivityTrends(sessions, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayStats = this.calculateDailyStats(sessions, date);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        focusTime: dayStats.totalFocusTime,
        sessions: dayStats.totalSessions,
        completionRate: dayStats.completionRate
      });
    }

    return trends;
  }

  static calculateAverageCompletionRate(dailyStats) {
    const daysWithSessions = dailyStats.filter(day => day.totalSessions > 0);
    if (daysWithSessions.length === 0) return 0;
    
    const totalRate = daysWithSessions.reduce((sum, day) => sum + day.completionRate, 0);
    return Math.round(totalRate / daysWithSessions.length);
  }

  static calculateOverallStats(sessions) {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        totalCompletedSessions: 0,
        overallCompletionRate: 0,
        averageSessionLength: 0,
        firstSessionDate: null,
        totalActiveDays: 0
      };
    }

    const completedSessions = sessions.filter(s => s.completed);
    const focusSessions = sessions.filter(s => s.type === 'focus');
    const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.actualDuration, 0);
    const uniqueDates = new Set(sessions.map(s => s.date));

    return {
      totalSessions: sessions.length,
      totalFocusTime,
      totalCompletedSessions: completedSessions.length,
      overallCompletionRate: Math.round((completedSessions.length / sessions.length) * 100),
      averageSessionLength: Math.round(sessions.reduce((sum, s) => sum + s.actualDuration, 0) / sessions.length),
      firstSessionDate: sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0]?.date,
      totalActiveDays: uniqueDates.size
    };
  }

  // Re-export formatting functions from timeUtils for backward compatibility
  static formatDuration(seconds) {
    return formatDuration(seconds);
  }

  static formatTime(seconds) {
    return formatTime(seconds);
  }
}