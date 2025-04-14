/**
 * チャートパスを生成するユーティリティ関数
 *
 * @param dataPoints データポイントの配列
 * @param valueKey 値を取得するためのキー
 * @param options オプション設定
 * @returns SVGパス文字列
 */
export function generateChartPath<T>(
  dataPoints: T[],
  valueKey: keyof T,
  options: {
    width?: number
    height?: number
    padding?: number
    minValue?: number
    maxValue?: number
  } = {},
): string {
  if (dataPoints.length === 0) return ''

  const values = dataPoints.map((item) => Number(item[valueKey]))
  const minValue = options.minValue ?? Math.min(...values) * 0.95
  const maxValue = options.maxValue ?? Math.max(...values) * 1.05
  const range = maxValue - minValue

  const width = options.width ?? 100
  const height = options.height ?? 100
  const padding = options.padding ?? 10

  const points = dataPoints.map((point, i) => {
    const x = padding + (i / (dataPoints.length - 1)) * (width - 2 * padding)
    const y =
      height -
      padding -
      ((Number(point[valueKey]) - minValue) / range) * (height - 2 * padding)
    return `${x},${y}`
  })

  return `M${points.join(' L')}`
}

/**
 * 円グラフのセグメントを生成するユーティリティ関数
 *
 * @param data データの配列
 * @param valueKey 値を取得するためのキー
 * @param options オプション設定
 * @returns 円グラフセグメントの配列
 */
export function generatePieSegments<T>(
  data: T[],
  valueKey: keyof T,
  options: {
    radius?: number
    centerX?: number
    centerY?: number
    getColorForIndex?: (index: number) => string
  } = {},
): Array<{
  path: string
  color: string
  startAngle: number
  endAngle: number
}> {
  if (data.length === 0) return []

  const total = data.reduce((sum, item) => sum + Number(item[valueKey]), 0)
  const radius = options.radius ?? 40
  const centerX = options.centerX ?? 50
  const centerY = options.centerY ?? 50
  const getColorForIndex = options.getColorForIndex ?? defaultColorForIndex

  let startAngle = 0
  return data.map((item, index) => {
    const angle = (Number(item[valueKey]) / total) * 360
    const endAngle = startAngle + angle

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    const segment = {
      path: pathData,
      color: getColorForIndex(index),
      startAngle,
      endAngle,
    }

    startAngle = endAngle
    return segment
  })
}

/**
 * デフォルトのインデックスに基づく色取得関数
 *
 * @param index インデックス
 * @returns 色コード
 */
function defaultColorForIndex(index: number): string {
  const colors = [
    '#9333ea',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ]
  return colors[index % colors.length]
}
