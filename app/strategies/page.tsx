'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import MarketplaceStrategies from '@/components/strategies/marketplace-strategies'
import StrategyPreview from '@/components/strategies/strategy-preview'
import portfolioData from '@/services/index'
import type { Strategy } from '@/types/strategies'

export default function StrategiesPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null,
  )
  const [showPreview, setShowPreview] = useState(false)
  const [showAdvancedFilters] = useState(false)
  const [returnRange, setReturnRange] = useState([0, 100])
  const [sharpRange, setSharpRange] = useState([0, 5])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marketplaceStrategies, setMarketplaceStrategies] = useState<
    Strategy[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // マーケットプレイス戦略を取得
        const strategies = await portfolioData.getMarketplaceStrategies()
        setMarketplaceStrategies(strategies)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch marketplace strategies', err)
        setError('Failed to load strategy data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 bg-zinc-800 rounded w-64 animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 h-10 bg-zinc-800 rounded animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-32 bg-zinc-800 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-8 bg-zinc-800 rounded w-48 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-zinc-800/50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-7xl">
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Strategy Marketplace
            </h1>
            <p className="text-zinc-400 mt-2">
              Discover and invest in high-performing algorithmic trading
              strategies
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                placeholder="Search strategies..."
                className="pl-10 bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Trading Pair" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all">All Pairs</SelectItem>
                  <SelectItem value="btcusdt">BTC/USDT</SelectItem>
                  <SelectItem value="ethusdt">ETH/USDT</SelectItem>
                  <SelectItem value="solusdt">SOL/USDT</SelectItem>
                  <SelectItem value="bnbusdt">BNB/USDT</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Strategy Type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trend">Trend Following</SelectItem>
                  <SelectItem value="mean">Mean Reversion</SelectItem>
                  <SelectItem value="breakout">Breakout</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="ml">Machine Learning</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="return">Highest Return</SelectItem>
                  <SelectItem value="sharpe">Best Sharpe Ratio</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-zinc-900 border-zinc-800">
                  <DropdownMenuLabel>Performance Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <div className="p-4 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">
                          Return Range
                        </span>
                        <span className="text-sm text-zinc-300">
                          {returnRange[0]}% - {returnRange[1]}%
                        </span>
                      </div>
                      <Slider
                        defaultValue={returnRange}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={setReturnRange}
                        className="py-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">
                          Sharpe Ratio
                        </span>
                        <span className="text-sm text-zinc-300">
                          {sharpRange[0]} - {sharpRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={sharpRange}
                        min={0}
                        max={5}
                        step={0.1}
                        onValueChange={setSharpRange}
                        className="py-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-zinc-400">
                        Max Drawdown
                      </span>
                      <Select defaultValue="any">
                        <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Max Drawdown" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="low">Low (&lt; 10%)</SelectItem>
                          <SelectItem value="medium">
                            Medium (10-20%)
                          </SelectItem>
                          <SelectItem value="high">High (&gt; 20%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-zinc-400">Timeframe</span>
                      <Select defaultValue="any">
                        <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="5m">5 minutes</SelectItem>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="4h">4 hours</SelectItem>
                          <SelectItem value="1d">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <div className="p-2 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      Reset Filters
                    </Button>
                    <Button size="sm" className="gradient-button">
                      Apply Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
              {/* Advanced filters would go here */}
            </div>
          )}
        </div>

        <div className="mt-6">
          <MarketplaceStrategies
            strategies={marketplaceStrategies}
            onStrategySelect={handleStrategySelect}
          />
        </div>
      </div>

      {showPreview && selectedStrategy && (
        <StrategyPreview
          strategy={selectedStrategy}
          onClose={handleClosePreview}
        />
      )}
    </div>
  )
}
