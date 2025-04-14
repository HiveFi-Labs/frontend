"use client"
import { useDataFetch } from "@/hooks/use-data-fetch"
import { Icon } from "@/utils/icon-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/skeleton"
import portfolioData from "@/services/index"
import type { ProductFeature } from "@/types/home"

export default function ProductOverview() {
  const { data: productFeatures, isLoading, error } = useDataFetch<ProductFeature[]>(portfolioData.getProductFeatures)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error || !productFeatures) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error?.message || "Failed to load product features"}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {productFeatures.map((feature) => (
        <Card key={feature.title} className="glass-card overflow-hidden group">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4 glow">
              <Icon name={feature.icon} />
            </div>
            <CardTitle className="text-2xl">{feature.title}</CardTitle>
            <CardDescription className="text-zinc-400 text-base">{feature.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300">
              Create custom trading strategies using technical indicators, price action, and volume metrics through an
              intuitive drag-and-drop interface. No coding required.
            </p>
            {/* Learn moreボタンを削除 */}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
