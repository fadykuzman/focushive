'use client';

import { useCalendarIntegration } from '@/app/hooks/useCalendarIntegration';
import FormInput from '@/app/components/shared/FormInput';

export default function CalendarIntegrationSection() {
  const {
    isConnected,
    isLoading,
    user,
    error,
    calendarStatus,
    upcomingEvents,
    notificationTiming,
    setNotificationTiming,
    showPrivateDetails,
    setShowPrivateDetails,
    connectCalendar,
    disconnectCalendar,
    testNotification,
    requestNotificationPermission,
    clearError
  } = useCalendarIntegration();

  const handleConnect = async () => {
    try {
      clearError();
      await connectCalendar();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect your Google Calendar? You\'ll stop receiving meeting notifications.')) {
      await disconnectCalendar();
    }
  };

  const handleTestNotification = async () => {
    try {
      const success = await testNotification();
      if (success) {
        alert('Test notification sent! Check if you received it.');
      }
    } catch (err) {
      alert('Notification test failed: ' + err.message);
    }
  };

  const handleNotificationPermission = async () => {
    try {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('Notifications were not enabled. Please enable them in your browser settings to receive calendar reminders.');
      }
    } catch (err) {
      alert('Failed to request notification permission: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-heading-h4 text-gray-700">Calendar Integration</h3>
      
      {/* Connection Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        {!isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Google Calendar</h4>
                <p className="text-sm text-gray-600">Get notified before meetings during focus sessions</p>
              </div>
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
              >
                {isLoading ? 'Connecting...' : 'Connect Calendar'}
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              ✓ Read-only access • ✓ Never stores event details • ✓ Disconnect anytime
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {user?.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-800">Connected to Google Calendar</h4>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="px-3 py-1 text-red-600 hover:text-red-800 text-sm transition-colors"
              >
                Disconnect
              </button>
            </div>

            {/* Calendar Status */}
            {calendarStatus && (
              <div className="flex items-center space-x-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  calendarStatus.color === 'green' ? 'bg-green-500' :
                  calendarStatus.color === 'yellow' ? 'bg-yellow-500' :
                  calendarStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                }`}></span>
                <span className="text-gray-600">{calendarStatus.message}</span>
              </div>
            )}

            {/* Upcoming Events Preview */}
            {upcomingEvents.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Next events:</p>
                <div className="space-y-1">
                  {upcomingEvents.slice(0, 2).map(event => (
                    <div key={event.id} className="flex justify-between text-xs text-gray-600">
                      <span className="truncate">{event.displayTitle}</span>
                      <span className="ml-2 flex-shrink-0">in {event.timeUntil}m</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings (only show when connected) */}
      {isConnected && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-gray-700">Notification Settings</h4>
          
          {/* Notification Timing */}
          <div className="flex items-center justify-between">
            <label className="text-gray-600 text-sm">Notify me before events</label>
            <div className="flex items-center space-x-2">
              <FormInput
                type="number"
                min="1"
                max="60"
                value={notificationTiming}
                onChange={(e) => setNotificationTiming(parseInt(e.target.value))}
                size="sm"
                isInSidebar={true}
                className="w-16 text-center"
              />
              <span className="text-gray-500 text-sm">min</span>
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-600 text-sm">Show event titles</label>
              <p className="text-xs text-gray-500">Private events always show as "Private Event"</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPrivateDetails}
                onChange={(e) => setShowPrivateDetails(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Notification Controls */}
          <div className="flex space-x-2">
            <button
              onClick={handleNotificationPermission}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Check Permissions
            </button>
            <button
              onClick={handleTestNotification}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Test Notification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}