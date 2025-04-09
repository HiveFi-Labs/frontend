import type { TimeSeriesData } from "./common"

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
    trend: "up" | "down"
  }
  allocation: PortfolioAllocation[]
  historicalPerformance: TimeSeriesData[]
}
