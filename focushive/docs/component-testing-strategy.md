# Component Testing Strategy

## Overview
This document outlines the component testing approach for FocusHive, explaining which components need testing, why they're important, and how to test them effectively.

## Testing Philosophy

### User-Centric Testing
Component tests focus on **user behavior** rather than implementation details:
- What users see on screen
- How users interact with the interface
- How the UI responds to user actions
- Integration between UI and business logic

### Testing Pyramid Integration
Component tests fill the integration layer between unit tests and future E2E tests:
- **Unit Tests (100+)**: Well-tested business logic in timer modules
- **Component Tests**: UI integration and user interaction verification
- **E2E Tests (Future)**: Complete user workflows across pages

## Component Test Priorities

### High Priority Components
These components have complex state integration and critical user interactions:

#### 1. **Timer.jsx** - Main Orchestrator
**Why Test**: Central component integrating all timer functionality
**Key Test Cases**:
- Timer state changes reflected across child components
- Complete timer cycle (start → pause → resume → complete → transition)
- Settings modal integration and duration updates
- Mode switching affects UI styling and display
- Document title updates with timer progress
- Hydration handling and loading states

**Integration Points**:
- Zustand store integration for all timer state
- Child component composition and prop passing
- Timer interval management and cleanup
- Settings modal state management

#### 2. **StartButton.jsx** - Critical User Interaction
**Why Test**: Primary user interaction point with conditional logic
**Key Test Cases**:
- Button text changes based on pause state ("Start" vs "Resume")
- Correct function calls (startTimer vs resumeTimer) based on state
- Mode-based styling applications
- Button accessibility and hover states

**State Dependencies**:
- `isPaused` determines button text and behavior
- `mode` affects button styling classes
- Integration with timer store actions

#### 3. **SettingsModal.jsx** - Complex Form Component
**Why Test**: Complex form logic with live updates and validation
**Key Test Cases**:
- Modal open/close functionality
- Form input validation (1-120 minute range)
- Live duration updates affect timer immediately
- Input field focus states and styling
- Form submission and close behavior

**Critical Features**:
- Real-time duration updates via `onDurationChange`
- Input validation and boundary conditions
- Local state management with `useState`
- Modal overlay and accessibility

#### 4. **ModeSwitch.jsx** - Mode Selection Component
**Why Test**: Mode switching is core timer functionality
**Key Test Cases**:
- Active mode styling (highlighted vs inactive buttons)
- Mode switching calls correct store actions
- All three modes (focus, short break, long break) are selectable
- Button accessibility and visual feedback

**State Integration**:
- Current `mode` determines active button styling
- `switchMode` function integration with store

### Medium Priority Components
These components have display logic and formatting responsibilities:

#### 5. **TimerDisplay.jsx** - Composite Display
**Why Test**: Orchestrates display components and progress calculation
**Key Test Cases**:
- Correct prop passing to ProgressRing and TimeDisplay
- Component composition and layout

#### 6. **TimeDisplay.jsx** - Time Formatting
**Why Test**: Critical time formatting logic (has current typo in export)
**Key Test Cases**:
- Correct MM:SS formatting for various time values
- Edge cases (0 seconds, large values, single digits)
- Font and styling consistency

**Note**: Component has typo `TimeDisply` instead of `TimeDisplay` in export

#### 7. **ProgressRing.jsx** - SVG Progress Visualization
**Why Test**: Mathematical SVG rendering based on progress
**Key Test Cases**:
- Correct progress calculation for stroke-dashoffset
- Edge cases (0%, 50%, 100% progress)
- SVG accessibility and proper rendering

### Lower Priority Components
Simple components with minimal logic:

#### 8. **PauseButton.jsx** - Simple Action
**Why Lower Priority**: Single action, minimal logic
**Test Cases**: Click handler integration, mode-based styling

#### 9. **ResetButton.jsx** - Simple Action  
**Why Lower Priority**: Single action, minimal logic
**Test Cases**: Click handler integration, mode-based styling

## Testing Approach

### Setup Requirements
- **React Testing Library**: User-centric testing utilities
- **jsdom**: Browser environment simulation for Vitest
- **Zustand Mocking**: Isolated component testing with predictable state

### Mock Strategy

#### Zustand Store Mocking
```javascript
// Create mock store for predictable testing
const createMockStore = (initialState = {}) => ({
  timeLeft: 1500,
  isActive: false,
  isPaused: false,
  mode: 'focus',
  startTimer: vi.fn(),
  pauseTimer: vi.fn(),
  ...initialState
});
```

#### Component Testing Pattern
```javascript
// Test user interactions, not implementation
test('should show Resume button when timer is paused', () => {
  const mockStore = createMockStore({ isPaused: true, isActive: true });
  render(<StartButton {...mockStore} />);
  
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('Resume');
});
```

### Testing Guidelines

#### What TO Test
- **User Interactions**: Button clicks, form inputs, mode selections
- **Conditional Rendering**: Different UI states based on props/state
- **Integration**: Component integration with Zustand store
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Visual States**: Active/inactive states, loading states, error states

#### What NOT to Test
- **Implementation Details**: Internal component state management
- **Styling Details**: Specific CSS classes (unless functionally important)
- **Business Logic**: Timer calculations (covered by unit tests)
- **Third-party Libraries**: React, Zustand internals

## Component Test Organization

### Directory Structure
```
src/app/components/__tests__/
├── Timer.test.jsx              # Main orchestrator integration
├── StartButton.test.jsx        # User interaction and state logic
├── SettingsModal.test.jsx      # Form validation and live updates
├── ModeSwitch.test.jsx         # Mode selection functionality
├── TimerDisplay.test.jsx       # Display component composition
├── TimeDisplay.test.jsx        # Time formatting logic
└── ProgressRing.test.jsx       # SVG progress visualization
```

### Test File Naming
- Match component file names with `.test.jsx` suffix
- Group related test cases with `describe` blocks
- Use descriptive test names focusing on user behavior

## Integration with Existing Testing

### Vitest Configuration
Component tests will use the same Vitest configuration with additional setup:
- **Environment**: jsdom for DOM simulation
- **Setup Files**: Configure React Testing Library utilities
- **Mock Helpers**: Zustand store mocking utilities

### CI/CD Integration
Component tests will be included in existing test pipeline:
- Run alongside unit tests in `pnpm test:run`
- Included in test reports (HTML, JUnit, JSON)
- Part of pre-commit hooks and GitHub Actions

## Expected Outcomes

### Test Coverage Goals
- **Unit Tests**: Maintain 100+ tests for business logic (current)
- **Component Tests**: Add ~25-30 tests for UI integration
- **Total Coverage**: ~130+ tests covering both logic and UI layers

### Quality Improvements
- **Regression Prevention**: Catch UI breaking changes
- **Refactoring Confidence**: Safe component restructuring
- **Integration Validation**: Verify store and UI work together
- **User Experience**: Ensure consistent user interactions

## Future Considerations

### E2E Testing
Component tests prepare the foundation for future E2E testing:
- Well-tested components enable reliable E2E test building blocks
- Clear user interaction patterns documented in component tests
- Established mocking strategies for external dependencies

### Accessibility Testing
Component tests can be extended to include:
- Screen reader compatibility testing
- Keyboard navigation verification
- ARIA label and role validation
- Color contrast and visual accessibility

## Related Documentation
- **Unit Testing**: See timer module tests in `src/app/utils/timer/__tests__/`
- **CI/CD Pipeline**: See `.github/workflows/ci.yml` and this document
- **Architecture**: See ADR 003 (Vitest) and ADR 005 (Timer Decomposition)