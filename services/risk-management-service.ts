import type { RiskMetrics } from '@/types/risk-management'
import { riskMetricsData } from '@/data/risk-management-data'

class RiskManagementService {
  private cache: Record<string, any> = {}

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
   * キャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const riskManagementService = new RiskManagementService()
export default riskManagementService
