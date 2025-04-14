import type {
  Transaction,
  Rebalance,
  FundSummary,
  ProfitHandlingSettings,
} from '@/types/fund-management'

// 取引履歴データ
export const transactionsData: Transaction[] = [
  {
    id: 1,
    type: 'deposit',
    amount: 10000,
    date: '2023-07-01T10:30:00Z',
    status: 'completed',
    description: 'Initial deposit',
  },
  {
    id: 2,
    type: 'transfer',
    amount: 5000,
    date: '2023-07-05T14:15:00Z',
    status: 'completed',
    description: 'Transfer to Trend Following RSI',
    strategy: 'Trend Following RSI',
  },
  {
    id: 3,
    type: 'transfer',
    amount: 3000,
    date: '2023-07-05T14:20:00Z',
    status: 'completed',
    description: 'Transfer to MACD Crossover',
    strategy: 'MACD Crossover',
  },
  {
    id: 4,
    type: 'deposit',
    amount: 5000,
    date: '2023-07-10T09:45:00Z',
    status: 'completed',
    description: 'Additional deposit',
  },
  {
    id: 5,
    type: 'transfer',
    amount: 2000,
    date: '2023-07-12T11:30:00Z',
    status: 'completed',
    description: 'Transfer to Volatility Breakout',
    strategy: 'Volatility Breakout',
  },
  {
    id: 6,
    type: 'withdraw',
    amount: 1500,
    date: '2023-07-15T16:20:00Z',
    status: 'completed',
    description: 'Partial withdrawal',
  },
  {
    id: 7,
    type: 'transfer',
    amount: 4000,
    date: '2023-07-20T10:10:00Z',
    status: 'completed',
    description: 'Transfer to Mean Reversion',
    strategy: 'Mean Reversion',
  },
  {
    id: 8,
    type: 'deposit',
    amount: 3000,
    date: '2023-07-25T13:40:00Z',
    status: 'pending',
    description: 'Monthly deposit',
  },
]

// リバランス履歴データ
export const rebalanceHistoryData: Rebalance[] = [
  {
    id: 1,
    date: '2023-07-01T00:00:00Z',
    type: 'manual',
    changes: [
      { strategy: 'Trend Following RSI', before: 30, after: 35 },
      { strategy: 'MACD Crossover', before: 25, after: 30 },
      { strategy: 'Volatility Breakout', before: 25, after: 20 },
      { strategy: 'Mean Reversion', before: 20, after: 15 },
    ],
  },
  {
    id: 2,
    date: '2023-06-15T00:00:00Z',
    type: 'automatic',
    changes: [
      { strategy: 'Trend Following RSI', before: 28, after: 30 },
      { strategy: 'MACD Crossover', before: 27, after: 25 },
      { strategy: 'Volatility Breakout', before: 22, after: 25 },
      { strategy: 'Mean Reversion', before: 23, after: 20 },
    ],
  },
  {
    id: 3,
    date: '2023-06-01T00:00:00Z',
    type: 'manual',
    changes: [
      { strategy: 'Trend Following RSI', before: 25, after: 28 },
      { strategy: 'MACD Crossover', before: 25, after: 27 },
      { strategy: 'Volatility Breakout', before: 25, after: 22 },
      { strategy: 'Mean Reversion', before: 25, after: 23 },
    ],
  },
]

// 利益処理設定
export const profitHandlingSettingsData: ProfitHandlingSettings = {
  autoReinvest: true,
  profitTaking: 'none', // "none" | "threshold" | "periodic"
  withdrawalMethod: 'manual', // "manual" | "scheduled" | "threshold"
}

// ファンド管理データ
export const fundSummaryData: FundSummary = {
  totalBalance: 42568.92,
  availableBalance: 5068.92,
  allocatedBalance: 37500.0,
  recentActivity: [
    {
      type: 'deposit',
      amount: 3000,
      date: '2023-07-25T13:40:00Z',
      status: 'pending',
      description: 'Monthly deposit',
    },
    {
      type: 'transfer',
      amount: 4000,
      date: '2023-07-20T10:10:00Z',
      status: 'completed',
      description: 'Transfer to Mean Reversion',
      strategy: 'Mean Reversion',
    },
  ],
  autoRebalanceSettings: {
    enabled: true,
    frequency: 'Monthly',
    nextRebalance: '2023-08-01T00:00:00Z',
    threshold: 5,
  },
  profitHandlingSettings: profitHandlingSettingsData,
}
