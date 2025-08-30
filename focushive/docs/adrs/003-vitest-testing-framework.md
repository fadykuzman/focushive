# ADR 003: Vitest Testing Framework

## Status
Accepted

## Context
The FocusHive timer application required a comprehensive testing strategy after decomposing the monolithic TimerLogic class into domain-based modules. Testing requirements included:

1. **Unit Testing**: All 8 timer modules with 100+ test cases
2. **Fast Execution**: Frequent testing during development and CI/CD
3. **Multiple Reports**: HTML, JUnit XML, and JSON formats for different consumers
4. **Modern Features**: ES modules, mocking, and dependency injection support
5. **CI Integration**: Seamless GitHub Actions integration
6. **Developer Experience**: Interactive UI and watch mode

## Decision
We will use **Vitest** as the primary testing framework with multiple reporting formats.

### Implementation Details
- **Framework**: Vitest 3.2.4 with `@vitest/ui` for interactive testing
- **Test Organization**: Domain-based test files mirroring module structure
- **Reporting**: Multi-format output (HTML, JUnit, JSON) for different use cases
- **CI Integration**: Optimized for GitHub Actions with artifact storage

## Alternatives Considered

### Jest
- **Pros**: Most popular, mature ecosystem, extensive documentation
- **Cons**: Slower execution, complex ES module setup, heavier dependencies
- **Why rejected**: Vitest offers better performance and native ES module support

### Mocha + Chai
- **Pros**: Flexible, modular approach, long-established
- **Cons**: Requires multiple packages, complex setup, no built-in mocking
- **Why rejected**: More setup complexity without significant benefits

### Node.js Test Runner
- **Pros**: Built into Node.js, no external dependencies
- **Cons**: Limited features, no watch mode, poor reporting
- **Why rejected**: Insufficient features for comprehensive testing needs

### Playwright Test
- **Pros**: Excellent for E2E testing, modern API
- **Cons**: Designed for browser testing, overkill for unit tests
- **Why rejected**: Wrong tool for unit testing timer logic

## Consequences

### Positive
- **Fast Execution**: ~76ms for 100 tests, excellent for TDD workflows
- **Native ES Modules**: No transpilation needed, works with modern JavaScript
- **Rich Reporting**: Multiple formats serve different stakeholders
- **Developer Experience**: Interactive UI via `@vitest/ui` for debugging
- **CI Optimized**: Efficient GitHub Actions integration
- **Vite Ecosystem**: Shares configuration with Vite-based tools

### Negative
- **Newer Framework**: Smaller community compared to Jest
- **Learning Curve**: Different API from Jest (though similar)
- **Ecosystem**: Fewer third-party plugins compared to Jest

## Implementation Examples

### Test Structure
```javascript
// Domain-based test organization
src/app/utils/timer/__tests__/
├── constants.test.js          # 7 tests
├── durationUtils.test.js      # 13 tests  
├── modeTransition.test.js     # 16 tests
└── ... (8 files total, 100+ tests)
```

### Test Configuration
```javascript
// package.json scripts
"test": "vitest",                    // Watch mode
"test:run": "vitest run",            // CI mode
"test:report": "vitest run --reporter=html --reporter=junit --reporter=json"
```

### Dependency Injection Testing
```javascript
// Time-based testing with DI
test('should calculate elapsed time correctly', () => {
  const mockTime = () => 2000;
  const elapsed = calculateElapsedTime(1000, mockTime);
  expect(elapsed).toBe(1);
});
```

## Test Report Strategy

### Multiple Formats for Different Consumers
1. **HTML Report** (`public/reports/index.html`)
   - **Consumer**: Developers, stakeholders
   - **Purpose**: Visual debugging and comprehensive test overview
   - **Access**: Available at `/reports` route in production

2. **JUnit XML** (`reports/junit.xml`)
   - **Consumer**: CI/CD systems, build tools
   - **Purpose**: Machine-readable format for automation
   - **Usage**: GitHub Actions test result parsing

3. **JSON Report** (`reports/results.json`)
   - **Consumer**: Automated systems, PR bots
   - **Purpose**: Programmatic access for custom tooling
   - **Usage**: PR comment generation with test statistics

## Compliance Requirements
- All timer modules must have corresponding test files
- Test coverage should maintain domain boundaries
- Tests must run successfully in both local and CI environments
- All three report formats must be generated during builds

## Future Considerations
- Add code coverage reporting and thresholds
- Consider E2E testing with Playwright for full user flows
- Evaluate snapshot testing for UI components
- Add performance testing for timer accuracy

## Related Decisions
- Timer logic decomposition enables comprehensive unit testing (ADR 005)
- CI/CD pipeline relies on test reports for quality gates (ADR 001)
- GitHub Actions integration uses JUnit format for test result parsing

## Notes
Vitest was chosen after the timer logic decomposition revealed the need for comprehensive unit testing of 8 separate modules. The framework's speed and ES module support align perfectly with the modern JavaScript architecture of the decomposed timer system.