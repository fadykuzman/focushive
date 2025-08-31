# Claude Code Configuration

## Package Manager

**IMPORTANT: This project uses pnpm as the package manager.**

Always use pnpm commands instead of npm:
- `pnpm install` (not `npm install`)
- `pnpm add <package>` (not `npm install <package>`)
- `pnpm add -D <package>` (not `npm install --save-dev <package>`)
- `pnpm run <script>` (not `npm run <script>`)

## Project Scripts

Use these pnpm commands for development:
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:report` - Generate test reports
- `pnpm lint` - Run linter

## Working Directory

**IMPORTANT: Always navigate to the focushive subdirectory before running pnpm commands.**

All pnpm-related commands (testing, building, package management) must be run from:
```
cd /home/fady/workspace/codefuchs/projects/focushive/focushive
```

This includes:
- `pnpm install`, `pnpm add`, `pnpm remove`
- `pnpm test`, `pnpm test:run`, `pnpm test:report`
- `pnpm build`, `pnpm dev`
- `pnpm lint`

Git commands can be run from any directory in the repository.

## Architecture Decision Records (ADRs)

**IMPORTANT: Document architectural decisions with ADRs in docs/adrs/**

Create an ADR when:
- Adding new npm packages or dependencies
- Choosing between different implementation approaches
- Setting up new development tools (testing frameworks, linters, CI/CD)
- Making decisions that affect the overall architecture

**Goals**: Document what we chose and learn from what was built and decided.

**Format**: Use numbered ADRs (e.g., `002-choosing-vitest-over-jest.md`) in the `docs/adrs/` directory.

## Communication Guidelines

**IMPORTANT: Always ask clarifying questions when requirements are unclear or ambiguous.**

When given a task or request:
- Ask specific questions about unclear requirements
- Confirm implementation approach before starting work
- Seek clarification on scope, priorities, or technical details when needed
- Request examples or specifications when the expected outcome is unclear
- **Always provide multiple implementation alternatives when applicable** (e.g., different approaches for adding functionality, various architectural patterns, alternative libraries or tools)

This ensures accurate implementation that meets your exact needs and avoids wasted effort on incorrect assumptions.

## Code Quality Standards

**IMPORTANT: Prioritize testability and maintainability in all code implementations.**

When writing or modifying code:
- Design components with clear, testable interfaces
- Minimize dependencies and coupling between modules
- Use dependency injection and composition patterns where appropriate
- Write code that is easy to mock, stub, and unit test
- Follow SOLID principles and clean code practices
- Prefer pure functions and avoid side effects when possible
- Structure code for easy debugging and modification

Testable and maintainable code is a higher priority than quick implementation.

## Test-Driven Development Workflow

**IMPORTANT: Always consider test requirements before implementing features or refactoring.**

Before starting any implementation:
1. **Assess test needs**: Determine if tests should be added for the feature/refactoring
2. **Document test strategy**: Note what will be tested and why in commit messages, PR descriptions, or inline comments
3. **Write tests first**: Add necessary tests before implementing the feature (if tests are needed)
4. **Implement**: Build the actual feature or refactoring
5. **Run tests**: Execute the test suite to verify implementation works correctly

Use `pnpm test:run` to run tests once or `pnpm test` for watch mode during development.

Before starting any implementation:
1. **Assess test needs**: Determine if tests should be added for the feature/refactoring
2. **Document test strategy**: Note what will be tested and why in commit messages, PR descriptions, or inline comments
3. **Write tests first**: Add necessary tests before implementing the feature (if tests are needed)
4. **Implement**: Build the actual feature or refactoring
5. **Run tests**: Execute the test suite to verify implementation works correctly

Use `pnpm test:run` to run tests once or `pnpm test` for watch mode during development.

## Reason
This project has pnpm workspace configuration (`pnpm-workspace.yaml`) and Vercel deployment expects pnpm lockfile consistency. Using npm creates lockfile conflicts that break deployment.