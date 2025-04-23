'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import portfolioData from '@/services/index'
import type { EquityCurvePoint } from '@/types/strategy-development'
import dynamic from 'next/dynamic'

// Import Plotly dynamically to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

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

  // Calculate performance percentage
  const calculatePerformance = () => {
    if (equityCurveData.length < 2) return '0.0%'

    const firstValue = equityCurveData[0].value
    const lastValue = equityCurveData[equityCurveData.length - 1].value
    const percentChange = ((lastValue - firstValue) / firstValue) * 100

    return `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-[200px]" />
      </div>
    )
  }

  const performance = calculatePerformance()
  const isPositive = !performance.startsWith('-')

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-zinc-300">Equity Curve</h3>
        <div
          className={`px-3 py-1 rounded-full ${isPositive ? 'bg-green-900/30 border border-green-800/50 text-green-400' : 'bg-red-900/30 border border-red-800/50 text-red-400'} text-xs font-medium flex items-center gap-1`}
        >
          <TrendingUp className="w-3 h-3" /> {performance}
        </div>
      </div>

      <div className="h-[200px]">
        {/* @ts-ignore */}
        <Plot
          data={[
            {
              x: equityCurveData.map((point) => point.date),
              y: equityCurveData.map((point) => point.value),
              type: 'scatter',
              mode: 'lines',
              line: {
                color: '#9333ea',
                width: 2,
                shape: 'spline',
              },
              fill: 'tozeroy',
              fillcolor: 'rgba(147, 51, 234, 0.1)',
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 0, r: 0, l: 40, b: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
              color: '#9ca3af',
            },
            xaxis: {
              showgrid: false,
              zeroline: false,
              tickfont: {
                size: 10,
              },
            },
            yaxis: {
              showgrid: true,
              gridcolor: '#374151',
              gridwidth: 0.5,
              zeroline: false,
              tickprefix: '$',
              tickformat: ',d',
              tickfont: {
                size: 10,
              },
            },
            height: 200,
            width: undefined,
            hovermode: 'x unified',
            hoverlabel: {
              bgcolor: '#18181b',
              bordercolor: '#3f3f46',
              font: {
                color: '#d4d4d8',
              },
            },
          }}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
