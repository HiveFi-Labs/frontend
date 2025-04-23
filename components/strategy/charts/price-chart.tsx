"use client"

import { useEffect, useState } from "react"
import portfolioData from "@/services/index"
import type { ChartDataPoint } from "@/types/strategy-development"

export default function PriceChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getChartData()
        setChartData(data)
      } catch (err) {
        console.error("Failed to fetch chart data", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate chart path
  const generateChartPath = () => {
    if (chartData.length === 0) return ""

    const minPrice = Math.min(...chartData.map((d) => d.price)) * 0.98
    const maxPrice = Math.max(...chartData.map((d) => d.price)) * 1.02
    const priceRange = maxPrice - minPrice

    const width = 100 // percentage width
    const height = 100 // percentage height
    const padding = 10 // percentage padding

    const xStep = (width - 2 * padding) / (chartData.length - 1)

    const points = chartData.map((point, i) => {
      const x = padding + i * xStep
      const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding)
      return `${x},${y}`
    })

    return `M${points.join(" L")}`
  }

  // Calculate positions for buy/sell signals
  const calculateSignalPositions = () => {
    if (chartData.length === 0) return []

    const minPrice = Math.min(...chartData.map((d) => d.price)) * 0.98
    const maxPrice = Math.max(...chartData.map((d) => d.price)) * 1.02
    const priceRange = maxPrice - minPrice

    const width = 100 // percentage width
    const height = 100 // percentage height
    const padding = 10 // percentage padding

    const xStep = (width - 2 * padding) / (chartData.length - 1)

    return chartData
      .map((point, i) => {
        if (!point.signal) return null

        const x = padding + i * xStep
        const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding)

        return {
          x,
          y,
          signal: point.signal,
        }
      })
      .filter(Boolean)
  }

  const signalPositions = calculateSignalPositions()

  // Generate price ticks for y-axis
  const generatePriceTicks = () => {
    if (chartData.length === 0) return []

    const minPrice = Math.min(...chartData.map((d) => d.price)) * 0.98
    const maxPrice = Math.max(...chartData.map((d) => d.price)) * 1.02
    const priceRange = maxPrice - minPrice

    const height = 100 // percentage height
    const padding = 10 // percentage padding

    const tickCount = 5
    const ticks = []

    for (let i = 0; i < tickCount; i++) {
      const price = minPrice + (priceRange * i) / (tickCount - 1)
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding)

      ticks.push({
        y,
        price: Math.round(price).toLocaleString(),
      })
    }

    return ticks
  }

  const priceTicks = generatePriceTicks()

  if (isLoading) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-6 animate-pulse">
        <div className="h-[300px]"></div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/70 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">BTC/USDT Price Chart with Signals</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-zinc-400">Buy Signal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-zinc-400">Sell Signal</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
            </linearGradient>
            <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {priceTicks.map((tick, i) => (
            <line
              key={`grid-${i}`}
              x1="10"
              y1={tick.y}
              x2="90"
              y2={tick.y}
              stroke="#374151"
              strokeWidth="0.1"
              strokeDasharray="0.5"
            />
          ))}

          {/* Chart line */}
          <path
            d={generateChartPath()}
            fill="none"
            stroke="url(#purple-gradient)"
            strokeWidth="0.5"
            className="text-purple-500"
          />

          {/* Area fill */}
          <path d={`${generateChartPath()} L90,90 L10,90 Z`} fill="url(#chart-gradient)" opacity="0.3" />

          {/* Buy/Sell signals */}
          {signalPositions.map((signal, index) => (
            <g key={index} transform={`translate(${signal.x}, ${signal.y})`}>
              {signal.signal === "buy" ? (
                <path d="M0 0L1 -2L-1 -2Z" fill="#10b981" stroke="#0f172a" strokeWidth="0.2" />
              ) : (
                <path d="M0 0L1 2L-1 2Z" fill="#ef4444" stroke="#0f172a" strokeWidth="0.2" />
              )}
            </g>
          ))}
        </svg>

        {/* Y-axis ticks */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between py-2">
          {priceTicks.map((tick, i) => (
            <div
              key={`y-tick-${i}`}
              className="text-xs text-zinc-500"
              style={{ position: "absolute", left: "8px", top: `${tick.y}%`, transform: "translateY(-50%)" }}
            >
              ${tick.price}
            </div>
          ))}
        </div>

        {/* X-axis ticks */}
        <div className="absolute bottom-0 left-0 w-full grid grid-cols-7 px-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, i) => (
            <div key={i} className="text-center text-xs text-zinc-500">
              {month}
            </div>
          ))}
        </div>
      </div>

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
