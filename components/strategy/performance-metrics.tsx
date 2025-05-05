'use client'

// useEffect, useState, portfolioData は不要になる
// import { useEffect, useState } from "react"
// import portfolioData from "@/services/index"
import { useStrategyStore } from '@/stores/strategyStore' // ストアをインポート
// PerformanceMetric 型は不要になる (ストアの型を使用)
// import type { PerformanceMetric } from "@/types/strategy-development"

// 表示したいメトリクスの定義
interface MetricConfig {
  key: string          // APIからのキー
  label: string        // 表示ラベル
  valueFormatter?: (value: any) => string | number // 値のフォーマッター
  colorCondition?: (value: any) => string // 色の条件
}

// 表示するメトリクスの設定
const METRICS_CONFIG: MetricConfig[] = [
  {
    key: 'Total Return [%]',
    label: 'Total Return',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: (value) => value > 0 ? 'text-green-400' : 'text-red-400'
  },
  {
    key: 'Sharpe Ratio',
    label: 'Sharpe Ratio',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: (value) => value > 1 ? 'text-green-400' : 'text-zinc-300'
  },
  {
    key: 'Sortino Ratio',
    label: 'Sortino Ratio',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: (value) => value > 1 ? 'text-green-400' : 'text-zinc-300'
  },
  {
    key: 'Max Drawdown [%]',
    label: 'Max Drawdown',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: () => 'text-zinc-300' // 常に同じ色
  },
  {
    key: 'Win Rate [%]',
    label: 'Win Rate',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: (value) => value > 50 ? 'text-green-400' : 'text-zinc-300'
  },
  {
    key: 'Profit Factor',
    label: 'Profit Factor',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: (value) => value > 1 ? 'text-green-400' : 'text-zinc-300'
  },
  {
    key: 'Avg Winning Trade [%]',
    label: 'Avg Win',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: () => 'text-zinc-300'
  },
  {
    key: 'Avg Losing Trade [%]',
    label: 'Avg Loss',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: () => 'text-zinc-300'
  },
  {
    key: 'Position Coverage [%]',
    label: 'Position Coverage',
    valueFormatter: (value) => value ? parseFloat(value.toFixed(2)) : '0.00',
    colorCondition: () => 'text-zinc-300'
  }
];

export default function PerformanceMetrics() {
  // ストアから結果を取得
  const backtestResults = useStrategyStore((state) => state.backtestResults)

  // バックテスト結果から必要なメトリクスを抽出
  const getMetricValue = (key: string) => {
    if (!backtestResults) return null;
    return backtestResults[key] ?? null;
  };

  // 結果がない場合の表示
  if (!backtestResults) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Placeholder for empty state */}
        {METRICS_CONFIG.slice(0, 8).map((metric, i) => (
          <div
            key={`placeholder-${i}`}
            className="glass-card p-4 rounded-lg flex flex-col"
          >
            <div className="text-sm text-zinc-400 mb-1">{metric.label}</div>
            <div className="text-xl font-semibold text-zinc-500">--</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {METRICS_CONFIG.map((metric) => {
        const value = getMetricValue(metric.key);
        const displayValue = value !== null ? 
          (metric.valueFormatter ? metric.valueFormatter(value) : String(value)) : 
          '--';
        
        const valueColor = value !== null && metric.colorCondition ? 
          metric.colorCondition(value) : 
          'text-zinc-300';

        return (
          <div key={metric.key} className="glass-card p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">
              {metric.label}
            </div>
            <div className={`text-xl font-semibold ${valueColor}`}>
              {displayValue}
            </div>
          </div>
        );
      })}
    </div>
  )
}
