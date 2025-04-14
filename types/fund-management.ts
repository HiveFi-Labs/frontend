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
