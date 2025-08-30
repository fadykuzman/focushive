# ADR 001: Git Pre-commit Hooks Implementation

## Status
Accepted

## Context
The project needed automated quality gates to prevent broken code from entering the repository and causing deployment failures. We experienced issues where:

1. Code style violations caused Vercel build failures
2. Broken tests weren't caught before push
3. Inconsistent code quality across commits
4. Manual quality checks were often forgotten

## Decision
We will implement git pre-commit hooks using **Husky + lint-staged** to automatically run quality checks before each commit.

### Quality Gates Implemented
1. **Linting**: ESLint with auto-fix for code style
2. **Testing**: Full test suite execution (100 tests)
3. **Build Verification**: Ensure production build succeeds
4. **Smart Processing**: lint-staged runs checks only on changed files when possible

### Tools Chosen
- **Husky 9.1.7**: Modern git hook management
- **lint-staged 16.1.5**: Efficient file-based processing
- **ESLint**: Code style enforcement
- **Vitest**: Test execution

## Implementation Details

### Pre-commit Hook Pipeline
```bash
1. pnpm lint-staged  # Lint and fix staged files
2. pnpm test:run     # Run full test suite
3. pnpm build        # Verify production build
```

### Configuration
- **Hook location**: `.husky/pre-commit`
- **Staged file config**: `package.json` lint-staged section
- **Auto-installation**: `prepare` script runs on `pnpm install`

### Monorepo Handling
Hook changes directory to `focushive/` subdirectory to handle the monorepo structure where git root is parent directory.

## Alternatives Considered

### Manual Git Hooks
- **Pros**: Simple, direct control
- **Cons**: Not team-friendly, hard to maintain, not version controlled

### GitHub Actions Only
- **Pros**: Cloud-based, no local setup
- **Cons**: Late feedback, wasted CI minutes, poor developer experience

### Pre-push Hooks
- **Pros**: Faster local commits
- **Cons**: Later feedback, can still push broken code

## Consequences

### Positive
- **Early feedback**: Catches issues before push
- **Consistent quality**: All commits meet quality standards
- **Team adoption**: Auto-installs for all developers
- **Fast feedback**: Local execution is faster than CI
- **Deployment reliability**: Reduces Vercel build failures

### Negative
- **Slower commits**: Adds ~30-60 seconds per commit
- **Local dependencies**: Requires pnpm and dependencies installed
- **Bypass possible**: Developers can use `--no-verify` flag

## Compliance Requirements
- All JavaScript/JSX files must pass ESLint
- All tests must pass (100 tests currently)
- Production build must succeed
- No commit allowed if any check fails

## Future Considerations
- Add type checking when TypeScript is introduced
- Consider parallel execution for faster hooks
- Add code coverage thresholds
- Consider pre-push hooks for expensive operations

## Notes
This ADR addresses the deployment failures caused by linting issues and ensures consistent code quality across the team. The hook integrates with existing CI/CD pipeline documented in `docs/ci-and-testing.md`.