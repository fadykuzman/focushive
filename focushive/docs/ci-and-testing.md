# CI/CD Pipeline and Test Reports

## Overview
This document describes the continuous integration and deployment pipeline for FocusHive, including comprehensive test reporting capabilities.

## CI/CD Pipeline Structure

### Pipeline Stages
1. **Test Stage** - Runs on all pushes and pull requests
2. **Deploy Stage** - Runs only on main branch pushes after successful tests

### Test Stage (`test` job)
- **Linting**: Code quality checks using ESLint
- **Testing**: Complete test suite execution with Vitest
- **Test Reports**: Generates HTML, JUnit XML, and JSON reports
- **Build Verification**: Ensures production build succeeds
- **Artifact Upload**: Stores test reports for 30 days
- **PR Comments**: Automatic test result summaries on pull requests

### Deploy Stage (`deploy` job)
- **Dependency**: Only runs after successful test stage
- **Trigger**: Only on main branch pushes
- **Target**: Vercel production deployment
- **Test Reports**: Generates fresh reports for deployment

## Test Framework

### Vitest Configuration
- **Framework**: Vitest (fast, modern testing framework)
- **Coverage**: Built-in coverage reporting
- **UI**: Interactive test dashboard via `@vitest/ui`
- **Modules**: 8 test files covering 100+ test cases

### Test Scripts
```bash
npm test          # Interactive test watcher
npm run test:run  # Single test run (CI)
npm run test:ui   # Visual test dashboard
npm run test:report # Generate all report formats
```

## Test Reports

### Report Formats Generated
1. **HTML Report** (`reports/index.html`)
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

#### Option 1: Local Development
```bash
npm run test:report    # Generate reports
npm run dev           # Start dev server
# Visit http://localhost:3000/reports
```

#### Option 2: Production (Vercel)
- Reports automatically generated during deployment
- Available at `https://yourdomain.com/reports`
- Updates with each deployment

#### Option 3: GitHub Actions Artifacts
- Download from GitHub Actions run page
- Available for 30 days
- Includes all report formats

#### Option 4: Pull Request Comments
- Automatic test summary posted to PRs
- Links to detailed GitHub Actions reports
- Shows pass/fail status and test counts

## Directory Structure

### Test Organization
```
src/app/utils/timer/__tests__/
├── constants.test.js          # Timer constants validation
├── durationUtils.test.js      # Duration calculations
├── modeTransition.test.js     # Mode and round logic
├── timeCalculation.test.js    # Time calculations with DI
├── timerValidation.test.js    # Input validation
├── timerStateFactory.test.js  # State creation
├── timerOrchestrator.test.js  # Complex operations
└── index.test.js             # API surface verification
```

### Report Storage
```
reports/                      # Generated reports (gitignored)
├── index.html               # Visual HTML report
├── junit.xml               # CI-compatible XML format
├── results.json            # JSON data for automation
└── assets/                 # Static assets for HTML report
```

## Required Secrets

### Vercel Deployment
Add these secrets to GitHub repository settings:
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## Workflow Triggers

### Automatic Triggers
- **Push to main/develop**: Full CI + deployment (main only)
- **Pull requests to main**: CI testing only
- **Manual dispatch**: Available via GitHub Actions UI

### Branch Protection
Recommended settings:
- Require status checks before merging
- Require branches to be up to date
- Require test stage to pass

## Testing Best Practices

### Test Structure
- Each module has dedicated test file
- Comprehensive edge case coverage
- Dependency injection for time-based tests
- Mocking external dependencies

### Report Integration
- Reports generated on every CI run
- Persistent storage via Vercel deployment
- Temporary CI artifacts for debugging
- Automated PR feedback

## Troubleshooting

### Common Issues
1. **Reports not showing**: Check if `npm run test:report` runs locally
2. **Vercel deployment fails**: Verify secrets are correctly set
3. **PR comments missing**: Check GitHub Actions permissions
4. **Tests failing**: Review individual test files for specifics

### Local Testing
```bash
# Verify full CI pipeline locally
npm run lint && npm run test:run && npm run build

# Generate and view reports
npm run test:report
npm run dev  # Then visit /reports
```

## Future Enhancements

### Potential Additions
- **Coverage badges** in README
- **Performance testing** integration
- **E2E testing** with Playwright
- **Visual regression testing**
- **Test result notifications** via Slack/Discord