"use client"

import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataFetch } from "@/hooks/use-data-fetch"
import { generateChartPath, generatePieSegments } from "@/utils/chart-utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"
import portfolioData from "@/services/index"
import type { PortfolioSummary } from "@/types/portfolio"

export default function PortfolioOverview() {
  // 修正: 関数を直接渡すのではなく、関数を返す関数を渡す
  const {
    data: portfolioSummary,
    isLoading,
    error,
    refetch,
  } = useDataFetch<PortfolioSummary>(() => portfolioData.getPortfolioSummary())

  // Get color for allocation index
  const getColorForIndex = (index: number) => {
    const colors = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b"]
    return colors[index % colors.length]
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardHeader className="pb-2">
                <Skeleton width="50%" height={24} />
              </CardHeader>
              <CardContent>
                <Skeleton width="66%" height={32} className="mb-3" />
                <Skeleton width="100%" height={16} className="mb-2" />
                <Skeleton width="80%" height={16} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !portfolioSummary) {
    return <ErrorDisplay message={error?.message || "Failed to load portfolio data"} onRetry={refetch} />
  }

  // Generate chart path for historical performance
  const equityCurvePath = generateChartPath(portfolioSummary.historicalPerformance, "value", {
    width: 100,
    height: 100,
    padding: 10,
  })

  // Generate pie chart segments for allocation
  const pieSegments = generatePieSegments(portfolioSummary.allocation, "percent", {
    radius: 40,
    centerX: 50,
    centerY: 50,
    getColorForIndex,
  })

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-white">${portfolioSummary.totalValue.toLocaleString()}</div>
              <div
                className={`flex items-center ${portfolioSummary.change.trend === "up" ? "text-green-400" : "text-red-400"}`}
              >
                {portfolioSummary.change.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="font-medium">{portfolioSummary.change.percent}%</span>
              </div>
            </div>
            <div className="text-sm text-zinc-400 mt-1">
              {portfolioSummary.change.trend === "up" ? "+" : "-"}$
              {Math.abs(portfolioSummary.change.value).toLocaleString()} this month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-zinc-400">Monthly</span>
                  <span className="text-sm font-medium text-green-400">+8.3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-zinc-400">Quarterly</span>
                  <span className="text-sm font-medium text-green-400">+21.6%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-zinc-400">Yearly</span>
                  <span className="text-sm font-medium text-green-400">+42.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Sharpe Ratio</span>
                <span className="text-sm font-medium text-zinc-300">1.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Max Drawdown</span>
                <span className="text-sm font-medium text-red-400">-12.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Volatility</span>
                <span className="text-sm font-medium text-zinc-300">14.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Performance Chart */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg text-zinc-300">Historical Performance</CardTitle>
            <CardDescription>Portfolio value over time</CardDescription>
          </div>
          <Select defaultValue="6m">
            <SelectTrigger className="w-[120px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="portfolio-chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
                  <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
                </linearGradient>
                <linearGradient id="portfolio-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="10" y1="10" x2="10" y2="90" stroke="#374151" strokeWidth="0.1" />
              <line x1="10" y1="30" x2="90" y2="30" stroke="#374151" strokeWidth="0.1" strokeDasharray="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#374151" strokeWidth="0.1" strokeDasharray="0.5" />
              <line x1="10" y1="70" x2="90" y2="70" stroke="#374151" strokeWidth="0.1" strokeDasharray="0.5" />
              <line x1="10" y1="90" x2="90" y2="90" stroke="#374151" strokeWidth="0.1" />

              {/* Chart path */}
              <path d={equityCurvePath} fill="none" stroke="url(#portfolio-line-gradient)" strokeWidth="0.5" />

              {/* Area fill */}
              <path d={`${equityCurvePath} L90,90 L10,90 Z`} fill="url(#portfolio-chart-gradient)" opacity="0.3" />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full grid grid-cols-7 px-2">
              {portfolioSummary.historicalPerformance.map((item, i) => (
                <div key={i} className="text-center text-xs text-zinc-500">
                  {item.date}
                </div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute top-0 left-0 h-full flex flex-col justify-between py-2">
              <div className="text-xs text-zinc-500">$45,000</div>
              <div className="text-xs text-zinc-500">$40,000</div>
              <div className="text-xs text-zinc-500">$35,000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Portfolio Allocation</CardTitle>
            <CardDescription>Current distribution of funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="relative w-[200px] h-[200px]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {pieSegments.map((segment, index) => (
                    <path key={index} d={segment.path} fill={segment.color} stroke="#0f172a" strokeWidth="0.5" />
                  ))}
                  <circle cx="50" cy="50" r="20" fill="#0f172a" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm text-zinc-400">Total</span>
                  <span className="text-xl font-bold text-white">${portfolioSummary.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {portfolioSummary.allocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorForIndex(index) }}></div>
                    <span className="text-sm text-zinc-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-400">{item.percent}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">Strategy Performance</CardTitle>
            <CardDescription>Individual strategy returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioSummary.allocation.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorForIndex(index) }}></div>
                      <span className="text-sm font-medium text-zinc-300">{item.name}</span>
                    </div>
                    <div className={`text-sm font-medium ${item.performance >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {item.performance >= 0 ? "+" : ""}
                      {item.performance}%
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${item.performance >= 0 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${Math.abs(item.performance) * 2}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>${item.value.toLocaleString()}</span>
                    <span>{item.percent}% of portfolio</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 h-auto py-4 flex flex-col items-center gap-2"
            >
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>Deposit Funds</span>
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 h-auto py-4 flex flex-col items-center gap-2"
            >
              <ArrowUpRight className="w-5 h-5 text-red-400" />
              <span>Withdraw Funds</span>
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 h-auto py-4 flex flex-col items-center gap-2"
            >
              <Percent className="w-5 h-5 text-blue-400" />
              <span>Rebalance Portfolio</span>
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 h-auto py-4 flex flex-col items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Schedule Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
