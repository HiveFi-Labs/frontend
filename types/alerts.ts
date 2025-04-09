// 通知設定
export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
}

// アラート
export interface Alert {
  id: number
  type: "performance" | "risk" | "strategy" | "market"
  name: string
  condition: string
  status: "active" | "inactive"
  lastTriggered: string | null
  notifications: NotificationSettings
}

// メール通知設定
export interface EmailNotificationSettings {
  enabled: boolean
  address: string
  dailyDigest: boolean
}

// プッシュ通知設定
export interface PushNotificationSettings {
  enabled: boolean
  device: "all" | "mobile" | "desktop"
  quietHours: boolean
}

// SMS通知設定
export interface SmsNotificationSettings {
  enabled: boolean
  phoneNumber: string
  criticalOnly: boolean
}

// 通知設定
export interface NotificationPreferences {
  email: EmailNotificationSettings
  push: PushNotificationSettings
  sms: SmsNotificationSettings
}
