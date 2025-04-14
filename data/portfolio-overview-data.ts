import type { PortfolioSummary } from '@/types/portfolio-overview'

// ポートフォリオの概要データ
export const portfolioSummaryData: PortfolioSummary = {
  totalValue: 42568.92,
  change: {
    value: 3254.67,
    percent: 8.3,
    trend: 'up',
  },
  allocation: [
    {
      name: 'Trend Following RSI',
      value: 15000,
      percent: 35.2,
      performance: 12.4,
    },
    { name: 'MACD Crossover', value: 12500, percent: 29.4, performance: 8.7 },
    {
      name: 'Volatility Breakout',
      value: 8000,
      percent: 18.8,
      performance: -3.2,
    },
    { name: 'Mean Reversion', value: 7068.92, percent: 16.6, performance: 6.5 },
  ],
  historicalPerformance: [
    { date: 'Jan', value: 35000 },
    { date: 'Feb', value: 36200 },
    { date: 'Mar', value: 38500 },
    { date: 'Apr', value: 37800 },
    { date: 'May', value: 39200 },
    { date: 'Jun', value: 41500 },
    { date: 'Jul', value: 42568.92 },
  ],
}
