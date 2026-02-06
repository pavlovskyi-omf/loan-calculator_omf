# Personal Loan Calculator

A client-side web application for estimating monthly payments on personal loans. Built with React, TypeScript, and Material-UI.

## Features

- **Loan Amount Input**: Currency input with validation ($1,500 - $100,000)
- **APR Control**: Interactive slider and step buttons (0-36%)
- **Payment Comparison**: View monthly payments across different amounts and terms
- **Real-time Updates**: APR changes update instantly; amount changes require Calculate click
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Runtime**: Node.js LTS
- **Frontend**: React 19 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4 + Material-UI 6
- **Testing**: Vitest 2.1 + React Testing Library 16
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Run tests with UI
npm test:ui

# Build for production
npm run build

# Preview production build
npm run preview
```

### Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm test -- --run` - Run tests once
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/              # Main application and state management
│   └── App.tsx
├── components/       # Reusable UI components
│   ├── LoanAmountInput.tsx
│   ├── AprControl.tsx
│   ├── AmountTabs.tsx
│   ├── PaymentTable.tsx
│   └── SelectedDetails.tsx
├── domain/           # Pure business logic (fully tested)
│   ├── config.ts     # Configuration constants
│   ├── loanMath.ts   # Payment calculations
│   ├── currency.ts   # Currency parsing and formatting
│   └── validation.ts # Input validation
└── test/             # Test setup
    └── setup.ts
```

## Architecture

The application follows a clean architecture with three layers:

1. **Domain Layer** (`src/domain/`): Pure TypeScript functions with zero React dependencies
   - Loan payment calculations (handles 0% APR edge case)
   - Currency formatting and parsing
   - Amount validation and clamping
   - 100% test coverage

2. **Component Layer** (`src/components/`): Reusable UI elements
   - Each component receives props, minimal internal state
   - Focused responsibilities

3. **App Layer** (`src/app/`): State orchestration
   - Central state management (React hooks)
   - Derived data computation
   - Event handling coordination

## Calculation Behavior

- **Calculate Button**: Commits the current input amount and updates the payment table
- **APR Changes**: Update the payment table instantly without requiring Calculate
- **Amount Input Changes**: Only update display, table updates after Calculate is clicked

## Testing

The project includes comprehensive tests:

- **Domain Logic**: 39 unit tests covering all calculation edge cases
- **Component Tests**: Tests for user interactions and rendering
- **Integration Tests**: End-to-end calculation flows

Run tests:
```bash
npm test                    # Watch mode
npm test -- --run           # Single run
npm test -- --coverage      # With coverage report
```

## Configuration

Key constants in `src/domain/config.ts`:
- Min amount: $1,500
- Max amount: $100,000
- APR range: 0-36%
- Terms: 24, 36, 48, 60 months
- Comparison delta: $1,000

## Deployment

The application can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

### Building for Production

```bash
npm run build
```

The `dist/` folder contains the production-ready files.

## License

This is an internal demo application.

## Documentation

- [PRODUCT.md](PRODUCT.md) - Product requirements and features
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture and design decisions
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Detailed implementation plan

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
