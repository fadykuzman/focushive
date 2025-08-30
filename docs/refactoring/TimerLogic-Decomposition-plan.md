● Timer Logic Decomposition Plan

  Current State

  - Single God Class TimerLogic with mixed responsibilities
  - All components depend on one monolithic utility
  - Hard to test, maintain, and extend

  Proposed Domain-Based Structure

  File Organization

  /utils/timer/
  ├── constants.js          # Timer modes, defaults
  ├── durationUtils.js      # Duration calculations
  ├── modeTransition.js     # Mode and round logic
  ├── timeCalculation.js    # Time-based calculations
  ├── timerValidation.js    # Input validation
  ├── timerStateFactory.js  # State creation
  ├── timerOrchestrator.js  # High-level coordination
  └── index.js             # Public API exports

  Domain Breakdown

  constants.js

  Responsibility: Centralized timer constants
  - TIMER_MODES
  - DEFAULT_DURATIONS
  - DEFAULT_SETTINGS

  durationUtils.js

  Responsibility: Duration mapping and calculations
  Functions:
  - getDurationForMode(mode, durations)
  - calculateProportionalTime(oldDuration, newDuration, currentTimeLeft)

  modeTransition.js

  Responsibility: Timer mode and round progression logic
  Functions:
  - getNextMode(currentMode, round, totalRounds)
  - shouldIncrementRound(currentMode)
  - shouldResetRound(currentMode, round, totalRounds)
  - calculateNextRound(currentMode, currentRound, totalRounds)

  timeCalculation.js

  Responsibility: Time-based calculations with dependency injection
  Functions:
  - calculateElapsedTime(lastTick, getCurrentTime = Date.now)
  - createTimeProvider() (for testing)

  timerValidation.js

  Responsibility: Input validation and type checking
  Functions:
  - validateDuration(duration)
  - validateMode(mode)
  - validateTimerState(state)

  timerStateFactory.js

  Responsibility: Creating timer state objects
  Functions:
  - createTimerState(mode, durations)
  - createInitialState(settings)

  timerOrchestrator.js

  Responsibility: Coordinate complex operations using other domains
  Functions:
  - completeTimerTransition(currentState) - uses modeTransition + durationUtils + timerStateFactory
  - restoreTimer(currentState) - coordinates with TimerRestoration + timeCalculation

  index.js

  Responsibility: Public API surface
  - Re-export all public functions
  - Provide convenient grouped exports by domain

  Migration Strategy

  Phase 1: Extract Pure Functions

  1. Create new domain files
  2. Extract pure functions (validation, duration mapping)
  3. Update imports in existing code

  Phase 2: Extract Stateful Logic

  1. Extract mode transition logic
  2. Extract time calculation with dependency injection
  3. Update TimerLogic class to use new functions

  Phase 3: Replace Orchestration

  1. Create timerOrchestrator for complex operations
  2. Update components to use orchestrator instead of TimerLogic
  3. Remove original TimerLogic class

  Phase 4: Optimize Imports

  1. Update all consuming components
  2. Use specific imports instead of importing everything
  3. Clean up unused exports

  Benefits

  Testability

  - Each function is pure and easily testable
  - Time dependencies can be injected for deterministic tests
  - Domain isolation allows focused unit tests

  Maintainability

  - Single responsibility per file
  - Changes isolated to specific domains
  - Clear dependency relationships
  - Easier to locate and modify specific logic

  Discoverability

  - Intuitive file names matching functionality
  - Grouped related functions
  - Clear API surface through index.js

  Reusability

  - Functions can be composed differently
  - Domains can be reused independently
  - Easy to extend individual domains without affecting others

  Example Usage After Migration

  // Instead of TimerLogic.getDurationForMode()
  import { getDurationForMode } from './utils/timer/durationUtils.js'

  // Instead of TimerLogic.completeTimerTransition()
  import { completeTimerTransition } from './utils/timer/timerOrchestrator.js'

  // Grouped imports
  import { validateDuration, validateMode } from './utils/timer/timerValidation.js'

  This approach transforms a monolithic class into focused, composable functions organized by business domain rather than technical structure.
