'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  gradientBorder?: boolean
  onClick?: () => void
}

/**
 * ガラス効果のあるカードコンポーネント
 */
export function GlassCard({
  children,
  className,
  hoverEffect = true,
  gradientBorder = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-xl relative overflow-hidden',
        hoverEffect && 'group transition-all hover:translate-y-[-5px]',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {gradientBorder && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
      {children}
    </div>
  )
}

interface GlassCardHeaderProps {
  children: ReactNode
  className?: string
}

/**
 * ガラスカードのヘッダーコンポーネント
 */
export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return <div className={cn('p-4 pb-2', className)}>{children}</div>
}

interface GlassCardContentProps {
  children: ReactNode
  className?: string
}

/**
 * ガラスカードのコンテンツコンポーネント
 */
export function GlassCardContent({
  children,
  className,
}: GlassCardContentProps) {
  return <div className={cn('p-4 pt-6', className)}>{children}</div>
}

interface GlassCardFooterProps {
  children: ReactNode
  className?: string
}

/**
 * ガラスカードのフッターコンポーネント
 */
export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div className={cn('p-4 pt-0 border-t border-zinc-800/50', className)}>
      {children}
    </div>
  )
}
