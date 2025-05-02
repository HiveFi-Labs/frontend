'use client'

import { useState } from 'react'
import { Code, MonitorSmartphone, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
        {/* コンパクトなステータスバー */}
        <div className="bg-zinc-900/80 border-b border-zinc-800 py-2 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Tabs
              value={activeView}
              onValueChange={handleViewChange}
              className="w-full"
            >
              <TabsList className="bg-zinc-800/50 backdrop-blur-sm h-6 p-0">
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-1 h-6 py-0 px-2 text-xs data-[state=active]:bg-zinc-700"
                >
                  <MonitorSmartphone className="w-3.5 h-3.5" />
                  Backtest
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="flex items-center gap-1 h-6 py-0 px-2 text-xs data-[state=active]:bg-zinc-700"
                >
                  <Code className="w-3.5 h-3.5" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Save Strategy Button */}
          <Button
            className="gradient-button text-white border-0 h-8 py-3 px-3 text-xs flex items-center gap-1"
            size="sm"
          >
            <Save className="w-3.5 h-3.5" />
            Save Strategy
          </Button>
        </div>

        <CardContent className="space-y-6 overflow-auto flex-1 pb-6 pt-4">
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
