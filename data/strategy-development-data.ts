import type {
  ChatMessage,
  PerformanceMetric,
  TradeHistoryItem,
  OptimizationResult,
  ChartDataPoint,
  MonthlyReturn,
  EquityCurvePoint,
  StrategyCode,
  StrategySettings,
} from '@/types/strategy-development'

// AIチャットメッセージデータ
export const chatConversationsData: ChatMessage[] = [
  {
    agent: 'strategist',
    message:
      "I'm analyzing the market conditions for BTC/USDT. Based on historical data, I suggest we implement a trend-following strategy with RSI as an additional filter.",
    timestamp: '10:32 AM',
  },
  {
    agent: 'developer',
    message:
      "That makes sense. I'll implement a basic structure using the RSI indicator with a 14-period lookback. We should also consider adding a moving average crossover to confirm the trend.",
    timestamp: '10:33 AM',
  },
  {
    agent: 'analyst',
    message:
      'Looking at the backtesting results, the strategy performs well in trending markets but struggles during sideways price action. We should add a volatility filter to avoid trading in low-volatility environments.',
    timestamp: '10:35 AM',
    attachment: {
      type: 'chart',
      data: {
        title: 'Strategy Performance',
        metrics: {
          return: '+28.4%',
          sharpeRatio: '1.8',
          maxDrawdown: '-12.3%',
        },
      },
    },
  },
  {
    agent: 'optimizer',
    message:
      "I've optimized the parameters based on the last 6 months of data. The optimal RSI settings appear to be: overbought = 70, oversold = 30, with a 14-period lookback. The moving average periods should be 10 and 30 for the fast and slow MAs respectively.",
    timestamp: '10:37 AM',
  },
  {
    agent: 'user',
    message: 'Can we add a stop-loss mechanism to limit the downside risk?',
    timestamp: '10:38 AM',
  },
  {
    agent: 'developer',
    message:
      "Absolutely. I'll implement a trailing stop-loss at 2% below the entry price. This should help protect profits while limiting downside risk.",
    timestamp: '10:39 AM',
    attachment: {
      type: 'code',
      data: `
// Implement trailing stop-loss
function applyTrailingStopLoss(position, currentPrice, stopLossPercent) {
 if (!position.stopLossPrice || currentPrice * (1 - stopLossPercent/100) > position.stopLossPrice) {
   position.stopLossPrice = currentPrice * (1 - stopLossPercent/100);
 }
 
 return position.stopLossPrice;
}
`,
    },
  },
]

// パフォーマンス指標データ
export const performanceMetricsData: PerformanceMetric[] = [
  { name: 'Total Return', value: '+28.4%', status: 'positive' },
  { name: 'Sharpe Ratio', value: '1.8', status: 'positive' },
  { name: 'Max Drawdown', value: '-12.3%', status: 'neutral' },
  { name: 'Win Rate', value: '62%', status: 'positive' },
  { name: 'Profit Factor', value: '2.1', status: 'positive' },
  { name: 'Avg. Trade', value: '+1.2%', status: 'positive' },
  { name: 'Total Trades', value: '47', status: 'neutral' },
  { name: 'Avg. Holding Time', value: '3.2 days', status: 'neutral' },
]

// 取引履歴データ
export const tradeHistoryData: TradeHistoryItem[] = [
  {
    id: 1,
    type: 'LONG',
    entry: '31,245',
    exit: '32,850',
    pnl: '+5.1%',
    duration: '2d 4h',
    date: 'Jan 15, 2023',
  },
  {
    id: 2,
    type: 'LONG',
    entry: '33,120',
    exit: '32,410',
    pnl: '-2.1%',
    duration: '1d 7h',
    date: 'Jan 18, 2023',
  },
  {
    id: 3,
    type: 'LONG',
    entry: '32,780',
    exit: '34,560',
    pnl: '+5.4%',
    duration: '3d 12h',
    date: 'Jan 22, 2023',
  },
  {
    id: 4,
    type: 'LONG',
    entry: '34,890',
    exit: '36,720',
    pnl: '+5.2%',
    duration: '4d 2h',
    date: 'Jan 28, 2023',
  },
  {
    id: 5,
    type: 'LONG',
    entry: '36,450',
    exit: '35,980',
    pnl: '-1.3%',
    duration: '0d 18h',
    date: 'Feb 2, 2023',
  },
]

