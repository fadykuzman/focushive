# Building Secure Google Calendar Integration with OAuth 2.0 PKCE in Next.js

*How to implement privacy-first calendar integration for your productivity app using modern authentication best practices*

---

Ever found yourself deep in a focus session only to realize you've missed an important meeting? As developers building productivity tools, we face a common challenge: helping users stay focused while keeping them aware of their commitments.

In this comprehensive tutorial, we'll build a secure Google Calendar integration for a Pomodoro timer app using OAuth 2.0 with PKCE (Proof Key for Code Exchange) – the gold standard for browser-based OAuth implementations in 2025.

## What We'll Build

By the end of this tutorial, you'll have:

- 🔐 **Secure OAuth 2.0 PKCE implementation** following security best practices
- 📅 **Read-only Google Calendar integration** with privacy controls
- 🔔 **Browser notifications** for upcoming meetings during focus sessions
- ⚠️ **Smart conflict detection** to prevent timer/meeting overlaps
- 🛡️ **Encrypted token storage** using Web Crypto API
- 🎨 **Clean UI components** that respect user privacy

## Why PKCE Matters in 2025

OAuth 2.0 with PKCE has become the security standard for single-page applications. Unlike the deprecated Implicit Flow, PKCE:

- **Prevents authorization code interception attacks**
- **Works securely without client secrets** (perfect for frontend apps)
- **Provides refresh tokens** for seamless user experience
- **Follows OAuth 2.1 security recommendations**

Let's dive into the implementation!

## 1. Setting Up Google Cloud Credentials

### Option A: Automated Setup (Recommended)

**Skip the manual setup!** Use our Infrastructure-as-Code automation:

```bash
# Clone the repository
git clone https://github.com/yourusername/focushive.git
cd focushive

# Run complete automated setup
./infrastructure/setup.sh
```

This will:
- Install OpenTofu/Terraform and Google Cloud CLI
- Authenticate with Google Cloud  
- Create Google Cloud project automatically
- Enable required APIs
- Configure OAuth consent screen
- Generate environment variables
- Guide you through any manual steps

**Continue to Option B if you prefer manual setup**

### Option B: Manual Setup

First, we need to configure Google Cloud for OAuth authentication.

#### Create Google Cloud Project

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "focushive-calendar")
3. Enable the Google Calendar API in "APIs & Services" → "Library"

### Configure OAuth Consent Screen

Navigate to "APIs & Services" → "OAuth consent screen":

```yaml
App Information:
  App name: "FocusHive"
  User support email: your-email@example.com
  
Scopes:
  - calendar.events.readonly
  
Test Users:
  - Add your email for testing
```

### Create OAuth Credentials

In "APIs & Services" → "Credentials":

```yaml
Application type: Web application
Name: FocusHive Calendar Client

Authorized JavaScript origins:
  - http://localhost:3001 (development)
  - https://yourdomain.com (production)

Authorized redirect URIs:
  - http://localhost:3001/auth/callback
  - https://yourdomain.com/auth/callback
```

