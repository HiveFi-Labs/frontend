"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataFetch } from "@/hooks/use-data-fetch"
import portfolioData from "@/services/index"
import type { ChartDataPoint, TradeHistoryItem, EquityCurvePoint } from "@/types/strategy-development"

export default function UnifiedChartView() {
  const [timeRange, setTimeRange] = useState("3m")

  // Fetch all required data
  const { data: chartData, isLoading: loadingChartData } = useDataFetch<ChartDataPoint[]>(() =>
    portfolioData.getChartData(),
  )

  const { data: equityCurveData, isLoading: loadingEquityCurve } = useDataFetch<EquityCurvePoint[]>(() =>
    portfolioData.getEquityCurveData(),
  )

  const { data: tradeHistory, isLoading: loadingTradeHistory } = useDataFetch<TradeHistoryItem[]>(() =>
    portfolioData.getTradeHistory(),
  )

  const isLoading = loadingChartData || loadingEquityCurve || loadingTradeHistory

  // Combine and normalize data to the same time axis
  const unifiedData = useMemo(() => {
    if (!chartData || !equityCurveData || !tradeHistory) return null

    // Create a unified timeline from all data sources
    const allDates = new Set([
      ...chartData.map((point) => point.date),
      ...equityCurveData.map((point) => point.date),
      ...tradeHistory.map((trade) => trade.date),
    ])

    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime()
    })

    // Create unified data structure
    return sortedDates.map((date) => {
      // Find price data for this date
      const pricePoint = chartData.find((p) => p.date === date)

      // Find equity data for this date
      const equityPoint = equityCurveData.find((p) => p.date === date)

      // Find trades that occurred on this date
      const trades = tradeHistory.filter((t) => t.date === date)

      return {
        date,
        price: pricePoint?.price,
        equity: equityPoint?.value,
        trades: trades.length > 0 ? trades : null,
      }
    })
  }, [chartData, equityCurveData, tradeHistory])

  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-zinc-800/50 rounded-lg"></div>
        </CardContent>
      </Card>
    )
  }

  if (!unifiedData) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">Strategy Performance</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-zinc-400">No chart data available. Run a backtest to generate data.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-zinc-300">Strategy Performance</CardTitle>
            <CardDescription>Price, trades, and equity curve aligned on the same timeline</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <IntegratedChartView data={unifiedData} />
      </CardContent>
    </Card>
  )
}

