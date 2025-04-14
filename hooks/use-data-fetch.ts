'use client'

import { useState, useEffect } from 'react'

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

/**
 * データフェッチングのカスタムフック
 *
 * @param fetchFn データを取得する関数
 * @param options オプション設定
 * @returns データ、ローディング状態、エラー、リフェッチ関数
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {},
) {
  const { onSuccess, onError, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // fetchFn を直接呼び出し、this コンテキストの問題を回避
      const result = await fetchFn()
      setData(result)
      setError(null)
      onSuccess?.(result)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [enabled]) // fetchFn を依存配列から除外して無限ループを防ぐ

  return { data, isLoading, error, refetch: fetchData }
}
