"use client"

import { useState } from "react"
import { Star, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StrategyCard from "@/components/strategies/strategy-card"
import type { Strategy } from "@/types/strategies"

interface MarketplaceStrategiesProps {
  strategies: Strategy[]
  onStrategySelect: (strategy: Strategy) => void
}

export default function MarketplaceStrategies({ strategies, onStrategySelect }: MarketplaceStrategiesProps) {
  const [activeCategory, setActiveCategory] = useState("popular")

  // Filter strategies based on active category
  const getFilteredStrategies = () => {
    if (activeCategory === "popular") {
      return [...strategies].sort((a, b) => {
        const aPopularity = a.popularity?.users || 0
        const bPopularity = b.popularity?.users || 0
        return bPopularity - aPopularity
      })
    } else if (activeCategory === "trending") {
      return [...strategies].sort((a, b) => {
        const aReturn = Number.parseFloat(a.performance.return.replace("%", "").replace("+", ""))
        const bReturn = Number.parseFloat(b.performance.return.replace("%", "").replace("+", ""))
        return bReturn - aReturn
      })
    } else if (activeCategory === "top-rated") {
      return [...strategies].sort((a, b) => {
        const aRating = Number.parseFloat(a.popularity?.rating || "0")
        const bRating = Number.parseFloat(b.popularity?.rating || "0")
        return bRating - aRating
      })
    }
    return strategies
  }

  const filteredStrategies = getFilteredStrategies()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Featured Strategies</h2>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
          <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1">
            <TabsTrigger
              value="popular"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              <Star className="w-4 h-4 mr-1" />
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="top-rated"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              <Award className="w-4 h-4 mr-1" />
              Top Rated
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} isMarketplace={true} onSelect={onStrategySelect} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
          Load More Strategies
        </Button>
      </div>
    </div>
  )
}
