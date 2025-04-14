'use client'

import { useEffect, useState } from 'react'
import portfolioData from '@/services/index'
import type { MonthlyReturn } from '@/types/strategy-development'

export default function MonthlyReturnsChart() {
  const [monthlyReturnsData, setMonthlyReturnsData] = useState<MonthlyReturn[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getMonthlyReturns()
        setMonthlyReturnsData(data)
      } catch (err) {
        console.error('Failed to fetch monthly returns data', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-[200px]"></div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-zinc-300 mb-3">
        Monthly Returns (%)
      </h3>
      <div className="h-[200px] relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Zero line */}
          <line
            x1="10"
            y1="50"
            x2="90"
            y2="50"
            stroke="#6b7280"
            strokeWidth="0.2"
            strokeDasharray="0.5"
          />

          {/* Grid lines */}
          <line
            x1="10"
            y1="30"
            x2="90"
            y2="30"
            stroke="#374151"
            strokeWidth="0.1"
            strokeDasharray="0.5"
          />
          <line
            x1="10"
            y1="70"
            x2="90"
            y2="70"
            stroke="#374151"
            strokeWidth="0.1"
            strokeDasharray="0.5"
          />

          {monthlyReturnsData.map((month, i) => {
            const barWidth = 6
            const gap = 2
            const totalWidth = barWidth + gap
            const x = 10 + i * totalWidth
            const height = Math.abs(month.return) * 4
            const y = month.return >= 0 ? 50 - height : 50

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={height}
                rx={1}
                fill={month.return >= 0 ? '#10b981' : '#ef4444'}
                opacity={0.7}
              />
            )
          })}
        </svg>

        {/* Y-axis ticks */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between py-2">
          <div
            className="text-xs text-zinc-500"
            style={{
              position: 'absolute',
              left: '8px',
              top: '30%',
              transform: 'translateY(-50%)',
            }}
          >
            +5%
          </div>
          <div
            className="text-xs text-zinc-500"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            0%
          </div>
          <div
            className="text-xs text-zinc-500"
            style={{
              position: 'absolute',
              left: '8px',
              top: '70%',
              transform: 'translateY(-50%)',
            }}
          >
            -5%
          </div>
        </div>

        {/* X-axis ticks */}
        <div className="absolute bottom-0 left-0 w-full grid grid-cols-12 px-2">
          {monthlyReturnsData.map((month, i) => (
            <div key={i} className="text-center text-xs text-zinc-500">
              {month.month}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
