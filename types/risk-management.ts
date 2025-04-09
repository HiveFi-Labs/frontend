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
