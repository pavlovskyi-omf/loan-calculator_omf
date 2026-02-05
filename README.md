# Personal Loan Calculator

A simple, client-side web application for estimating monthly payments on a personal loan.  
Built as an internal demo/prototype with a clean UI and instant feedback when adjusting loan parameters.

## Overview
The Personal Loan Calculator helps users understand how loan amount, APR, and repayment term affect monthly payments.

Users can:
- Enter a desired loan amount
- Adjust APR using a slider and plus/minus controls
- Compare monthly payments across multiple loan terms
- See total paid and total interest for a selected scenario

All calculations run entirely in the browser. No backend or user accounts are required.

## Features
- Currency-aware loan amount input
- APR slider with step controls
- Standard amortized loan calculations
- Comparison table with:
  - 3 loan amount variants
  - 24, 36, 48, and 60 month terms
- Instant updates when APR changes
- Explicit Calculate action for committing loan amount changes
- Responsive layout for desktop and mobile
- Accessible inputs and keyboard-friendly controls

## Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Material UI (unstyled primitives, customized styling)
- Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js (LTS)
- npm

### Install dependencies
```bash
npm install
