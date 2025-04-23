/**
 * 戦略開発ページの型定義
 */

// AIチャットメッセージ
export interface ChatMessage {
  agent: "strategist" | "developer" | "analyst" | "optimizer" | "user"
  message: string
  timestamp: string
  attachment?: {
    type: "chart" | "code"
    data: any
  }
}

// 取引履歴
export interface TradeHistoryItem {
  id: number
  type: "LONG" | "SHORT"
  entry: string
  exit: string
  pnl: string
  duration: string
  date: string
}

// パラメータ最適化結果
export interface OptimizationResult {
  rsiPeriod: number
  fastMA: number
  slowMA: number
  stopLoss: number
  return: string
  sharpe: string
}

// チャートデータポイント
export interface ChartDataPoint {
  date: string
  price: number
  signal?: "buy" | "sell"
}

// 月次リターンデータ
export interface MonthlyReturn {
  month: string
  return: number
}

// 株式曲線データ
export interface EquityCurvePoint {
  date: string
  value: number
}

// 戦略コード
export interface StrategyCode {
  main: string
  indicators: string
}

// 戦略設定
export interface StrategySettings {
  riskPerTrade: number
  maxOpenPositions: number
  takeProfit: number
  stopLoss: number
  trailingStop: boolean
  leverage: number
}