Save your **Client ID** (you won't need the client secret for PKCE).

**Infrastructure-as-Code Alternative:**
All of the above steps can be automated using our Terraform/OpenTofu configuration in the `infrastructure/` directory. See the [infrastructure README](../infrastructure/README.md) for details.

## 2. Environment Configuration

### Automated Setup
If you used the automated setup, your `.env.local` file was created automatically. Skip to step 3.

### Manual Setup
Create `.env.local` in your Next.js project root:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3001/auth/callback
NEXT_PUBLIC_GOOGLE_SCOPES=https://www.googleapis.com/auth/calendar.events.readonly
```

## 3. Building Secure Token Storage

Modern browser security requires encrypted storage. Here's our implementation using the Web Crypto API:

```javascript
// src/utils/secureStorage.js
class SecureTokenStorage {
  constructor() {
    this.dbName = 'focushive_secure_tokens';
    this.dbVersion = 1;
    this.storeName = 'auth_tokens';
    this.db = null;
  }

  // Initialize IndexedDB
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('service', 'service', { unique: false });
        }
      };
    });
  }

  // Encrypt data using Web Crypto API
  async encrypt(data) {
    const encoder = new TextEncoder();
    const key = await this.getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(JSON.stringify(data))
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  // Generate session-based encryption key
  async getEncryptionKey() {
    if (this._encryptionKey) return this._encryptionKey;

    this._encryptionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false, // Non-extractable for security
      ['encrypt', 'decrypt']
    );

    return this._encryptionKey;
  }

  // Store OAuth tokens securely
  async storeTokens(service, tokens) {
    try {
      await this.init();
      
      const encryptedTokens = await this.encrypt({
        ...tokens,
        storedAt: Date.now(),
        service
      });

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.put({
          id: `${service}_tokens`,
          service,
          data: encryptedTokens,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`[SecureStorage] Tokens stored securely for ${service}`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to store tokens:`, error);
      throw new Error('Failed to store authentication tokens');
    }
  }
}

export const secureStorage = new SecureTokenStorage();
```

**Security Features:**
- AES-GCM encryption with 256-bit keys
- Session-based encryption keys (cleared on page unload)
- IndexedDB for persistent storage
- Automatic cleanup of expired tokens

## 4. OAuth 2.0 PKCE Implementation

Now for the core OAuth implementation:

```javascript
// src/utils/googleAuth.js
import { secureStorage } from './secureStorage';

class GoogleAuthManager {
  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    this.redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    this.scopes = ['https://www.googleapis.com/auth/calendar.events.readonly'];
    
    this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    this.tokenUrl = 'https://oauth2.googleapis.com/token';
    this.revokeUrl = 'https://oauth2.googleapis.com/revoke';
  }

  // Generate cryptographically secure random string
  generateRandomString(length = 128) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[byte % 66]
    ).join('');
  }

  // Generate PKCE code challenge
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    // Base64URL encode
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // Build authorization URL with PKCE
  async buildAuthUrl() {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateRandomString(32);

    // Store PKCE parameters securely
    await secureStorage.storeTokens('google_pkce', {
      code_verifier: codeVerifier,
      state: state,
      created_at: Date.now()
    });

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true'
    });

    return `${this.authUrl}?${params}`;
  }

  // Handle OAuth callback
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error('Missing authorization code or state');
    }

    // Retrieve and validate PKCE parameters
    const pkceData = await secureStorage.getTokens('google_pkce');
    if (!pkceData || pkceData.state !== state) {
      throw new Error('Invalid state parameter - potential CSRF attack');
    }

    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(code, pkceData.code_verifier);
    
    // Clean up PKCE data
    await secureStorage.removeTokens('google_pkce');
    
    // Store tokens securely
    await this.storeTokens(tokens);
    
    return { success: true, tokens };
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code, codeVerifier) {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        code: code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Token exchange failed: ${errorData.error_description || response.statusText}`);
    }

    const tokens = await response.json();
    
    // Add expiry timestamp
    if (tokens.expires_in) {
      tokens.expires_at = Math.floor(Date.now() / 1000) + tokens.expires_in;
    }

    return tokens;
  }
}

export const googleAuth = new GoogleAuthManager();
```

**PKCE Security Features:**
- Cryptographically secure code verifier (128 characters)
- SHA256-based code challenge
- State parameter for CSRF protection
- Automatic PKCE parameter cleanup
- Secure parameter storage

## 5. Google Calendar API Service

Create a service layer for calendar operations:

```javascript
// src/services/googleCalendar.js
import { googleAuth } from '@/utils/googleAuth';

class GoogleCalendarService {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/calendar/v3';
    this.calendarId = 'primary';
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
      
      // Filter out declined and all-day events
      return events
        .filter(event => {
          // Skip declined events
          if (event.attendees?.some(attendee => 
            attendee.self && attendee.responseStatus === 'declined'
          )) return false;

          // Skip all-day events
          if (!event.start.dateTime || !event.end.dateTime) return false;

          return true;
        })
        .map(this.formatEvent);
    } catch (error) {
      console.error('Failed to get today\'s events:', error);
      throw error;
    }
  }

  // Check for conflicts with a focus session
  async checkSessionConflicts(sessionStartTime, sessionDurationMinutes) {
    try {
      const sessionStart = new Date(sessionStartTime);
      const sessionEnd = new Date(sessionStart.getTime() + (sessionDurationMinutes * 60 * 1000));

      // Add 5-minute buffer
      const bufferTime = 5 * 60 * 1000;
      const checkStart = new Date(sessionStart.getTime() - bufferTime);
      const checkEnd = new Date(sessionEnd.getTime() + bufferTime);

      const events = await this.getEventsInRange(checkStart, checkEnd);

      const conflicts = events.filter(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        return (sessionStart < eventEnd && sessionEnd > eventStart);
      });

      return {
        hasConflicts: conflicts.length > 0,
        conflicts: conflicts,
        sessionStart,
        sessionEnd,
        warningMessage: conflicts.length > 0 
          ? this.generateConflictWarning(conflicts, sessionDurationMinutes)
          : null
      };
    } catch (error) {
      console.error('Failed to check session conflicts:', error);
      return { hasConflicts: false, conflicts: [], error: error.message };
    }
  }

  // Format event for privacy protection
  formatEvent(event) {
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);
    
    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      startTime,
      endTime,
      duration: endTime - startTime,
      location: event.location || '',
      isPrivate: event.visibility === 'private',
      // Privacy protection
      safeTitle: event.visibility === 'private' ? 'Private Event' : (event.summary || 'Untitled Event')
    };
  }
}

