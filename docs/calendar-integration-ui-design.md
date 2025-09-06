# Google Calendar Integration UI Design System
## BelugaFocus Pomodoro Timer App

### Table of Contents
1. [Design System Foundation](#design-system-foundation)
2. [Component Specifications](#component-specifications)
3. [Privacy-First Design Patterns](#privacy-first-design-patterns)
4. [Visual Hierarchy & Information Architecture](#visual-hierarchy--information-architecture)
5. [Mobile Adaptations](#mobile-adaptations)
6. [Accessibility Guidelines](#accessibility-guidelines)
7. [Implementation Guidelines](#implementation-guidelines)

---

## Design System Foundation

### Core Design Principles
- **Privacy-First**: Clear communication about data access and usage
- **Minimal Disruption**: Calendar features integrate seamlessly without breaking focus
- **Trust Building**: Visual indicators and messaging that build user confidence
- **Progressive Disclosure**: Show information when needed, hide when not
- **Accessibility**: WCAG 2.1 AA compliant throughout

### Color System for Calendar Integration

```css
/* Calendar Status Colors */
--color-calendar-free: #10b981;        /* Green - Free/Available */
--color-calendar-busy-soon: #f59e0b;   /* Amber - Meeting approaching */
--color-calendar-conflict: #ef4444;    /* Red - Active conflict */
--color-calendar-neutral: #6b7280;     /* Gray - Disconnected/Unknown */
--color-calendar-connected: #3b82f6;   /* Blue - Connected status */

/* Privacy & Trust Indicators */
--color-privacy-secure: #059669;       /* Green - Secure/Private */
--color-privacy-warning: #dc2626;      /* Red - Attention needed */
--color-privacy-info: #2563eb;         /* Blue - Information */

/* Background Colors */
--color-calendar-bg-light: #f9fafb;    /* Light neutral background */
--color-calendar-bg-connected: #eff6ff; /* Connected state background */
--color-calendar-bg-warning: #fef3c7;  /* Warning background */
--color-calendar-bg-error: #fee2e2;    /* Error background */
```

### Typography Scale (Extended for Calendar)

```css
/* Calendar-specific typography */
--font-size-calendar-event: 0.875rem;    /* 14px - Event titles */
--font-size-calendar-time: 0.75rem;      /* 12px - Time displays */
--font-size-calendar-status: 0.8125rem;  /* 13px - Status messages */
--font-size-calendar-privacy: 0.6875rem; /* 11px - Privacy notices */

/* Weight variants */
--font-weight-calendar-event: 500;       /* Medium for event titles */
--font-weight-calendar-status: 400;      /* Regular for status */
--font-weight-calendar-privacy: 400;     /* Regular for privacy text */
```

### Spacing System (Calendar-specific)

```css
/* Calendar component spacing */
--spacing-calendar-compact: 0.375rem;    /* 6px - Tight spacing in lists */
--spacing-calendar-item: 0.75rem;        /* 12px - Between calendar items */
--spacing-calendar-section: 1.5rem;      /* 24px - Between sections */
--spacing-calendar-modal: 2rem;          /* 32px - Modal padding */

/* Status indicator sizes */
--size-status-dot: 0.5rem;               /* 8px - Small status dots */
--size-status-indicator: 1rem;           /* 16px - Larger status indicators */
--size-avatar: 2rem;                     /* 32px - User profile images */
```

---

## Component Specifications

### 1. Settings Integration Section

**Purpose**: Primary connection point for Google Calendar integration within Settings modal

**Visual Hierarchy**:
1. Section heading
2. Connection status/user info
3. Privacy assurance badges
4. Action buttons
5. Configuration options (when connected)

**Disconnected State**:
```jsx
<div className="space-y-4" id="calendar-integration-section">
  <h3 className="text-heading-h4 text-gray-700">Calendar Integration</h3>
  
  {/* Main Connection Card */}
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <img src="/icons/calendar.svg" alt="" className="w-5 h-5 text-gray-400" />
          <h4 className="font-medium text-gray-800 text-ui">Google Calendar</h4>
        </div>
        <p className="text-body-sm text-gray-600 mb-3">
          Get notified before meetings during focus sessions
        </p>
        
        {/* Privacy Assurance - Prominent placement */}
        <div className="flex items-center gap-3 text-caption text-gray-500 bg-white rounded-md p-2 border border-gray-100">
          <div className="flex items-center gap-1">
            <img src="/icons/shield-check.svg" alt="" className="w-3 h-3 text-success-600" />
            <span>Read-only access</span>
          </div>
          <div className="flex items-center gap-1">
            <img src="/icons/eye-slash.svg" alt="" className="w-3 h-3 text-success-600" />
            <span>Never stores events</span>
          </div>
          <div className="flex items-center gap-1">
            <img src="/icons/power.svg" alt="" className="w-3 h-3 text-success-600" />
            <span>Disconnect anytime</span>
          </div>
        </div>
      </div>
      
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-ui-sm font-medium ml-4 min-w-[120px]"
        id="connect-calendar-button"
      >
        Connect Calendar
      </button>
    </div>
  </div>

  {/* Privacy Details Expandable Section */}
  <details className="text-caption text-gray-500">
    <summary className="cursor-pointer hover:text-gray-700 mb-2">
      What permissions are requested?
    </summary>
    <div className="pl-4 space-y-1 text-gray-600">
      <div>• View your calendar events (read-only)</div>
      <div>• See event times and basic details</div>
      <div>• No access to edit, create, or delete events</div>
    </div>
  </details>
</div>
```

**Connected State**:
```jsx
<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
  {/* User Info Header */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <img 
        src={user.picture} 
        alt={user.name}
        className="w-8 h-8 rounded-full ring-2 ring-blue-200"
      />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800 text-ui">Connected to Google Calendar</h4>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Active connection"></span>
        </div>
        <p className="text-body-sm text-gray-600">{user.email}</p>
      </div>
    </div>
    
    <button
      className="text-red-600 hover:text-red-800 text-ui-sm transition-colors px-3 py-1 rounded hover:bg-red-50"
      id="disconnect-calendar-button"
    >
      Disconnect
    </button>
  </div>

  {/* Current Status Indicator */}
  <div className="flex items-center gap-2 text-ui-sm mb-4 p-2 bg-white rounded border">
    <span className="w-2 h-2 rounded-full bg-green-500"></span>
    <span className="text-gray-700">Free for the next 2 hours</span>
  </div>

  {/* Upcoming Events Preview */}
  <div className="space-y-2 mb-4">
    <h5 className="text-ui-sm font-medium text-gray-700">Next events:</h5>
    <div className="space-y-1">
      <div className="flex justify-between items-center text-calendar-event text-gray-600 bg-white rounded p-2">
        <span className="truncate">Team Standup</span>
        <span className="text-calendar-time text-gray-500 ml-2">in 45m</span>
      </div>
      <div className="flex justify-between items-center text-calendar-event text-gray-600 bg-white rounded p-2">
        <span className="truncate">Design Review</span>
        <span className="text-calendar-time text-gray-500 ml-2">in 2h 15m</span>
      </div>
    </div>
  </div>
</div>

{/* Configuration Options */}
<div className="space-y-4 border-t pt-4">
  <h4 className="font-medium text-gray-700 text-ui">Notification Settings</h4>
  
  {/* Notification Timing */}
  <div className="flex items-center justify-between">
    <label className="text-gray-600 text-ui-sm">Notify me before events</label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        max="60"
        value="5"
        className="w-16 text-center border rounded px-2 py-1 text-ui-sm"
      />
      <span className="text-gray-500 text-ui-sm">min</span>
    </div>
  </div>

  {/* Privacy Toggle */}
  <div className="flex items-center justify-between">
    <div>
      <label className="text-gray-600 text-ui-sm">Show event titles</label>
      <p className="text-calendar-privacy text-gray-500">Private events always show as "Private Event"</p>
    </div>
    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
      <input type="checkbox" className="sr-only peer" />
      <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform peer-checked:translate-x-6 peer-checked:bg-blue-500" />
    </div>
  </div>

  {/* Control Buttons */}
  <div className="flex gap-2 mt-4">
    <button className="flex-1 px-3 py-2 text-ui-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
      Check Permissions
    </button>
    <button className="flex-1 px-3 py-2 text-ui-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
      Test Notification
    </button>
  </div>
</div>
```

### 2. Calendar Status Indicator (Timer Interface)

**Purpose**: Subtle indicator in timer interface showing current calendar status without disruption

**Position**: Top-right area of timer interface, next to existing controls
**Behavior**: Only visible when calendar is connected and relevant

```jsx
<div className="absolute top-4 right-4 z-10" id="calendar-status-indicator">
  {/* Free Status */}
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white/80">
    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
    <span className="text-caption">Free</span>
  </div>

  {/* Meeting Soon Status */}
  <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-full px-3 py-1 text-yellow-100 border border-yellow-400/30">
    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
    <span className="text-caption">Meeting in 5m</span>
  </div>

  {/* Conflict Status */}
  <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1 text-red-100 border border-red-400/30">
    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
    <span className="text-caption">In meeting</span>
  </div>
</div>
```

**Interactive Behavior**:
- Click to open Calendar Modal
- Hover shows tooltip with next event time
- Automatically updates every minute
- Fades out during active focus sessions (can be toggled)

### 3. Calendar Modal (Full Event View)

**Purpose**: Dedicated view of today's calendar events accessible from status indicator or menu

**Layout**: Full-width modal optimized for quick scanning

```jsx
<BaseModal
  isOpen={isCalendarModalOpen}
  onClose={closeCalendarModal}
  title="Today's Schedule"
  size="lg"
  id="calendar-modal"
>
  <div className="space-y-6">
    {/* Header with connection status */}
    <div className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center gap-3">
        <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
        <div>
          <p className="text-ui font-medium">{user.email}</p>
          <p className="text-calendar-status text-gray-500">
            Last updated: 2 minutes ago
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-ui-sm text-gray-700">Free until 2:00 PM</span>
      </div>
    </div>

    {/* Current Time Indicator */}
    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
      <div className="flex items-center gap-2">
        <img src="/icons/clock.svg" alt="" className="w-4 h-4 text-blue-600" />
        <span className="text-ui font-medium text-blue-800">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-ui-sm text-blue-600">Current time</span>
      </div>
    </div>

    {/* Events List */}
    <div className="space-y-2">
      <h3 className="text-ui font-medium text-gray-800 mb-3">Today's Events</h3>
      
      {/* Event Item - Upcoming */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border">
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-ui-sm font-medium text-gray-900">2:00</span>
          <span className="text-calendar-time text-gray-500">PM</span>
          <div className="w-1 h-6 bg-yellow-300 rounded-full mt-1"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-calendar-event font-medium text-gray-900 truncate mb-1">
            Team Standup
          </h4>
          <div className="flex items-center gap-4 text-calendar-time text-gray-500">
            <span>📅 30 min</span>
            <span>👥 5 attendees</span>
            <span className="flex items-center gap-1">
              <img src="/icons/video.svg" alt="" className="w-3 h-3" />
              Google Meet
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-calendar-time text-yellow-600 font-medium">
            In 45m
          </span>
          <button className="text-calendar-time text-gray-500 hover:text-gray-700">
            Set reminder
          </button>
        </div>
      </div>

      {/* Event Item - Later Today */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-white border">
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-ui-sm font-medium text-gray-900">4:30</span>
          <span className="text-calendar-time text-gray-500">PM</span>
          <div className="w-1 h-6 bg-gray-300 rounded-full mt-1"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-calendar-event font-medium text-gray-900 truncate mb-1">
            Design Review
          </h4>
          <div className="flex items-center gap-4 text-calendar-time text-gray-500">
            <span>📅 60 min</span>
            <span>👥 3 attendees</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-calendar-time text-gray-600">
            In 2h 45m
          </span>
        </div>
      </div>

      {/* Private Event */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-dashed">
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-ui-sm font-medium text-gray-900">6:00</span>
          <span className="text-calendar-time text-gray-500">PM</span>
          <div className="w-1 h-6 bg-gray-300 rounded-full mt-1"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-calendar-event font-medium text-gray-700 italic">
              Private Event
            </h4>
            <img src="/icons/lock.svg" alt="Private" className="w-3 h-3 text-gray-400" />
          </div>
          <div className="flex items-center gap-4 text-calendar-time text-gray-500">
            <span>📅 Duration hidden</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-calendar-time text-gray-600">
            In 5h
          </span>
        </div>
      </div>
    </div>

    {/* No Events State */}
    <div className="text-center py-8 text-gray-500">
      <img src="/icons/calendar-check.svg" alt="" className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <h3 className="text-ui font-medium mb-1">No events today</h3>
      <p className="text-ui-sm">You have a clear calendar - perfect for deep focus!</p>
    </div>

    {/* Footer Actions */}
    <div className="flex justify-between items-center pt-4 border-t">
      <button
        className="text-ui-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
        onClick={refreshCalendar}
      >
        <img src="/icons/refresh.svg" alt="" className="w-4 h-4" />
        Refresh
      </button>
      
      <div className="flex gap-2">
        <button className="px-4 py-2 text-ui-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          Settings
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white text-ui-sm rounded-lg hover:bg-blue-600">
          Close
        </button>
      </div>
    </div>
  </div>
</BaseModal>
```

### 4. Session Conflict Warning Modal

**Purpose**: Alert users when starting/continuing a focus session that conflicts with calendar events

**Trigger**: Appears when user starts timer and calendar shows conflicting meeting
**Priority**: High - blocks timer start until acknowledged

```jsx
<BaseModal
  isOpen={isConflictWarningOpen}
  onClose={closeConflictWarning}
  title=""
  size="md"
  id="session-conflict-modal"
  showCloseButton={false}
>
  <div className="text-center space-y-6">
    {/* Warning Icon */}
    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
      <img src="/icons/exclamation-triangle.svg" alt="" className="w-8 h-8 text-yellow-600" />
    </div>
    
    {/* Title */}
    <div>
      <h2 className="text-heading-h2 text-gray-900 mb-2">
        Meeting Conflict Detected
      </h2>
      <p className="text-body text-gray-600">
        You have a meeting starting soon that overlaps with your focus session.
      </p>
    </div>

    {/* Conflict Details */}
    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-left">
      <div className="flex items-start gap-3">
        <img src="/icons/calendar.svg" alt="" className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-ui font-medium text-gray-900 mb-1">
            Team Standup
          </h3>
          <div className="space-y-1 text-ui-sm text-gray-600">
            <div>📅 2:00 PM - 2:30 PM (30 min)</div>
            <div>⏰ Starts in 15 minutes</div>
            <div>👥 5 attendees</div>
          </div>
        </div>
      </div>
    </div>

    {/* Options */}
    <div className="space-y-3">
      <div className="text-left">
        <h3 className="text-ui font-medium text-gray-900 mb-3">What would you like to do?</h3>
        
        <div className="space-y-2">
          <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="conflict-action" value="shorten" className="mt-1" />
            <div>
              <div className="font-medium text-ui">Shorten focus session</div>
              <div className="text-ui-sm text-gray-600">End session 5 minutes before meeting (10 min focus)</div>
            </div>
          </label>
          
          <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="conflict-action" value="continue" className="mt-1" />
            <div>
              <div className="font-medium text-ui">Continue anyway</div>
              <div className="text-ui-sm text-gray-600">I'll manage the conflict manually</div>
            </div>
          </label>
          
          <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="conflict-action" value="cancel" className="mt-1" />
            <div>
              <div className="font-medium text-ui">Don't start session</div>
              <div className="text-ui-sm text-gray-600">Wait until after the meeting</div>
            </div>
          </label>
        </div>
      </div>
    </div>

    {/* Notification Settings */}
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-left">
      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked className="rounded" />
        <span className="text-ui-sm text-gray-700">
          Remind me 5 minutes before the meeting
        </span>
      </label>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 pt-2">
      <button
        onClick={closeConflictWarning}
        className="flex-1 px-4 py-2 text-ui border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleConflictDecision}
        className="flex-1 px-4 py-2 bg-blue-500 text-white text-ui rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Start Session
      </button>
    </div>
  </div>
</BaseModal>
```

### 5. Onboarding Flow

**Purpose**: Guide users through calendar connection with emphasis on privacy and benefits

**Flow**: Multi-step process that can be initiated from Settings or first-time prompts

**Step 1: Introduction**
```jsx
<BaseModal
  isOpen={isOnboardingOpen}
  onClose={closeOnboarding}
  title="Calendar Integration"
  size="md"
  id="calendar-onboarding-modal"
>
  <div className="space-y-6 text-center">
    {/* Hero Illustration */}
    <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
      <img src="/icons/calendar-plus.svg" alt="" className="w-12 h-12 text-blue-600" />
    </div>
    
    {/* Benefits */}
    <div>
      <h2 className="text-heading-h2 text-gray-900 mb-3">
        Never Miss a Meeting Again
      </h2>
      <p className="text-body text-gray-600 mb-6">
        Connect your Google Calendar to get smart notifications during focus sessions.
      </p>
    </div>

    {/* Feature List */}
    <div className="space-y-4 text-left">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/bell.svg" alt="" className="w-3 h-3 text-green-600" />
        </div>
        <div>
          <h3 className="text-ui font-medium text-gray-900">Smart Notifications</h3>
          <p className="text-ui-sm text-gray-600">Get alerted before meetings during focus sessions</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/clock.svg" alt="" className="w-3 h-3 text-green-600" />
        </div>
        <div>
          <h3 className="text-ui font-medium text-gray-900">Conflict Detection</h3>
          <p className="text-ui-sm text-gray-600">Automatically adjust session length to avoid meeting conflicts</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/eye.svg" alt="" className="w-3 h-3 text-green-600" />
        </div>
        <div>
          <h3 className="text-ui font-medium text-gray-900">Privacy First</h3>
          <p className="text-ui-sm text-gray-600">Read-only access, no data stored on our servers</p>
        </div>
      </div>
    </div>

    {/* Privacy Assurance */}
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <img src="/icons/shield-check.svg" alt="" className="w-5 h-5 text-green-600" />
        <span className="text-ui font-medium text-green-800">Privacy Guaranteed</span>
      </div>
      <ul className="text-ui-sm text-green-700 space-y-1">
        <li>• Only reads basic event information (time, title, duration)</li>
        <li>• Never stores your calendar data</li>
        <li>• No access to edit, create, or delete events</li>
        <li>• Disconnect anytime with one click</li>
      </ul>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-3 pt-2">
      <button
        onClick={startCalendarConnection}
        className="w-full px-4 py-3 bg-blue-500 text-white text-ui rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <img src="/icons/google.svg" alt="" className="w-5 h-5" />
        Connect Google Calendar
      </button>
      <button
        onClick={closeOnboarding}
        className="w-full px-4 py-2 text-ui text-gray-600 hover:text-gray-800 transition-colors"
      >
        Maybe later
      </button>
    </div>

    {/* Legal Links */}
    <div className="text-center text-calendar-privacy text-gray-500">
      By connecting, you agree to our{' '}
      <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
      {' '}and{' '}
      <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
    </div>
  </div>
</BaseModal>
```

**Step 2: OAuth Consent (Handled by Google)**
- Redirects to Google OAuth flow
- Returns to app with success/error state
- Shows loading state during process

**Step 3: Success & Configuration**
```jsx
<BaseModal
  isOpen={isOnboardingSuccessOpen}
  onClose={closeOnboardingSuccess}
  title=""
  size="md"
  id="calendar-success-modal"
>
  <div className="space-y-6 text-center">
    {/* Success Icon */}
    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
      <img src="/icons/check-circle.svg" alt="" className="w-10 h-10 text-green-600" />
    </div>
    
    {/* Success Message */}
    <div>
      <h2 className="text-heading-h2 text-gray-900 mb-2">
        Calendar Connected Successfully!
      </h2>
      <p className="text-body text-gray-600">
        Welcome back, {user.name}. Let's configure your preferences.
      </p>
    </div>

    {/* User Info */}
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-center gap-3">
        <img 
          src={user.picture} 
          alt={user.name}
          className="w-10 h-10 rounded-full ring-2 ring-blue-200"
        />
        <div className="text-left">
          <div className="font-medium text-gray-900 text-ui">{user.name}</div>
          <div className="text-ui-sm text-gray-600">{user.email}</div>
        </div>
      </div>
    </div>

    {/* Quick Setup */}
    <div className="space-y-4 text-left">
      <h3 className="text-ui font-medium text-gray-900">Quick Setup</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <label className="text-ui text-gray-700">Notification timing</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="60"
              value="5"
              className="w-16 text-center border rounded px-2 py-1 text-ui-sm"
            />
            <span className="text-gray-500 text-ui-sm">minutes before</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <label className="text-ui text-gray-700">Show event titles</label>
            <p className="text-ui-sm text-gray-500">Private events are always hidden</p>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform translate-x-6" />
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-3 pt-2">
      <button
        onClick={completeOnboarding}
        className="w-full px-4 py-3 bg-blue-500 text-white text-ui rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Complete Setup
      </button>
      <button
        onClick={testNotification}
        className="w-full px-4 py-2 text-ui text-blue-600 hover:text-blue-800 transition-colors"
      >
        Test Notification
      </button>
    </div>
  </div>
</BaseModal>
```

---

## Privacy-First Design Patterns

### Trust Building Visual Elements

**Security Badges**
```jsx
{/* Prominent placement in connection flow */}
<div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
  <img src="/icons/shield-check.svg" alt="" className="w-5 h-5 text-green-600" />
  <span className="text-ui-sm font-medium text-green-800">Verified Secure Connection</span>
</div>
```

**Privacy Indicators**
```jsx
{/* Clear data usage messaging */}
<div className="space-y-2 text-ui-sm text-gray-600">
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span>Read-only access to calendar events</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span>No data stored on BelugaFocus servers</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span>Revoke access anytime</span>
  </div>
</div>
```

**Data Handling Transparency**
```jsx
{/* Expandable details */}
<details className="text-ui-sm text-gray-600 mt-4">
  <summary className="cursor-pointer hover:text-gray-800 mb-2">
    How is my calendar data handled?
  </summary>
  <div className="pl-4 space-y-2 text-gray-600">
    <p>Your calendar data is processed locally in your browser and never sent to our servers.</p>
    <p>We only access basic event information: title, time, duration, and attendee count.</p>
    <p>Private events are automatically filtered and show only as "Private Event".</p>
    <p>You can revoke access at any time through Google's security settings or our app.</p>
  </div>
</details>
```

### Permission Scoping

**Clear Scope Communication**
```jsx
<div className="bg-gray-50 rounded-lg p-4">
  <h4 className="font-medium text-gray-800 mb-3">Permissions Requested</h4>
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-ui-sm text-gray-700">View calendar events</span>
      <span className="text-ui-xs text-green-600 bg-green-100 px-2 py-1 rounded">Read-only</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-ui-sm text-gray-700">See event details</span>
      <span className="text-ui-xs text-green-600 bg-green-100 px-2 py-1 rounded">Basic info only</span>
    </div>
  </div>
  
  <div className="mt-3 pt-3 border-t border-gray-200">
    <h5 className="text-ui-sm font-medium text-gray-700 mb-2">Not requested:</h5>
    <div className="space-y-1 text-ui-sm text-gray-500">
      <div>✗ Edit or delete events</div>
      <div>✗ Create new events</div>
      <div>✗ Access to other Google services</div>
    </div>
  </div>
</div>
```

---

## Visual Hierarchy & Information Architecture

### Information Prioritization (Top to Bottom)

1. **Primary Status** - Current availability/conflict state
2. **Immediate Actions** - Connect, disconnect, emergency controls
3. **Upcoming Context** - Next 1-2 events preview
4. **Configuration Options** - Settings and preferences
5. **Secondary Info** - Help, legal, technical details

### Progressive Disclosure Patterns

**Collapsed State (Default)**
- Connection status
- Primary action button
- Key privacy points

**Expanded State (After Connection)**
- User profile info
- Current status with timing
- Next events preview
- Configuration options

**Detailed View (Calendar Modal)**
- Full day schedule
- Detailed event information
- Advanced controls

### Visual Weight Distribution

**High Weight (Most Prominent)**
- Connection status indicators
- Conflict warnings
- Primary action buttons

**Medium Weight**
- Event titles and times
- Status messages
- Configuration toggles

**Low Weight**
- Privacy notices
- Technical details
- Secondary actions

---

## Mobile Adaptations

### Responsive Breakpoints

```css
/* Mobile First Approach */

/* Mobile (320px - 767px) */
@media (max-width: 767px) {
  .calendar-status-indicator {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 50;
  }
  
  .calendar-modal-content {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .event-list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .calendar-integration-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .calendar-status-indicator {
    right: 2rem;
    top: 2rem;
  }
}
```

### Touch-Optimized Interactions

**Minimum Touch Targets**: 44px × 44px (iOS HIG standard)
**Gesture Support**:
- Swipe down to refresh calendar
- Long press for quick actions
- Pull-to-refresh in calendar modal

### Mobile-Specific Components

**Compact Status Indicator**
```jsx
<div className="fixed top-4 right-4 z-50 sm:relative sm:top-0 sm:right-0">
  <button 
    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border min-h-[44px]"
    onClick={openCalendarModal}
  >
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span className="text-ui-sm">Free</span>
  </button>
</div>
```

**Mobile Calendar Modal**
```jsx
<BaseModal
  size="xl"
  className="sm:hidden" // Full screen on mobile
  contentClassName="h-full flex flex-col"
>
  {/* Fixed Header */}
  <div className="flex-shrink-0 pb-4 border-b">
    {/* Header content */}
  </div>
  
  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto py-4">
    {/* Events list */}
  </div>
  
  {/* Fixed Footer */}
  <div className="flex-shrink-0 pt-4 border-t">
    {/* Action buttons */}
  </div>
</BaseModal>
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast Requirements**
- Text on backgrounds: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum  
- Non-text elements: 3:1 minimum

**Color Usage**
```css
/* Status colors with sufficient contrast */
.status-free { color: #059669; background: #f0fdf4; } /* 4.87:1 */
.status-busy-soon { color: #d97706; background: #fffbeb; } /* 4.64:1 */
.status-conflict { color: #dc2626; background: #fef2f2; } /* 5.36:1 */
```

### Keyboard Navigation

**Tab Order**
1. Connect/Disconnect button
2. Configuration options
3. Test buttons
4. Modal close button

**Keyboard Shortcuts**
- `Escape` - Close modals
- `Enter/Space` - Activate buttons
- `Tab/Shift+Tab` - Navigate elements

### Screen Reader Support

**ARIA Labels**
```jsx
<div 
  role="status" 
  aria-live="polite"
  aria-label="Calendar connection status"
>
  <span className="sr-only">Calendar status: </span>
  Free until 2:00 PM
</div>

<button 
  aria-label="Connect Google Calendar for meeting notifications"
  aria-describedby="privacy-notice"
>
  Connect Calendar
</button>

<div id="privacy-notice" className="sr-only">
  Read-only access, no data stored, disconnect anytime
</div>
```

**Status Announcements**
```jsx
const announceStatusChange = (status) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.textContent = `Calendar status updated: ${status}`;
  announcement.classList.add('sr-only');
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};
```

### Focus Management

**Modal Focus Trapping**
```jsx
useEffect(() => {
  if (isModalOpen) {
    const firstFocusable = modalRef.current.querySelector('[tabindex="0"], button, input, select, textarea');
    firstFocusable?.focus();
  }
}, [isModalOpen]);
```

**Focus Indicators**
```css
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .focus-visible:focus {
    outline: 3px solid;
  }
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .status-indicator {
    animation: none;
  }
  
  .modal-enter {
    transition: none;
  }
  
  .pulse {
    animation: none;
  }
}
```

---

## Implementation Guidelines

### Code Organization

```
src/app/components/calendar/
├── CalendarIntegrationSection.jsx      # Settings section
├── CalendarStatusIndicator.jsx         # Timer interface indicator
├── CalendarModal.jsx                   # Full calendar view
├── ConflictWarningModal.jsx           # Session conflict warning
├── CalendarOnboardingFlow.jsx         # Multi-step setup
├── shared/
│   ├── CalendarEvent.jsx              # Individual event component
│   ├── StatusDot.jsx                  # Status indicator component
│   └── PrivacyBadge.jsx              # Trust indicator
└── styles/
    └── calendar.css                   # Component-specific styles
```

### Component Props Interface

```typescript
// CalendarIntegrationSection.jsx
interface CalendarIntegrationProps {
  isConnected: boolean;
  user?: CalendarUser;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onConfigChange: (config: CalendarConfig) => void;
}

// CalendarStatusIndicator.jsx
interface StatusIndicatorProps {
  status: 'free' | 'busy-soon' | 'in-meeting' | 'unknown';
  nextEventTime?: number; // minutes until next event
  onClick: () => void;
  className?: string;
}

// CalendarModal.jsx
interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  onRefresh: () => Promise<void>;
  onEventAction: (eventId: string, action: string) => void;
}
```

### State Management Integration

```javascript
// useCalendarStore.js
import { create } from 'zustand';

const useCalendarStore = create((set, get) => ({
  // Connection state
  isConnected: false,
  user: null,
  lastSync: null,
  
  // Calendar data
  todaysEvents: [],
  status: 'unknown', // 'free' | 'busy-soon' | 'in-meeting' | 'unknown'
  nextEventTime: null,
  
  // Configuration
  notificationTiming: 5, // minutes
  showPrivateDetails: true,
  
  // Actions
  connect: async () => {
    // OAuth flow implementation
  },
  
  disconnect: async () => {
    set({ isConnected: false, user: null, todaysEvents: [] });
  },
  
  refreshEvents: async () => {
    // Fetch latest events
  },
  
  updateConfig: (config) => {
    set({ ...config });
  },
  
  // Computed status
  getCurrentStatus: () => {
    const { todaysEvents } = get();
    const now = new Date();
    // Status calculation logic
  }
}));
```

### Performance Optimizations

**Lazy Loading**
```jsx
const CalendarModal = lazy(() => import('./CalendarModal'));
const ConflictWarningModal = lazy(() => import('./ConflictWarningModal'));
```

**Memoization**
```jsx
const MemoizedCalendarEvent = memo(CalendarEvent, (prevProps, nextProps) => {
  return (
    prevProps.event.id === nextProps.event.id &&
    prevProps.event.startTime === nextProps.event.startTime
  );
});
```

**API Rate Limiting**
```javascript
// Debounced refresh function
const debouncedRefresh = useCallback(
  debounce(() => refreshCalendar(), 1000),
  [refreshCalendar]
);
```

### Testing Strategy

**Component Testing**
```javascript
// CalendarIntegrationSection.test.jsx
describe('CalendarIntegrationSection', () => {
  test('displays connection button when not connected', () => {
    render(<CalendarIntegrationSection isConnected={false} />);
    expect(screen.getByText('Connect Calendar')).toBeInTheDocument();
  });

  test('shows privacy assurance prominently', () => {
    render(<CalendarIntegrationSection isConnected={false} />);
    expect(screen.getByText('Read-only access')).toBeInTheDocument();
    expect(screen.getByText('Never stores events')).toBeInTheDocument();
  });
});
```

**Integration Testing**
```javascript
// Calendar integration flow
test('complete calendar integration flow', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Open settings
  await user.click(screen.getByLabelText('Settings'));
  
  // Connect calendar
  await user.click(screen.getByText('Connect Calendar'));
  
  // Mock OAuth success
  mockOAuthSuccess();
  
  // Verify connected state
  expect(screen.getByText('Connected to Google Calendar')).toBeInTheDocument();
});
```

### Bundle Size Considerations

**Code Splitting by Feature**
```javascript
// Calendar integration as separate chunk
const CalendarFeature = lazy(() => 
  import('./calendar/CalendarFeature').then(module => ({
    default: module.CalendarFeature
  }))
);
```

**Selective Icon Loading**
```javascript
// Only load calendar-specific icons when needed
const calendarIcons = {
  calendar: () => import('/icons/calendar.svg'),
  bell: () => import('/icons/bell.svg'),
  shield: () => import('/icons/shield-check.svg')
};
```

### Error Handling

**User-Friendly Error Messages**
```jsx
const errorMessages = {
  'auth_failed': 'Connection to Google Calendar failed. Please try again.',
  'permissions_denied': 'Calendar permissions were not granted. You can try connecting again or continue without calendar integration.',
  'network_error': 'Unable to connect to Google Calendar. Check your internet connection.',
  'rate_limit': 'Too many connection attempts. Please wait a few minutes and try again.'
};
```

**Graceful Degradation**
```jsx
const CalendarIntegrationSection = () => {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-medium text-red-800 mb-2">Calendar Integration Unavailable</h3>
        <p className="text-sm text-red-700 mb-3">{errorMessages[error] || 'An unexpected error occurred.'}</p>
        <button 
          onClick={() => setError(null)}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return <NormalCalendarSection />;
};
```

---

## File References

Based on this design system, the following files should be created or modified:

### New Files to Create:
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/CalendarStatusIndicator.jsx`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/CalendarModal.jsx`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/ConflictWarningModal.jsx`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/CalendarOnboardingFlow.jsx`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/shared/CalendarEvent.jsx`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/shared/StatusDot.jsx`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/calendar/shared/PrivacyBadge.jsx`

### Existing Files to Modify:
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/settings/CalendarIntegrationSection.jsx` (enhance with new design patterns)
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/components/timer/TimerLayout.jsx` (add calendar status indicator)
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/src/app/globals.css` (add calendar-specific design tokens)

### Icons to Add:
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/public/icons/calendar-plus.svg`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/public/icons/shield-check.svg`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/public/icons/eye-slash.svg`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/public/icons/exclamation-triangle.svg`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/public/icons/check-circle.svg`
- `/home/fady/workspace/codefuchs/projects/focushive/focushive/public/icons/google.svg`

This comprehensive design system provides everything needed to implement a privacy-first, accessible, and beautiful Google Calendar integration that maintains BelugaFocus's clean aesthetic while building user trust and providing valuable functionality.