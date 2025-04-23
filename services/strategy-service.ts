import apiClient from "./api-client"
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
} from "@/types/strategy-development"

/**
 * 戦略開発サービス
 *
 * 戦略開発関連のデータ取得を担当するサービス
 */
class StrategyService {
  /**
   * AIチャットの会話履歴を取得
   */
  async getChatConversations(): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>("/strategy-development/chat")
  }

  /**
   * パフォーマンス指標を取得
   */
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    return apiClient.get<PerformanceMetric[]>("/strategy-development/performance-metrics")
  }

  /**
   * 取引履歴を取得
   */
  async getTradeHistory(): Promise<TradeHistoryItem[]> {
    return apiClient.get<TradeHistoryItem[]>("/strategy-development/trade-history")
  }

  /**
   * パラメータ最適化結果を取得
   */
  async getOptimizationResults(): Promise<OptimizationResult[]> {
    return apiClient.get<OptimizationResult[]>("/strategy-development/optimization-results")
  }

  /**
   * チャートデータを取得
   */
  async getChartData(): Promise<ChartDataPoint[]> {
    return apiClient.get<ChartDataPoint[]>("/strategy-development/chart-data")
  }

  /**
   * 月次リターンデータを取得
   */
  async getMonthlyReturns(): Promise<MonthlyReturn[]> {
    return apiClient.get<MonthlyReturn[]>("/strategy-development/monthly-returns")
  }

  /**
   * 株式曲線データを取得
   */
  async getEquityCurveData(): Promise<EquityCurvePoint[]> {
    return apiClient.get<EquityCurvePoint[]>("/strategy-development/equity-curve")
  }

  /**
   * 戦略コードを取得
   */
  async getStrategyCode(): Promise<StrategyCode> {
    return apiClient.get<StrategyCode>("/strategy-development/strategy-code")
  }

  /**
   * 戦略設定を取得
   */
  async getStrategySettings(): Promise<StrategySettings> {
    return apiClient.get<StrategySettings>("/strategy-development/strategy-settings")
  }
}

// シングルトンとしてエクスポート
const strategyService = new StrategyService()
export default strategyService
