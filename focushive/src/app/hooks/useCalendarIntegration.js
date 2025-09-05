/**
 * Calendar Integration Hook
 * 
 * Manages Google Calendar integration, notifications, and conflict detection for FocusHive.
 */

import { useState, useEffect, useCallback } from 'react';
import { googleAuth } from '@/app/utils/googleAuth';
import { googleCalendar } from '@/app/services/googleCalendar';

export function useCalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [error, setError] = useState(null);
  
  // Notification settings
  const [notificationTiming, setNotificationTiming] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('calendar_notification_timing')) || 15;
    }
    return 15;
  });

  const [showPrivateDetails, setShowPrivateDetails] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calendar_show_private') !== 'false';
    }
    return true;
  });

  // Save notification settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendar_notification_timing', notificationTiming.toString());
      localStorage.setItem('calendar_show_private', showPrivateDetails.toString());
    }
  }, [notificationTiming, showPrivateDetails]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await googleAuth.isUserAuthenticated();
        setIsConnected(authenticated);
        
        if (authenticated) {
          setUser(googleAuth.getCurrentUser());
          await refreshCalendarData();
        }
      } catch (err) {
        console.error('Failed to check auth status:', err);
        setError(err.message);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh calendar data periodically
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      refreshCalendarData();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [isConnected]);

  // Initiate Google OAuth flow
  const connectCalendar = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await googleAuth.initiateAuth();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Disconnect from Google Calendar
  const disconnectCalendar = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await googleAuth.signOut();
      
      setIsConnected(false);
      setUser(null);
      setCalendarStatus(null);
      setTodaysEvents([]);
      
      // Clear notifications
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const notifications = await registration.getNotifications();
        notifications.forEach(notification => notification.close());
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh calendar data
  const refreshCalendarData = useCallback(async () => {
    if (!isConnected) return;

    try {
      const [status, events] = await Promise.all([
        googleCalendar.getCalendarStatus(),
        googleCalendar.getTodaysEvents()
      ]);

      setCalendarStatus(status);
      setTodaysEvents(events);
      
      // Schedule notifications for upcoming events
      await scheduleEventNotifications(events);
      
    } catch (err) {
      console.error('Failed to refresh calendar data:', err);
      // Don't set error state for background refreshes
    }
  }, [isConnected, notificationTiming]);

  // Check for session conflicts
  const checkSessionConflicts = useCallback(async (sessionDurationMinutes) => {
    if (!isConnected) return { hasConflicts: false, conflicts: [] };

    try {
      const sessionStart = new Date();
      return await googleCalendar.checkSessionConflicts(sessionStart, sessionDurationMinutes);
    } catch (err) {
      console.error('Failed to check session conflicts:', err);
      return { hasConflicts: false, conflicts: [], error: err.message };
    }
  }, [isConnected]);

  // Get optimal session length
  const getOptimalSessionLength = useCallback(async (defaultMinutes = 25) => {
    if (!isConnected) return defaultMinutes;

    try {
      return await googleCalendar.getOptimalSessionLength(defaultMinutes);
    } catch (err) {
      console.error('Failed to get optimal session length:', err);
      return defaultMinutes;
    }
  }, [isConnected]);

  // Schedule browser notifications for upcoming events
  const scheduleEventNotifications = useCallback(async (events) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    // Clear existing notifications
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const existingNotifications = await registration.getNotifications();
      existingNotifications.forEach(notification => notification.close());
    }

    const now = new Date();
    const notificationTime = notificationTiming * 60 * 1000; // Convert to milliseconds

    events.forEach(event => {
      const eventStart = new Date(event.startTime);
      const notifyAt = eventStart.getTime() - notificationTime;
      const timeUntilNotification = notifyAt - now.getTime();

      // Only schedule notifications for future events within the next 8 hours
      if (timeUntilNotification > 0 && timeUntilNotification <= 8 * 60 * 60 * 1000) {
        setTimeout(() => {
          const title = showPrivateDetails ? event.title : event.safeTitle;
          const body = `Starting in ${notificationTiming} minutes`;
          
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              registration.showNotification(`📅 ${title}`, {
                body: body,
                icon: '/icons/calendar-notification.svg',
                badge: '/icons/calendar-badge.svg',
                requireInteraction: false,
                silent: false,
                tag: `calendar-${event.id}`,
                data: {
                  eventId: event.id,
                  eventStart: event.startTime,
                  type: 'calendar-reminder'
                }
              });
            });
          } else {
            // Fallback to regular notification
            new Notification(`📅 ${title}`, {
              body: body,
              icon: '/icons/calendar-notification.svg'
            });
          }
        }, timeUntilNotification);
      }
    });
  }, [notificationTiming, showPrivateDetails]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notifications are blocked. Please enable them in your browser settings.');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Test notification
  const testNotification = useCallback(async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      
      if (hasPermission) {
        new Notification('🎯 FocusHive Calendar Test', {
          body: `You'll get notifications ${notificationTiming} minutes before calendar events.`,
          icon: '/icons/calendar-notification.svg'
        });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Test notification failed:', err);
      throw err;
    }
  }, [notificationTiming, requestNotificationPermission]);

  // Get next 3 events for display
  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return todaysEvents
      .filter(event => new Date(event.startTime) > now)
      .slice(0, 3)
      .map(event => ({
        ...event,
        displayTitle: showPrivateDetails ? event.title : event.safeTitle,
        timeUntil: Math.round((new Date(event.startTime) - now) / (60 * 1000))
      }));
  }, [todaysEvents, showPrivateDetails]);

  return {
    // Connection state
    isConnected,
    isLoading,
    user,
    error,
    
    // Calendar data
    calendarStatus,
    todaysEvents,
    upcomingEvents: getUpcomingEvents(),
    
    // Settings
    notificationTiming,
    setNotificationTiming,
    showPrivateDetails,
    setShowPrivateDetails,
    
    // Actions
    connectCalendar,
    disconnectCalendar,
    refreshCalendarData,
    checkSessionConflicts,
    getOptimalSessionLength,
    
    // Notifications
    requestNotificationPermission,
    testNotification,
    
    // Utilities
    clearError: () => setError(null)
  };
}