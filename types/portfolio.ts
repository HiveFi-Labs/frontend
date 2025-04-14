// 基本的な型定義

// パフォーマンス指標
export interface PerformanceMetric {
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  changePercent?: number
}

// 時系列データ
export interface TimeSeriesData {
  date: string
  value: number
}

// ポートフォリオ関連の型定義

// ポートフォリオ配分
export interface PortfolioAllocation {
  name: string
  value: number
  percent: number
  performance: number
}

// ポートフォリオ概要
export interface PortfolioSummary {
  totalValue: number
  change: {
    value: number
    percent: number
    trend: 'up' | 'down'
  }
  allocation: PortfolioAllocation[]
  historicalPerformance: TimeSeriesData[]
}

// 戦略関連の型定義

// 戦略パフォーマンス
export interface StrategyPerformance {
  trend: 'up' | 'down'
  return: string
  sharpe: string
  winRate: string
  maxDrawdown: string
  chartPath: string
}

// 戦略の作成者情報
export interface StrategyCreator {
  name: string
  verified: boolean
  rating: string
}

// 戦略の人気度情報
export interface StrategyPopularity {
  users: number
  rating: string
}

// 戦略
export interface Strategy {
  id: number
  name: string
  type: 'trend' | 'mean' | 'breakout'
  pair: string
  timeframe: string
  status: 'live' | 'testing' | 'draft'
  isPublic: boolean
  indicators: string[]
  performance: StrategyPerformance
  allocation?: number
  allocationPercent?: number
  creator?: StrategyCreator
  popularity?: StrategyPopularity
}

// リスク管理関連の型定義

// 戦略リスク指標
export interface RiskStrategyMetrics {
  name: string
  risk: number
  correlation: number[]
}

// リスク寄与度
export interface RiskContribution {
  name: string
  value: number
}

// リスク要因
export interface RiskFactor {
  name: string
  value: number
}

// リスク指標
export interface RiskMetrics {
  overall: number // 0-100 scale
  volatility: number
  drawdown: number
  sharpeRatio: number
  sortinoRatio: number
  var95: number // Value at Risk (95%)
  var99: number // Value at Risk (99%)
  strategies: RiskStrategyMetrics[]
  riskContribution: RiskContribution[]
  riskFactors: RiskFactor[]
}

// ファンド管理関連の型定義

// 取引
export interface Transaction {
  id: number
  type: 'deposit' | 'withdraw' | 'transfer'
  amount: number
  date: string
  status: 'completed' | 'pending'
  description: string
  strategy?: string
}

// リバランス変更
export interface RebalanceChange {
  strategy: string
  before: number
  after: number
}

// リバランス
export interface Rebalance {
  id: number
  date: string
  type: 'manual' | 'automatic'
  changes: RebalanceChange[]
}

// 自動リバランス設定
export interface AutoRebalanceSettings {
  enabled: boolean
  frequency: string
  nextRebalance: string
  threshold: number
}

// 最近のアクティビティ
export interface RecentActivity {
  type: 'deposit' | 'withdraw' | 'transfer'
  amount: number
  date: string
  status: 'completed' | 'pending'
  description: string
  strategy?: string
}

// 利益処理設定
export interface ProfitHandlingSettings {
  autoReinvest: boolean
  profitTaking: 'none' | 'threshold' | 'periodic'
  withdrawalMethod: 'manual' | 'scheduled' | 'threshold'
}

// ファンド概要
export interface FundSummary {
  totalBalance: number
  availableBalance: number
  allocatedBalance: number
  recentActivity: RecentActivity[]
  autoRebalanceSettings: AutoRebalanceSettings
  profitHandlingSettings?: ProfitHandlingSettings
}

// アラート関連の型定義

// 通知設定
export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
}

// アラート
export interface Alert {
  id: number
  type: 'performance' | 'risk' | 'strategy' | 'market'
  name: string
  condition: string
  status: 'active' | 'inactive'
  lastTriggered: string | null
  notifications: NotificationSettings
}

// メール通知設定
export interface EmailNotificationSettings {
  enabled: boolean
  address: string
  dailyDigest: boolean
}

// プッシュ通知設定
export interface PushNotificationSettings {
  enabled: boolean
  device: 'all' | 'mobile' | 'desktop'
  quietHours: boolean
}

// SMS通知設定
export interface SmsNotificationSettings {
  enabled: boolean
  phoneNumber: string
  criticalOnly: boolean
}

// 通知設定
export interface NotificationPreferences {
  email: EmailNotificationSettings
  push: PushNotificationSettings
  sms: SmsNotificationSettings
}

// モーダル関連の型定義
export interface ModalProps {
  onClose: () => void
}
