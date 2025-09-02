'use client';

import { useSessionStats } from '@/app/hooks/useSessionStats';

export default function StatsDashboard({ isOpen, onClose }) {
  const { daily, weekly, streaks, overall, trends, loading, error, formatDuration, refreshStats } = useSessionStats();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div id="stats-dashboard-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={handleOverlayClick}>
        <div id="stats-dashboard-modal" className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-xl">
          <div className="flex justify-center items-center p-4 sm:p-6 flex-1">
            <div id="stats-loading-message" className="text-base sm:text-lg text-gray-600">Loading statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="stats-dashboard-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={handleOverlayClick}>
        <div id="stats-dashboard-modal" className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-xl">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 id="stats-dashboard-title" className="text-xl sm:text-2xl font-bold text-gray-800">Statistics</h2>
            <button id="stats-dashboard-close-btn" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold">×</button>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6">
            <div id="stats-error-message" className="text-red-600 mb-4 text-sm sm:text-base">{error}</div>
            <button 
              id="stats-retry-btn"
              onClick={refreshStats}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasData = daily && daily.totalSessions > 0;

  return (
    <div id="stats-dashboard-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={handleOverlayClick}>
      <div id="stats-dashboard-modal" className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 gap-3 sm:gap-2">
          <h2 id="stats-dashboard-title" className="text-xl sm:text-2xl font-bold text-gray-800">Productivity Statistics</h2>
          <div className="flex gap-2 self-end sm:self-auto">
            <button 
              id="stats-dashboard-refresh-btn"
              onClick={refreshStats}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
            >
              Refresh
            </button>
            <button id="stats-dashboard-close-btn" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!hasData ? (
            <div id="stats-no-data-section" className="text-center py-12">
              <div id="stats-no-data-message" className="text-gray-500 text-lg mb-4">No session data yet</div>
              <div id="stats-no-data-subtitle" className="text-gray-400">Complete some focus sessions to see your productivity statistics!</div>
            </div>
          ) : (
            <div className="space-y-6">
            {/* Quick Stats Overview */}
            <div id="stats-quick-overview" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <div id="stats-today-focus-card" className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                <div id="stats-today-focus" className="text-lg sm:text-2xl font-bold text-blue-600">{formatDuration(daily.totalFocusTime)}</div>
                <div className="text-xs sm:text-sm text-gray-600">Today's Focus</div>
              </div>
              <div id="stats-current-streak-card" className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                <div id="stats-current-streak" className="text-lg sm:text-2xl font-bold text-green-600">{streaks.currentStreak}</div>
                <div className="text-xs sm:text-sm text-gray-600">Current Streak</div>
              </div>
              <div id="stats-today-rate-card" className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                <div id="stats-today-rate" className="text-lg sm:text-2xl font-bold text-purple-600">{daily.completionRate}%</div>
                <div className="text-xs sm:text-sm text-gray-600">Today's Rate</div>
              </div>
              <div id="stats-today-sessions-card" className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
                <div id="stats-today-sessions" className="text-lg sm:text-2xl font-bold text-orange-600">{daily.totalSessions}</div>
                <div className="text-xs sm:text-sm text-gray-600">Today's Sessions</div>
              </div>
            </div>

            {/* Streaks Section */}
            <div id="stats-streaks-section" className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 id="stats-streaks-title" className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Streaks</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div id="stats-current-streak-details">
                  <div className="text-xs sm:text-sm text-gray-600">Current Streak</div>
                  <div id="stats-current-streak-value" className="text-lg sm:text-xl font-bold text-green-600">{streaks.currentStreak} days</div>
                </div>
                <div id="stats-longest-streak-details">
                  <div className="text-xs sm:text-sm text-gray-600">Longest Streak</div>
                  <div id="stats-longest-streak-value" className="text-lg sm:text-xl font-bold text-blue-600">{streaks.longestStreak} days</div>
                </div>
              </div>
            </div>

            {/* Weekly Overview */}
            <div id="stats-weekly-section" className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 id="stats-weekly-title" className="text-base sm:text-lg font-semibold text-gray-800 mb-3">This Week</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                <div id="stats-weekly-focus-time">
                  <div className="text-xs sm:text-sm text-gray-600">Total Focus Time</div>
                  <div className="text-base sm:text-lg font-bold">{formatDuration(weekly.totalWeeklyFocusTime)}</div>
                </div>
                <div id="stats-weekly-sessions">
                  <div className="text-xs sm:text-sm text-gray-600">Sessions</div>
                  <div className="text-base sm:text-lg font-bold">{weekly.totalWeeklySessions}</div>
                </div>
                <div id="stats-weekly-avg-daily">
                  <div className="text-sm text-gray-600">Avg Daily Focus</div>
                  <div className="text-lg font-bold">{formatDuration(weekly.averageDailyFocusTime)}</div>
                </div>
                <div id="stats-weekly-completion">
                  <div className="text-sm text-gray-600">Completion Rate</div>
                  <div className="text-lg font-bold">{weekly.weeklyCompletionRate}%</div>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div id="stats-weekly-breakdown" className="bg-gray-50 p-4 rounded-lg">
              <h3 id="stats-weekly-breakdown-title" className="text-lg font-semibold text-gray-800 mb-3">Weekly Breakdown</h3>
              <div id="stats-daily-list" className="space-y-2">
                {weekly.dailyStats.map((day, index) => {
                  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                  const dayDate = new Date(day.date).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: '2-digit' 
                  });
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div key={day.date} id={`stats-day-${day.date}`} className={`flex justify-between items-center p-2 rounded ${isToday ? 'bg-blue-100' : 'bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                          {dayName} {dayDate}
                        </span>
                        {isToday && <span id="stats-today-marker" className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Today</span>}
                      </div>
                      <div className="flex gap-6 text-sm">
                        <span className="text-gray-600">
                          {formatDuration(day.totalFocusTime)} focus
                        </span>
                        <span className="text-gray-600">
                          {day.totalSessions} sessions
                        </span>
                        <span className={`font-medium ${day.completionRate >= 80 ? 'text-green-600' : day.completionRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {day.completionRate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All-Time Stats */}
            <div id="stats-alltime-section" className="bg-gray-50 p-4 rounded-lg">
              <h3 id="stats-alltime-title" className="text-lg font-semibold text-gray-800 mb-3">All-Time Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div id="stats-alltime-focus-time">
                  <div className="text-sm text-gray-600">Total Focus Time</div>
                  <div className="text-lg font-bold">{formatDuration(overall.totalFocusTime)}</div>
                </div>
                <div id="stats-alltime-sessions">
                  <div className="text-sm text-gray-600">Total Sessions</div>
                  <div className="text-lg font-bold">{overall.totalSessions}</div>
                </div>
                <div id="stats-alltime-completion">
                  <div className="text-sm text-gray-600">Completion Rate</div>
                  <div className="text-lg font-bold">{overall.overallCompletionRate}%</div>
                </div>
                <div id="stats-alltime-active-days">
                  <div className="text-sm text-gray-600">Active Days</div>
                  <div className="text-lg font-bold">{overall.totalActiveDays}</div>
                </div>
                <div id="stats-alltime-avg-session">
                  <div className="text-sm text-gray-600">Avg Session</div>
                  <div className="text-lg font-bold">{formatDuration(overall.averageSessionLength)}</div>
                </div>
                {overall.firstSessionDate && (
                  <div id="stats-alltime-since">
                    <div className="text-sm text-gray-600">Since</div>
                    <div className="text-lg font-bold">{new Date(overall.firstSessionDate).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Trend */}
            {trends && trends.length > 0 && (
              <div id="stats-trends-section" className="bg-gray-50 p-4 rounded-lg">
                <h3 id="stats-trends-title" className="text-lg font-semibold text-gray-800 mb-3">30-Day Trend</h3>
                <div id="stats-trends-subtitle" className="text-sm text-gray-600 mb-2">Daily focus time over the last 30 days</div>
                <div id="stats-trends-chart" className="flex items-end gap-1 h-20">
                  {trends.slice(-30).map((day, index) => {
                    const maxFocusTime = Math.max(...trends.map(d => d.focusTime));
                    const height = maxFocusTime > 0 ? (day.focusTime / maxFocusTime) * 100 : 0;
                    
                    return (
                      <div
                        key={day.date}
                        id={`stats-trend-bar-${day.date}`}
                        className="bg-blue-400 hover:bg-blue-500 min-w-[4px] cursor-pointer transition-colors"
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${day.date}: ${formatDuration(day.focusTime)}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}