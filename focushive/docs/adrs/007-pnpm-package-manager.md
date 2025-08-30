# ADR 007: pnpm Package Manager

## Status
Accepted

## Context
FocusHive required a package manager choice for dependency management with specific requirements:

1. **Monorepo Structure**: Project has nested directory structure with git root at parent level
2. **CI/CD Consistency**: GitHub Actions and Vercel deployments need consistent lockfiles
3. **Workspace Management**: Multiple related projects in the same repository
4. **Performance**: Fast installs during development and CI/CD
5. **Disk Efficiency**: Reduced node_modules duplication
6. **Deployment Reliability**: Vercel builds were failing due to lockfile inconsistencies

## Decision
We will use **pnpm** as the primary package manager with workspace configuration.

### Implementation Details
- **Version**: pnpm 8.x (specified in GitHub Actions)
- **Workspace**: `pnpm-workspace.yaml` configuration for monorepo support
- **Lockfile**: `pnpm-lock.yaml` for dependency resolution consistency
- **Scripts**: All package.json scripts use pnpm commands

## Alternatives Considered

### npm (Node Package Manager)
- **Pros**: Default Node.js package manager, universal support, familiar
- **Cons**: Slower installs, larger node_modules, no built-in workspace efficiency
- **Why rejected**: Caused lockfile conflicts leading to Vercel deployment failures

### Yarn Classic (v1.x)
- **Pros**: Fast installs, good workspace support, mature ecosystem
- **Cons**: No longer actively developed, security concerns, flat node_modules issues
- **Why rejected**: Deprecated in favor of Yarn Modern

### Yarn Modern (v3+/v4+)
- **Pros**: Plug'n'Play architecture, excellent monorepo support, zero-installs
- **Cons**: Complex migration, Plug'n'Play compatibility issues, steep learning curve
- **Why rejected**: Too much complexity for current project needs

### Bun Package Manager
- **Pros**: Extremely fast, built-in runtime, modern approach
- **Cons**: Still experimental, limited CI/CD support, compatibility concerns
- **Why rejected**: Too new and experimental for production deployment

## Consequences

### Positive
- **Fast Installs**: Content-addressable storage reduces install times
- **Disk Efficiency**: Global store prevents duplicate packages
- **Monorepo Support**: Built-in workspace management
- **Strict Dependencies**: Prevents phantom dependencies
- **Lockfile Stability**: Deterministic installs across environments
- **Vercel Compatibility**: Consistent lockfiles prevent deployment failures

### Negative
- **Learning Curve**: Team needs to learn pnpm-specific commands
- **Tool Support**: Some tools may expect npm/yarn (though rare)
- **Migration Effort**: Existing npm workflows need updating

## Implementation Examples

### Workspace Configuration
```yaml
# pnpm-workspace.yaml
packages:
  - 'focushive'
```

### CI/CD Integration
```yaml
# .github/workflows/ci.yml
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 8

- name: Install dependencies  
  run: pnpm install --frozen-lockfile
```

### Package Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "pnpm test:report && next build --turbopack",
    "test:run": "vitest run"
  }
}
```

## Directory Structure Impact

### Working Directory Requirements
Due to monorepo structure, pnpm commands must be run from the correct subdirectory:
```bash
# Correct approach
cd /home/fady/workspace/codefuchs/projects/focushive/focushive
pnpm install

# Git commands can run from anywhere in repo
cd /home/fady/workspace/codefuchs/projects/focushive
git status
```

## Deployment Configuration

### Vercel Integration
- **Lockfile Detection**: Vercel automatically detects `pnpm-lock.yaml`
- **Build Commands**: Uses pnpm for installs and script execution
- **Consistency**: Same package manager in local, CI, and production

### GitHub Actions
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'pnpm'  # Enable pnpm caching
```

## Problem Resolution

### Lockfile Conflicts
**Problem**: Mixed npm/pnpm usage created conflicting lockfiles
```
package-lock.json (npm)
pnpm-lock.yaml   (pnpm)
```

**Solution**: Standardized on pnpm throughout entire pipeline:
- Development: pnpm commands only
- CI/CD: pnpm in GitHub Actions
- Deployment: pnpm in Vercel builds

## Compliance Requirements
- All dependency installation must use pnpm
- No npm or yarn commands in scripts or documentation
- CI/CD pipelines must use pnpm consistently
- Local development must run pnpm from correct subdirectory

## Future Considerations
- Monitor pnpm ecosystem maturity and stability
- Evaluate workspace features as project grows
- Consider pnpm patches for dependency fixes
- Assess migration to newer pnpm versions

## Related Decisions
- CI/CD pipeline configured for pnpm consistency (ADR 001)
- Build process relies on pnpm script execution (ADR 003, ADR 006)
- Monorepo structure affects pnpm workspace configuration

## Notes
pnpm was adopted after experiencing deployment failures caused by inconsistent package managers. The decision prioritizes deployment reliability and performance while providing excellent monorepo support for the project's directory structure.