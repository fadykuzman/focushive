# ADR 005: Timer Logic Decomposition Strategy

## Status
Accepted

## Context
The original FocusHive timer implementation suffered from the **God Class antipattern** with a monolithic `TimerLogic` class that violated multiple SOLID principles:

1. **Single Responsibility**: One class handled constants, calculations, validation, state management, and orchestration
2. **Testability**: Monolithic structure made unit testing difficult and brittle
3. **Maintainability**: Adding features required modifying the central class
4. **Dependencies**: All components depended on the single large class
5. **Code Organization**: Related functionality was scattered throughout the class

## Decision
We will decompose the monolithic `TimerLogic` class into **domain-based modules** using functional programming principles.

### Architecture Approach: Domain-Driven Design
Organize code by business domain rather than technical concerns, creating focused modules that encapsulate related functionality.

## Module Decomposition

### 1. **constants.js** - Timer Configuration
```javascript
// Pure constants and configuration
export const TIMER_MODES = { FOCUS: 'focus', SHORT_BREAK: 'shortBreak' };
export const DEFAULT_DURATIONS = { FOCUS: 1500, SHORT_BREAK: 300 };
```

### 2. **durationUtils.js** - Duration Calculations
```javascript
// Duration-related calculations
export function getDurationForMode(mode, customDurations) { /* */ }
export function calculateProportionalTime(oldDuration, newDuration, timeLeft) { /* */ }
```

### 3. **modeTransition.js** - Mode and Round Logic
```javascript
// Mode transitions and round management
export function getNextMode(currentMode, currentRound, totalRounds) { /* */ }
export function calculateNextRound(currentMode, currentRound, totalRounds) { /* */ }
```

### 4. **timeCalculation.js** - Time-Based Operations
```javascript
// Time calculations with dependency injection
export function calculateElapsedTime(lastTick, getCurrentTime = Date.now) { /* */ }
export function createTimeProvider() { /* */ }
```

### 5. **timerValidation.js** - Input Validation
```javascript
// Input validation and type checking
export function validateDuration(duration) { /* */ }
export function validateMode(mode) { /* */ }
```

### 6. **timerStateFactory.js** - State Creation
```javascript
// Timer state creation utilities
export function createTimerState(mode, customDurations) { /* */ }
export function createInitialState(settings) { /* */ }
```

### 7. **timerOrchestrator.js** - Complex Operations
```javascript
// Orchestrates complex timer operations
export function completeTimerTransition(currentState) { /* */ }
export function restoreTimer(savedState) { /* */ }
```

### 8. **index.js** - Public API
```javascript
// Clean public API surface
export * from './constants.js';
export * from './durationUtils.js';
// ... all other modules
```

## Alternatives Considered

### Class-Based Decomposition
- **Pros**: Familiar OOP patterns, encapsulation
- **Cons**: More complex inheritance, harder to test individual methods
- **Why rejected**: Functional approach is simpler and more testable

### Service Layer Pattern
- **Pros**: Clear service boundaries, dependency injection
- **Cons**: Over-engineering for timer domain, unnecessary abstraction
- **Why rejected**: Too much complexity for straightforward timer logic

### Single File with Namespaces
- **Pros**: Everything in one place, no import complexity
- **Cons**: Still maintains the God Class problem, hard to test
- **Why rejected**: Doesn't solve the fundamental maintainability issues

### MVC/MVP Pattern
- **Pros**: Established pattern, clear separation of concerns
- **Cons**: Overkill for timer logic, doesn't align with functional approach
- **Why rejected**: Too heavyweight for domain-specific timer operations

## Consequences

### Positive
- **Single Responsibility**: Each module has one clear purpose
- **Testability**: 100+ unit tests covering all modules individually
- **Maintainability**: Changes are localized to specific domains
- **Reusability**: Pure functions can be composed and reused
- **Dependency Injection**: Time-based functions accept custom time providers
- **Tree Shaking**: Unused modules can be eliminated from bundles

### Negative
- **Import Complexity**: Multiple imports instead of single class
- **Learning Curve**: Team needs to understand functional composition
- **File Proliferation**: 8 files instead of 1 (mitigated by clear organization)

## Design Principles Applied

### 1. **Single Responsibility Principle**
Each module handles one domain concern:
- Constants: Configuration values
- Duration Utils: Time calculations
- Mode Transition: State transitions

### 2. **Dependency Injection**
```javascript
// Testable time calculations
export function calculateElapsedTime(lastTick, getCurrentTime = Date.now) {
  if (!lastTick) return 0;
  return Math.floor((getCurrentTime() - lastTick) / 1000);
}
```

### 3. **Pure Functions**
All functions are pure with no side effects, making them predictable and testable.

### 4. **Domain Boundaries**
Clear separation between:
- **Data**: Constants and configuration
- **Calculations**: Duration and time operations  
- **Business Logic**: Mode transitions and round management
- **Validation**: Input checking and type safety
- **Orchestration**: Complex multi-step operations

## Testing Strategy

### Unit Testing Coverage
- **8 test files** mirroring the 8 modules
- **100+ test cases** covering all functions and edge cases
- **Domain isolation**: Each module tested independently
- **Dependency injection**: Mockable time functions for deterministic tests

### Integration Points
```javascript
// Timer store integrates all modules
import { 
  getDurationForMode, 
  calculateProportionalTime, 
  completeTimerTransition 
} from '../utils/timer';
```

## Compliance Requirements
- All timer logic must be organized into domain-specific modules
- Each module must have corresponding test file
- Functions must be pure with no hidden dependencies
- Public API must be exposed through `index.js`

## Future Considerations
- Consider TypeScript for better type safety across modules
- Evaluate adding time-based integration tests
- Monitor for new domains as features are added
- Consider performance optimizations for frequently called functions

## Related Decisions
- Zustand state management benefits from modular timer logic (ADR 002)
- Vitest testing framework enables comprehensive module testing (ADR 003)
- Functional approach aligns with React's functional component model

## Notes
This decomposition transformed the codebase from a single 300+ line God Class into 8 focused modules with clear responsibilities. The approach emphasizes functional programming principles and domain-driven design, resulting in significantly improved testability and maintainability.