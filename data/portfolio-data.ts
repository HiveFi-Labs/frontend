import type {
  PortfolioSummary,
  Strategy,
  RiskMetrics,
  Transaction,
  Rebalance,
  FundSummary,
  Alert,
  NotificationPreferences,
  ProfitHandlingSettings,
} from "@/types/portfolio"

// ポートフォリオの概要データ
export const portfolioSummaryData: PortfolioSummary = {
  totalValue: 42568.92,
  change: {
    value: 3254.67,
    percent: 8.3,
    trend: "up",
  },
  allocation: [
    { name: "Trend Following RSI", value: 15000, percent: 35.2, performance: 12.4 },
    { name: "MACD Crossover", value: 12500, percent: 29.4, performance: 8.7 },
    { name: "Volatility Breakout", value: 8000, percent: 18.8, performance: -3.2 },
    { name: "Mean Reversion", value: 7068.92, percent: 16.6, performance: 6.5 },
  ],
  historicalPerformance: [
    { date: "Jan", value: 35000 },
    { date: "Feb", value: 36200 },
    { date: "Mar", value: 38500 },
    { date: "Apr", value: 37800 },
    { date: "May", value: 39200 },
    { date: "Jun", value: 41500 },
    { date: "Jul", value: 42568.92 },
  ],
}

// ユーザーの戦略データ
export const userStrategiesData: Strategy[] = [
  {
    id: 1,
    name: "Trend Following RSI",
    type: "trend",
    pair: "BTC/USDT",
    timeframe: "1h",
    status: "live",
    isPublic: true,
    indicators: ["RSI", "MA"],
    allocation: 15000,
    allocationPercent: 35.2,
    performance: {
      trend: "up",
      return: "+28.4%",
      sharpe: "1.8",
      winRate: "62%",
      maxDrawdown: "-12.3%",
      chartPath:
        "M10,50 C30,40 50,60 70,45 C90,30 110,50 130,40 C150,30 170,50 190,35 C210,20 230,30 250,15 C270,5 290,10 290,10",
    },
  },
  {
    id: 2,
    name: "Mean Reversion Bollinger",
    type: "mean",
    pair: "ETH/USDT",
    timeframe: "4h",
    status: "testing",
    isPublic: false,
    indicators: ["Bollinger", "Volume"],
    allocation: 7068.92,
    allocationPercent: 16.6,
    performance: {
      trend: "up",
      return: "+15.7%",
      sharpe: "1.4",
      winRate: "58%",
      maxDrawdown: "-8.5%",
      chartPath:
        "M10,60 C30,50 50,65 70,55 C90,45 110,60 130,50 C150,40 170,55 190,45 C210,35 230,45 250,30 C270,20 290,25 290,25",
    },
  },
  {
    id: 3,
    name: "Breakout Strategy",
    type: "breakout",
    pair: "SOL/USDT",
    timeframe: "15m",
    status: "draft",
    isPublic: false,
    indicators: ["ATR", "Support/Resistance"],
    allocation: 8000,
    allocationPercent: 18.8,
    performance: {
      trend: "down",
      return: "-3.2%",
      sharpe: "0.7",
      winRate: "45%",
      maxDrawdown: "-15.1%",
      chartPath:
        "M10,40 C30,50 50,45 70,55 C90,65 110,60 130,70 C150,80 170,75 190,85 C210,90 230,85 250,90 C270,85 290,90 290,90",
    },
  },
  {
    id: 4,
    name: "MACD Crossover",
    type: "trend",
    pair: "BNB/USDT",
    timeframe: "1d",
    status: "live",
    isPublic: true,
    indicators: ["MACD", "EMA"],
    allocation: 12500,
    allocationPercent: 29.4,
    performance: {
      trend: "up",
      return: "+32.1%",
      sharpe: "2.1",
      winRate: "67%",
      maxDrawdown: "-10.8%",
      chartPath:
        "M10,70 C30,60 50,50 70,40 C90,30 110,35 130,25 C150,15 170,20 190,10 C210,5 230,15 250,5 C270,10 290,5 290,5",
    },
  },
]

