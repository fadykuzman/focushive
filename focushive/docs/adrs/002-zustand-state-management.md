# ADR 002: Zustand for State Management

## Status
Accepted

## Context
The FocusHive Pomodoro timer application requires client-side state management for:

1. **Timer State**: Current time, active/paused status, mode (focus/break)
2. **Session Management**: Round tracking, total rounds configuration
3. **User Preferences**: Custom durations for different timer modes
4. **Persistence**: State must survive browser refreshes and sessions
5. **Reactivity**: UI components need automatic updates when state changes

## Decision
We will use **Zustand** as the primary state management solution with persistence middleware.

### Implementation Details
- **Store Structure**: Single timer store (`useTimerStore`) managing all timer-related state
- **Persistence**: Zustand's `persist` middleware for localStorage persistence
- **State Partitioning**: Only timer-critical data is persisted (excludes internal React state)
- **Actions**: Encapsulated timer operations (start, pause, reset, mode switching)

## Alternatives Considered

### React Context + useReducer
- **Pros**: Built into React, no external dependencies, familiar pattern
- **Cons**: Verbose boilerplate, complex persistence setup, performance issues with frequent updates
- **Why rejected**: Timer needs frequent updates (every second) which would cause unnecessary re-renders

### Redux Toolkit
- **Pros**: Mature ecosystem, excellent DevTools, standardized patterns
- **Cons**: Heavy dependency, complex setup, overkill for simple timer state
- **Why rejected**: Too much overhead for a single-feature application

### Valtio
- **Pros**: Proxy-based reactivity, minimal boilerplate, good TypeScript support
- **Cons**: Less mature, smaller ecosystem, potential proxy performance concerns
- **Why rejected**: Zustand provides similar benefits with better stability

### Jotai
- **Pros**: Atomic state management, excellent composability, bottom-up approach
- **Cons**: Different mental model, more complex for simple global state
- **Why rejected**: Timer state is naturally global rather than atomic

## Consequences

### Positive
- **Minimal Bundle**: Zustand is lightweight (~2.3kb gzipped)
- **Simple API**: Intuitive hook-based API reduces learning curve
- **Built-in Persistence**: Middleware handles localStorage serialization automatically
- **Performance**: Selective subscriptions prevent unnecessary re-renders
- **DevTools**: Browser extension for debugging state changes
- **TypeScript Ready**: Excellent TypeScript support when needed

### Negative
- **External Dependency**: Adds one more package to maintain
- **Learning Curve**: Team needs to understand Zustand patterns
- **Migration Complexity**: Moving away would require significant refactoring

## Implementation Examples

### Store Definition
```javascript
const useTimerStore = create(
  persist(
    (set, get) => ({
      // State properties
      timeLeft: DEFAULT_DURATIONS.FOCUS,
      mode: "focus",
      // Actions
      startTimer: () => set({ isActive: true, lastTick: Date.now() }),
    }),
    { name: "focushive-timer" }
  )
);
```

### Component Usage
```javascript
function Timer() {
  const { timeLeft, startTimer } = useTimerStore();
  return <button onClick={startTimer}>{timeLeft}s</button>;
}
```

## Compliance Requirements
- All timer state must flow through the Zustand store
- No direct localStorage manipulation outside of Zustand persistence
- Actions must be pure functions without side effects
- State updates must be immutable

## Future Considerations
- Consider state slicing if application grows beyond timer functionality
- Evaluate migration to TypeScript for better type safety
- Monitor bundle size impact as application scales
- Consider middleware for logging/debugging in development

## Related Decisions
- Timer logic decomposition (see ADR 005)
- Component architecture follows state-driven approach
- Persistence strategy affects user experience and data recovery

## Notes
This decision supports the modular timer architecture by providing a clean interface between UI components and business logic. The persistent state enables seamless user experience across browser sessions.