// 統合されたチャートビュー - 価格、エクイティ、ボリューム、利益/損失を1つのビューに統合
function IntegratedChartView({ data }) {
  // 価格データと株式曲線データを取得
  const prices = data.map((d) => d.price).filter(Boolean)
  const equities = data.map((d) => d.equity).filter(Boolean)

  const minPrice = Math.min(...prices) * 0.98
  const maxPrice = Math.max(...prices) * 1.02
  const priceRange = maxPrice - minPrice

  const minEquity = Math.min(...equities) * 0.98
  const maxEquity = Math.max(...equities) * 1.02
  const equityRange = maxEquity - minEquity

  // チャートの共通設定
  const chartWidth = 1000
  const chartHeight = 600
  const padding = { top: 20, right: 60, bottom: 40, left: 60 }

  // 各セクションの高さ
  const priceChartHeight = 300
  const equityChartHeight = 150
  const volumeChartHeight = 80
  const pnlChartHeight = 70

  // 価格チャートのパス
  const pricePath = generatePath(data, "price", {
    minValue: minPrice,
    maxValue: maxPrice,
    width: chartWidth,
    height: priceChartHeight,
    padding,
  })

  // エクイティカーブのパス
  const equityPath = generatePath(data, "equity", {
    minValue: minEquity,
    maxValue: maxEquity,
    width: chartWidth,
    height: equityChartHeight,
    padding,
  })

  // 移動平均線のパス
  const sma10Path = generateSMAPath(data, "price", 10, {
    minValue: minPrice,
    maxValue: maxPrice,
    width: chartWidth,
    height: priceChartHeight,
    padding,
  })

  const sma20Path = generateSMAPath(data, "price", 20, {
    minValue: minPrice,
    maxValue: maxPrice,
    width: chartWidth,
    height: priceChartHeight,
    padding,
  })

  return (
    <div className="bg-zinc-900/70 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <span className="text-xs text-zinc-400">Price</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-zinc-400">SMA(10)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-zinc-400">SMA(20)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-zinc-400">Equity</span>
          </div>
        </div>
        <div className="text-sm text-zinc-300">
          <span className="text-green-400 mr-2">+28.4%</span>
          <span>Total Return</span>
        </div>
      </div>

      <div className="relative" style={{ height: `${chartHeight}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {/* グラデーション定義 */}
          <defs>
            <linearGradient id="price-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
            <linearGradient id="equity-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
            </linearGradient>
            <linearGradient id="sma10-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="sma20-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* 価格チャートセクション */}
          <g transform={`translate(0, 0)`}>
            {/* グリッドライン */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`grid-price-${i}`}
                x1={padding.left}
                y1={padding.top + priceChartHeight * ratio}
                x2={chartWidth - padding.right}
                y2={padding.top + priceChartHeight * ratio}
                stroke="#374151"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
            ))}

            {/* 価格チャート */}
            <path d={pricePath} fill="none" stroke="#ffffff" strokeWidth="1.5" />

            {/* 移動平均線 */}
            <path d={sma10Path} fill="none" stroke="url(#sma10-gradient)" strokeWidth="1.5" />
            <path d={sma20Path} fill="none" stroke="url(#sma20-gradient)" strokeWidth="1.5" />

            {/* Y軸ラベル - 価格 */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <text
                key={`y-price-${i}`}
                x={padding.left - 10}
                y={padding.top + priceChartHeight * ratio}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-zinc-400"
              >
                ${Math.round(maxPrice - priceRange * ratio).toLocaleString()}
              </text>
            ))}

            {/* セクションタイトル */}
            <text x={padding.left} y={15} className="text-xs font-medium fill-zinc-300">
              Price Chart
            </text>
          </g>

          {/* エクイティカーブセクション */}
          <g transform={`translate(0, ${priceChartHeight})`}>
            {/* グリッドライン */}
            {[0, 0.5, 1].map((ratio, i) => (
              <line
                key={`grid-equity-${i}`}
                x1={padding.left}
                y1={padding.top + equityChartHeight * ratio}
                x2={chartWidth - padding.right}
                y2={padding.top + equityChartHeight * ratio}
                stroke="#374151"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
            ))}

            {/* エクイティカーブ */}
            <path d={equityPath} fill="none" stroke="#9333ea" strokeWidth="1.5" />

            {/* エリア塗りつぶし */}
            <path
              d={`${equityPath} L${chartWidth - padding.right},${padding.top + equityChartHeight} L${padding.left},${padding.top + equityChartHeight} Z`}
              fill="url(#equity-gradient)"
              opacity="0.3"
            />

            {/* Y軸ラベル - エクイティ */}
            {[0, 0.5, 1].map((ratio, i) => (
              <text
                key={`y-equity-${i}`}
                x={padding.left - 10}
                y={padding.top + equityChartHeight * ratio}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-purple-400"
              >
                ${Math.round(maxEquity - equityRange * ratio).toLocaleString()}
              </text>
            ))}

            {/* セクションタイトル */}
            <text x={padding.left} y={15} className="text-xs font-medium fill-zinc-300">
              Equity Curve
            </text>
          </g>

          {/* ボリュームセクション */}
          <g transform={`translate(0, ${priceChartHeight + equityChartHeight})`}>
            {/* グリッドライン */}
            <line
              x1={padding.left}
              y1={padding.top + volumeChartHeight}
              x2={chartWidth - padding.right}
              y2={padding.top + volumeChartHeight}
              stroke="#374151"
              strokeWidth="0.5"
            />

            {/* ボリュームバー */}
            {data.map((point, i) => {
              if (i === 0) return null // 最初のポイントはスキップ

              const x = padding.left + (chartWidth - padding.left - padding.right) * (i / (data.length - 1))
              const barWidth = Math.max(1, (chartWidth - padding.left - padding.right) / data.length - 1)

              // 価格変化に基づいてボリュームの高さと色を決定
              const prevPrice = data[i - 1]?.price
              const currentPrice = point.price

              if (!prevPrice || !currentPrice) return null

              const priceChange = currentPrice - prevPrice
              const isPositive = priceChange >= 0

              // ボリュームの高さ - 価格変化の絶対値に基づく（実際のデータがないため）
              const volumeScale = (Math.abs(priceChange) / priceRange) * 5 // スケーリング係数
              const height =
                Math.min(volumeScale * (volumeChartHeight - padding.top), volumeChartHeight - padding.top) * 0.8

              return (
                <rect
                  key={`volume-${i}`}
                  x={x}
                  y={padding.top + volumeChartHeight - height}
                  width={barWidth}
                  height={height}
                  fill={isPositive ? "#22c55e80" : "#ef444480"}
                />
              )
            })}

            {/* Y軸ラベル - ボリューム */}
            <text
              x={padding.left - 10}
              y={padding.top + volumeChartHeight * 0.5}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-zinc-400"
            >
              Volume
            </text>

            {/* セクションタイトル */}
            <text x={padding.left} y={15} className="text-xs font-medium fill-zinc-300">
              Volume
            </text>
          </g>

          {/* 利益/損失セクション */}
          <g transform={`translate(0, ${priceChartHeight + equityChartHeight + volumeChartHeight})`}>
            {/* グリッドライン */}
            {[-20, 0, 20].map((value, i) => {
              const y = padding.top + pnlChartHeight * 0.5 - (value / 40) * pnlChartHeight
              return (
                <line
                  key={`grid-pnl-${i}`}
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#374151"
                  strokeWidth={value === 0 ? "1" : "0.5"}
                  strokeDasharray={value === 0 ? "" : "5,5"}
                />
              )
            })}

            {/* Y軸ラベル - 利益/損失 */}
            {[-20, 0, 20].map((value, i) => {
              const y = padding.top + pnlChartHeight * 0.5 - (value / 40) * pnlChartHeight
              return (
                <text
                  key={`y-pnl-${i}`}
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-zinc-400"
                >
                  {value}%
                </text>
              )
            })}

            {/* セクションタイトル */}
            <text x={padding.left} y={15} className="text-xs font-medium fill-zinc-300">
              Trade P&L
            </text>
          </g>

          {/* X軸ラベル - 日付のみ表示 */}
          <g transform={`translate(0, ${chartHeight - 20})`}>
            {data
              .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
              .map((point, i) => {
                const index = data.findIndex((d) => d.date === point.date)
                const x = padding.left + (chartWidth - padding.left - padding.right) * (index / (data.length - 1))
                return (
                  <text key={`x-label-${i}`} x={x} y={10} textAnchor="middle" className="text-xs fill-zinc-500">
                    {point.date}
                  </text>
                )
              })}
          </g>
        </svg>
      </div>

      {/* 現在のポジション情報 */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-zinc-400 mb-1">Current Position</div>
          <div className="text-lg font-semibold text-green-400">Long</div>
        </div>
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-zinc-400 mb-1">Entry Price</div>
          <div className="text-lg font-semibold text-white">$36,450</div>
        </div>
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-zinc-400 mb-1">Current P&L</div>
          <div className="text-lg font-semibold text-red-400">-1.3%</div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate the chart path
function generatePath(data, key, options) {
  const { minValue, maxValue, width, height, padding } = options
  const valueRange = maxValue - minValue

  const points = data
    .map((point, index) => {
      if (point[key] === null || point[key] === undefined) return null // Skip null or undefined values

      const x = padding.left + (width - padding.left - padding.right) * (index / (data.length - 1))
      const y = padding.top + ((maxValue - point[key]) / valueRange) * height
      return `${x},${y}`
    })
    .filter(Boolean) // Filter out null values

  return points.length > 0 ? `M${points.join(" L")}` : ""
}

// SMA（単純移動平均線）を計算するヘルパー関数
function generateSMAPath(data, key, period, options) {
  const { minValue, maxValue, width, height, padding } = options
  const valueRange = maxValue - minValue

  // 有効なデータポイントをフィルタリング
  const validData = data
    .map((point, index) => ({
      index,
      value: point[key],
      date: point.date,
    }))
    .filter((point) => point.value !== undefined && point.value !== null)

  if (validData.length < period) return ""

  // SMAを計算
  const smaPoints = []
  for (let i = period - 1; i < validData.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += validData[i - j].value
    }
    const sma = sum / period
    smaPoints.push({
      index: validData[i].index,
      value: sma,
    })
  }

  // パスを生成
  const points = smaPoints.map((point) => {
    const x = padding.left + (width - padding.left - padding.right) * (point.index / (data.length - 1))
    const y = padding.top + ((maxValue - point.value) / valueRange) * height
    return `${x},${y}`
  })

  return points.length > 0 ? `M${points.join(" L")}` : ""
}
