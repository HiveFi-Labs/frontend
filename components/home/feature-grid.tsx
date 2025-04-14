"use client"

import { useDataFetch } from "@/hooks/use-data-fetch"
import { Icon } from "@/utils/icon-utils"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { CardSkeleton } from "@/components/ui/skeleton"
import portfolioData from "@/services/index"
import type { Feature } from "@/types/home"

export default function FeatureGrid() {
  const { data: features, isLoading, error } = useDataFetch<Feature[]>(() => portfolioData.getFeatures())

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error || !features) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error?.message || "Failed to load features"}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature) => (
        <GlassCard key={feature.title} gradientBorder hoverEffect>
          <GlassCardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4 group-hover:glow transition-all">
              <Icon name={feature.icon} />
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">{feature.description}</p>
          </GlassCardContent>
        </GlassCard>
      ))}
    </div>
  )
}
