'use client'

import { useState } from 'react'
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
import { useStrategyStore } from '@/stores/strategyStore'

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

  const chartData = useStrategyStore((state) => state.backtestResultsJson)

  const filterDataByTimeRange = (data: PlotlyDataObject | null) => {
    if (!data) return null
    console.log('Applying time range (not implemented yet):', timeRange)
    return data
  }
  const filteredData = filterDataByTimeRange(chartData)

  if (!chartData) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-zinc-300">
                Strategy Performance
              </CardTitle>
              <CardDescription>Price, trades, and equity curve</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] flex items-center justify-center text-zinc-500">
            Waiting for backtest results...
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
