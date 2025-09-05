'use client';

import { useCalendarIntegration } from '@/app/hooks/useCalendarIntegration';
import BaseModal from '@/app/components/shared/BaseModal';

export default function CalendarModal({ isOpen, onClose }) {
  const {
    isConnected,
    isLoading,
    user,
    calendarStatus,
    todaysEvents,
    upcomingEvents,
    refreshCalendarData
  } = useCalendarIntegration();

  if (!isConnected) return null;

  const handleRefresh = async () => {
    await refreshCalendarData();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const minutes = Math.round(durationMs / (60 * 1000));
    
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (now >= startTime && now <= endTime) {
      return { status: 'ongoing', color: 'bg-blue-100 text-blue-800', label: 'Ongoing' };
    } else if (startTime > now) {
      const minutesUntil = Math.round((startTime - now) / (60 * 1000));
      if (minutesUntil <= 15) {
        return { status: 'soon', color: 'bg-red-100 text-red-800', label: `In ${minutesUntil}m` };
      } else if (minutesUntil <= 60) {
        return { status: 'upcoming', color: 'bg-yellow-100 text-yellow-800', label: `In ${minutesUntil}m` };
      } else {
        return { status: 'later', color: 'bg-gray-100 text-gray-700', label: formatTime(startTime) };
      }
    } else {
      return { status: 'past', color: 'bg-gray-100 text-gray-500', label: 'Completed' };
    }
  };

  const groupEventsByTime = (events) => {
    const now = new Date();
    const currentEvents = [];
    const upcomingEvents = [];
    const laterEvents = [];
    const pastEvents = [];

    events.forEach(event => {
      const eventStatus = getEventStatus(event);
      switch (eventStatus.status) {
        case 'ongoing':
          currentEvents.push({ ...event, statusInfo: eventStatus });
          break;
        case 'soon':
        case 'upcoming':
          upcomingEvents.push({ ...event, statusInfo: eventStatus });
          break;
        case 'later':
          laterEvents.push({ ...event, statusInfo: eventStatus });
          break;
        case 'past':
          pastEvents.push({ ...event, statusInfo: eventStatus });
          break;
      }
    });

    return { currentEvents, upcomingEvents, laterEvents, pastEvents };
  };

  const { currentEvents, upcomingEvents: nextEvents, laterEvents, pastEvents } = groupEventsByTime(todaysEvents);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Today's Calendar"
      size="lg"
    >
      <div className="space-y-4">
        {/* Header with status and refresh */}
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
              <h3 className="font-medium text-gray-800">{user?.name}</h3>
              {calendarStatus && (
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    calendarStatus.color === 'green' ? 'bg-green-500' :
                    calendarStatus.color === 'yellow' ? 'bg-yellow-500' :
                    calendarStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></span>
                  <span className="text-sm text-gray-600">{calendarStatus.message}</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh calendar"
          >
            <img 
              src="/icons/refresh.svg" 
              alt="Refresh" 
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {/* Events List */}
        <div className="max-h-96 overflow-y-auto space-y-4">
          {todaysEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-600 mb-1">No events today</p>
              <p className="text-sm text-gray-500">Perfect day for deep focus work!</p>
            </div>
          ) : (
            <>
              {/* Current Events */}
              {currentEvents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Happening Now
                  </h4>
                  <div className="space-y-2">
                    {currentEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {nextEvents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Coming Up</h4>
                  <div className="space-y-2">
                    {nextEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Later Events */}
              {laterEvents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Later Today</h4>
                  <div className="space-y-2">
                    {laterEvents.slice(0, 5).map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                    {laterEvents.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{laterEvents.length - 5} more events
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Past Events (collapsed by default) */}
              {pastEvents.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Show {pastEvents.length} completed events
                  </summary>
                  <div className="mt-2 space-y-2">
                    {pastEvents.slice(-3).map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </details>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 text-center">
            Calendar integration helps you focus without missing important meetings
          </p>
        </div>
      </div>
    </BaseModal>
  );
}

// Individual Event Card Component
function EventCard({ event }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const minutes = Math.round(durationMs / (60 * 1000));
    
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-gray-800 truncate">{event.safeTitle}</h5>
          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
            <span>•</span>
            <span>{formatDuration(event.startTime, event.endTime)}</span>
          </div>
          {event.location && (
            <p className="text-sm text-gray-500 mt-1 truncate">📍 {event.location}</p>
          )}
        </div>
        
        <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${event.statusInfo?.color}`}>
          {event.statusInfo?.label}
        </span>
      </div>
    </div>
  );
}