import type { Alert, NotificationPreferences } from "@/types/alerts"
import { alertsData, notificationPreferencesData } from "@/data/alerts-data"

class AlertsService {
  private cache: Record<string, any> = {}

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
   * キャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const alertsService = new AlertsService()
export default alertsService
