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
  const conversations = useStrategyStore((state) => state.messages)
  const hasConversations = conversations.length > 0

  const [splitRatio, setSplitRatio] = useState(50)

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
    const splitContainer = document.querySelector('.split-container')
    if (!splitContainer) return

    const containerWidth = splitContainer.clientWidth
    const mouseX = e.clientX - splitContainer.getBoundingClientRect().left
    const newRatio = Math.min(Math.max((mouseX / containerWidth) * 100, 20), 80)
    setSplitRatio(newRatio)
  }

  const showSplitLayout = !!backtestResults || !!backtestResultsJson

  // バックテスト開始時にsplitRatioを調整
  useEffect(() => {
    if (backtestResults || backtestResultsJson) {
      setSplitRatio(50) // バックテスト結果が揃った時に50%に設定
    } else {
      setSplitRatio(100) // バックテスト未開始時はチャットUIを100%に
    }
  }, [backtestResults, backtestResultsJson])

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-full">
        {/* 条件付きレイアウト - showSplitLayoutがfalseの時は中央配置と最大幅制限 */}
        <div
          className={`flex flex-row gap-0 h-[calc(85vh)] min-h-[calc(500px)] overflow-hidden relative split-container ${!showSplitLayout ? 'justify-center' : ''}`}
        >
          {/* Left side - AI Collaboration */}
          <div
            className={`overflow-hidden flex flex-col flex-1 min-h-0 ${!hasConversations ? 'pb-20' : ''} ${!showSplitLayout ? 'max-w-3xl self-center' : ''}`}
            style={{ width: showSplitLayout ? `${splitRatio}%` : '100%' }}
          >
            {!hasConversations && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Let's begin.</h2>
                <p className="text-zinc-400">
                  Start a conversation with AI to create your trading strategy
                </p>
              </div>
            )}

            <AICollaboration sessionId={sessionId} />
          </div>

          {/* リサイズハンドラー - showSplitLayoutがtrueの時のみ表示 */}
          {showSplitLayout && (
            <div
              className="w-1 cursor-col-resize"
              onMouseDown={(e: React.MouseEvent) => {
                e.preventDefault()

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  handleResize(moveEvent)
                }

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }

                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            />
          )}

          {/* Right side - Backtesting Results - showSplitLayoutがtrueの時のみ表示 */}
          {showSplitLayout && (
            <div
              className="overflow-hidden flex flex-col"
              style={{ width: `${100 - splitRatio}%` }}
            >
              <BacktestingResults />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
