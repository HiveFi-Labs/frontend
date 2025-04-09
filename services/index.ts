// 各サービスをまとめてエクスポート
import portfolioOverviewService from "./portfolio-overview-service"
import strategiesService from "./strategies-service"
import riskManagementService from "./risk-management-service"
import fundManagementService from "./fund-management-service"
import alertsService from "./alerts-service"
import strategyDevelopmentService from "./strategy-development-service"
import homeService from "./home-service"

// 統合サービス
class PortfolioDataService {
  // ポートフォリオ概要サービス
  getPortfolioSummary = () => portfolioOverviewService.getPortfolioSummary()

  // 戦略サービス
  getUserStrategies = () => strategiesService.getUserStrategies()
  getMarketplaceStrategies = () => strategiesService.getMarketplaceStrategies()

  // リスク管理サービス
  getRiskMetrics = () => riskManagementService.getRiskMetrics()

  // ファンド管理サービス
  getTransactions = () => fundManagementService.getTransactions()
  getRebalanceHistory = () => fundManagementService.getRebalanceHistory()
  getFundSummary = () => fundManagementService.getFundSummary()
  getProfitHandlingSettings = () => fundManagementService.getProfitHandlingSettings()

  // アラート設定サービス
  getAlerts = () => alertsService.getAlerts()
  getNotificationPreferences = () => alertsService.getNotificationPreferences()

  // 戦略開発サービス
  getChatConversations = () => strategyDevelopmentService.getChatConversations()
  getPerformanceMetrics = () => strategyDevelopmentService.getPerformanceMetrics()
  getTradeHistory = () => strategyDevelopmentService.getTradeHistory()
  getOptimizationResults = () => strategyDevelopmentService.getOptimizationResults()
  getChartData = () => strategyDevelopmentService.getChartData()
  getMonthlyReturns = () => strategyDevelopmentService.getMonthlyReturns()
  getEquityCurveData = () => strategyDevelopmentService.getEquityCurveData()
  getStrategyCode = () => strategyDevelopmentService.getStrategyCode()
  getStrategySettings = () => strategyDevelopmentService.getStrategySettings()

  // ホームページサービス
  getFeatures = () => homeService.getFeatures()
  getProblemSolutions = () => homeService.getProblemSolutions()
  getProductFeatures = () => homeService.getProductFeatures()
  getStats = () => homeService.getStats()
  getTestimonials = () => homeService.getTestimonials()
  getHeroData = () => homeService.getHeroData()

  // すべてのキャッシュをクリア
  clearCache() {
    portfolioOverviewService.clearCache()
    strategiesService.clearCache()
    riskManagementService.clearCache()
    fundManagementService.clearCache()
    alertsService.clearCache()
    strategyDevelopmentService.clearCache()
    homeService.clearCache()
  }
}

// シングルトンとしてエクスポート
const portfolioData = new PortfolioDataService()
export default portfolioData
