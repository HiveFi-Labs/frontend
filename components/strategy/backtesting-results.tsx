'use client'

import { useState } from 'react'
import { Play, Pause, Code, MonitorSmartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StrategyCode from '@/components/strategy/strategy-code'
import PerformanceMetrics from '@/components/strategy/performance-metrics'
import TradeCharts from '@/components/strategy/trade-charts'
import TradeHistoryTable from '@/components/strategy/trade-history-table'

export default function BacktestingResults() {
  const [isRunningBacktest, setIsRunningBacktest] = useState(false)
  const [activeView, setActiveView] = useState('preview')

  // activeViewの変更を検知して親コンポーネントのshowCodeを更新
  const handleViewChange = (value: string) => {
    setActiveView(value)
  }

  return (
    <>
      <Card className="glass-card overflow-hidden h-full flex flex-col mt-2">
        <CardHeader className="pt-2 pb-3">
          {/* View Toggle Tabs */}
          <div className="mt-1">
            <Tabs
              value={activeView}
              onValueChange={handleViewChange}
              className="w-full"
            >
              <TabsList className="grid w-[240px] grid-cols-2 bg-zinc-800/50 backdrop-blur-sm">
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-700"
                >
                  <MonitorSmartphone className="w-4 h-4" />
                  Backtest
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="flex items-center gap-2 data-[state=active]:bg-zinc-700"
                >
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-auto flex-1 pb-6">
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={isRunningBacktest ? 'destructive' : 'default'}
                size="sm"
                className={
                  isRunningBacktest
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'gradient-button'
                }
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
          </div> */}
          {activeView === 'preview' ? (
            <>
              {/* Chart View */}
              <TradeCharts />

              {/* Performance Metrics */}
              <PerformanceMetrics />

              {/* Trade History */}
              <TradeHistoryTable />
            </>
          ) : (
            <div className="h-full">
              <StrategyCode />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
