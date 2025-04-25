'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useQuery } from '@tanstack/react-query'
import { Upload, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AICollaboration from '@/components/strategy/ai-collaboration'
import BacktestingResults from '@/components/strategy/backtesting-results'
import { useStrategyStore } from '@/stores/strategyStore'
import {
  getBacktestResults,
  type BacktestResultsJsonResponse,
  type PlotlyDataObject,
} from '@/lib/backtest.api'

export default function StrategyPage() {
  const sessionId = useStrategyStore((state) => state.sessionId)
  const setSessionId = useStrategyStore((state) => state.setSessionId)
  const backtestResults = useStrategyStore((state) => state.backtestResults)
  const backtestResultsJson = useStrategyStore(
    (state) => state.backtestResultsJson,
  )
  const setBacktestResultsJson = useStrategyStore(
    (state) => state.setBacktestResultsJson,
  )

  const [showCode, setShowCode] = useState(false)
  const [splitRatio, setSplitRatio] = useState(60)

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4())
    }
  }, [sessionId, setSessionId])

  const {
    data: fetchedResultsJson,
    isLoading: isLoadingResultsJson,
    error: errorResultsJson,
    isSuccess,
  } = useQuery<PlotlyDataObject, Error>({
    queryKey: ['backtestResultsJson', sessionId],
    queryFn: () => {
      if (!sessionId) {
        return Promise.reject(new Error('Session ID is required'))
      }
      return getBacktestResults(sessionId)
    },
    enabled: !!sessionId && !!backtestResults && !backtestResultsJson,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSuccess && fetchedResultsJson) {
      if (!backtestResultsJson) {
        console.log(
          'Fetched backtest results JSON (Saving full data):',
          fetchedResultsJson,
        )
        setBacktestResultsJson(fetchedResultsJson)
      }
    }
  }, [
    isSuccess,
    fetchedResultsJson,
    setBacktestResultsJson,
    backtestResultsJson,
  ])

  useEffect(() => {
    if (errorResultsJson) {
      console.error('Error fetching backtest results JSON:', errorResultsJson)
    }
  }, [errorResultsJson])

  const handleResize = (e: MouseEvent) => {
    const splitContainer = document.querySelector('.split-container');
    if (!splitContainer) return;
    
    const containerWidth = splitContainer.clientWidth;
    const mouseX = e.clientX - splitContainer.getBoundingClientRect().left;
    const newRatio = Math.min(Math.max((mouseX / containerWidth) * 100, 20), 80);
    setSplitRatio(newRatio);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Strategy Development & Backtesting
            </h1>
            <p className="text-zinc-400 mt-2">
              Create, test, and optimize your trading strategies with AI
              assistance
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 backdrop-blur-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button className="gradient-button text-white border-0 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Strategy
            </Button>
          </div>
        </div>

        {/* Split layout: Left side for results, right side for AI chat */}
        <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-100px)] overflow-hidden relative split-container">
          {/* Left side - Backtesting Results */}
          <div 
            className="lg:overflow-auto" 
            style={{ width: `${splitRatio}%` }}
          >
            <BacktestingResults showCode={showCode} setShowCode={setShowCode} />
          </div>

          {/* リサイズハンドラー */}
          <div
            className="hidden lg:block w-1 bg-zinc-700 hover:bg-blue-500 cursor-col-resize"
            onMouseDown={(e: React.MouseEvent) => {
              e.preventDefault(); // ドラッグ操作を防止
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                handleResize(moveEvent);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Right side - AI Collaboration */}
          <div 
            className="lg:overflow-hidden flex flex-col" 
            style={{ width: `${100 - splitRatio}%` }}
          >
            {sessionId ? (
              <AICollaboration sessionId={sessionId} />
            ) : (
              <div className="flex justify-center items-center h-full">
                Generating session...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
