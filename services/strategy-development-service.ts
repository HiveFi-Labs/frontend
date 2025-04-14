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

import {
  chatConversationsData,
  performanceMetricsData,
  tradeHistoryData,
  optimizationResultsData,
  chartDataPoints,
  monthlyReturnsData,
  equityCurveData,
  strategyCodeData,
  strategySettingsData,
} from '@/data/strategy-development-data'

class StrategyDevelopmentService {
  private cache: Record<string, any> = {}

  /**
   * AIチャットの会話履歴を取得
   */
  async getChatConversations(): Promise<ChatMessage[]> {
    if (this.cache.chatConversations) {
      return this.cache.chatConversations
    }

    const data = chatConversationsData
    this.cache.chatConversations = data
    return data
  }

  /**
   * パフォーマンス指標を取得
   */
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    if (this.cache.performanceMetrics) {
      return this.cache.performanceMetrics
    }

    const data = performanceMetricsData
    this.cache.performanceMetrics = data
    return data
  }

  /**
   * 取引履歴を取得
   */
  async getTradeHistory(): Promise<TradeHistoryItem[]> {
    if (this.cache.tradeHistory) {
      return this.cache.tradeHistory
    }

    const data = tradeHistoryData
    this.cache.tradeHistory = data
    return data
  }

  /**
   * パラメータ最適化結果を取得
   */
  async getOptimizationResults(): Promise<OptimizationResult[]> {
    if (this.cache.optimizationResults) {
      return this.cache.optimizationResults
    }

    const data = optimizationResultsData
    this.cache.optimizationResults = data
    return data
  }

  /**
   * チャートデータを取得
   */
  async getChartData(): Promise<ChartDataPoint[]> {
    if (this.cache.chartData) {
      return this.cache.chartData
    }

    const data = chartDataPoints
    this.cache.chartData = data
    return data
  }

  /**
   * 月次リターンデータを取得
   */
  async getMonthlyReturns(): Promise<MonthlyReturn[]> {
    if (this.cache.monthlyReturns) {
      return this.cache.monthlyReturns
    }

    const data = monthlyReturnsData
    this.cache.monthlyReturns = data
    return data
  }

  /**
   * 株式曲線データを取得
   */
  async getEquityCurveData(): Promise<EquityCurvePoint[]> {
    if (this.cache.equityCurveData) {
      return this.cache.equityCurveData
    }

    const data = equityCurveData
    this.cache.equityCurveData = data
    return data
  }

  /**
   * 戦略コードを取得
   */
  async getStrategyCode(): Promise<StrategyCode> {
    if (this.cache.strategyCode) {
      return this.cache.strategyCode
    }

    const data = strategyCodeData
    this.cache.strategyCode = data
    return data
  }

  /**
   * 戦略設定を取得
   */
  async getStrategySettings(): Promise<StrategySettings> {
    if (this.cache.strategySettings) {
      return this.cache.strategySettings
    }

    const data = strategySettingsData
    this.cache.strategySettings = data
    return data
  }

  /**
   * キャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const strategyDevelopmentService = new StrategyDevelopmentService()
export default strategyDevelopmentService
