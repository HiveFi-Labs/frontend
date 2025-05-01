import type { PortfolioSummary } from '@/types/portfolio-overview'
import { portfolioSummaryData } from '@/data/portfolio-overview-data'

class PortfolioOverviewService {
  // キャッシュをクラスプロパティとして初期化
  private cache: Record<string, any> = {}

  /**
   * ポートフォリオの概要データを取得
   */
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    if (this.cache.portfolioSummary) {
      return this.cache.portfolioSummary
    }

    // 実際のアプリではAPI呼び出しになります
    const data = portfolioSummaryData

    this.cache.portfolioSummary = data
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
const portfolioOverviewService = new PortfolioOverviewService()
export default portfolioOverviewService
