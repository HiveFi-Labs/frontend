import {
  portfolioSummaryData,
  userStrategiesData,
  marketplaceStrategiesData,
  riskMetricsData,
  transactionsData,
  rebalanceHistoryData,
  fundSummaryData,
  alertsData,
  notificationPreferencesData,
  profitHandlingSettingsData,
  chatConversationsData,
  performanceMetricsData,
  tradeHistoryData,
  optimizationResultsData,
  chartDataPoints,
  monthlyReturnsData,
  equityCurveData,
  strategyCodeData,
  strategySettingsData,
  featuresData,
  problemSolutionsData,
  productFeaturesData,
  statsData,
  testimonialsData,
  heroData,
} from "./mock-data"

/**
 * エンドポイントとモックデータのマッピング
 * 実際のアプリケーションでは不要
 */
const mockDataMap: Record<string, any> = {
  // ポートフォリオ
  "/portfolio/summary": portfolioSummaryData,

  // 戦略
  "/strategies/user": userStrategiesData,
  "/strategies/marketplace": marketplaceStrategiesData,

  // リスク管理
  "/risk/metrics": riskMetricsData,

  // ファンド管理
  "/fund/transactions": transactionsData,
  "/fund/rebalance-history": rebalanceHistoryData,
  "/fund/summary": fundSummaryData,
  "/fund/profit-handling-settings": profitHandlingSettingsData,

  // アラート
  "/alerts": alertsData,
  "/alerts/notification-preferences": notificationPreferencesData,

  // 戦略開発
  "/strategy-development/chat": chatConversationsData,
  "/strategy-development/performance-metrics": performanceMetricsData,
  "/strategy-development/trade-history": tradeHistoryData,
  "/strategy-development/optimization-results": optimizationResultsData,
  "/strategy-development/chart-data": chartDataPoints,
  "/strategy-development/monthly-returns": monthlyReturnsData,
  "/strategy-development/equity-curve": equityCurveData,
  "/strategy-development/strategy-code": strategyCodeData,
  "/strategy-development/strategy-settings": strategySettingsData,

  // ホームページ
  "/home/features": featuresData,
  "/home/problem-solutions": problemSolutionsData,
  "/home/product-features": productFeaturesData,
  "/home/stats": statsData,
  "/home/testimonials": testimonialsData,
  "/home/hero": heroData,
}

export default mockDataMap
