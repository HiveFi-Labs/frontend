import { useState, useCallback } from 'react'
import { apiV1 } from '@/lib/backtest.api'
import { useStrategyStore } from '@/stores/strategyStore'
import type { PlotlyDataObject } from '@/lib/backtest.api'

export default function useV1Backtest(sessionId: string | null) {
  const [error, setError] = useState<Error | null>(null)

  const messages = useStrategyStore((s) => s.messages)
  const backtestStatus = useStrategyStore((s) => s.backtestStatus)
  const setBacktestStatus = useStrategyStore((s) => s.setBacktestStatus)
  const setBacktestResults = useStrategyStore((s) => s.setResults)
  const setBacktestResultsJson = useStrategyStore(
    (s) => s.setBacktestResultsJson,
  )

  /* ------------------------------------------------------------
   *  実行関数
   * ------------------------------------------------------------ */
  const run = useCallback(async () => {
    if (!sessionId) return
    setError(null)

    try {
      /* 1. prompt を生成（今回は全文を join するだけ） */
      setBacktestStatus('prompt')
      const promptText = messages
        .filter((m) => m.agent === 'user' || m.agent === 'strategist')
        .map((m) => m.message)
        .join('\n')
      await apiV1.setStrategyPrompt(sessionId, promptText)

      /* 2. コード生成 */
      setBacktestStatus('code')
      const codeRes = await apiV1.generateCode(sessionId)
      const codeRef = codeRes.script_path ?? '' // sync 実装なら script_path が返る

      /* 3. バックテスト実行 */
      setBacktestStatus('backtest')
      const btRes = await apiV1.runBacktest(sessionId, codeRef)

      /* 4. 結果をストアに格納 */
      setBacktestResults(btRes.backtest_results)
      if (btRes.backtest_results.plot_json)
        setBacktestResultsJson(btRes.backtest_results.plot_json as PlotlyDataObject)

      setBacktestStatus('completed')
    } catch (err: any) {
      console.error('v1 backtest run error:', err)
      setError(err)
      setBacktestStatus('error')
    }
  }, [sessionId, messages, setBacktestStatus, setBacktestResults, setBacktestResultsJson])

  const reset = () => {
    setBacktestStatus('idle')
    setError(null)
  }

  return { run, status: backtestStatus, error, reset }
}
