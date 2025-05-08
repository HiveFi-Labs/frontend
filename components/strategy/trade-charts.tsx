'use client'

import dynamic from 'next/dynamic'
import { useStrategyStore } from '@/stores/strategyStore'
import type { PlotlyDataObject } from '@/lib/backtest.api'

// ─── Plotly は動的 import ───────────────────────────────
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

/* =========================================================================
 *  1. データフィルタ関数
 * ========================================================================= */
const filterClosedOpenTrades = (data: PlotlyDataObject | null) => {
  if (!data?.data) return null
  const filtered = data.data.filter(
    (t: any) =>
      t &&
      (t.name === 'Closed - Profit' ||
        t.name === 'Closed - Loss' ||
        t.name === 'Open'),
  )
  return filtered.length ? { ...data, data: filtered } : null
}

const filterSignals = (data: PlotlyDataObject | null) => {
  if (!data?.data) return null
  const filtered = data.data.filter(
    (t: any) =>
      t && (t.name === 'Close' || t.name === 'Buy' || t.name === 'Sell'),
  )
  return filtered.length ? { ...data, data: filtered } : null
}

/**
 * **損益曲線 (Value / Equity) のみ** を返す。
 */
const filterEquity = (data: PlotlyDataObject | null) => {
  if (!data?.data) return null
  const filtered = data.data.filter(
    (t: any) => t && (t.name === 'Value' || t.name === 'Equity'),
  )
  return filtered.length ? { ...data, data: filtered } : null
}

/* =========================================================================
 *  2. メイン React コンポーネント
 * ========================================================================= */
export default function TradeCharts() {
  const chartData = useStrategyStore((s) => s.backtestResultsJson)

  // --- データがまだ無い場合のプレースホルダ -----------------------------
  if (!chartData) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-4">
          Trade Signals &amp; History
        </h3>
        <div className="text-center text-zinc-500 py-10">
          Waiting for backtest results to show trade charts...
        </div>
      </div>
    )
  }

  // --- トレースを区分ごとに抽出 ----------------------------------------
  const closedOpenObj = filterClosedOpenTrades(chartData)
  const signalObj = filterSignals(chartData)
  const equityObj = filterEquity(chartData)

  if (!closedOpenObj && !signalObj && !equityObj) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-4 text-center text-zinc-500 py-10">
        No relevant trade data found in the results for charts.
      </div>
    )
  }

  /* --------------------------------------------------------------------- */
  /* 3. trace を各 x/y 軸に割り当てる（順序: Equity → Signals → Closed/Open）*/
  /* --------------------------------------------------------------------- */
  const tracesEquity =
    equityObj?.data.map((t) => ({ ...t, xaxis: 'x', yaxis: 'y' })) ?? []
  const tracesSignals =
    signalObj?.data.map((t) => ({ ...t, xaxis: 'x2', yaxis: 'y2' })) ?? []
  const tracesClosedOpen =
    closedOpenObj?.data.map((t) => ({ ...t, xaxis: 'x3', yaxis: 'y3' })) ?? []

  const data = [...tracesEquity, ...tracesSignals, ...tracesClosedOpen]

  /* --------------------------------------------------------------------- */
  /* 4. 共通レイアウト                                                     */
  /* --------------------------------------------------------------------- */
  const baseLayout = {
    paper_bgcolor: 'rgba(24,24,27,0.7)',
    plot_bgcolor: 'rgba(24,24,27,0)',
    font: { family: 'Inter, sans-serif', color: '#d4d4d8' },
    dragmode: 'pan',
    autosize: true,
    margin: { t: 20, b: 20, l: 50, r: 30 },
    hovermode: 'x unified',
    hoverdistance: -1,
    spikedistance: -1,
  }

  const spike = {
    showspikes: true,
    spikemode: 'across',
    spikecolor: '#888',
    spikethickness: 1,
    spikesnap: 'cursor',
  }

  /* --------------------------------------------------------------------- */
  /* 5. 3 段レイアウト（上: Equity, 中: Signals, 下: Closed/Open）         */
  /* --------------------------------------------------------------------- */
  const layout = {
    ...baseLayout,
    height: 700,
    grid: {
      rows: 3,
      columns: 1,
      pattern: 'independent',
      roworder: 'top to bottom',
    },

    // ─ 1段目：Equity ────────────────────────────────
    xaxis: { domain: [0, 1], anchor: 'y', ...spike },
    yaxis: {
      domain: [0.7, 1],
      title: 'Equity Curve',
      gridcolor: '#3f3f46',
      zerolinecolor: '#52525b',
      ...spike,
    },

    // ─ 2段目：Signals ───────────────────────────────
    xaxis2: { domain: [0, 1], anchor: 'y2', matches: 'x', ...spike },
    yaxis2: {
      domain: [0.35, 0.65],
      title: 'Buy / Sell Signals',
      gridcolor: '#3f3f46',
      zerolinecolor: '#52525b',
      ...spike,
    },

    // ─ 3段目：Closed & Open ────────────────────────
    xaxis3: { domain: [0, 1], anchor: 'y3', matches: 'x', ...spike },
    yaxis3: {
      domain: [0, 0.3],
      title: 'Closed & Open Trades',
      gridcolor: '#3f3f46',
      zerolinecolor: '#52525b',
      ...spike,
    },

    legend: {
      orientation: 'h',
      x: 0,
      y: 1.05,
      bgcolor: 'rgba(39,39,42,0.8)',
      bordercolor: '#52525b',
      borderwidth: 1,
    },
  }

  /* --------------------------------------------------------------------- */
  /* 6. Plotly 描画                                                        */
  /* --------------------------------------------------------------------- */
  return (
    <div className="bg-zinc-900/70 rounded-lg p-4">
      <h3 className="text-lg font-medium text-white mb-4">
        Trade Signals &amp; History
      </h3>

      <div className="w-full" style={{ height: layout.height }}>
        <Plot
          data={data}
          layout={layout as object}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            scrollZoom: true,
            doubleClick: 'reset',
            modeBarButtonsToRemove: [
              'lasso2d',
              'select2d',
              'toggleSpikelines',
              'pan2d',
            ],
          }}
          useResizeHandler
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
