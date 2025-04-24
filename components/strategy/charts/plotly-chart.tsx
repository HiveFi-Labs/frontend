'use client'

import dynamic from 'next/dynamic'
import type { PlotlyDataObject } from '@/lib/backtest.api' // 型をインポート

// Dynamically import Plotly
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface PlotlyChartProps {
  data: PlotlyDataObject
  title?: string // Optional title for the chart card
  description?: string // Optional description
  height?: number // Optional height override
}

export default function PlotlyChartView({
  data,
  title = 'Chart',
  description,
  height = 600,
}: PlotlyChartProps) {
  const layout = data?.layout || {}

  // ダークテーマに合わせたスタイル調整 (UnifiedChartViewからコピー)
  const customLayout = {
    title: title, // Add title to layout if provided
    paper_bgcolor: 'rgba(24, 24, 27, 0.7)', // zinc-900 with opacity
    plot_bgcolor: 'rgba(24, 24, 27, 0)', // transparent inside plot
    font: {
      family: 'Inter, sans-serif',
      color: '#d4d4d8', // zinc-300
    },
    margin: layout.margin || { t: 50, b: 40, l: 50, r: 30 }, // Adjusted margins
    autosize: true,
    height: height, // Use prop height
    xaxis: layout.xaxis
      ? {
          ...(layout.xaxis as object),
          gridcolor: '#3f3f46', // zinc-700
          zerolinecolor: '#52525b', // zinc-600
        }
      : { gridcolor: '#3f3f46', zerolinecolor: '#52525b' },
    yaxis: layout.yaxis
      ? {
          ...(layout.yaxis as object),
          gridcolor: '#3f3f46',
          zerolinecolor: '#52525b',
        }
      : { gridcolor: '#3f3f46', zerolinecolor: '#52525b' },
    // Keep other axes if they exist in original layout
    xaxis2: layout.xaxis2
      ? {
          ...(layout.xaxis2 as object),
          gridcolor: '#3f3f46',
          zerolinecolor: '#52525b',
        }
      : undefined,
    yaxis2: layout.yaxis2
      ? {
          ...(layout.yaxis2 as object),
          gridcolor: '#3f3f46',
          zerolinecolor: '#52525b',
        }
      : undefined,
    legend: layout.legend
      ? {
          ...(layout.legend as object),
          bgcolor: 'rgba(39, 39, 42, 0.8)', // zinc-800 with opacity
          bordercolor: '#52525b', // zinc-600
        }
      : { bgcolor: 'rgba(39, 39, 42, 0.8)', bordercolor: '#52525b' },
  }

  return (
    // Simplified wrapper, removed extra divs from UnifiedChartView's version
    <div className="w-full" style={{ height: `${height}px` }}>
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
  )
}
