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

## Reason
This project has pnpm workspace configuration (`pnpm-workspace.yaml`) and Vercel deployment expects pnpm lockfile consistency. Using npm creates lockfile conflicts that break deployment.