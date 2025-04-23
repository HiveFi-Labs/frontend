// 各サービスをまとめてエクスポート
import portfolioService from "./portfolio-service"
import strategyService from "./strategy-service"
import homeService from "./home-service"
import apiClient from "./api-client"

/**
 * サービスのエクスポート
 *
 * すべてのサービスを一箇所からエクスポートする
 */

// 統合サービス
class PortfolioDataService {
  // ポートフォリオ関連
  getPortfolioSummary = () => portfolioService.getPortfolioSummary()
  getUserStrategies = () => portfolioService.getUserStrategies()
  getMarketplaceStrategies = () => portfolioService.getMarketplaceStrategies()
  getRiskMetrics = () => portfolioService.getRiskMetrics()
  getTransactions = () => portfolioService.getTransactions()
  getRebalanceHistory = () => portfolioService.getRebalanceHistory()
  getFundSummary = () => portfolioService.getFundSummary()
  getProfitHandlingSettings = () => portfolioService.getProfitHandlingSettings()
  getAlerts = () => portfolioService.getAlerts()
  getNotificationPreferences = () => portfolioService.getNotificationPreferences()

  // 戦略開発関連
  getChatConversations = () => strategyService.getChatConversations()
  getPerformanceMetrics = () => strategyService.getPerformanceMetrics()
  getTradeHistory = () => strategyService.getTradeHistory()
  getOptimizationResults = () => strategyService.getOptimizationResults()
  getChartData = () => strategyService.getChartData()
  getMonthlyReturns = () => strategyService.getMonthlyReturns()
  getEquityCurveData = () => strategyService.getEquityCurveData()
  getStrategyCode = () => strategyService.getStrategyCode()
  getStrategySettings = () => strategyService.getStrategySettings()

  // ホームページ関連
  getFeatures = () => homeService.getFeatures()
  getProblemSolutions = () => homeService.getProblemSolutions()
  getProductFeatures = () => homeService.getProductFeatures()
  getStats = () => homeService.getStats()
  getTestimonials = () => homeService.getTestimonials()
  getHeroData = () => homeService.getHeroData()

  // キャッシュをクリア
  clearCache() {
    apiClient.clearCache()
  }
}

// シングルトンとしてエクスポート
const portfolioData = new PortfolioDataService()
export default portfolioData

export { portfolioService, strategyService, homeService, apiClient }
