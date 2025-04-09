// 共通の型定義

// 時系列データ
export interface TimeSeriesData {
  date: string
  value: number
}

// パフォーマンス指標
export interface PerformanceMetric {
  value: string | number
  trend?: "up" | "down" | "neutral"
  changePercent?: number
}

// モーダル関連の型定義
export interface ModalProps {
  onClose: () => void
}
