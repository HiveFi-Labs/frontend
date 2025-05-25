'use client'

import { useState, useEffect } from 'react'
import { Code, MonitorSmartphone, Save, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StrategyCode from '@/components/strategy/strategy-code'
import PerformanceMetrics from '@/components/strategy/performance-metrics'
import PerformanceMetricsV0 from '@/components/strategy/performance-metrics-v0'
import TradeCharts from '@/components/strategy/trade-charts'
import TradeHistoryTable from '@/components/strategy/trade-history-table'
import CodeLoading from '@/components/strategy/code-loading'
import { useStrategyStore } from '@/stores/strategyStore'
import { useIsMobile } from '@/hooks/use-mobile'

// Constants
const DESKTOP_CARD_HEIGHT = 'calc(100vh - 80px)'

export default function BacktestingResults() {
  // View state
  const [activeView, setActiveView] = useState('backtest')

  // Store state
  const backtestStatus = useStrategyStore((s) => s.backtestStatus)
  const apiVersion = useStrategyStore((s) => s.apiVersion)
  const isMobileBacktestVisible = useStrategyStore(
    (s) => s.isMobileBacktestVisible,
  )
  const setMobileBacktestVisible = useStrategyStore(
    (s) => s.setIsMobileBacktestVisible,
  )

  // Helper variables
  const isRunning = backtestStatus === 'code' || backtestStatus === 'backtest'
  const isMobile = useIsMobile()

  // Handle tab changes
  const handleViewChange = (value: string) => {
    setActiveView(value)
  }

  // Show backtest results automatically when completed on mobile
  useEffect(() => {
    if (
      isMobile &&
      (backtestStatus === 'completed' || backtestStatus === 'error')
    ) {
      setMobileBacktestVisible(true)
    }
  }, [isMobile, backtestStatus, setMobileBacktestVisible])

  // Toggle mobile backtest visibility
  const handleHideBacktest = () => {
    setMobileBacktestVisible(false)
  }

  // Render backtest content
  const renderBacktestContent = () => (
    <>
      {/* Chart View */}
      <TradeCharts />

      {/* Performance Metrics */}
      {apiVersion === 'v0' ? <PerformanceMetricsV0 /> : <PerformanceMetrics />}

      {/* Trade History */}
      <TradeHistoryTable />
    </>
  )

  // Render main content (backtest or code)
  const renderMainContent = () => {
    if (isRunning) {
      return <CodeLoading />
    }

    return activeView === 'backtest' ? (
      renderBacktestContent()
    ) : (
      <div className="h-full">
        <StrategyCode />
      </div>
    )
  }

  return (
    <>
      {/* Mobile Backtest Card */}
      {isMobile && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
            isMobileBacktestVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <Card className="glass-card overflow-hidden h-[calc(86vh)] flex flex-col rounded-t-lg rounded-b-none shadow-2xl">
            {/* Mobile Close Button */}
            <div
              className="bg-zinc-900 border-b border-zinc-800 p-2 flex justify-center cursor-pointer shadow-lg"
              onClick={handleHideBacktest}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm">Hide Backtest Results</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <CardContent
              className={`space-y-6 overflow-auto flex-1 ${isMobile ? 'p-1' : 'pb-6 pt-4'}`}
            >
              {renderMainContent()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Desktop Backtest Card */}
      {!isMobile && (
        <Card
          className="glass-card overflow-hidden h-full flex flex-col"
          style={{ height: DESKTOP_CARD_HEIGHT }}
        >
          {/* Status bar */}
          <div className="bg-zinc-900/80 border-b border-zinc-800 py-2 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <Tabs
                value={activeView}
                onValueChange={handleViewChange}
                className="w-full"
              >
                <TabsList className="bg-zinc-800/50 backdrop-blur-sm h-6 p-0">
                  <TabsTrigger
                    value="backtest"
                    className="flex items-center gap-1 h-6 py-0 px-2 text-xs data-[state=active]:bg-zinc-700"
                  >
                    <MonitorSmartphone className="w-3.5 h-3.5" />
                    Backtest
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="flex items-center gap-1 h-6 py-0 px-2 text-xs data-[state=active]:bg-zinc-700"
                    disabled={true}
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
              disabled={true}
            >
              <Save className="w-3.5 h-3.5" />
              Save Strategy
            </Button>
          </div>

          <CardContent
            className={`space-y-6 overflow-auto flex-1 ${isMobile ? 'p-1' : 'pb-6 pt-4'}`}
          >
            {renderMainContent()}
          </CardContent>
        </Card>
      )}
    </>
  )
}
