'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import type { EquityCurvePoint } from '@/types/strategy-development'
import dynamic from 'next/dynamic'
import type {
  Layout as PlotlyLayout,
  Config as PlotlyConfig,
  Data as PlotlyData,
} from 'plotly.js'

// Import Plotly dynamically to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

// S3のJSONファイルURL
const DATA_URL =
  'https://takdeeegijfftoeggznd.supabase.co/storage/v1/object/public/public-files//fig_data.json'

// データ型定義
interface FigData {
  data: Partial<PlotlyData>[]
  layout: Partial<PlotlyLayout>
}

export default function EquityCurveChart() {
  const [figData, setFigData] = useState<FigData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(DATA_URL)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const data = await response.json()
        setFigData(data)
      } catch (err) {
        console.error('Failed to fetch JSON data', err)
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // レンダリング中の表示
  if (isLoading) {
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-[200px]" />
      </div>
    )
  }

  // エラー表示
  if (error || !figData) {
    return (
      <div className="bg-zinc-800/50 rounded-lg p-4">
        <div className="text-red-400 text-sm">
          {error || 'Failed to load data'}
        </div>
      </div>
    )
  }

  // カスタマイズしたレイアウト
  const customLayout: Partial<PlotlyLayout> = {
    ...figData.layout,
    autosize: true,
    margin: { t: 10, r: 30, l: 40, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      color: '#9ca3af',
      family: 'system-ui, sans-serif',
    },
    xaxis: {
      ...figData.layout.xaxis,
      showgrid: false,
      tickfont: {
        size: 10,
      },
      automargin: true,
    },
    yaxis: {
      ...figData.layout.yaxis,
      showgrid: true,
      gridcolor: '#374151',
      gridwidth: 0.5,
      tickfont: {
        size: 10,
      },
      automargin: true,
    },
    height: 300,
    width: undefined,
    hovermode: 'x unified' as const,
    hoverlabel: {
      bgcolor: '#18181b',
      bordercolor: '#3f3f46',
      font: {
        color: '#d4d4d8',
      },
    },
    legend: {
      orientation: 'h',
      y: -0.15,
      font: {
        size: 10,
        color: '#9ca3af',
      },
    },
  }

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-zinc-300">
          Equity Curve Chart
        </h3>
      </div>

      <div className="w-full h-[300px]">
        {/* @ts-ignore */}
        <Plot
          data={figData.data}
          layout={customLayout}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    </div>
  )
}
