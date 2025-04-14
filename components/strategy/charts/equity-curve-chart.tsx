'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import portfolioData from '@/services/index'
import type { EquityCurvePoint } from '@/types/strategy-development'

export default function EquityCurveChart() {
  const [equityCurveData, setEquityCurveData] = useState<EquityCurvePoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getEquityCurveData()
        setEquityCurveData(data)
      } catch (err) {
        console.error('Failed to fetch equity curve data', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate equity curve path
  const generateEquityCurvePath = () => {
    if (equityCurveData.length === 0) return ''

    const values = equityCurveData.map((item) => item.value)
    const minValue = Math.min(...values) * 0.98
    const maxValue = Math.max(...values) * 1.02
    const range = maxValue - minValue

    const width = 100 // percentage width
    const height = 100 // percentage height
    const padding = 10 // percentage padding

    const xStep = (width - 2 * padding) / (equityCurveData.length - 1)

    const points = equityCurveData.map((point, i) => {
      const x = padding + i * xStep
      const y =
        height -
        padding -
        ((point.value - minValue) / range) * (height - 2 * padding)
      return `${x},${y}`
    })

    return `M${points.join(' L')}`
  }

  // Generate equity ticks for y-axis
  const generateEquityTicks = () => {
    if (equityCurveData.length === 0) return []

    const values = equityCurveData.map((item) => item.value)
    const minValue = Math.min(...values) * 0.98
    const maxValue = Math.max(...values) * 1.02
    const valueRange = maxValue - minValue

    const height = 100 // percentage height
    const padding = 10 // percentage padding

    const tickCount = 4
    const ticks = []

    for (let i = 0; i < tickCount; i++) {
      const value = minValue + (valueRange * i) / (tickCount - 1)
      const y =
        height -
        padding -
        ((value - minValue) / valueRange) * (height - 2 * padding)

      ticks.push({
        y,
        value: `$${Math.round(value).toLocaleString()}`,
      })
    }

    return ticks
  }

  const equityTicks = generateEquityTicks()

  if (isLoading) {
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-[200px]"></div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-zinc-300">Equity Curve</h3>
        <div className="px-3 py-1 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-xs font-medium flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +28.4%
        </div>
      </div>

      <div className="h-[200px] relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="equity-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
            </linearGradient>
            <linearGradient
              id="purple-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {equityTicks.map((tick, i) => (
            <line
              key={`equity-grid-${i}`}
              x1="10"
              y1={tick.y}
              x2="90"
              y2={tick.y}
              stroke="#374151"
              strokeWidth="0.1"
              strokeDasharray="0.5"
            />
          ))}

          {/* Equity curve line */}
          <path
            d={generateEquityCurvePath()}
            fill="none"
            stroke="url(#purple-gradient)"
            strokeWidth="0.5"
          />

          {/* Area fill */}
          <path
            d={`${generateEquityCurvePath()} L90,90 L10,90 Z`}
            fill="url(#equity-gradient)"
            opacity="0.3"
          />
        </svg>

        {/* Y-axis ticks */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between py-2">
          {equityTicks.map((tick, i) => (
            <div
              key={`equity-y-tick-${i}`}
              className="text-xs text-zinc-500"
              style={{
                position: 'absolute',
                left: '8px',
                top: `${tick.y}%`,
                transform: 'translateY(-50%)',
              }}
            >
              {tick.value}
            </div>
          ))}
        </div>

        {/* X-axis ticks */}
        <div className="absolute bottom-0 left-0 w-full grid grid-cols-7 px-2">
          {equityCurveData.map((item, i) => (
            <div key={i} className="text-center text-xs text-zinc-500">
              {item.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
