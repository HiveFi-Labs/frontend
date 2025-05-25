# HiveFi Frontend Specification

## Overview

HiveFi is a decentralized trading platform designed to make automated strategies accessible to everyone. This repository contains the Next.js 15 frontend which communicates with a backend API for running AI-assisted strategy creation and backtesting.

## Features

- **AI Trading Strategy Assistant**: Chat-based assistant that helps users build strategies and provides guidance from specialized agents.
- **Backtesting Engine**: Users can run backtests from the chat interface, view performance metrics and trade history, and iterate on strategies.
- **Coming Soon Screen**: Some features are gated by an environment flag and display a placeholder page.
- **Portfolio Management**: Tabs for overview, active strategies, risk controls, fund management, and alert settings.

## Getting Started

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and configure:
   - `NEXT_PUBLIC_BACKEND_API_URL`
   - Optional feature flags like `NEXT_PUBLIC_ENABLE_API_V1`.
3. Run the dev server with `pnpm dev` and open `http://localhost:3000`.

## Project Structure

```
frontend/
├── app/                - Next.js app router pages and API routes
│   ├── api/            - Backend API route proxies or stubs
│   ├── strategy/       - Strategy builder UI
│   ├── portfolio/      - Portfolio management pages
│   └── page.tsx        - Homepage
├── components/         - React components
│   ├── strategy/       - Backtesting charts, code viewer, etc.
│   ├── portfolio/      - Portfolio related components
│   └── ui/             - Common UI elements (button, tabs, etc.)
├── hooks/              - Custom React hooks (chat, backtest)
├── lib/                - API clients for v0/v1 backtesting services
├── services/           - Mock data fetching services
├── stores/             - Zustand store for strategy state
├── data/               - Mock datasets used by the services
└── public/             - Static assets
```

## API Modules

- `lib/backtest.api.ts` contains both v0 and v1 clients for the backtesting backend. The v1 client exposes endpoints for creating sessions, submitting prompts, generating code, and running backtests.
- `services/api-client.ts` provides a wrapper around fetch with an in-memory cache and loads mock data from `data/mock-data-map.ts`.

## State Management

The app uses a Zustand store defined in `stores/strategyStore.ts` to keep track of:

- API version (`v0` or `v1`)
- Current chat messages
- Backtest status and results
- Session IDs for each user

## Styling

Tailwind CSS and Radix UI components are used for the user interface. Global styles live in `app/globals.css` and the Tailwind configuration is defined in `tailwind.config.ts`.

## Build and Test

- Run `pnpm dev` for development.
- Run `pnpm build` to produce a production build.

## Notes

This repository currently relies on mock data for most services. Real API endpoints can replace the mock client by modifying `services/api-client.ts`.

## Strategy Builder Page

This page (`/app/strategy/page.tsx`) is the main interface for creating strategies.
Users chat with AI agents on the left while viewing results on the right.
The layout splits horizontally and can be resized by dragging the divider.
When no results are present the chat expands to the full width.

### Chat Interface

- Implemented in `components/strategy/ai-collaboration.tsx`.
- The top bar contains trading pair, timeframe and date range selectors. These are
  enabled only when `NEXT_PUBLIC_ENABLE_MARKET_CONTROLS=true`.
- A settings menu toggles **Easy Mode** (API v0) and **Build Mode** (API v1) and
  lets the user clear the session.
- Messages display avatars for each agent (`strategist`, `developer`, `analyst`,
  `optimizer`, `user`) and are stored in `useStrategyStore`.
- The `ChatInput` component sends messages via the `useChat` hook which calls
  `apiV0` or `apiV1` depending on the selected mode.
- A sample prompt button can populate the chat to generate an ATR breakout strategy.
- After the last assistant reply a **Run Backtest** button becomes available.
  Version `v1` triggers `useV1Backtest.run()` while `v0` uses
  `useV0Backtest.startBacktest()`.

### Backtest Results Panel

- Rendered by `components/strategy/backtesting-results.tsx`.
- Tabs switch between **Backtest** and **Code** (the code view is disabled for now).
- While the backtest is running `CodeLoading` shows animated placeholder lines.
- The **Save Strategy** button is present but disabled.

#### Trade Charts

- `TradeCharts` uses `react-plotly.js` and `backtestResultsJson` from the store.
- Three stacked subplots display the equity curve, buy/sell signals and closed/open
  trades. Only relevant traces from the JSON response are plotted.

#### Performance Metrics

- `PerformanceMetrics` (or `PerformanceMetricsV0`) shows total return, Sharpe
  ratio, max drawdown, win rate and more. Values are color coded and formatted as
  percentages when appropriate.

#### Trade History

- `TradeHistoryTable` derives individual trades from signal traces. Results are
  paginated and include side, entry/exit times, prices, PnL and duration.

### State Flow

- `stores/strategyStore.ts` keeps the session ID, API version, messages,
  backtest status and results.
- `useChat`, `useV0Backtest` and `useV1Backtest` update the store as messages are
  exchanged and backtests complete. Clearing the chat resets all results.

### Environment Flags

- `NEXT_PUBLIC_ENABLE_API_V1` enables Build Mode and v1 endpoints.
- `NEXT_PUBLIC_ENABLE_MARKET_CONTROLS` shows the pair and timeframe selectors.
- `NEXT_PUBLIC_DISABLE_COMING_SOON` removes placeholder screens.
