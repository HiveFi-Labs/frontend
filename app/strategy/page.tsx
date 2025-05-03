'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useQuery } from '@tanstack/react-query'
import AICollaboration from '@/components/strategy/ai-collaboration'
import BacktestingResults from '@/components/strategy/backtesting-results'
import { useStrategyStore } from '@/stores/strategyStore'
import {
  apiV0, // ← 成果の取得はまだ v0 のみ
  type PlotlyDataObject,
} from '@/lib/backtest.api'

export default function StrategyPage() {
  /* ---- zustand ---- */
  const sessionId = useStrategyStore((s) => s.sessionId)
  const setSessionId = useStrategyStore((s) => s.setSessionId)
  const backtestResults = useStrategyStore((s) => s.backtestResults)
  const backtestResultsJson = useStrategyStore((s) => s.backtestResultsJson)
  const setBacktestResultsJson = useStrategyStore(
    (s) => s.setBacktestResultsJson,
  )
  const conversations = useStrategyStore((s) => s.messages)
  const hasConversations = conversations.length > 0

  /* ---- split ---- */
  const [splitRatio, setSplitRatio] = useState(50)

  /* ---- sessionId ---- */
  useEffect(() => {
    if (!sessionId) setSessionId(uuidv4())
  }, [sessionId, setSessionId])

  /* ---- back-test JSON (v0 only for now) ---- */
  const { data: fetchedJson, isSuccess } = useQuery<PlotlyDataObject, Error>({
    queryKey: ['backtestResultsJson', sessionId],
    queryFn: () => {
      if (!sessionId) throw new Error('Session ID is required')
      return apiV0.getBacktestResults(sessionId)
    },
    enabled: !!sessionId && !!backtestResults && !backtestResultsJson,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSuccess && fetchedJson && !backtestResultsJson) {
      setBacktestResultsJson(fetchedJson)
    }
  }, [isSuccess, fetchedJson, backtestResultsJson, setBacktestResultsJson])

  /* ---- split auto adjust ---- */
  useEffect(() => {
    setSplitRatio(backtestResults || backtestResultsJson ? 50 : 100)
  }, [backtestResults, backtestResultsJson])

  /* ---- resize handler ---- */
  const handleResize = (e: MouseEvent) => {
    const container = document.querySelector('.split-container')
    if (!container) return
    const { left, width } = container.getBoundingClientRect()
    const ratio = Math.min(Math.max(((e.clientX - left) / width) * 100, 20), 80)
    setSplitRatio(ratio)
  }

  const showSplit = !!backtestResults || !!backtestResultsJson

  /* =========================================================================
   *  JSX
   * ========================================================================= */
  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-full">
        <div
          className={`flex flex-row gap-0 h-[calc(90vh)] min-h-[500px] overflow-hidden relative split-container ${!showSplit ? 'justify-center' : ''}`}
        >
          {/* -------- Left (chat) -------- */}
          <div
            className={`overflow-hidden flex flex-col flex-1 min-h-0 ${!hasConversations ? 'pb-20' : ''} ${!showSplit ? 'max-w-3xl self-center' : ''}`}
            style={{ width: showSplit ? `${splitRatio}%` : '100%' }}
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

          {/* -------- Splitter -------- */}
          {showSplit && (
            <div
              className="w-1 cursor-col-resize"
              onMouseDown={(e) => {
                e.preventDefault()
                const move = (ev: MouseEvent) => handleResize(ev)
                const up = () => {
                  document.removeEventListener('mousemove', move)
                  document.removeEventListener('mouseup', up)
                }
                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', up)
              }}
            />
          )}

          {/* -------- Right (results) -------- */}
          {showSplit && (
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
