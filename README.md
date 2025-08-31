# FocusHive

A modern productivity timer application built with Next.js, featuring customizable work/break intervals and a clean, intuitive interface.

## Features

- ⏰ Customizable focus timer with work and break sessions
- ⚙️ Adjustable session durations
- 🎯 Progress tracking with visual indicators
- 📱 Responsive design for desktop and mobile
- 🔄 Automatic session transitions
- ⏸️ Pause and resume functionality

## Prerequisites

- Node.js >= 22.0.0
- pnpm (recommended package manager)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd focushive
```

2. Navigate to the project directory and install dependencies:
```bash
cd focushive
pnpm install
```

### Running Locally

Start the development server:
```bash
cd focushive
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
cd focushive
pnpm build
```

## Testing

Run the test suite:
```bash
cd focushive
pnpm test:run          # Run tests once
pnpm test              # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
pnpm test:ui           # Run tests with UI interface
pnpm test:report       # Generate HTML test reports
```

Test reports are generated in the `reports/` directory.

## Development

### Code Quality

- ESLint for code linting: `pnpm lint`
- Husky pre-commit hooks ensure code quality
- Comprehensive test coverage with Vitest and React Testing Library

### Project Structure

```
focushive/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── stores/          # Zustand state management
│   │   └── utils/           # Utility functions and timer logic
│   └── test-setup.js        # Test configuration
├── docs/                    # Documentation and ADRs
└── reports/                 # Test and build reports
```

## Technology Stack

- **Framework**: Next.js 15.5.0
- **UI Library**: React 18.3.1
- **State Management**: Zustand
- **Styling**: TailwindCSS 4
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Run `pnpm lint` before committing
4. Create Architecture Decision Records (ADRs) for significant changes

## Architecture Decisions

See `docs/adrs/` for detailed architecture decision records documenting technology choices and implementation decisions.
