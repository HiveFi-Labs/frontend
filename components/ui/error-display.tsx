'use client'

import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
}

/**
 * エラー表示コンポーネント
 */
export function ErrorDisplay({
  message = 'An error occurred',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
      <h3 className="text-lg font-semibold mb-2">Error</h3>
      <p>{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          className="mt-4 border-red-800 text-red-400 hover:bg-red-900/20"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