// パラメータ最適化結果データ
export const optimizationResultsData: OptimizationResult[] = [
  {
    rsiPeriod: 14,
    fastMA: 10,
    slowMA: 30,
    stopLoss: 2,
    return: '+28.4%',
    sharpe: '1.8',
  },
  {
    rsiPeriod: 12,
    fastMA: 8,
    slowMA: 25,
    stopLoss: 2.5,
    return: '+26.7%',
    sharpe: '1.7',
  },
  {
    rsiPeriod: 16,
    fastMA: 12,
    slowMA: 35,
    stopLoss: 1.8,
    return: '+25.9%',
    sharpe: '1.6',
  },
  {
    rsiPeriod: 14,
    fastMA: 9,
    slowMA: 28,
    stopLoss: 2.2,
    return: '+27.8%',
    sharpe: '1.75',
  },
  {
    rsiPeriod: 15,
    fastMA: 11,
    slowMA: 32,
    stopLoss: 1.9,
    return: '+26.2%',
    sharpe: '1.65',
  },
]

// チャートデータポイント
export const chartDataPoints: ChartDataPoint[] = [
  { date: 'Jan 1', price: 29000 },
  { date: 'Jan 5', price: 30200 },
  { date: 'Jan 10', price: 31500 },
  { date: 'Jan 15', price: 31245, signal: 'buy' },
  { date: 'Jan 20', price: 32100 },
  { date: 'Jan 25', price: 32850, signal: 'sell' },
  { date: 'Jan 30', price: 33120, signal: 'buy' },
  { date: 'Feb 5', price: 32410, signal: 'sell' },
  { date: 'Feb 10', price: 32780, signal: 'buy' },
  { date: 'Feb 15', price: 33500 },
  { date: 'Feb 20', price: 34560, signal: 'sell' },
  { date: 'Feb 25', price: 34890, signal: 'buy' },
  { date: 'Mar 1', price: 35600 },
  { date: 'Mar 5', price: 36720, signal: 'sell' },
  { date: 'Mar 10', price: 36450, signal: 'buy' },
  { date: 'Mar 15', price: 35980, signal: 'sell' },
  { date: 'Mar 20', price: 36200 },
  { date: 'Mar 25', price: 37100 },
  { date: 'Mar 30', price: 38500 },
]

// 月次リターンデータ
export const monthlyReturnsData: MonthlyReturn[] = [
  { month: 'Jan', return: 5.1 },
  { month: 'Feb', return: 3.3 },
  { month: 'Mar', return: 8.2 },
  { month: 'Apr', return: -2.1 },
  { month: 'May', return: 6.7 },
  { month: 'Jun', return: 4.2 },
  { month: 'Jul', return: 1.8 },
  { month: 'Aug', return: -1.5 },
  { month: 'Sep', return: 3.9 },
  { month: 'Oct', return: 5.6 },
  { month: 'Nov', return: 2.3 },
  { month: 'Dec', return: 4.8 },
]

// 株式曲線データ
export const equityCurveData: EquityCurvePoint[] = [
  { date: 'Jan 1', value: 10000 },
  { date: 'Jan 15', value: 10000 },
  { date: 'Jan 25', value: 10510 },
  { date: 'Feb 5', value: 10300 },
  { date: 'Feb 20', value: 10850 },
  { date: 'Mar 5', value: 11400 },
  { date: 'Mar 15', value: 11250 },
  { date: 'Mar 30', value: 12840 },
]

