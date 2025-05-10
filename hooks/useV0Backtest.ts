import { useState, useCallback, useEffect } from 'react'
import { apiV0 } from '@/lib/backtest.api'
import { useStrategyStore } from '@/stores/strategyStore'

export default function useV0Backtest(sessionId: string | null) {
  const [error, setError] = useState<Error | null>(null)
  const apiVersion = useStrategyStore((s) => s.apiVersion)

  const messages = useStrategyStore((s) => s.messages)
  const addMessage = useStrategyStore((s) => s.addMessage)
  const setBacktestStatus = useStrategyStore((s) => s.setBacktestStatus)
  const backtestResults = useStrategyStore((s) => s.backtestResults)
  const setBacktestResults = useStrategyStore((s) => s.setResults)
  const setBacktestResultsJson = useStrategyStore(
    (s) => s.setBacktestResultsJson,
  )

  useEffect(() => {
    if (backtestResults) {
      runBacktest()
    }
  }, [backtestResults])

  /* ------------------------------------------------------------
   *  実行関数
   * ------------------------------------------------------------ */

  const startBacktest = useCallback(async () => {
    setBacktestStatus('code')
    setTimeout(() => {
      setBacktestStatus('backtest')
    }, 4000)
  }, [])

  const runBacktest = useCallback(async () => {
    if (!sessionId || apiVersion !== 'v0') return
    setError(null)

    try {
      // PlotlyデータをJSON形式で取得
      try {
        const jsonData = await apiV0.getBacktestResults(sessionId)
        setBacktestResultsJson(jsonData)
      } catch (jsonErr) {
        console.error('Failed to fetch backtest results JSON:', jsonErr)
      }

      setBacktestStatus('completed')
    } catch (err: any) {
      console.error('v0 backtest run error:', err)
      setError(err)
      setBacktestStatus('error')
    }
  }, [
    sessionId,
    apiVersion,
    messages,
    addMessage,
    setBacktestStatus,
    setBacktestResults,
    setBacktestResultsJson,
  ])

  const reset = () => {
    setBacktestStatus('idle')
    setError(null)
  }

  return { startBacktest, error, reset }
}
