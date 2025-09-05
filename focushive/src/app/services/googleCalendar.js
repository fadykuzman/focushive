/**
 * Google Calendar API Service
 * 
 * Handles all interactions with Google Calendar API for FocusHive.
 * Provides event fetching, conflict detection, and notification scheduling.
 */

import { googleAuth } from '@/app/utils/googleAuth';

class GoogleCalendarService {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/calendar/v3';
    this.calendarId = 'primary'; // User's primary calendar
  }

  // Make authenticated API request
  async makeAuthenticatedRequest(url, options = {}) {
    const accessToken = await googleAuth.getValidAccessToken();
    
    if (!accessToken) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, trigger re-authentication
        throw new Error('Authentication expired');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Calendar API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  // Get today's calendar events
  async getTodaysEvents() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const params = new URLSearchParams({
        calendarId: this.calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '50'
      });

      const url = `${this.baseUrl}/calendars/${this.calendarId}/events?${params}`;
      const response = await this.makeAuthenticatedRequest(url);

      const events = response.items || [];
      
      // Filter out declined events and all-day events
      const relevantEvents = events.filter(event => {
        // Skip declined events
        if (event.attendees?.some(attendee => 
          attendee.self && attendee.responseStatus === 'declined'
        )) {
          return false;
        }

        // Skip all-day events (they have 'date' instead of 'dateTime')
        if (!event.start.dateTime || !event.end.dateTime) {
          return false;
        }

        return true;
      });

      return relevantEvents.map(this.formatEvent);
    } catch (error) {
      console.error('[GoogleCalendar] Failed to get today\'s events:', error);
      throw error;
    }
  }

  // Get events in a specific time range
  async getEventsInRange(startTime, endTime) {
    try {
      const params = new URLSearchParams({
        calendarId: this.calendarId,
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '20'
      });

      const url = `${this.baseUrl}/calendars/${this.calendarId}/events?${params}`;
      const response = await this.makeAuthenticatedRequest(url);

      const events = response.items || [];
      
      return events
        .filter(event => {
          // Same filtering logic as getTodaysEvents
          if (event.attendees?.some(attendee => 
            attendee.self && attendee.responseStatus === 'declined'
          )) {
            return false;
          }
          
          if (!event.start.dateTime || !event.end.dateTime) {
            return false;
          }
          
          return true;
        })
        .map(this.formatEvent);
    } catch (error) {
      console.error('[GoogleCalendar] Failed to get events in range:', error);
      throw error;
    }
  }

  // Format event data for FocusHive
  formatEvent(event) {
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);
    
    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      startTime: startTime,
      endTime: endTime,
      duration: endTime - startTime,
      location: event.location || '',
      isPrivate: event.visibility === 'private',
      organizer: event.organizer?.email || '',
      attendees: event.attendees?.length || 0,
      url: event.htmlLink,
      // Privacy protection: don't expose sensitive details
      safeTitle: event.visibility === 'private' ? 'Private Event' : (event.summary || 'Untitled Event')
    };
  }

  // Check for conflicts with a focus session
  async checkSessionConflicts(sessionStartTime, sessionDurationMinutes) {
    try {
      const sessionStart = new Date(sessionStartTime);
      const sessionEnd = new Date(sessionStart.getTime() + (sessionDurationMinutes * 60 * 1000));

      // Add 5-minute buffer to account for transition time
      const bufferTime = 5 * 60 * 1000;
      const checkStart = new Date(sessionStart.getTime() - bufferTime);
      const checkEnd = new Date(sessionEnd.getTime() + bufferTime);

      const events = await this.getEventsInRange(checkStart, checkEnd);

      const conflicts = events.filter(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);

        // Check for overlap
        return (sessionStart < eventEnd && sessionEnd > eventStart);
      });

      return {
        hasConflicts: conflicts.length > 0,
        conflicts: conflicts,
        sessionStart: sessionStart,
        sessionEnd: sessionEnd,
        warningMessage: conflicts.length > 0 
          ? this.generateConflictWarning(conflicts, sessionDurationMinutes)
          : null
      };
    } catch (error) {
      console.error('[GoogleCalendar] Failed to check session conflicts:', error);
      // Don't block user if calendar check fails
      return {
        hasConflicts: false,
        conflicts: [],
        sessionStart: new Date(sessionStartTime),
        sessionEnd: new Date(sessionStartTime + (sessionDurationMinutes * 60 * 1000)),
        warningMessage: null,
        error: error.message
      };
    }
  }

  // Generate user-friendly conflict warning
  generateConflictWarning(conflicts, sessionDurationMinutes) {
    if (conflicts.length === 1) {
      const event = conflicts[0];
      const eventStart = new Date(event.startTime);
      const timeUntilEvent = Math.round((eventStart - new Date()) / (60 * 1000));
      
      return `Your ${sessionDurationMinutes}-minute session might overlap with "${event.safeTitle}" starting in ${timeUntilEvent} minutes.`;
    } else {
      return `Your ${sessionDurationMinutes}-minute session conflicts with ${conflicts.length} calendar events.`;
    }
  }

  // Get next upcoming event
  async getNextUpcomingEvent(withinHours = 8) {
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + (withinHours * 60 * 60 * 1000));

      const events = await this.getEventsInRange(now, endTime);
      
      // Find the next event that hasn't started yet
      const upcomingEvents = events.filter(event => 
        new Date(event.startTime) > now
      );

      return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    } catch (error) {
      console.error('[GoogleCalendar] Failed to get next upcoming event:', error);
      return null;
    }
  }

  // Calculate optimal session length based on calendar
  async getOptimalSessionLength(defaultMinutes = 25) {
    try {
      const nextEvent = await this.getNextUpcomingEvent();
      
      if (!nextEvent) {
        return defaultMinutes;
      }

      const now = new Date();
      const eventStart = new Date(nextEvent.startTime);
      const availableMinutes = Math.floor((eventStart - now) / (60 * 1000));

      // Leave 10-minute buffer before the event
      const bufferMinutes = 10;
      const maxSessionMinutes = Math.max(5, availableMinutes - bufferMinutes);

      // Suggest common session lengths
      const commonLengths = [15, 25, 30, 45, 60, 90];
      const suggestedLength = commonLengths.find(length => length <= maxSessionMinutes) || 15;

      return Math.min(suggestedLength, defaultMinutes);
    } catch (error) {
      console.error('[GoogleCalendar] Failed to calculate optimal session length:', error);
      return defaultMinutes;
    }
  }

  // Get calendar status for UI indicator
  async getCalendarStatus() {
    try {
      const nextEvent = await this.getNextUpcomingEvent(2); // Next 2 hours
      
      if (!nextEvent) {
        return {
          status: 'free',
          message: 'Clear schedule',
          color: 'green',
          nextEventIn: null
        };
      }

      const now = new Date();
      const eventStart = new Date(nextEvent.startTime);
      const minutesUntilEvent = Math.round((eventStart - now) / (60 * 1000));

      if (minutesUntilEvent <= 30) {
        return {
          status: 'busy-soon',
          message: `${nextEvent.safeTitle} in ${minutesUntilEvent}m`,
          color: 'red',
          nextEventIn: minutesUntilEvent
        };
      } else if (minutesUntilEvent <= 60) {
        return {
          status: 'busy-later',
          message: `${nextEvent.safeTitle} in ${minutesUntilEvent}m`,
          color: 'yellow',
          nextEventIn: minutesUntilEvent
        };
      } else {
        return {
          status: 'free',
          message: `Free until ${eventStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          color: 'green',
          nextEventIn: minutesUntilEvent
        };
      }
    } catch (error) {
      console.error('[GoogleCalendar] Failed to get calendar status:', error);
      return {
        status: 'error',
        message: 'Calendar unavailable',
        color: 'gray',
        nextEventIn: null,
        error: error.message
      };
    }
  }

  // Test calendar connection
  async testConnection() {
    try {
      const url = `${this.baseUrl}/calendars/${this.calendarId}`;
      const response = await this.makeAuthenticatedRequest(url);
      
      return {
        success: true,
        calendar: {
          id: response.id,
          summary: response.summary,
          timeZone: response.timeZone
        }
      };
    } catch (error) {
      console.error('[GoogleCalendar] Connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const googleCalendar = new GoogleCalendarService();