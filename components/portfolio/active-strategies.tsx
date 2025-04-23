"use client"

import { useState, useEffect } from "react"
import { PlusCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorDisplay } from "@/components/ui/error-display"
import { useDataFetch } from "@/hooks/use-data-fetch"
import { portfolioService } from "@/services"
import StrategyCard from "@/components/strategies/strategy-card"
import StrategyPreview from "@/components/strategies/strategy-preview"
import type { Strategy } from "@/types/portfolio"

export default function ActiveStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [portfolioTotal, setPortfolioTotal] = useState<number>(0)

  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [newAllocation, setNewAllocation] = useState<number>(0)

  // データフェッチングを改善
  const { data, isLoading, error, refetch } = useDataFetch(
    async () => {
      const [strategies, portfolio] = await Promise.all([
        portfolioService.getUserStrategies(),
        portfolioService.getPortfolioSummary(),
      ])
      return { strategies, portfolio }
    },
    { cacheTime: 5 * 60 * 1000 }, // 5分間キャッシュ
  )

  useEffect(() => {
    if (data) {
      setStrategies(data.strategies)
      setPortfolioTotal(data.portfolio.totalValue)
    }
  }, [data])

  const handleAllocationChange = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    setNewAllocation(strategy.allocationPercent || 0)
    setShowAllocationModal(true)
  }

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  const handleSliderChange = (values: number[]) => {
    setNewAllocation(values[0])
  }

  const handleSaveAllocation = () => {
    if (!selectedStrategy) return

    // 実際のアプリケーションでは、ここでAPIを呼び出して変更を保存します
    setStrategies((prevStrategies) =>
      prevStrategies.map((s) =>
        s.id === selectedStrategy.id
          ? {
              ...s,
              allocationPercent: newAllocation,
              allocation: Math.round((newAllocation / 100) * portfolioTotal),
            }
          : s,
      ),
    )
    setShowAllocationModal(false)
  }

  if (isLoading) {
    return <LoadingState text="Loading your active strategies..." height={400} />
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message || "Failed to load strategies"}
        onRetry={refetch}
        title="Strategy Loading Error"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">My Strategies</h2>
        <Button className="gradient-button">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Strategy
        </Button>
      </div>

      {strategies.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/30 rounded-lg border border-zinc-800/50">
          <p className="text-zinc-400 mb-4">You don't have any active strategies yet.</p>
          <Button className="gradient-button">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Your First Strategy
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} onSelect={handleStrategySelect} />
          ))}
        </div>
      )}

      {/* Strategy Preview Modal */}
      {showPreview && selectedStrategy && <StrategyPreview strategy={selectedStrategy} onClose={handleClosePreview} />}

      {/* Allocation Change Modal */}
      {showAllocationModal && selectedStrategy && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="allocation-modal-title"
        >
          <div className="bg-zinc-900 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-zinc-800">
              <h3 id="allocation-modal-title" className="text-lg font-semibold text-white">
                Adjust Allocation
              </h3>
              <p className="text-sm text-zinc-400">Change the allocation for {selectedStrategy.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Current Allocation</span>
                  <span className="text-sm font-medium text-zinc-300">
                    ${selectedStrategy.allocation ? selectedStrategy.allocation.toLocaleString() : "0"}
                    {selectedStrategy.allocationPercent ? ` (${selectedStrategy.allocationPercent}%)` : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">New Allocation</span>
                    <span className="text-sm font-medium text-zinc-300">
                      ${Math.round((newAllocation / 100) * portfolioTotal).toLocaleString()} ({newAllocation.toFixed(1)}
                      %)
                    </span>
                  </div>
                  <Slider
                    defaultValue={[selectedStrategy.allocationPercent || 0]}
                    value={[newAllocation]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={0.1}
                    className="py-1"
                    aria-label="Allocation percentage"
                  />
                </div>
              </div>
              <div className="bg-zinc-800/30 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <p className="text-xs text-zinc-400">
                    Changing allocation may affect your portfolio's risk profile. Make sure the new allocation aligns
                    with your risk tolerance.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300"
                onClick={() => setShowAllocationModal(false)}
              >
                Cancel
              </Button>
              <Button className="gradient-button" onClick={handleSaveAllocation}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
