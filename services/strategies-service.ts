import type { Strategy } from "@/types/strategies"
import { userStrategiesData, marketplaceStrategiesData } from "@/data/strategies-data"

class StrategiesService {
  private cache: Record<string, any> = {}

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
   * キャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const strategiesService = new StrategiesService()
export default strategiesService
