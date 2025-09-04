# バックテストグラフ表示仕様

このドキュメントでは、`strategy` ページでバックテスト結果を表示するための
グラフ仕様および関連型定義について説明します。グラフライブラリを
変更する際の参考資料としてまとめています。

## 1. データ取得と型

API から返されるバックテスト結果のグラフデータは
`PlotlyDataObject` 形式で表されます。定義は
`lib/backtest.api.ts` で行われています。

```ts
export interface PlotlyDataObject {
  data: Array<Record<string, unknown>>
  layout: Record<string, unknown>
}
```
【PlotlyDataObject】

API v1 ではさらに以下のレスポンス構造で返されます。

```ts
export interface BacktestResponse {
  backtest_results: {
    script_path: string
    plot_json: PlotlyDataObject
    stats: Record<string, unknown> | null
  }
}
```
【BacktestResponse】

### 1.1 データ取得フロー

v0 API では `getBacktestResults(sessionId)` を呼び出すと
`PlotlyDataObject` が直接返されます【F:lib/backtest.api.ts†L78-L86】。
v1 API の場合は `runBacktest` 実行後、上記 `BacktestResponse` が返り、
`backtest_results.plot_json` を取り出して使用します【F:lib/backtest.api.ts†L190-L204】。

取得した `plot_json` は Zustand ストア (`useStrategyStore`) の
`backtestResultsJson` に保存します【F:stores/strategyStore.ts†L82-L88】。

## 2. TradeCharts コンポーネント

バックテスト結果のグラフ描画を担当するのが
`components/strategy/trade-charts.tsx` です。`react-plotly.js` を
動的インポートして利用しています。

### 2.1 コンポーネント概要

コンポーネント冒頭で Plotly を動的読み込みし、
Zustand ストアから `backtestResultsJson` を取得して描画に利用します
【F:components/strategy/trade-charts.tsx†L1-L10】【F:components/strategy/trade-charts.tsx†L49-L56】。
データが存在しない場合はプレースホルダを表示します【F:components/strategy/trade-charts.tsx†L52-L63】。

### 2.2 トレースのフィルタ

取得した Plotly JSON から、以下の 3 種類のトレースを抽出します。

- **Closed/Open Trades**: `"Closed - Profit"`, `"Closed - Loss"`, `"Open"`
- **Signals**: `"Buy"`, `"Sell"`, `"Close"`
- **Equity**: `"Value"`, `"Equity"`

各トレースはフィルタ後に個別の `xaxis` / `yaxis` を割り当てます。
コード上では `tracesEquity` → `x`/`y`,
`tracesSignals` → `x2`/`y2`,
`tracesClosedOpen` → `x3`/`y3` の順でマッピングしています
【F:components/strategy/trade-charts.tsx†L80-L89】。

### 2.3 レイアウト

グラフは 3 段構成のサブプロットとして配置されます。
それぞれの縦領域は次のとおりです。

1. **Equity** : 上部 30% (y domain `0.7-1`)
2. **Signals** : 中央 30% (y domain `0.35-0.65`)
3. **Closed/Open Trades** : 下部 30% (y domain `0-0.3`)

共通レイアウト (`baseLayout`) では背景色やフォント、パン／ズーム設定、
hover モードを定義しています。ホバー時にはスパイクラインを表示する
ため `spike` 設定を各軸に適用しています。

```ts
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
```

最終的な `layout` では、上記を基に高さ `700px` のグリッドを組み
次のように各軸を設定します。

```ts
const layout = {
  ...baseLayout,
  height: 700,
  grid: { rows: 3, columns: 1, pattern: 'independent', roworder: 'top to bottom' },
  xaxis: { domain: [0, 1], anchor: 'y', ...spike },                 // Equity
  yaxis: { domain: [0.7, 1], title: 'Equity Curve', ...spike },
  xaxis2: { domain: [0, 1], anchor: 'y2', matches: 'x', ...spike }, // Signals
  yaxis2: { domain: [0.35, 0.65], title: 'Buy / Sell Signals', ...spike },
  xaxis3: { domain: [0, 1], anchor: 'y3', matches: 'x', ...spike }, // Closed/Open
  yaxis3: { domain: [0, 0.3], title: 'Closed & Open Trades', ...spike },
  legend: { orientation: 'h', x: 0, y: 1.05, bgcolor: 'rgba(39,39,42,0.8)', bordercolor: '#52525b', borderwidth: 1 },
}
```

### 2.4 Plotly コンフィグ

`Plot` コンポーネントには以下の設定で表示しています。

```ts
<Plot
  data={data}
  layout={layout as object}
  config={{
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: true,
    doubleClick: 'reset',
    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines', 'pan2d'],
  }}
  useResizeHandler
  className="w-full h-full"
/>
```

## 3. 移行時のポイント

- `backtestResultsJson` には Plotly と同等のデータ構造を保持する必要があります。
- 各トレース名を基にフィルタし、3 サブプロットへ割り振る処理を別ライブラリでも再現してください。
- レイアウトの高さやグリッド構成、スパイクライン設定を維持することで
  現行と同様のユーザー体験を提供できます。

以上がバックテスト結果グラフの表示仕様および型定義の概要です。