// 戦略コードデータ
export const strategyCodeData: StrategyCode = {
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

/**
* Calculate Exponential Moving Average (EMA)
* @param {Array} prices - Array of price values
* @param {Number} period - EMA period
* @returns {Array} - Array of EMA values
*/
export function calculateEMA(prices, period = 20) {
 if (prices.length < period) {
   throw new Error('Not enough data points to calculate EMA');
 }
 
 const k = 2 / (period + 1);
 const emaValues = [];
 
 // First EMA value is SMA
 const firstSMA = prices.slice(0, period).reduce((total, price) => total + price, 0) / period;
 emaValues.push(firstSMA);
 
 // Calculate remaining EMA values
 for (let i = period; i < prices.length; i++) {
   const ema = prices[i] * k + emaValues[emaValues.length - 1] * (1 - k);
   emaValues.push(ema);
 }
 
 // Pad the beginning with null values to match the input length
 const result = Array(period - 1).fill(null).concat(emaValues);
 return result;
}

/**
* Calculate Bollinger Bands
* @param {Array} prices - Array of price values
* @param {Number} period - Period for SMA calculation
* @param {Number} multiplier - Standard deviation multiplier
* @returns {Object} - Object containing upper band, middle band (SMA), and lower band arrays
*/
export function calculateBollingerBands(prices, period = 20, multiplier = 2) {
 if (prices.length < period) {
   throw new Error('Not enough data points to calculate Bollinger Bands');
 }
 
 const sma = calculateSMA(prices, period);
 const bands = { upper: [], middle: sma, lower: [] };
 
 for (let i = period - 1; i < prices.length; i++) {
   const slice = prices.slice(i - (period - 1), i + 1);
   const sum = slice.reduce((total, price) => total + Math.pow(price - sma[i], 2), 0);
   const std = Math.sqrt(sum / period);
   
   bands.upper[i] = sma[i] + (multiplier * std);
   bands.lower[i] = sma[i] - (multiplier * std);
 }
 
 // Pad the beginning with null values
 for (let i = 0; i < period - 1; i++) {
   bands.upper[i] = null;
   bands.lower[i] = null;
 }
 
 return bands;
}

/**
* Calculate Moving Average Convergence Divergence (MACD)
* @param {Array} prices - Array of price values
* @param {Number} fastPeriod - Fast EMA period
* @param {Number} slowPeriod - Slow EMA period
* @param {Number} signalPeriod - Signal EMA period
* @returns {Object} - Object containing MACD line, signal line, and histogram arrays
*/
export function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
 const fastEMA = calculateEMA(prices, fastPeriod);
 const slowEMA = calculateEMA(prices, slowPeriod);
 
 const macdLine = [];
 for (let i = 0; i < prices.length; i++) {
   if (fastEMA[i] === null || slowEMA[i] === null) {
     macdLine.push(null);
   } else {
     macdLine.push(fastEMA[i] - slowEMA[i]);
   }
 }
 
 // Calculate signal line (EMA of MACD line)
 const validMacdValues = macdLine.filter(val => val !== null);
 const signalLine = Array(prices.length - validMacdValues.length).fill(null);
 
 if (validMacdValues.length >= signalPeriod) {
   const k = 2 / (signalPeriod + 1);
   let ema = validMacdValues.slice(0, signalPeriod).reduce((sum, val) => sum + val, 0) / signalPeriod;
   signalLine.push(ema);
   
   for (let i = signalPeriod; i < validMacdValues.length; i++) {
     ema = validMacdValues[i] * k + ema * (1 - k);
     signalLine.push(ema);
   }
 }
 
 // Calculate histogram (MACD line - signal line)
 const histogram = [];
 for (let i = 0; i < prices.length; i++) {
   if (macdLine[i] === null || i >= prices.length - signalLine.length + (prices.length - validMacdValues.length)) {
     histogram.push(null);
   } else {
     const signalIndex = i - (prices.length - signalLine.length);
     histogram.push(macdLine[i] - signalLine[signalIndex]);
   }
 }
 
 return {
   macd: macdLine,
   signal: Array(prices.length - signalLine.length).fill(null).concat(signalLine),
   histogram
 };
}
`,
}

// 戦略設定データ
export const strategySettingsData: StrategySettings = {
  riskPerTrade: 2.0,
  maxOpenPositions: 3,
  takeProfit: 5.0,
  stopLoss: 2.5,
  trailingStop: true,
  leverage: 1,
}
