import type { Alert, NotificationPreferences } from '@/types/alerts'

// アラート設定データ
export const alertsData: Alert[] = [
  {
    id: 1,
    type: 'performance',
    name: 'Significant Profit',
    condition: 'Portfolio up by 5% or more in a day',
    status: 'active',
    lastTriggered: '2023-07-10T14:30:00Z',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  {
    id: 2,
    type: 'risk',
    name: 'Drawdown Alert',
    condition: 'Portfolio down by 10% or more from peak',
    status: 'active',
    lastTriggered: null,
    notifications: {
      email: true,
      push: true,
      sms: true,
    },
  },
  {
    id: 3,
    type: 'strategy',
    name: 'Strategy Underperformance',
    condition: 'Trend Following RSI underperforms by 5% vs benchmark',
    status: 'active',
    lastTriggered: '2023-06-15T09:45:00Z',
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
  },
  {
    id: 4,
    type: 'market',
    name: 'Market Volatility',
    condition: 'BTC volatility exceeds 5% in 24 hours',
    status: 'inactive',
    lastTriggered: '2023-05-22T11:20:00Z',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
]

// 通知設定データ
export const notificationPreferencesData: NotificationPreferences = {
  email: {
    enabled: true,
    address: 'user@example.com',
    dailyDigest: true,
  },
  push: {
    enabled: true,
    device: 'all',
    quietHours: false,
  },
  sms: {
    enabled: false,
    phoneNumber: '',
    criticalOnly: true,
  },
}
