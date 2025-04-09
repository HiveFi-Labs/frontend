import type { RiskMetrics } from "@/types/risk-management"

// リスク管理データ
export const riskMetricsData: RiskMetrics = {
  overall: 65, // 0-100 scale
  volatility: 14.2,
  drawdown: 12.3,
  sharpeRatio: 1.8,
  sortinoRatio: 2.1,
  var95: 3.2, // Value at Risk (95%)
  var99: 5.8, // Value at Risk (99%)
  strategies: [
    { name: "Trend Following RSI", risk: 60, correlation: [1, 0.3, 0.5, 0.2] },
    { name: "MACD Crossover", risk: 65, correlation: [0.3, 1, 0.4, 0.3] },
    { name: "Volatility Breakout", risk: 80, correlation: [0.5, 0.4, 1, 0.1] },
    { name: "Mean Reversion", risk: 45, correlation: [0.2, 0.3, 0.1, 1] },
  ],
  riskContribution: [
    { name: "Trend Following RSI", value: 35 },
    { name: "MACD Crossover", value: 30 },
    { name: "Volatility Breakout", value: 25 },
    { name: "Mean Reversion", value: 10 },
  ],
  riskFactors: [
    { name: "Market Risk", value: 45 },
    { name: "Volatility Risk", value: 30 },
    { name: "Liquidity Risk", value: 15 },
    { name: "Correlation Risk", value: 10 },
  ],
}
