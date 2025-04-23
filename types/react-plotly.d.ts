import type * as Plotly from 'plotly.js'
import type * as React from 'react'

declare module 'react-plotly.js' {
  interface PlotProps extends Plotly.Layout {
    data: Plotly.Data[]
    layout?: Partial<Plotly.Layout>
    config?: Partial<Plotly.Config>
    frames?: Plotly.Frame[]
    style?: React.CSSProperties
    useResizeHandler?: boolean
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void
    onError?: (err: Error) => void
    divId?: string
    className?: string
    debug?: boolean
    revision?: number
  }

  export default class Plot extends React.Component<PlotProps> {}
}
