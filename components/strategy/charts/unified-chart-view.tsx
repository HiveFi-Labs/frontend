'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import dynamic from 'next/dynamic'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

// Plotlyデータの型定義
interface PlotlyDataObject {
  data: Array<Record<string, unknown>>
  layout: Record<string, unknown>
  table?: Array<Record<string, unknown>>
}

export default function UnifiedChartView() {
  const [timeRange, setTimeRange] = useState('3m')
  const [chartData, setChartData] = useState<PlotlyDataObject | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with an actual backtest result
        const response = await fetch(
          'https://takdeeegijfftoeggznd.supabase.co/storage/v1/object/public/public-files//fig_data.json',
        )
        const data = await response.json()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply time range filter if needed
  const filterDataByTimeRange = (data: PlotlyDataObject | null) => {
    if (!data) return data

    // For now, returning the original data
    // You can implement time filtering based on the timeRange state
    return data
  }

  const filteredData = filterDataByTimeRange(chartData)

  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-zinc-800/50 rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">
            Strategy Performance
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-zinc-400">
              No chart data available. Failed to load chart data.
            </p>
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
            <CardTitle className="text-lg text-zinc-300">
              Strategy Performance
            </CardTitle>
            <CardDescription>
              Price, trades, and equity curve aligned on the same timeline
            </CardDescription>
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
        {filteredData && <PlotlyChartView data={filteredData} />}
      </CardContent>
    </Card>
  )
}

// Plotlyを使用したチャートコンポーネント
function PlotlyChartView({ data }: { data: PlotlyDataObject }) {
  // Plotlyのレイアウト設定を取得
  const layout = data?.layout || {}

  // ダークテーマに合わせたスタイル調整
  const customLayout = {
    paper_bgcolor: 'rgba(24, 24, 27, 0.7)',
    plot_bgcolor: 'rgba(24, 24, 27, 0)',
    font: {
      family: 'Inter, sans-serif',
      color: '#d4d4d8',
    },
    margin: layout.margin || { t: 30, b: 30, l: 30, r: 30 },
    autosize: true,
    height: 600,
    xaxis: layout.xaxis
      ? {
          ...(layout.xaxis as object),
          gridcolor: '#27272a',
          zerolinecolor: '#3f3f46',
        }
      : {
          gridcolor: '#27272a',
          zerolinecolor: '#3f3f46',
        },
    yaxis: layout.yaxis
      ? {
          ...(layout.yaxis as object),
          gridcolor: '#27272a',
          zerolinecolor: '#3f3f46',
        }
      : {
          gridcolor: '#27272a',
          zerolinecolor: '#3f3f46',
        },
    xaxis2: layout.xaxis2
      ? {
          ...(layout.xaxis2 as object),
          gridcolor: '#27272a',
          zerolinecolor: '#3f3f46',
        }
      : undefined,
    yaxis2: layout.yaxis2
      ? {
          ...(layout.yaxis2 as object),
          gridcolor: '#27272a',
          zerolinecolor: '#3f3f46',
        }
      : undefined,
    legend: layout.legend
      ? {
          ...(layout.legend as object),
          bgcolor: 'rgba(24, 24, 27, 0.7)',
          bordercolor: '#3f3f46',
        }
      : {
          bgcolor: 'rgba(24, 24, 27, 0.7)',
          bordercolor: '#3f3f46',
        },
  }

  return (
    <div className="bg-zinc-900/70 rounded-lg p-4">
      <div className="w-full" style={{ height: '600px' }}>
        <Plot
          data={data?.data || []}
          layout={customLayout}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines'],
          }}
          className="w-full h-full"
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
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
