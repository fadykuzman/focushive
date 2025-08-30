# Testing Strategy

## Overview
This document outlines the comprehensive testing approach for FocusHive, covering the testing pyramid, tools, and best practices for maintaining high code quality.

## Testing Strategy

### Testing Pyramid
FocusHive follows a comprehensive testing pyramid approach:

```
       E2E Tests (Future)
      ___________________
     Component Tests (89)     ← Integration layer
    _________________________
   Unit Tests (100)           ← Business logic
  ___________________________
```

### Unit Tests (100 tests)
**Purpose**: Test business logic in isolation
**Coverage**: All 8 timer modules with comprehensive edge cases
**Tools**: Vitest with dependency injection for time-based functions

### Component Tests (89 tests)
**Purpose**: Test UI integration and user interactions
**What They Test**:
- User interactions (clicks, form inputs, mode switches)
- State integration between Zustand store and React components
- Conditional rendering based on timer state
- Component composition and prop passing
- User workflows and error states

**Why Component Tests Matter**:
- **User-Centric**: Test what users actually see and interact with
- **Integration**: Verify business logic integrates correctly with UI
- **Regression Prevention**: Catch UI breaking changes during refactoring
- **Documentation**: Living examples of component behavior

**Component Test Strategy**:
- **High Priority**: Components with complex state integration (Timer, StartButton, SettingsModal, ModeSwitch)
- **Medium Priority**: Display components with formatting logic (TimerDisplay, TimeDisplay)
- **Testing Approach**: User interaction focused, not implementation details

### Testing Tools
- **Unit Tests**: Vitest for pure function testing
- **Component Tests**: Vitest + React Testing Library + jsdom
- **Mocking**: Zustand store mocking for isolated component testing

## Test Framework

### Vitest Configuration
- **Framework**: Vitest (fast, modern testing framework)
- **Environment**: jsdom for component tests, node for unit tests
- **Coverage**: Built-in coverage reporting
- **UI**: Interactive test dashboard via `@vitest/ui`
- **Dependencies**: React Testing Library ecosystem for component testing

#### React 19 Compatibility Fix
**Issue**: `React.act is not a function` error in CI pipeline  
**Root Cause**: @testing-library/react@16.3.0 hasn't been updated for React 19.1.0 compatibility  
**Solution**: Added official React Testing Library fix in `src/test-setup.js`:

```javascript
global.IS_REACT_ACT_ENVIRONMENT = true;
```

This tells React Testing Library it's in a testing environment where `act` should be used, resolving compatibility issues until official React 19 support is released.

### Test Scripts
```bash
pnpm test          # Interactive test watcher
pnpm test:run      # Single test run (CI)
pnpm test:ui       # Visual test dashboard
pnpm test:report   # Generate all report formats
pnpm test:coverage # Run tests with coverage
```

## Test Organization

### Directory Structure
```
src/app/utils/timer/__tests__/           # Unit tests
├── constants.test.js                   # Timer constants validation
├── durationUtils.test.js               # Duration calculations
├── modeTransition.test.js              # Mode and round logic
├── timeCalculation.test.js             # Time calculations with DI
├── timerValidation.test.js             # Input validation
├── timerStateFactory.test.js           # State creation
├── timerOrchestrator.test.js           # Complex operations
└── index.test.js                      # API surface verification

src/app/components/__tests__/            # Component tests
├── Timer.test.jsx                      # Main component integration (20 tests)
├── StartButton.test.jsx                # User interaction logic (15 tests)
├── SettingsModal.test.jsx              # Form validation (20 tests)
├── ModeSwitch.test.jsx                 # Mode selection (20 tests)
└── TimerDisplay.test.jsx               # Component composition (14 tests)
```

### Test Coverage
- **Unit Tests**: 100 tests across 8 timer modules
- **Component Tests**: 89 tests across 5 React components
- **Total Coverage**: 189 tests with 95.8% pass rate

## Testing Best Practices

### Unit Test Structure
- Each module has dedicated test file
- Comprehensive edge case coverage
- Dependency injection for time-based tests
- Mocking external dependencies
- Pure function testing approach

### Component Test Structure
- Test user behavior, not implementation details
- Mock Zustand store for predictable state
- Focus on component integration and interactions
- Verify accessibility and user experience
- Use React Testing Library queries that mirror user interactions

