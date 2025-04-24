'use client'

import { useStrategyStore } from '@/stores/strategyStore'
import PlotlyChartView from './charts/plotly-chart'
import type { PlotlyDataObject } from '@/lib/backtest.api'

export default function TradeHistory() {
  const chartData = useStrategyStore((state) => state.backtestResultsJson)

  const filterTrades1 = (
    data: PlotlyDataObject | null,
  ): PlotlyDataObject | null => {
    if (!data?.data) return null
    const filtered = data.data.filter(
      (trace: any) =>
        trace &&
        typeof trace === 'object' &&
        (trace.name === 'Closed - Profit' ||
          trace.name === 'Closed - Loss' ||
          trace.name === 'Open'),
    )
    if (filtered.length === 0) return null
    return { ...data, data: filtered }
  }
  const closedOpenTradesData = filterTrades1(chartData)

  const filterTrades2 = (
    data: PlotlyDataObject | null,
  ): PlotlyDataObject | null => {
    if (!data?.data) return null
    const filtered = data.data.filter(
      (trace: any) =>
        trace &&
        typeof trace === 'object' &&
        (trace.name === 'Close' ||
          trace.name === 'Buy' ||
          trace.name === 'Sell'),
    )
    if (filtered.length === 0) return null
    return { ...data, data: filtered }
  }
  const signalsData = filterTrades2(chartData)

  if (!chartData) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-4">
          Trade Signals & History
        </h3>
        <div className="text-center text-zinc-500 py-10">
          Waiting for backtest results to show trade charts...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {closedOpenTradesData && (
        <div className="bg-zinc-900/70 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">
            Closed & Open Trades
          </h3>
          <PlotlyChartView data={closedOpenTradesData} height={400} />
        </div>
      )}
      {signalsData && (
        <div className="bg-zinc-900/70 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">
            Buy/Sell Signals
          </h3>
          <PlotlyChartView data={signalsData} height={400} />
        </div>
      )}
      {!closedOpenTradesData && !signalsData && (
        <div className="bg-zinc-900/70 rounded-lg p-4 text-center text-zinc-500 py-10">
          No relevant trade data found in the results for charts.
        </div>
      )}
    </div>
  )
}
