"use client"

import { useState } from "react"
import { Play, Pause, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StrategyCode from "@/components/strategy/strategy-code-modal"
import UnifiedChartView from "@/components/strategy/charts/unified-chart-view"
import PerformanceMetrics from "@/components/strategy/performance-metrics"
import TradeHistory from "@/components/strategy/trade-history"
import ParameterOptimization from "@/components/strategy/parameter-optimization"

export default function BacktestingResults({ showCode, setShowCode }) {
  const [isRunningBacktest, setIsRunningBacktest] = useState(false)

  return (
    <>
      <Card className="glass-card overflow-hidden h-full flex flex-col mt-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Backtesting Results</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 flex items-center gap-2"
                onClick={() => setShowCode(true)}
              >
                <Code className="w-4 h-4 mr-1" />
                Edit Code
              </Button>
              <Button
                variant={isRunningBacktest ? "destructive" : "default"}
                size="sm"
                className={isRunningBacktest ? "bg-red-600 hover:bg-red-700" : "gradient-button"}
                onClick={() => setIsRunningBacktest(!isRunningBacktest)}
              >
                {isRunningBacktest ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Run Backtest
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardDescription className="text-zinc-400">Analyze the performance of your trading strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 overflow-auto flex-1 pb-6">
          {/* Unified Chart View - Shows price, trades, and equity on the same timeline */}
          <UnifiedChartView />

          {/* Performance Metrics */}
          <PerformanceMetrics />

          {/* Trade History */}
          <TradeHistory />

          {/* Parameter Optimization */}
          <ParameterOptimization />
        </CardContent>
      </Card>

      {/* Strategy Code Modal */}
      {showCode && <StrategyCode onClose={() => setShowCode(false)} />}
    </>
  )
}
