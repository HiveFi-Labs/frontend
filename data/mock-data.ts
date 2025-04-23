/**
 * モックデータ
 *
 * すべてのモックデータを一つのファイルに集約
 */

// ポートフォリオ概要データ
export const portfolioSummaryData = {
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
export const userStrategiesData = [
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
export const marketplaceStrategiesData = [
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
]

// リスク管理データ
export const riskMetricsData = {
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
export const transactionsData = [
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
]

// リバランス履歴データ
export const rebalanceHistoryData = [
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
export const profitHandlingSettingsData = {
  autoReinvest: true,
  profitTaking: "none", // "none" | "threshold" | "periodic"
  withdrawalMethod: "manual", // "manual" | "scheduled" | "threshold"
}

// ファンド管理データ
export const fundSummaryData = {
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
  profitHandlingSettings: {
    autoReinvest: true,
    profitTaking: "none",
    withdrawalMethod: "manual",
  },
}

// アラート設定データ
export const alertsData = [
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
]

// 通知設定データ
export const notificationPreferencesData = {
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

// AIチャットメッセージデータ
export const chatConversationsData = [
  {
    agent: "strategist",
    message:
      "I'm analyzing the market conditions for BTC/USDT. Based on historical data, I suggest we implement a trend-following strategy with RSI as an additional filter.",
    timestamp: "10:32 AM",
  },
  {
    agent: "developer",
    message:
      "That makes sense. I'll implement a basic structure using the RSI indicator with a 14-period lookback. We should also consider adding a moving average crossover to confirm the trend.",
    timestamp: "10:33 AM",
  },
  {
    agent: "analyst",
    message:
      "Looking at the backtesting results, the strategy performs well in trending markets but struggles during sideways price action. We should add a volatility filter to avoid trading in low-volatility environments.",
    timestamp: "10:35 AM",
    attachment: {
      type: "chart",
      data: {
        title: "Strategy Performance",
        metrics: {
          return: "+28.4%",
          sharpeRatio: "1.8",
          maxDrawdown: "-12.3%",
        },
      },
    },
  },
]

// パフォーマンス指標データ
export const performanceMetricsData = [
  { name: "Total Return", value: "+28.4%", status: "positive" },
  { name: "Sharpe Ratio", value: "1.8", status: "positive" },
  { name: "Max Drawdown", value: "-12.3%", status: "neutral" },
  { name: "Win Rate", value: "62%", status: "positive" },
  { name: "Profit Factor", value: "2.1", status: "positive" },
  { name: "Avg. Trade", value: "+1.2%", status: "positive" },
]

// 取引履歴データ
export const tradeHistoryData = [
  { id: 1, type: "LONG", entry: "31,245", exit: "32,850", pnl: "+5.1%", duration: "2d 4h", date: "Jan 15, 2023" },
  { id: 2, type: "LONG", entry: "33,120", exit: "32,410", pnl: "-2.1%", duration: "1d 7h", date: "Jan 18, 2023" },
  { id: 3, type: "LONG", entry: "32,780", exit: "34,560", pnl: "+5.4%", duration: "3d 12h", date: "Jan 22, 2023" },
  { id: 4, type: "LONG", entry: "34,890", exit: "36,720", pnl: "+5.2%", duration: "4d 2h", date: "Jan 28, 2023" },
  { id: 5, type: "LONG", entry: "36,450", exit: "35,980", pnl: "-1.3%", duration: "0d 18h", date: "Feb 2, 2023" },
]

// パラメータ最適化結果データ
export const optimizationResultsData = [
  { rsiPeriod: 14, fastMA: 10, slowMA: 30, stopLoss: 2, return: "+28.4%", sharpe: "1.8" },
  { rsiPeriod: 12, fastMA: 8, slowMA: 25, stopLoss: 2.5, return: "+26.7%", sharpe: "1.7" },
  { rsiPeriod: 16, fastMA: 12, slowMA: 35, stopLoss: 1.8, return: "+25.9%", sharpe: "1.6" },
]

// チャートデータポイント
export const chartDataPoints = [
  { date: "Jan 1", price: 29000 },
  { date: "Jan 5", price: 30200 },
  { date: "Jan 10", price: 31500 },
  { date: "Jan 15", price: 31245, signal: "buy" },
  { date: "Jan 20", price: 32100 },
  { date: "Jan 25", price: 32850, signal: "sell" },
  { date: "Jan 30", price: 33120, signal: "buy" },
  { date: "Feb 5", price: 32410, signal: "sell" },
  { date: "Feb 10", price: 32780, signal: "buy" },
]

// 月次リターンデータ
export const monthlyReturnsData = [
  { month: "Jan", return: 5.1 },
  { month: "Feb", return: 3.3 },
  { month: "Mar", return: 8.2 },
  { month: "Apr", return: -2.1 },
  { month: "May", return: 6.7 },
  { month: "Jun", return: 4.2 },
]

// 株式曲線データ
export const equityCurveData = [
  { date: "Jan 1", value: 10000 },
  { date: "Jan 15", value: 10000 },
  { date: "Jan 25", value: 10510 },
  { date: "Feb 5", value: 10300 },
  { date: "Feb 20", value: 10850 },
  { date: "Mar 5", value: 11400 },
  { date: "Mar 15", value: 11250 },
  { date: "Mar 30", value: 12840 },
]

// 戦略コードデータ
export const strategyCodeData = {
  main: `
// Strategy: Trend Following with RSI Filter
// Version: 1.0

// Import required indicators
import { calculateRSI, calculateSMA } from './indicators';

class TrendFollowingStrategy {
  constructor(params = {}) {
    // Default parameters
    this.rsiPeriod = params.rsiPeriod || 14;
    this.rsiOverbought = params.rsiOverbought || 70;
    this.rsiOversold = params.rsiOversold || 30;
    this.fastMAPeriod = params.fastMAPeriod || 10;
    this.slowMAPeriod = params.slowMAPeriod || 30;
    this.stopLossPercent = params.stopLossPercent || 2;
    this.trailingStopLoss = params.trailingStopLoss || true;

    // State variables
    this.position = null;
    this.positions = [];
  }

  analyze(candles) {
    const prices = candles.map(candle => candle.close);
    const volumes = candles.map(candle => candle.volume);

    // Calculate indicators
    const rsi = calculateRSI(prices, this.rsiPeriod);
    const fastMA = calculateSMA(prices, this.fastMAPeriod);
    const slowMA = calculateSMA(prices, this.slowMAPeriod);

    const currentPrice = prices[prices.length - 1];
    const currentRSI = rsi[rsi.length - 1];
    const currentFastMA = fastMA[fastMA.length - 1];
    const currentSlowMA = slowMA[slowMA.length - 1];
    const previousFastMA = fastMA[fastMA.length - 2];
    const previousSlowMA = slowMA[slowMA.length - 2];

    // Check for buy signal: RSI oversold + MA crossover
    const isBuySignal = currentRSI < this.rsiOversold && 
                        previousFastMA <= previousSlowMA && 
                        currentFastMA > currentSlowMA;

    // Check for sell signal: RSI overbought + MA crossover
    const isSellSignal = currentRSI > this.rsiOverbought && 
                         previousFastMA >= previousSlowMA && 
                         currentFastMA < currentSlowMA;

    // Check stop loss if in position
    let isStopLoss = false;
    if (this.position && this.position.stopLossPrice && currentPrice <= this.position.stopLossPrice) {
      isStopLoss = true;
    }

    // Execute trading logic
    if (!this.position && isBuySignal) {
      // Open long position
      this.position = {
        type: 'long',
        entryPrice: currentPrice,
        entryTime: candles[candles.length - 1].timestamp,
        stopLossPrice: this.trailingStopLoss ? currentPrice * (1 - this.stopLossPercent/100) : null
      };
    } 
    else if (this.position && (isSellSignal || isStopLoss)) {
      // Close position
      this.position.exitPrice = currentPrice;
      this.position.exitTime = candles[candles.length - 1].timestamp;
      this.position.pnl = (currentPrice - this.position.entryPrice) / this.position.entryPrice * 100;
      
      // Add to closed positions
      this.positions.push({...this.position});
      
      // Reset current position
      this.position = null;
    }
    else if (this.position && this.trailingStopLoss) {
      // Update trailing stop loss
      this.position.stopLossPrice = this.applyTrailingStopLoss(
        this.position, 
        currentPrice, 
        this.stopLossPercent
      );
    }

    return {
      position: this.position,
      indicators: {
        rsi: currentRSI,
        fastMA: currentFastMA,
        slowMA: currentSlowMA
      },
      signals: {
        buy: isBuySignal,
        sell: isSellSignal,
        stopLoss: isStopLoss
      }
    };
  }

  applyTrailingStopLoss(position, currentPrice, stopLossPercent) {
    if (!position.stopLossPrice || currentPrice * (1 - stopLossPercent/100) > position.stopLossPrice) {
      position.stopLossPrice = currentPrice * (1 - stopLossPercent/100);
    }

    return position.stopLossPrice;
  }
}

export default TrendFollowingStrategy;
`,
  indicators: `
// indicators.js
// Common technical indicators for trading strategies

/**
 * Calculate Relative Strength Index (RSI)
 * @param {Array} prices - Array of price values
 * @param {Number} period - RSI period
 * @returns {Array} - Array of RSI values
 */
export function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) {
    throw new Error('Not enough data points to calculate RSI');
  }

  const deltas = [];
  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1]);
  }

  let gains = [];
  let losses = [];

  for (let i = 0; i < deltas.length; i++) {
    gains.push(deltas[i] > 0 ? deltas[i] : 0);
    losses.push(deltas[i] < 0 ? Math.abs(deltas[i]) : 0);
  }

  // Calculate average gains and losses over the period
  let avgGain = gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

  const rsiValues = [];

  // First RSI value
  let rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss); // Avoid division by zero
  rsiValues.push(100 - (100 / (1 + rs)));

  // Calculate remaining RSI values
  for (let i = period; i < prices.length - 1; i++) {
    avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    
    rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
    rsiValues.push(100 - (100 / (1 + rs)));
  }

  // Pad the beginning with null values to match the input length
  const result = Array(period).fill(null).concat(rsiValues);
  return result;
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param {Array} prices - Array of price values
 * @param {Number} period - SMA period
 * @returns {Array} - Array of SMA values
 */
export function calculateSMA(prices, period = 20) {
  if (prices.length < period) {
    throw new Error('Not enough data points to calculate SMA');
  }

  const smaValues = [];

  // Calculate SMA values
  for (let i = 0; i <= prices.length - period; i++) {
    const sum = prices.slice(i, i + period).reduce((total, price) => total + price, 0);
    smaValues.push(sum / period);
  }

  // Pad the beginning with null values to match the input length
  const result = Array(period - 1).fill(null).concat(smaValues);
  return result;
}
`,
}

// 戦略設定データ
export const strategySettingsData = {
  riskPerTrade: 2.0,
  maxOpenPositions: 3,
  takeProfit: 5.0,
  stopLoss: 2.5,
  trailingStop: true,
  leverage: 1,
}

// 機能データ
export const featuresData = [
  {
    title: "Visual Strategy Builder",
    description: "Create complex trading strategies with an intuitive drag-and-drop interface. No coding required.",
    icon: "Code2",
  },
  {
    title: "Advanced Backtesting",
    description: "Test your strategies against historical data with comprehensive performance metrics and analysis.",
    icon: "BarChart3",
  },
  {
    title: "AI-Powered Strategy Creation",
    description: "Leverage artificial intelligence to create, optimize, and improve your trading strategies.",
    icon: "MessageSquare",
  },
  {
    title: "Risk Management",
    description: "Set precise risk parameters to protect capital and ensure strategies align with risk tolerance.",
    icon: "Shield",
  },
  {
    title: "Capital Efficiency",
    description:
      "Maximize returns by deploying capital across multiple verified strategies with different risk profiles.",
    icon: "Rocket",
  },
  {
    title: "Strategy Marketplace",
    description: "Discover and invest in verified strategies or monetize your own trading expertise.",
    icon: "LineChart",
  },
]

// 問題と解決策のデータ
export const problemSolutionsData = [
  {
    problem: "Commoditized Strategy Saturation",
    description:
      "Current DeFi market is saturated with commoditized strategies competing solely on TVL with little differentiation.",
    solution: "Algorithmic Directional Trading Platform",
    solutionDescription:
      "Permissionless, verifiable algorithmic long/short strategy platform with on-chain verification for transparency and trust.",
  },
  {
    problem: "Lack of Directional Trading",
    description:
      "Limited options for directional trading operations like long or short positions based on price predictions.",
    solution: "Predictable Performance",
    solutionDescription:
      "Algorithmic trading providing predictable PnL results and transparent execution, allowing investors to understand strategy characteristics.",
  },
  {
    problem: "Lack of Predictability",
    description: "Traditional copy trading requires extreme trust as trader actions cannot be predicted.",
    solution: "Risk-Managed Investment",
    solutionDescription:
      "Directional but risk-limited investment options with clear risk parameters to prevent excessive risk-taking.",
  },
]

// 製品概要データ
export const productFeaturesData = [
  {
    title: "Strategy Builder",
    description: "No-code visual interface for building trading algorithms",
    icon: "Code2",
    learnMoreLink: "/strategy-builder",
  },
  {
    title: "Backtest Engine",
    description: "Test strategies against historical market data",
    icon: "BarChart3",
    learnMoreLink: "/backtest",
  },
  {
    title: "AI Chat Interface",
    description: "Intelligent assistant for strategy creation and optimization",
    icon: "MessageSquare",
    learnMoreLink: "/ai-chat",
  },
  {
    title: "Vault Management",
    description: "Create and manage strategy vaults",
    icon: "Shield",
    learnMoreLink: "/vaults",
  },
  {
    title: "Risk Management",
    description: "Comprehensive risk parameters and controls",
    icon: "LineChart",
    learnMoreLink: "/risk",
  },
  {
    title: "Strategy Portfolio",
    description: "Build diversified portfolios of trading strategies",
    icon: "Layers",
    learnMoreLink: "/portfolio",
  },
]

// 統計データ
export const statsData = [
  { value: "$42M+", label: "Total Value Locked" },
  { value: "2,500+", label: "Active Traders" },
  { value: "350+", label: "Verified Strategies" },
  { value: "28%", label: "Avg. Annual Return" },
]

// お客様の声データ
export const testimonialsData = [
  {
    name: "Alex Thompson",
    role: "Professional Trader",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "HiveFi has completely transformed my trading workflow. The AI chat interface makes it easy to implement complex ideas without writing a single line of code.",
  },
  {
    name: "Sarah Chen",
    role: "Hedge Fund Manager",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The backtesting capabilities are unmatched. I can validate strategies across multiple market conditions and optimize parameters with just a few clicks.",
  },
  {
    name: "Michael Rodriguez",
    role: "DeFi Investor",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "As an investor, I love being able to diversify across multiple verified strategies. The risk management tools give me confidence that my capital is being deployed responsibly.",
  },
]

// ヒーローセクションのデータ
export const heroData = {
  title: "AI-Powered Algorithmic Trading for DeFi",
  subtitle:
    "Create, backtest, and deploy algorithmic trading strategies with AI assistance. Invest in verified strategies or share your expertise with the world.",
  userCount: 2500,
}
