'use client'

import { useState } from 'react'
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
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-zinc-300">
                Strategy Performance
              </h2>
              <p className="text-sm text-zinc-500">
                Price, trades, and equity curve
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="h-[600px] flex items-center justify-center text-zinc-500">
            Waiting for backtest results...
          </div>
        </div>
      </div>
    )
  }

  if (!filteredDataForDisplay) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-zinc-300">
                Strategy Performance
              </h2>
              <p className="text-sm text-zinc-500">
                Price, trades, and equity curve aligned on the same timeline
              </p>
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
        </div>
        <div className="p-4">
          <div className="h-[600px] flex items-center justify-center text-zinc-500">
            No 'Value' or 'Benchmark' data found in results.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-zinc-300">
              Strategy Performance
            </h2>
            <p className="text-sm text-zinc-500">
              Price, trades, and equity curve aligned on the same timeline
            </p>
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
      </div>
      <div className="p-4">
        <div className="bg-zinc-900/70 rounded-lg p-4">
          <PlotlyChartView data={filteredDataForDisplay} />
        </div>
      </div>
    </div>
  )
}
