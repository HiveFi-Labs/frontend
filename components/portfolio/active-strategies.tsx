'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import StrategyCard from '@/components/strategies/strategy-card'
import StrategyPreview from '@/components/strategies/strategy-preview'
import portfolioData from '@/services/portfolio-data'
import type { Strategy } from '@/types/portfolio'

export default function ActiveStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portfolioTotal, setPortfolioTotal] = useState<number>(0)

  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null,
  )
  const [showPreview, setShowPreview] = useState(false)
  const [newAllocation, setNewAllocation] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [strategiesData, portfolioSummary] = await Promise.all([
          portfolioData.getUserStrategies(),
          portfolioData.getPortfolioSummary(),
        ])
        setStrategies(strategiesData)
        setPortfolioTotal(portfolioSummary.totalValue)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch user strategies', err)
        setError('Failed to load strategy data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">My Strategies</h2>
          <div className="h-10 w-40 bg-zinc-800 rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-zinc-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4 border-red-800 text-red-400 hover:bg-red-900/20"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onSelect={handleStrategySelect}
          />
        ))}
      </div>

      {/* Strategy Preview Modal */}
      {showPreview && selectedStrategy && (
        <StrategyPreview
          strategy={selectedStrategy}
          onClose={handleClosePreview}
        />
      )}

      {/* Allocation Change Modal */}
      {showAllocationModal && selectedStrategy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">
                Adjust Allocation
              </h3>
              <p className="text-sm text-zinc-400">
                Change the allocation for {selectedStrategy.name}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">
                    Current Allocation
                  </span>
                  <span className="text-sm font-medium text-zinc-300">
                    $
                    {selectedStrategy.allocation
                      ? selectedStrategy.allocation.toLocaleString()
                      : '0'}
                    {selectedStrategy.allocationPercent
                      ? ` (${selectedStrategy.allocationPercent}%)`
                      : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">
                      New Allocation
                    </span>
                    <span className="text-sm font-medium text-zinc-300">
                      $
                      {Math.round(
                        (newAllocation / 100) * portfolioTotal,
                      ).toLocaleString()}{' '}
                      ({newAllocation.toFixed(1)}
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
                  />
                </div>
              </div>
              <div className="bg-zinc-800/30 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <p className="text-xs text-zinc-400">
                    Changing allocation may affect your portfolio&apos;s risk
                    profile. Make sure the new allocation aligns with your risk
                    tolerance.
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
              <Button
                className="gradient-button"
                onClick={() => setShowAllocationModal(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