export const googleCalendar = new GoogleCalendarService();
```

## 6. React Integration Hook

Create a custom hook to manage calendar integration:

```javascript
// src/hooks/useCalendarIntegration.js
import { useState, useEffect, useCallback } from 'react';
import { googleAuth } from '@/utils/googleAuth';
import { googleCalendar } from '@/services/googleCalendar';

export function useCalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [error, setError] = useState(null);

  // Check authentication on mount
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
        setError(err.message);
      }
    };

    checkAuth();
  }, []);

  // Connect calendar
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

  // Disconnect calendar
  const disconnectCalendar = useCallback(async () => {
    try {
      setIsLoading(true);
      await googleAuth.signOut();
      
      setIsConnected(false);
      setUser(null);
      setTodaysEvents([]);
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
      const events = await googleCalendar.getTodaysEvents();
      setTodaysEvents(events);
    } catch (err) {
      console.error('Failed to refresh calendar data:', err);
    }
  }, [isConnected]);

  // Check session conflicts
  const checkSessionConflicts = useCallback(async (sessionDurationMinutes) => {
    if (!isConnected) return { hasConflicts: false, conflicts: [] };

    try {
      const sessionStart = new Date();
      return await googleCalendar.checkSessionConflicts(sessionStart, sessionDurationMinutes);
    } catch (err) {
      return { hasConflicts: false, conflicts: [], error: err.message };
    }
  }, [isConnected]);

  return {
    isConnected,
    isLoading,
    user,
    todaysEvents,
    error,
    connectCalendar,
    disconnectCalendar,
    refreshCalendarData,
    checkSessionConflicts,
    clearError: () => setError(null)
  };
}
```

## 7. OAuth Callback Page

Create the OAuth callback handler:

```jsx
// src/app/auth/callback/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { googleAuth } from '@/utils/googleAuth';

export default function AuthCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('processing');
        
        const result = await googleAuth.handleCallback();
        
        if (result.success) {
          setStatus('success');
          
          // Redirect back to app
          setTimeout(() => {
            window.location.href = `${window.location.origin}/?calendar_connected=true`;
          }, 2000);
        }
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') || urlParams.has('error')) {
      handleCallback();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-2">Connecting to Google...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">Successfully Connected!</h1>
            <p className="text-gray-600">Redirecting you back to FocusHive...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">Connection Failed</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.href = window.location.origin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to FocusHive
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

## 8. UI Components

### Settings Integration Component

```jsx
// src/components/settings/CalendarIntegrationSection.jsx
'use client';

import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';

export default function CalendarIntegrationSection() {
  const {
    isConnected,
    isLoading,
    user,
    error,
    connectCalendar,
    disconnectCalendar
  } = useCalendarIntegration();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Calendar Integration</h3>
      
      <div className="bg-gray-50 rounded-lg p-4">
        {!isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Google Calendar</h4>
                <p className="text-sm text-gray-600">Get notified before meetings during focus sessions</p>
              </div>
              <button
                onClick={connectCalendar}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Connecting...' : 'Connect Calendar'}
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              ✓ Read-only access • ✓ Never stores event details • ✓ Disconnect anytime
            </div>
          </div>
        ) : (
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
                <h4 className="font-medium">Connected to Google Calendar</h4>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={disconnectCalendar}
              className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
```

### Session Conflict Warning

```jsx
// src/components/SessionConflictWarning.jsx
'use client';

import BaseModal from '@/components/shared/BaseModal';

export default function SessionConflictWarning({ 
  isOpen, 
  onClose, 
  conflictData,
  onStartAnyway,
  onStartShorter 
}) {
  if (!conflictData?.hasConflicts) return null;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="⚠️ Calendar Conflict">
      <div className="space-y-4">
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-1">Session Conflicts with Calendar</h3>
          <p className="text-yellow-700 text-sm">{conflictData.warningMessage}</p>
        </div>

        {/* Conflicting Events */}
        <div className="space-y-2">
          <h4 className="font-medium">Conflicting Events:</h4>
          {conflictData.conflicts.map(event => (
            <div key={event.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
              <h5 className="font-medium text-red-800">{event.safeTitle}</h5>
              <p className="text-sm text-red-600">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onStartShorter}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start Shorter Session
          </button>
          <button
            onClick={onStartAnyway}
            className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
          >
            Start Anyway
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
```

