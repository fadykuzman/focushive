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

## Reason
This project has pnpm workspace configuration (`pnpm-workspace.yaml`) and Vercel deployment expects pnpm lockfile consistency. Using npm creates lockfile conflicts that break deployment.