// マーケットプレイス戦略データ
export const marketplaceStrategiesData: Strategy[] = [
  {
    id: 101,
    name: "Quantum Trend Predictor",
    type: "trend",
    pair: "BTC/USDT",
    timeframe: "4h",
    status: "live",
    isPublic: true,
    indicators: ["RSI", "MACD", "Fibonacci"],
    performance: {
      trend: "up",
      return: "+42.7%",
      sharpe: "2.4",
      winRate: "71%",
      maxDrawdown: "-11.2%",
      chartPath:
        "M10,60 C30,50 50,40 70,30 C90,20 110,25 130,15 C150,10 170,15 190,5 C210,10 230,5 250,10 C270,5 290,10 290,10",
    },
    creator: {
      name: "CryptoWhale",
      verified: true,
      rating: "4.9",
    },
    popularity: {
      users: 1245,
      rating: "4.8",
    },
  },
  {
    id: 102,
    name: "AI-Enhanced Mean Reversion",
    type: "mean",
    pair: "ETH/USDT",
    timeframe: "1h",
    status: "live",
    isPublic: true,
    indicators: ["Bollinger", "RSI", "ML Model"],
    performance: {
      trend: "up",
      return: "+36.2%",
      sharpe: "2.1",
      winRate: "68%",
      maxDrawdown: "-9.7%",
      chartPath:
        "M10,70 C30,60 50,50 70,40 C90,45 110,35 130,30 C150,25 170,30 190,20 C210,15 230,20 250,10 C270,15 290,5 290,5",
    },
    creator: {
      name: "TradingGenius",
      verified: true,
      rating: "4.7",
    },
    popularity: {
      users: 876,
      rating: "4.6",
    },
  },
  {
    id: 103,
    name: "Volatility Breakout Pro",
    type: "breakout",
    pair: "SOL/USDT",
    timeframe: "15m",
    status: "live",
    isPublic: true,
    indicators: ["ATR", "Keltner", "Volume"],
    performance: {
      trend: "up",
      return: "+31.5%",
      sharpe: "1.9",
      winRate: "64%",
      maxDrawdown: "-13.8%",
      chartPath:
        "M10,50 C30,40 50,45 70,35 C90,25 110,30 130,20 C150,25 170,15 190,20 C210,10 230,15 250,10 C270,5 290,10 290,10",
    },
    creator: {
      name: "VolatilityMaster",
      verified: false,
      rating: "4.5",
    },
    popularity: {
      users: 542,
      rating: "4.3",
    },
  },
  {
    id: 104,
    name: "DeFi Yield Optimizer",
    type: "mean",
    pair: "LINK/USDT",
    timeframe: "1d",
    status: "live",
    isPublic: true,
    indicators: ["EMA", "RSI", "Volume Flow"],
    performance: {
      trend: "up",
      return: "+38.9%",
      sharpe: "2.2",
      winRate: "69%",
      maxDrawdown: "-10.5%",
      chartPath:
        "M10,60 C30,50 50,40 70,30 C90,35 110,25 130,20 C150,15 170,25 190,15 C210,10 230,5 250,15 C270,10 290,5 290,5",
    },
    creator: {
      name: "DeFiWhisperer",
      verified: true,
      rating: "4.8",
    },
    popularity: {
      users: 921,
      rating: "4.7",
    },
  },
  {
    id: 105,
    name: "Momentum Scalper",
    type: "trend",
    pair: "BTC/USDT",
    timeframe: "5m",
    status: "live",
    isPublic: true,
    indicators: ["Stochastic", "MACD", "Volume"],
    performance: {
      trend: "up",
      return: "+29.3%",
      sharpe: "1.8",
      winRate: "65%",
      maxDrawdown: "-14.2%",
      chartPath:
        "M10,55 C30,45 50,50 70,40 C90,30 110,35 130,25 C150,30 170,20 190,25 C210,15 230,20 250,10 C270,15 290,10 290,10",
    },
    creator: {
      name: "ScalpKing",
      verified: false,
      rating: "4.4",
    },
    popularity: {
      users: 687,
      rating: "4.2",
    },
  },
  {
    id: 106,
    name: "Smart Grid Trading",
    type: "mean",
    pair: "ETH/USDT",
    timeframe: "4h",
    status: "live",
    isPublic: true,
    indicators: ["Support/Resistance", "Volume", "RSI"],
    performance: {
      trend: "up",
      return: "+33.7%",
      sharpe: "2.0",
      winRate: "67%",
      maxDrawdown: "-12.1%",
      chartPath:
        "M10,65 C30,55 50,60 70,50 C90,40 110,45 130,35 C150,25 170,30 190,20 C210,15 230,10 250,5 C270,10 290,5 290,5",
    },
    creator: {
      name: "GridMaster",
      verified: true,
      rating: "4.6",
    },
    popularity: {
      users: 754,
      rating: "4.5",
    },
  },
]

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

