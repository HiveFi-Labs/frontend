'use client'

// useEffect, useState, portfolioData は不要になる
// import { useEffect, useState } from "react"
// import portfolioData from "@/services/index"
import { useStrategyStore } from '@/stores/strategyStore' // ストアをインポート
// PerformanceMetric 型は不要になる (ストアの型を使用)
// import type { PerformanceMetric } from "@/types/strategy-development"

export default function PerformanceMetricsV0() {
  // ストアから結果を取得
  const backtestResults = useStrategyStore((state) => state.backtestResults)

  // メトリクスデータを抽出 (APIレスポンスの構造に合わせてキーを調整)
  // APIドキュメントでは result_metrics.extracted_metrics でしたが、
  // ストアでは backtestResults に保存しています。構造がネストしているか確認が必要です。
  // 仮に backtestResults が直接メトリクスのオブジェクトだと想定します。
  // 例: { "Total Return": "10.5%", "Sharpe Ratio": 1.2, ... }
  // もし { extracted_metrics: { ... } } のような構造なら、
  // const metrics = backtestResults?.extracted_metrics; のようにアクセスします。

  // より安全な抽出方法: extracted_metrics が存在するかチェック
  let metrics: Record<string, any> | null = null
  if (
    backtestResults &&
    typeof backtestResults === 'object' &&
    'extracted_metrics' in backtestResults &&
    backtestResults.extracted_metrics
  ) {
    metrics = backtestResults.extracted_metrics as Record<string, any>
  } else if (backtestResults && typeof backtestResults === 'object') {
    // もし extracted_metrics がなければ、backtestResults 自体を metrics とみなす（フォールバック）
    // ただし、raw_output など他のキーも含まれる可能性があるので注意
    metrics = backtestResults as Record<string, any>
  }

  // 結果がない場合の表示
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Placeholder for empty state - use more stable keys */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            className="glass-card p-4 rounded-lg flex items-center justify-center h-24"
          >
            <span className="text-zinc-500 text-sm">--</span>
          </div>
        ))}
      </div>
    )
  }

  // メトリクスを表示
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(metrics)
        // Optional: Filter out non-displayable metrics if needed
        // Filter out keys like 'raw_output' or 'parsing_error' if metrics = backtestResults
        .filter(([key]) => !['raw_output', 'parsing_error'].includes(key))
        .map(([key, value]) => {
          // Determine color based on value (simple example)
          let valueColor = 'text-zinc-300'
          const lowerCaseKey = key.toLowerCase()

          if (typeof value === 'string') {
            if (
              value.startsWith('+') ||
              (lowerCaseKey.includes('ratio') &&
                Number.parseFloat(value) > 1) ||
              (lowerCaseKey.includes('win rate') &&
                Number.parseFloat(value) > 50)
            ) {
              valueColor = 'text-green-400'
            } else if (
              value.startsWith('-') ||
              lowerCaseKey.includes('drawdown')
            ) {
              valueColor = 'text-red-400'
            }
          } else if (typeof value === 'number') {
            if (
              value > 0 &&
              (lowerCaseKey.includes('return') ||
                lowerCaseKey.includes('profit') ||
                lowerCaseKey.includes('ratio') ||
                lowerCaseKey.includes('factor'))
            ) {
              valueColor = 'text-green-400'
            } else if (value < 0) {
              valueColor = 'text-red-400'
            }
          }

          return (
            // Use metric key for React key
            <div key={key} className="glass-card p-4 rounded-lg">
              <div className="text-sm text-zinc-400 mb-1 capitalize">
                {/* Convert key to readable format */}
                {key
                  .replace(/([A-Z]+)/g, ' $1')
                  .replace(/_/g, ' ')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim()}
              </div>
              <div className={`text-xl font-semibold ${valueColor}`}>
                {/* Format value (e.g., percentage, decimals) */}
                {typeof value === 'number' ? value.toFixed(2) : String(value)}
              </div>
            </div>
          )
        })}
    </div>
  )
}
