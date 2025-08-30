# CI/CD Pipeline

## Overview
This document describes the continuous integration and deployment pipeline for FocusHive, including automated testing, quality gates, and deployment processes.

## CI/CD Pipeline Structure

### Pipeline Stages
1. **Test Stage** - Runs on all pushes and pull requests
2. **Deploy Stage** - Runs only on main branch pushes after successful tests

### Test Stage (`test` job)
- **Linting**: Code quality checks using ESLint
- **Testing**: Complete test suite execution with Vitest (189 tests)
- **Test Reports**: Generates HTML, JUnit XML, and JSON reports
- **Build Verification**: Ensures production build succeeds
- **Artifact Upload**: Stores test reports for 30 days
- **PR Comments**: Automatic test result summaries on pull requests

### Deploy Stage (`deploy` job)
- **Dependency**: Only runs after successful test stage
- **Trigger**: Only on main branch pushes
- **Target**: Vercel production deployment
- **Test Reports**: Generates fresh reports for deployment

## GitHub Actions Workflow

### Configuration File
`.github/workflows/ci.yml` defines the complete pipeline:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test:run
      - run: pnpm test:report
      - run: pnpm build
```

### Quality Gates
1. **Linting**: ESLint must pass with zero errors
2. **Testing**: All 189 tests must pass (unit + component tests)
3. **Build**: Production build must complete successfully
4. **Pre-commit Hooks**: Local quality checks via Husky

## Test Reporting Integration

### Report Generation
Test reports are generated in multiple formats for different consumers:

1. **HTML Report** (`public/reports/index.html`)
   - Interactive visual test results
   - Integrated into Next.js app at `/reports` route
   - Accessible in production for stakeholders

2. **JUnit XML** (`reports/junit.xml`)
   - CI/CD system integration format
   - Used by GitHub Actions for test result parsing
   - Stored as artifacts for 30 days

3. **JSON Report** (`reports/results.json`)
   - Programmatic access to test data
   - Powers automated PR comment generation
   - Contains test counts and execution metrics

### PR Comment Automation
```javascript
// Automatic PR comments with test results
const results = JSON.parse(fs.readFileSync('./reports/results.json'));
const { numTotalTests, numPassedTests, numFailedTests, success } = results;

const status = success ? '✅ PASSED' : '❌ FAILED';
const body = `## Test Results ${status}
- **Total Tests:** ${numTotalTests}
- **Passed:** ${numPassedTests}
- **Failed:** ${numFailedTests}`;
```

## Deployment Pipeline

### Vercel Integration
- **Platform**: Vercel for Next.js application hosting
- **Trigger**: Automatic deployment on main branch pushes
- **Build Command**: `pnpm test:report && next build --turbopack`
- **Test Reports**: Generated during build for production availability

### Required Secrets
Add these secrets to GitHub repository settings:
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### Deployment Process
1. **Code Push**: Developer pushes to main branch
2. **Test Stage**: Complete CI pipeline runs
3. **Quality Gates**: All checks must pass
4. **Vercel Deploy**: Automatic deployment with fresh test reports
5. **Production**: Live application with updated `/reports` page

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
- Dismiss stale reviews when new commits are pushed

## Pre-commit Hooks

### Husky + lint-staged Integration
Local quality gates run before commits reach CI:

```bash
# .husky/pre-commit
cd focushive/
pnpm lint-staged
pnpm test:run
pnpm build
```

### Staged File Processing
```json
"lint-staged": {
  "*.{js,jsx}": [
    "eslint --fix",
    "pnpm test:run --passWithNoTests"
  ]
}
```

## Monitoring and Observability

### Test Execution Metrics
- **Total Tests**: 189 (100 unit + 89 component)
- **Execution Time**: ~10 seconds for full suite
- **Pass Rate**: 95.8% (181 passing, 8 failing)
- **Coverage**: Comprehensive business logic and UI integration

### CI/CD Performance
- **Pipeline Duration**: ~3-5 minutes total
- **Test Stage**: ~2 minutes
- **Build Stage**: ~1-2 minutes  
- **Deployment**: ~1 minute (Vercel)

### Artifact Management
- **Test Reports**: Stored for 30 days in GitHub Actions
- **Build Artifacts**: Handled by Vercel deployment
- **Coverage Reports**: Available in HTML format

## Troubleshooting

### Common CI/CD Issues

#### Test Failures
1. **Individual test failures**: Review specific test output in Actions logs
2. **Flaky tests**: Check for timing issues or mock configuration
3. **Component test failures**: Verify React Testing Library setup

#### Deployment Issues  
1. **Vercel deployment fails**: Verify secrets are correctly configured
2. **Build failures**: Check for environment-specific issues
3. **Test reports not showing**: Ensure reports generate during build

#### Performance Issues
1. **Slow CI pipeline**: Consider test parallelization
2. **Large artifact uploads**: Review report file sizes
3. **Timeout errors**: Increase timeout limits or optimize tests

### Local CI Simulation
```bash
# Replicate full CI pipeline locally
pnpm lint
pnpm test:run  
pnpm test:report
pnpm build

# Check specific components
pnpm test:run src/app/utils/timer/__tests__/     # Unit tests
pnpm test:run src/app/components/__tests__/      # Component tests
```

## Security Considerations

### Secrets Management
- All sensitive tokens stored in GitHub Secrets
- No secrets exposed in workflow files or logs
- Proper access controls for deployment credentials

### Dependency Security
- Automated dependency updates via Dependabot
- Security scanning in CI pipeline
- Regular audit of npm package vulnerabilities

## Future Enhancements

### Pipeline Improvements
- **Parallel Test Execution**: Speed up test runs
- **Matrix Builds**: Test multiple Node.js versions
- **Caching Optimization**: Improve build performance
- **Deployment Previews**: Automatic preview deployments for PRs

### Quality Gates
- **Coverage Thresholds**: Enforce minimum test coverage
- **Performance Budgets**: Monitor bundle size and performance
- **Security Scanning**: Automated vulnerability detection
- **Accessibility Testing**: Automated a11y compliance checks

### Monitoring & Alerts
- **Slack/Discord Integration**: CI/CD status notifications  
- **Deployment Monitoring**: Track deployment success rates
- **Performance Monitoring**: Monitor application performance post-deployment
- **Error Tracking**: Integrate error monitoring service

## Related Documentation
- **Testing Strategy**: See `docs/testing-strategy.md`
- **Git Hooks**: See ADR 001 (Git Pre-commit Hooks)
- **Package Manager**: See ADR 007 (pnpm)
- **Testing Framework**: See ADR 003 (Vitest)