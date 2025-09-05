'use client';

import { useCalendarIntegration } from '@/app/hooks/useCalendarIntegration';
import IconButton from '@/app/components/shared/IconButton';

export default function CalendarStatusIndicator({ onCalendarClick }) {
  const {
    isConnected,
    calendarStatus,
    upcomingEvents
  } = useCalendarIntegration();

  if (!isConnected) return null;

  const getStatusColor = () => {
    if (!calendarStatus) return 'text-gray-400';
    
    switch (calendarStatus.color) {
      case 'green': return 'text-green-400';
      case 'yellow': return 'text-yellow-400'; 
      case 'red': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    if (!calendarStatus || calendarStatus.status === 'free') {
      return '/icons/calendar.svg';
    }
    return '/icons/calendar-alert.svg';
  };

  const getTooltipText = () => {
    if (!calendarStatus) return 'Calendar connected';
    
    if (upcomingEvents.length === 0) {
      return 'No upcoming events';
    }
    
    const nextEvent = upcomingEvents[0];
    return `${nextEvent.displayTitle} in ${nextEvent.timeUntil}m`;
  };

  return (
    <div className="relative">
      <IconButton
        icon={getStatusIcon()}
        onClick={onCalendarClick}
        size="md"
        variant="ghost"
        className={`${getStatusColor()} hover:opacity-100 transition-all`}
        title={getTooltipText()}
        aria-label="Calendar status"
      />
      
      {/* Status dot indicator */}
      {calendarStatus && (
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          calendarStatus.color === 'green' ? 'bg-green-500' :
          calendarStatus.color === 'yellow' ? 'bg-yellow-500' :
          calendarStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
        }`}></div>
      )}
    </div>
  );
}