// 取引履歴データ
export const transactionsData: Transaction[] = [
  {
    id: 1,
    type: "deposit",
    amount: 10000,
    date: "2023-07-01T10:30:00Z",
    status: "completed",
    description: "Initial deposit",
  },
  {
    id: 2,
    type: "transfer",
    amount: 5000,
    date: "2023-07-05T14:15:00Z",
    status: "completed",
    description: "Transfer to Trend Following RSI",
    strategy: "Trend Following RSI",
  },
  {
    id: 3,
    type: "transfer",
    amount: 3000,
    date: "2023-07-05T14:20:00Z",
    status: "completed",
    description: "Transfer to MACD Crossover",
    strategy: "MACD Crossover",
  },
  {
    id: 4,
    type: "deposit",
    amount: 5000,
    date: "2023-07-10T09:45:00Z",
    status: "completed",
    description: "Additional deposit",
  },
  {
    id: 5,
    type: "transfer",
    amount: 2000,
    date: "2023-07-12T11:30:00Z",
    status: "completed",
    description: "Transfer to Volatility Breakout",
    strategy: "Volatility Breakout",
  },
  {
    id: 6,
    type: "withdraw",
    amount: 1500,
    date: "2023-07-15T16:20:00Z",
    status: "completed",
    description: "Partial withdrawal",
  },
  {
    id: 7,
    type: "transfer",
    amount: 4000,
    date: "2023-07-20T10:10:00Z",
    status: "completed",
    description: "Transfer to Mean Reversion",
    strategy: "Mean Reversion",
  },
  {
    id: 8,
    type: "deposit",
    amount: 3000,
    date: "2023-07-25T13:40:00Z",
    status: "pending",
    description: "Monthly deposit",
  },
]

// リバランス履歴データ
export const rebalanceHistoryData: Rebalance[] = [
  {
    id: 1,
    date: "2023-07-01T00:00:00Z",
    type: "manual",
    changes: [
      { strategy: "Trend Following RSI", before: 30, after: 35 },
      { strategy: "MACD Crossover", before: 25, after: 30 },
      { strategy: "Volatility Breakout", before: 25, after: 20 },
      { strategy: "Mean Reversion", before: 20, after: 15 },
    ],
  },
  {
    id: 2,
    date: "2023-06-15T00:00:00Z",
    type: "automatic",
    changes: [
      { strategy: "Trend Following RSI", before: 28, after: 30 },
      { strategy: "MACD Crossover", before: 27, after: 25 },
      { strategy: "Volatility Breakout", before: 22, after: 25 },
      { strategy: "Mean Reversion", before: 23, after: 20 },
    ],
  },
  {
    id: 3,
    date: "2023-06-01T00:00:00Z",
    type: "manual",
    changes: [
      { strategy: "Trend Following RSI", before: 25, after: 28 },
      { strategy: "MACD Crossover", before: 25, after: 27 },
      { strategy: "Volatility Breakout", before: 25, after: 22 },
      { strategy: "Mean Reversion", before: 25, after: 23 },
    ],
  },
]

// 利益処理設定
export const profitHandlingSettingsData: ProfitHandlingSettings = {
  autoReinvest: true,
  profitTaking: "none", // "none" | "threshold" | "periodic"
  withdrawalMethod: "manual", // "manual" | "scheduled" | "threshold"
}

// ファンド管理データ
export const fundSummaryData: FundSummary = {
  totalBalance: 42568.92,
  availableBalance: 5068.92,
  allocatedBalance: 37500.0,
  recentActivity: [
    {
      type: "deposit",
      amount: 3000,
      date: "2023-07-25T13:40:00Z",
      status: "pending",
      description: "Monthly deposit",
    },
    {
      type: "transfer",
      amount: 4000,
      date: "2023-07-20T10:10:00Z",
      status: "completed",
      description: "Transfer to Mean Reversion",
      strategy: "Mean Reversion",
    },
  ],
  autoRebalanceSettings: {
    enabled: true,
    frequency: "Monthly",
    nextRebalance: "2023-08-01T00:00:00Z",
    threshold: 5,
  },
  profitHandlingSettings: profitHandlingSettingsData,
}

// アラート設定データ
export const alertsData: Alert[] = [
  {
    id: 1,
    type: "performance",
    name: "Significant Profit",
    condition: "Portfolio up by 5% or more in a day",
    status: "active",
    lastTriggered: "2023-07-10T14:30:00Z",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  {
    id: 2,
    type: "risk",
    name: "Drawdown Alert",
    condition: "Portfolio down by 10% or more from peak",
    status: "active",
    lastTriggered: null,
    notifications: {
      email: true,
      push: true,
      sms: true,
    },
  },
  {
    id: 3,
    type: "strategy",
    name: "Strategy Underperformance",
    condition: "Trend Following RSI underperforms by 5% vs benchmark",
    status: "active",
    lastTriggered: "2023-06-15T09:45:00Z",
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
  },
  {
    id: 4,
    type: "market",
    name: "Market Volatility",
    condition: "BTC volatility exceeds 5% in 24 hours",
    status: "inactive",
    lastTriggered: "2023-05-22T11:20:00Z",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
]

// 通知設定データ
export const notificationPreferencesData: NotificationPreferences = {
  email: {
    enabled: true,
    address: "user@example.com",
    dailyDigest: true,
  },
  push: {
    enabled: true,
    device: "all",
    quietHours: false,
  },
  sms: {
    enabled: false,
    phoneNumber: "",
    criticalOnly: true,
  },
}
