import apiClient from "./api-client"
import type {
  PortfolioSummary,
  Strategy,
  RiskMetrics,
  Transaction,
  Rebalance,
  FundSummary,
  Alert,
  NotificationPreferences,
  ProfitHandlingSettings,
} from "@/types/portfolio"

/**
 * ポートフォリオサービス
 *
 * ポートフォリオ関連のデータ取得を担当するサービス
 */
class PortfolioService {
  /**
   * ポートフォリオの概要データを取得
   */
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    return apiClient.get<PortfolioSummary>("/portfolio/summary")
  }

  /**
   * ユーザーの戦略を取得
   */
  async getUserStrategies(): Promise<Strategy[]> {
    return apiClient.get<Strategy[]>("/strategies/user")
  }

  /**
   * マーケットプレイスの戦略を取得
   */
  async getMarketplaceStrategies(): Promise<Strategy[]> {
    return apiClient.get<Strategy[]>("/strategies/marketplace")
  }

  /**
   * リスク指標を取得
   */
  async getRiskMetrics(): Promise<RiskMetrics> {
    return apiClient.get<RiskMetrics>("/risk/metrics")
  }

  /**
   * 取引履歴を取得
   */
  async getTransactions(): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>("/fund/transactions")
  }

  /**
   * リバランス履歴を取得
   */
  async getRebalanceHistory(): Promise<Rebalance[]> {
    return apiClient.get<Rebalance[]>("/fund/rebalance-history")
  }

  /**
   * ファンド管理の概要を取得
   */
  async getFundSummary(): Promise<FundSummary> {
    return apiClient.get<FundSummary>("/fund/summary")
  }

  /**
   * アラートを取得
   */
  async getAlerts(): Promise<Alert[]> {
    return apiClient.get<Alert[]>("/alerts")
  }

  /**
   * 通知設定を取得
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return apiClient.get<NotificationPreferences>("/alerts/notification-preferences")
  }

  /**
   * 利益処理設定を取得
   */
  async getProfitHandlingSettings(): Promise<ProfitHandlingSettings> {
    return apiClient.get<ProfitHandlingSettings>("/fund/profit-handling-settings")
  }
}

// シングルトンとしてエクスポート
const portfolioService = new PortfolioService()
export default portfolioService
