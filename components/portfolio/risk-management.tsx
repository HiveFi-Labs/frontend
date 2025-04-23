"use client"

import { useMemo } from "react"
import { Shield, AlertTriangle, Sliders, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorDisplay } from "@/components/ui/error-display"
import { useDataFetch } from "@/hooks/use-data-fetch"
import { portfolioService } from "@/services"
import type { RiskMetrics } from "@/types/portfolio"

export default function RiskManagement() {
  const {
    data: riskData,
    isLoading,
    error,
    refetch,
  } = useDataFetch<RiskMetrics>(
    () => portfolioService.getRiskMetrics(),
    { cacheTime: 10 * 60 * 1000 }, // 10分間キャッシュ
  )

  // メモ化された色の取得関数
  const getColorForIndex = useMemo(() => {
    const colors = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b"]
    return (index: number) => colors[index % colors.length]
  }, [])

  if (isLoading) {
    return <LoadingState text="Loading risk management data..." height={400} />
  }

  if (error || !riskData) {
    return <ErrorDisplay message={error?.message || "Failed to load risk data"} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Risk Management</h2>
        <div className="flex gap-2">
          <Select defaultValue="portfolio">
            <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="portfolio">Portfolio View</SelectItem>
              <SelectItem value="strategy">Strategy View</SelectItem>
              <SelectItem value="correlation">Correlation View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Portfolio Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Portfolio Risk Overview</CardTitle>
            <CardDescription>Overall risk assessment of your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Overall Risk Level</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-300">Medium</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                    style={{ width: `${riskData.overall}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Volatility</span>
                  <p className="text-lg font-semibold text-zinc-300">{riskData.volatility}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Max Drawdown</span>
                  <p className="text-lg font-semibold text-red-400">-{riskData.drawdown}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Sharpe Ratio</span>
                  <p className="text-lg font-semibold text-zinc-300">{riskData.sharpeRatio}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Sortino Ratio</span>
                  <p className="text-lg font-semibold text-zinc-300">{riskData.sortinoRatio}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Value at Risk (95%)</span>
                    <span className="text-sm font-medium text-red-400">-{riskData.var95}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${riskData.var95 * 10}%` }}></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    There is a 95% chance that your portfolio will not lose more than {riskData.var95}% in a single day.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Value at Risk (99%)</span>
                    <span className="text-sm font-medium text-red-400">-{riskData.var99}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${riskData.var99 * 5}%` }}></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    There is a 99% chance that your portfolio will not lose more than {riskData.var99}% in a single day.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Risk Contribution</CardTitle>
            <CardDescription>Risk breakdown by strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.riskContribution.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorForIndex(index) }}></div>
                      <span className="text-sm text-zinc-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-400">{item.value}%</span>
                  </div>
                  <Progress
                    value={item.value}
                    className="h-1.5 bg-zinc-800"
                    indicatorClassName={`bg-[${getColorForIndex(index)}]`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 残りのコンポーネントは必要に応じて遅延ロード */}
      <RiskFactorsSection riskData={riskData} getColorForIndex={getColorForIndex} />
    </div>
  )
}

// 分割したコンポーネント - リスク要因セクション
function RiskFactorsSection({
  riskData,
  getColorForIndex,
}: {
  riskData: RiskMetrics
  getColorForIndex: (index: number) => string
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">Risk Factors</CardTitle>
          <CardDescription>Breakdown of risk sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskData.riskFactors.map((factor, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-300">{factor.name}</span>
                  <span className="text-sm font-medium text-zinc-400">{factor.value}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${factor.value}%`,
                      backgroundColor: getColorForIndex(index),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <p className="text-xs text-zinc-400">
                Market risk is currently your highest risk factor. Consider diversifying your strategies to reduce
                exposure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">Risk Adjustment</CardTitle>
          <CardDescription>Adjust your portfolio risk tolerance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Portfolio Risk Tolerance</span>
                <span className="text-sm font-medium text-zinc-300">Medium (65%)</span>
              </div>
              <Slider defaultValue={[65]} max={100} step={1} className="py-1" />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Maximum Drawdown Limit</span>
              <div className="flex items-center gap-4">
                <Slider defaultValue={[15]} min={5} max={30} step={1} className="flex-1 py-1" />
                <span className="text-sm font-medium text-zinc-300 w-12 text-right">15%</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Maximum Allocation Per Strategy</span>
              <div className="flex items-center gap-4">
                <Slider defaultValue={[40]} min={10} max={80} step={5} className="flex-1 py-1" />
                <span className="text-sm font-medium text-zinc-300 w-12 text-right">40%</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gradient-button">
                <Sliders className="w-4 h-4 mr-2" />
                Apply Risk Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