## 9. Browser Notifications

Add notification support to your calendar integration:

```javascript
// src/hooks/useCalendarNotifications.js
import { useEffect } from 'react';

export function useCalendarNotifications(events, notificationTiming = 15) {
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const scheduleNotifications = () => {
      const now = new Date();
      const notificationTime = notificationTiming * 60 * 1000;

      events.forEach(event => {
        const eventStart = new Date(event.startTime);
        const notifyAt = eventStart.getTime() - notificationTime;
        const timeUntilNotification = notifyAt - now.getTime();

        if (timeUntilNotification > 0 && timeUntilNotification <= 8 * 60 * 60 * 1000) {
          setTimeout(() => {
            new Notification(`📅 ${event.safeTitle}`, {
              body: `Starting in ${notificationTiming} minutes`,
              icon: '/icons/calendar-notification.svg',
              requireInteraction: false
            });
          }, timeUntilNotification);
        }
      });
    };

    scheduleNotifications();
  }, [events, notificationTiming]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  return { requestPermission };
}
```

## 10. Security Best Practices

### Content Security Policy

Add CSP headers to your Next.js app:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval';
      connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com;
      img-src 'self' data: https:;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      }
    ];
  }
};
```

### Token Security Checklist

- ✅ **Use PKCE flow** (not Implicit flow)
- ✅ **Encrypt tokens** using Web Crypto API
- ✅ **Validate state parameter** to prevent CSRF
- ✅ **Store tokens in IndexedDB** (not localStorage)
- ✅ **Clear tokens on sign out** and page unload
- ✅ **Implement token refresh** for seamless experience
- ✅ **Use minimal scopes** (calendar.events.readonly)

## 11. Testing Your Integration

### Manual Testing Checklist

1. **OAuth Flow**
   - [ ] Authorization URL contains PKCE parameters
   - [ ] State parameter validates correctly
   - [ ] Code exchange succeeds with proper verifier
   - [ ] Tokens are encrypted in storage

2. **Calendar Integration**
   - [ ] Today's events load correctly
   - [ ] Private events show as "Private Event"
   - [ ] Conflict detection works with various scenarios
   - [ ] Notifications fire at correct times

3. **Error Handling**
   - [ ] Network failures gracefully handled
   - [ ] Token expiry triggers refresh
   - [ ] Invalid tokens trigger re-authentication

### Automated Testing

```javascript
// __tests__/googleAuth.test.js
import { googleAuth } from '@/utils/googleAuth';

describe('Google OAuth PKCE', () => {
  test('generates secure code verifier', () => {
    const verifier = googleAuth.generateRandomString(128);
    expect(verifier).toHaveLength(128);
    expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
  });

  test('creates valid code challenge', async () => {
    const verifier = 'test-verifier';
    const challenge = await googleAuth.generateCodeChallenge(verifier);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(challenge).not.toContain('=');
  });
});
```

## 12. Production Deployment

### Environment Variables

Set these in your production environment:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
vercel env add NEXT_PUBLIC_GOOGLE_REDIRECT_URI

# Deploy
vercel --prod
```

### Update Google Cloud Console

Add your production domain to authorized origins and redirect URIs:

```yaml
Authorized JavaScript origins:
  - https://yourdomain.com

Authorized redirect URIs:
  - https://yourdomain.com/auth/callback
```

## Conclusion

You've successfully implemented a secure, privacy-first Google Calendar integration using modern OAuth 2.0 PKCE standards. Key achievements:

🔐 **Security**: PKCE flow with encrypted token storage  
📅 **Privacy**: Read-only access with user-controlled visibility  
🔔 **UX**: Seamless notifications and conflict detection  
🛡️ **Best Practices**: Follows OAuth 2.1 recommendations  

This implementation provides a solid foundation for calendar integration that users can trust. The privacy-first approach and security-by-design architecture ensure your app meets modern web standards while delivering genuine value to productivity-focused users.

### What's Next?

Consider these enhancements for your calendar integration:

- **Multiple Calendar Support**: Add support for Outlook, Apple Calendar
- **Team Calendars**: Integrate shared calendar awareness
- **Smart Scheduling**: AI-powered optimal session timing
- **Calendar Webhooks**: Real-time event updates via push notifications

---

*Want to see this implementation in action? Check out [FocusHive](https://github.com/yourusername/focushive) on GitHub, and follow me for more productivity app tutorials!*

**Tags:** #OAuth #WebSecurity #GoogleCalendar #NextJS #ProductivityApps #WebDevelopment

---

*Have questions about OAuth security or calendar integration? Drop them in the comments below! 👇*