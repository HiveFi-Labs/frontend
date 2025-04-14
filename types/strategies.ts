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
