import { cn } from '@/lib/utils'

interface LoadingStateProps {
  className?: string
  height?: string | number
  text?: string
  variant?: 'default' | 'card' | 'inline'
}

/**
 * ローディング状態を表示するコンポーネント
 */
export function LoadingState({
  className,
  height = '200px',
  text = 'Loading...',
  variant = 'default',
}: LoadingStateProps) {
  const heightValue = typeof height === 'number' ? `${height}px` : height

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'glass-card p-6 rounded-xl animate-pulse flex flex-col items-center justify-center',
          className,
        )}
        style={{ height: heightValue }}
      >
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400 text-sm">{text}</p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="w-4 h-4 border-2 border-zinc-700 border-t-purple-500 rounded-full animate-spin"></div>
        <span className="text-zinc-400 text-sm">{text}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center',
        className,
      )}
      style={{ height: heightValue }}
    >
      <div className="w-12 h-12 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
      <p className="text-zinc-400">{text}</p>
    </div>
  )
}

/**
 * スケルトンローディングコンポーネント
 */
export function Skeleton({
  className,
  width = '100%',
  height = '20px',
}: {
  className?: string
  width?: string | number
  height?: string | number
}) {
  return (
    <div
      className={cn('animate-pulse bg-zinc-800 rounded', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

/**
 * カードスケルトンコンポーネント
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6 rounded-xl animate-pulse', className)}>
      <Skeleton width="50px" height="50px" className="mb-4 rounded-xl" />
      <Skeleton width="70%" height="24px" className="mb-3" />
      <Skeleton width="100%" height="16px" className="mb-2" />
      <Skeleton width="90%" height="16px" />
    </div>
  )
}

/**
 * テーブルスケルトンコンポーネント
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-4 mb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={`header-${i}`}
            width={`${100 / columns}%`}
            height="20px"
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              width={`${100 / columns}%`}
              height="24px"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
