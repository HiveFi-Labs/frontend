"use client"

import { useDataFetch } from "@/hooks/use-data-fetch"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { Skeleton } from "@/components/ui/skeleton"
import portfolioData from "@/services/index"
import type { Stat } from "@/types/home"

export default function StatsSection() {
  const { data: stats, isLoading, error } = useDataFetch<Stat[]>(portfolioData.getStats)

  if (isLoading) {
    return (
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-xl text-center animate-pulse">
                <Skeleton width="50%" height="32px" className="mx-auto mb-2" />
                <Skeleton width="66%" height="16px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !stats) {
    return (
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error?.message || "Failed to load stats"}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <GlassCard key={stat.label}>
              <GlassCardContent className="text-center pt-6">
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</h3>
                <p className="text-zinc-400">{stat.label}</p>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
