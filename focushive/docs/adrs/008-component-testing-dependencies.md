# ADR 008: Component Testing Dependencies

## Status
Accepted

## Context
After implementing comprehensive unit tests for timer business logic, FocusHive needed component testing capabilities to verify UI integration and user interactions. The existing Vitest setup was optimized for unit testing pure functions but lacked the infrastructure needed for React component testing.

## Requirements
1. **React Component Testing**: Ability to render and test React components in isolation
2. **DOM Environment**: Browser-like environment for component interaction testing
3. **User-Centric Testing**: Test user interactions rather than implementation details
4. **Integration Testing**: Verify Zustand store integration with React components
5. **Existing Tool Compatibility**: Work seamlessly with current Vitest and Next.js setup

## Decision
We will add **React Testing Library ecosystem** dependencies to enable comprehensive component testing.

### Dependencies Added
1. **@testing-library/react**: Core React component testing utilities
2. **@testing-library/jest-dom**: Custom Jest DOM matchers for better assertions
3. **jsdom**: Headless DOM implementation for Node.js testing
4. **@vitejs/plugin-react**: Vite React plugin for JSX transformation in tests

## Implementation Details

### Package Installation
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

### Vitest Configuration Updates
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],                    // JSX transformation
  test: {
    environment: 'jsdom',                // Browser-like environment
    setupFiles: ['./src/test-setup.js'], // Global test setup
    globals: true,                       // Global test functions
  },
});
```

### Test Setup Configuration
```javascript
// src/test-setup.js
import '@testing-library/jest-dom';  // Custom DOM matchers

// Mock browser APIs for jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

## Alternatives Considered

### Enzyme
- **Pros**: Mature React testing library, shallow rendering capabilities
- **Cons**: Deprecated, poor React 18+ support, implementation-focused testing
- **Why rejected**: Maintenance concerns and philosophy mismatch

### React Testing Library Alternatives
- **@testing-library/preact**: For Preact applications
- **@testing-library/vue**: For Vue applications
- **Why rejected**: We're using React, these are framework-specific

### jsdom Alternatives
- **happy-dom**: Faster DOM implementation
- **playwright-test**: Full browser testing
- **Why jsdom chosen**: Industry standard, excellent React Testing Library compatibility

### Build Tool Integration
- **Jest + React Testing Library**: Traditional setup
- **Pros**: More mature ecosystem, extensive documentation
- **Cons**: Separate test runner, configuration complexity with Vite/Next.js
- **Why rejected**: Vitest provides better integration with our Vite-based toolchain

## Consequences

### Positive
- **User-Centric Testing**: Tests focus on user behavior rather than implementation
- **Integration Coverage**: Verifies UI and business logic work together correctly
- **Regression Prevention**: Catches UI breaking changes during refactoring
- **Development Experience**: Familiar React Testing Library patterns
- **Toolchain Integration**: Seamless integration with existing Vitest setup
- **Performance**: jsdom provides fast test execution compared to real browsers

### Negative
- **Bundle Size**: Additional ~15MB of dev dependencies
- **Learning Curve**: Team needs to understand component testing patterns
- **Test Complexity**: More complex than unit tests, requires mocking strategies
- **Maintenance**: More tests to maintain and update

## Testing Strategy Impact

### Before (Unit Tests Only)
```
Unit Tests (100)     ← Business logic only
```

### After (Testing Pyramid)
```
       E2E Tests (Future)
      ___________________
     Component Tests (89)     ← NEW: UI integration
    _________________________
   Unit Tests (100)           ← Existing: Business logic
  ___________________________
```

## Implementation Examples

### Component Test Pattern
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

test('should start timer when start button is clicked', () => {
  const mockStart = vi.fn();
  render(<StartButton startTimer={mockStart} isPaused={false} />);
  
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(mockStart).toHaveBeenCalled();
});
```

### Store Integration Testing
```javascript
// Mock Zustand store for predictable testing
const mockStore = {
  timeLeft: 1500,
  isActive: false,
  startTimer: vi.fn(),
};

vi.mock('../stores/timerStore', () => ({
  default: () => mockStore
}));
```

## Test Coverage Added
- **Timer.jsx**: 20 tests - Main component integration
- **StartButton.jsx**: 15 tests - User interaction logic  
- **SettingsModal.jsx**: 20 tests - Form validation and live updates
- **ModeSwitch.jsx**: 20 tests - Mode selection functionality
- **TimerDisplay.jsx**: 14 tests - Component composition

**Total**: 89 component tests added to existing 100 unit tests

## Compliance Requirements
- All new React components should have corresponding component tests
- Component tests must focus on user behavior, not implementation details
- Mock external dependencies (stores, APIs) for predictable testing
- Use React Testing Library queries that mirror user interactions

## Future Considerations
- Consider adding **MSW** (Mock Service Worker) for API mocking if needed
- Evaluate **Testing Library User Event** for more realistic user interactions
- Consider **Storybook** for visual component documentation and testing
- Monitor test execution time as component tests grow

## Related Decisions
- Vitest testing framework enables component test integration (ADR 003)
- Timer logic decomposition provides clean mocking boundaries (ADR 005)
- Zustand state management simplifies store mocking in tests (ADR 002)

## Notes
This decision complements the existing unit testing strategy by adding UI integration coverage. The React Testing Library ecosystem was chosen for its user-centric testing philosophy and excellent integration with our Vitest/Next.js toolchain. The dependencies enable comprehensive component testing without disrupting the existing development workflow.