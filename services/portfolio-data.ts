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
} from '../types/portfolio'

// データのインポート
import {
  portfolioSummaryData,
  userStrategiesData,
  riskMetricsData,
  transactionsData,
  rebalanceHistoryData,
  fundSummaryData,
  alertsData,
  notificationPreferencesData,
  profitHandlingSettingsData,
  marketplaceStrategiesData, // 追加: マーケットプレイス戦略データをインポート
} from '@/data/portfolio-data'

/**
 * ポートフォリオデータサービス
 *
 * ポートフォリオ関連のすべてのデータ取得を一元管理するレイヤー。
 * 実際のアプリケーションでは、バックエンドへのAPI呼び出しを行います。
 */
class PortfolioDataService {
  // パフォーマンス最適化のためのキャッシュ
  private cache: Record<string, any> = {}

  /**
   * ポートフォリオの概要データを取得
   */
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    if (this.cache.portfolioSummary) {
      return this.cache.portfolioSummary
    }

    // 実際のアプリではAPI呼び出しになります
    // 現在はモックデータを使用
    const data = portfolioSummaryData

    this.cache.portfolioSummary = data
    return data
  }

  /**
   * ユーザーの戦略を取得
   */
  async getUserStrategies(): Promise<Strategy[]> {
    if (this.cache.userStrategies) {
      return this.cache.userStrategies
    }

    const data = userStrategiesData

    this.cache.userStrategies = data
    return data
  }

  /**
   * マーケットプレイスの戦略を取得
   */
  async getMarketplaceStrategies(): Promise<Strategy[]> {
    if (this.cache.marketplaceStrategies) {
      return this.cache.marketplaceStrategies
    }

    const data = marketplaceStrategiesData

    this.cache.marketplaceStrategies = data
    return data
  }

  /**
   * リスク指標を取得
   */
  async getRiskMetrics(): Promise<RiskMetrics> {
    if (this.cache.riskMetrics) {
      return this.cache.riskMetrics
    }

    const data = riskMetricsData

    this.cache.riskMetrics = data
    return data
  }

  /**
   * 取引履歴を取得
   */
  async getTransactions(): Promise<Transaction[]> {
    if (this.cache.transactions) {
      return this.cache.transactions
    }

    const data = transactionsData

    this.cache.transactions = data
    return data
  }

  /**
   * リバランス履歴を取得
   */
  async getRebalanceHistory(): Promise<Rebalance[]> {
    if (this.cache.rebalanceHistory) {
      return this.cache.rebalanceHistory
    }

    const data = rebalanceHistoryData

    this.cache.rebalanceHistory = data
    return data
  }

  /**
   * ファンド管理の概要を取得
   */
  async getFundSummary(): Promise<FundSummary> {
    if (this.cache.fundSummary) {
      return this.cache.fundSummary
    }

    const data = fundSummaryData

    this.cache.fundSummary = data
    return data
  }

  /**
   * アラートを取得
   */
  async getAlerts(): Promise<Alert[]> {
    if (this.cache.alerts) {
      return this.cache.alerts
    }

    const data = alertsData

    this.cache.alerts = data
    return data
  }

  /**
   * 通知設定を取得
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    if (this.cache.notificationPreferences) {
      return this.cache.notificationPreferences
    }

    const data = notificationPreferencesData

    this.cache.notificationPreferences = data
    return data
  }

  /**
   * 利益処理設定を取得
   */
  async getProfitHandlingSettings(): Promise<ProfitHandlingSettings> {
    if (this.cache.profitHandlingSettings) {
      return this.cache.profitHandlingSettings
    }

    const data = profitHandlingSettingsData

    this.cache.profitHandlingSettings = data
    return data
  }

  /**
   * テスト用またはデータの更新が必要な場合にキャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const portfolioData = new PortfolioDataService()
export default portfolioData