### Test Writing Guidelines

#### What TO Test
**Unit Tests**:
- Pure function behavior with various inputs
- Edge cases and boundary conditions
- Error handling and validation logic
- Mathematical calculations and transformations

**Component Tests**:
- User interactions (clicks, form inputs, keyboard navigation)
- Conditional rendering based on props/state
- Integration between components and stores
- Accessibility features and ARIA attributes
- Error boundaries and error states

#### What NOT to Test
**Unit Tests**:
- Implementation details of other modules
- Third-party library internals
- Complex integration scenarios (use component tests)

**Component Tests**:
- Internal component state management
- Specific CSS classes (unless functionally important)
- Business logic calculations (covered by unit tests)
- Third-party library behavior

### Testing Patterns

#### Unit Test Pattern
```javascript
// Test pure functions with dependency injection
describe('calculateElapsedTime', () => {
  test('should calculate elapsed time correctly', () => {
    const mockTime = () => 2000;
    const elapsed = calculateElapsedTime(1000, mockTime);
    expect(elapsed).toBe(1);
  });
});
```

#### Component Test Pattern
```javascript
// Test user interactions, not implementation
test('should start timer when start button is clicked', () => {
  const mockStart = vi.fn();
  render(<StartButton startTimer={mockStart} isPaused={false} />);
  
  const button = screen.getByRole('button', { name: /start/i });
  fireEvent.click(button);
  
  expect(mockStart).toHaveBeenCalled();
});
```

#### Store Mocking Pattern
```javascript
// Mock Zustand store for predictable testing
const mockTimerStore = {
  timeLeft: 1500,
  isActive: false,
  startTimer: vi.fn(),
  pauseTimer: vi.fn(),
};

vi.mock('../stores/timerStore', () => ({
  default: () => mockTimerStore
}));
```

## Test Reports

### Report Formats Generated
1. **HTML Report** (`public/reports/index.html`)
   - Visual test results with interactive UI
   - Coverage maps and detailed breakdowns
   - Accessible via browser at `/reports` route

2. **JUnit XML** (`reports/junit.xml`)
   - Standard format for CI/CD integration
   - Compatible with GitHub Actions and other tools
   - Used for test result parsing

3. **JSON Report** (`reports/results.json`)
   - Programmatic access to test data
   - Used for PR comment generation
   - Contains test counts and success status

### Viewing Test Reports

#### Local Development
```bash
pnpm test:report    # Generate reports
pnpm dev           # Start dev server
# Visit http://localhost:3000/reports
```

#### Production
- Reports automatically generated during deployment
- Available at production URL `/reports` route
- Updates with each deployment

## Troubleshooting

### Common Issues
1. **Component tests failing**: Check React Testing Library setup and jsdom environment
2. **Store mocking not working**: Verify mock is properly configured before component render
3. **Tests timing out**: Increase timeout or simplify complex integration tests
4. **Coverage not accurate**: Ensure all source files are included in coverage configuration

### Local Testing Verification
```bash
# Verify full test suite locally
pnpm test:run

# Check specific test types
pnpm test:run src/app/utils/timer/__tests__/    # Unit tests only
pnpm test:run src/app/components/__tests__/     # Component tests only

# Generate and view reports
pnpm test:report
pnpm dev  # Then visit /reports
```

## Future Enhancements

### Potential Testing Additions
- **E2E Testing**: Playwright for complete user workflows
- **Visual Regression Testing**: Screenshot comparisons for UI changes
- **Performance Testing**: Timer accuracy and performance benchmarks
- **Accessibility Testing**: Automated a11y testing integration
- **Coverage Thresholds**: Enforce minimum coverage requirements

### Testing Tool Considerations
- **MSW** (Mock Service Worker) for API mocking if backend integration added
- **Testing Library User Event** for more realistic user interactions
- **Storybook** for visual component documentation and testing
- **Snapshot Testing** for component output regression detection

## Related Documentation
- **Component Testing Strategy**: See `docs/component-testing-strategy.md`
- **CI/CD Pipeline**: See `docs/ci-cd-pipeline.md`
- **Architecture Decisions**: See ADR 003 (Vitest) and ADR 008 (Component Testing Dependencies)