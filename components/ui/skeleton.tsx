import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

/**
 * スケルトンローディングコンポーネント
 */
export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-zinc-800 rounded', className)}
      style={{
        width: width
          ? typeof width === 'number'
            ? `${width}px`
            : width
          : '100%',
        height: height
          ? typeof height === 'number'
            ? `${height}px`
            : height
          : '20px',
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
