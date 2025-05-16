# HiveFi (Frontend Repository)

HiveFi is a decentralized platform designed to democratize access to sophisticated automated trading strategies. Our mission is to make advanced trading accessible to everyone, not just financial professionals.

## About HiveFi

HiveFi enables anyone to effortlessly leverage high-performing trading strategies that typically require extensive trading knowledge or resources. We believe advanced trading should not be exclusive to financial professionals.

## Currently Implemented Features

### AI Trading Strategy Assistant

Our platform features an intelligent AI chat assistant that helps users:

- Design custom trading strategies through natural language conversations
- Receive guidance from specialized AI agents including a strategist, developer, analyst, and optimizer
- Get support for different trading pairs (BTC, ETH, SOL, BNB) and timeframes (5m, 15m, 1h, 4h, 1d)
- Switch between "Easy Mode" and "Build Mode" based on your expertise level

### Backtesting Engine

Test and validate trading strategies with our comprehensive backtesting system:

- Run backtests directly from the AI chat interface
- Analyze performance metrics to evaluate strategy effectiveness
- View detailed trade history and performance charts
- Fine-tune strategies based on backtest results

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm package manager (v10+)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/hivefi.git
cd hivefi/frontend
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`

```bash
cp .env.example .env
```

4. Configure environment variables in the `.env` file:

```
# Authentication (for future implementation)
NEXT_PUBLIC_PRIVY_APP_ID=
NEXT_PUBLIC_PRIVY_CLIENT_ID=

# API Configuration
NEXT_PUBLIC_BACKEND_API_URL=

# Feature Flags
NEXT_PUBLIC_DISABLE_COMING_SOON=true  # Enable features that are marked as "Coming Soon"
NEXT_PUBLIC_ENABLE_API_V1=true        # Enable "Build Mode" for advanced strategy development
NEXT_PUBLIC_ENABLE_MARKET_CONTROLS=true  # Enable selection of different trading pairs and timeframes
```

5. Start the development server

```bash
pnpm dev
```

6. Open your browser and navigate to http://localhost:3000

## Project Structure

```
frontend/
├── app/                # Next.js pages and API routes
│   ├── api/            # Backend API routes
│   ├── strategy/       # Strategy builder pages
│   └── page.tsx        # Homepage
├── components/         # React components
│   ├── strategy/       # Strategy-related components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API clients
├── stores/             # State management (Zustand)
└── public/             # Static assets
```

## Technical Overview

HiveFi is built using:

- Next.js 15 framework with App Router
- React 19 for the frontend UI
- TailwindCSS for styling
- Zustand for state management
- Plotly.js for trading charts and visualization
- Radix UI components for accessible UI elements

## Related Repositories

- **Backend Repository**: [HiveFi-Labs/vectorbt-pro-sandbox](https://github.com/HiveFi-Labs/vectorbt-pro-sandbox) - Contains the backtesting engine and strategy execution logic. It is currently private.

- **Smart Contracts**: [HiveFi-Labs/contracts](https://github.com/HiveFi-Labs/contracts) - Contains various smart contracts for the HiveFi project

## Live Demo

The application is hosted and available at [https://hivefi.xyz/](https://hivefi.xyz/). Check out our platform to experience the future of algorithmic trading in DeFi.

## Documentation

For more detailed information, please visit our [official documentation](https://hivefi.gitbook.io/hivefi).

## Community

Join our growing community to get early access, exclusive benefits, and connect with like-minded traders:

- Join our [Discord server](https://discord.com/invite/u93QSsPNd6) for real-time updates and discussions
