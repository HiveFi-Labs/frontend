'use client'

import { useDataFetch } from '@/hooks/use-data-fetch'
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import portfolioData from '@/services/index'
import type { ProblemSolution } from '@/types/home'

export default function ProblemSolutionSection() {
  const {
    data: items,
    isLoading,
    error,
  } = useDataFetch<ProblemSolution[]>(portfolioData.getProblemSolutions)

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="glass-card p-8 rounded-xl relative overflow-hidden group animate-pulse"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton width="33%" height="24px" className="mb-2" />
                <Skeleton width="66%" height="24px" className="mb-2" />
                <Skeleton width="100%" height="16px" />
              </div>
              <div className="space-y-4">
                <Skeleton width="33%" height="24px" className="mb-2" />
                <Skeleton width="66%" height="24px" className="mb-2" />
                <Skeleton width="100%" height="16px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !items) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error?.message || 'Failed to load problem solutions'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {items.map((item) => (
        <GlassCard key={item.problem} gradientBorder hoverEffect>
          <GlassCardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-medium">
                  Problem
                </div>
                <h3 className="text-xl font-semibold group-hover:text-white transition-colors">
                  {item.problem}
                </h3>
                <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {item.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-medium">
                  Solution
                </div>
                <h3 className="text-xl font-semibold group-hover:text-white transition-colors">
                  {item.solution}
                </h3>
                <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {item.solutionDescription}
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      ))}
    </div>
  )
}
