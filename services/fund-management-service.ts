import type {
  Transaction,
  Rebalance,
  FundSummary,
  ProfitHandlingSettings,
} from '@/types/fund-management'
import {
  transactionsData,
  rebalanceHistoryData,
  fundSummaryData,
  profitHandlingSettingsData,
} from '@/data/fund-management-data'

class FundManagementService {
  private cache: Record<string, any> = {}

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
   * キャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const fundManagementService = new FundManagementService()
export default fundManagementService
