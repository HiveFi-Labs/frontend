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
import { useStrategyStore } from '@/stores/strategyStore'
import PlotlyChartView from './plotly-chart'
import type { PlotlyDataObject } from '@/lib/backtest.api'

export default function UnifiedChartView() {
  const [timeRange, setTimeRange] = useState('3m')

  const fullChartData = useStrategyStore((state) => state.backtestResultsJson)

  const filterValueBenchmark = (
    data: PlotlyDataObject | null,
  ): PlotlyDataObject | null => {
    if (!data?.data) return null
    const filtered = data.data.filter(
      (trace: any) =>
        trace &&
        typeof trace === 'object' &&
        (trace.name === 'Value' || trace.name === 'Benchmark'),
    )
    if (filtered.length === 0) return null
    return { ...data, data: filtered }
  }

  const filterDataByTimeRange = (data: PlotlyDataObject | null) => {
    if (!data) return null
    console.log('Applying time range (not implemented yet):', timeRange)
    return data
  }

  const filteredDataForDisplay = filterDataByTimeRange(
    filterValueBenchmark(fullChartData),
  )

  if (!fullChartData) {
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

  if (!filteredDataForDisplay) {
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
          <div className="h-[600px] flex items-center justify-center text-zinc-500">
            No 'Value' or 'Benchmark' data found in results.
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
        <div className="bg-zinc-900/70 rounded-lg p-4">
          <PlotlyChartView data={filteredDataForDisplay} />
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
      </CardContent>
    </Card>
  )
}
