"use client"

import {
  X,
  TrendingUp,
  BarChart4,
  LineChart,
  Shield,
  Copy,
  ExternalLink,
  Star,
  User,
  Calendar,
  Clock,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StrategyPreview({ strategy, onClose }) {
  const isMarketplace = strategy.id > 100 // Simple check to determine if it's a marketplace strategy

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-md ${strategy.type === "trend" ? "bg-purple-900/50" : strategy.type === "mean" ? "bg-blue-900/50" : "bg-green-900/50"} flex items-center justify-center`}
            >
              <LineChart
                className={`w-5 h-5 ${strategy.type === "trend" ? "text-purple-400" : strategy.type === "mean" ? "text-blue-400" : "text-green-400"}`}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{strategy.name}</h2>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span>{strategy.pair}</span>
                <span>•</span>
                <span>{strategy.timeframe}</span>
                {isMarketplace && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{strategy.creator.name}</span>
                      {strategy.creator.verified && (
                        <Badge
                          variant="outline"
                          className="ml-1 py-0 h-4 text-[10px] border-blue-500 text-blue-400 bg-blue-900/20"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-300" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Chart */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Performance</h3>
                  <div className="px-3 py-1 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-xs font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {strategy.performance.return}
                  </div>
                </div>
                <div className="h-[250px] relative">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="preview-chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop
                          offset="0%"
                          stopColor={`${strategy.performance.trend === "up" ? "rgba(16, 185, 129, 0.5)" : "rgba(239, 68, 68, 0.5)"}`}
                        />
                        <stop
                          offset="100%"
                          stopColor={`${strategy.performance.trend === "up" ? "rgba(16, 185, 129, 0)" : "rgba(239, 68, 68, 0)"}`}
                        />
                      </linearGradient>
                      <linearGradient id="preview-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop
                          offset="0%"
                          stopColor={`${strategy.performance.trend === "up" ? "#10b981" : "#ef4444"}`}
                        />
                        <stop
                          offset="100%"
                          stopColor={`${strategy.performance.trend === "up" ? "#10b981" : "#ef4444"}`}
                        />
                      </linearGradient>
                    </defs>

                    {/* Chart path */}
                    <path
                      d={strategy.performance.chartPath}
                      fill="none"
                      stroke="url(#preview-line-gradient)"
                      strokeWidth="2"
                    />

                    {/* Area fill */}
                    <path
                      d={`${strategy.performance.chartPath} L290,90 L10,90 Z`}
                      fill="url(#preview-chart-gradient)"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>

              {/* Tabs for additional information */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 mb-4">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="trades"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                  >
                    Trade History
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0 space-y-4">
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">Strategy Description</h4>
                    <p className="text-sm text-zinc-400">
                      {isMarketplace
                        ? `This ${strategy.type === "trend" ? "trend following" : strategy.type === "mean" ? "mean reversion" : "breakout"} strategy uses a combination of ${strategy.indicators.join(", ")} indicators to identify optimal entry and exit points. It has been optimized for ${strategy.pair} on the ${strategy.timeframe} timeframe.`
                        : `A custom ${strategy.type === "trend" ? "trend following" : strategy.type === "mean" ? "mean reversion" : "breakout"} strategy that uses ${strategy.indicators.join(", ")} to generate trading signals. This strategy works best in ${strategy.type === "trend" ? "trending" : strategy.type === "mean" ? "ranging" : "volatile"} market conditions.`}
                    </p>
                  </div>

                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">Technical Indicators</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {strategy.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                          <div className="w-6 h-6 rounded-md bg-purple-900/50 flex items-center justify-center">
                            <BarChart4 className="w-3 h-3 text-purple-400" />
                          </div>
                          <span className="text-sm text-zinc-300">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trades" className="mt-0">
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">Recent Trades</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">Date</th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">Type</th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">Entry Price</th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">Exit Price</th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">P&L</th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                              <td className="py-2 px-4 text-sm text-zinc-300">
                                {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                              </td>
                              <td className="py-2 px-4">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${index % 2 === 0 ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                                >
                                  {index % 2 === 0 ? "LONG" : "SHORT"}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-sm text-zinc-300">
                                ${(30000 + Math.random() * 5000).toFixed(2)}
                              </td>
                              <td className="py-2 px-4 text-sm text-zinc-300">
                                ${(30000 + Math.random() * 5000).toFixed(2)}
                              </td>
                              <td
                                className={`py-2 px-4 text-sm font-medium ${index % 3 !== 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {index % 3 !== 0 ? "+" : "-"}
                                {(Math.random() * 5).toFixed(2)}%
                              </td>
                              <td className="py-2 px-4 text-sm text-zinc-300">
                                {Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">Strategy Parameters</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400">Risk Per Trade</p>
                        <p className="text-sm text-zinc-300">2.0%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400">Max Open Positions</p>
                        <p className="text-sm text-zinc-300">3</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400">Take Profit</p>
                        <p className="text-sm text-zinc-300">5.0%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400">Stop Loss</p>
                        <p className="text-sm text-zinc-300">2.5%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400">Trailing Stop</p>
                        <p className="text-sm text-zinc-300">Enabled</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400">Leverage</p>
                        <p className="text-sm text-zinc-300">1x</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Total Return</span>
                    <span
                      className={`text-sm font-medium ${strategy.performance.return.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                    >
                      {strategy.performance.return}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Sharpe Ratio</span>
                    <span className="text-sm font-medium text-zinc-300">{strategy.performance.sharpe}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Win Rate</span>
                    <span className="text-sm font-medium text-zinc-300">{strategy.performance.winRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Max Drawdown</span>
                    <span className="text-sm font-medium text-red-400">{strategy.performance.maxDrawdown}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Profit Factor</span>
                    <span className="text-sm font-medium text-zinc-300">1.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Avg. Trade Duration</span>
                    <span className="text-sm font-medium text-zinc-300">8h 45m</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Risk Level</div>
                      <div className="flex items-center">
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              Number.parseFloat(strategy.performance.maxDrawdown.replace("-", "")) > 15
                                ? "bg-red-500"
                                : Number.parseFloat(strategy.performance.maxDrawdown.replace("-", "")) > 10
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(Number.parseFloat(strategy.performance.maxDrawdown.replace("-", "")) * 5, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-zinc-400">
                          {Number.parseFloat(strategy.performance.maxDrawdown.replace("-", "")) > 15
                            ? "High"
                            : Number.parseFloat(strategy.performance.maxDrawdown.replace("-", "")) > 10
                              ? "Medium"
                              : "Low"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Additional Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Created: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-400">Last Updated: {new Date().toLocaleDateString()}</span>
                  </div>
                  {isMarketplace && (
                    <>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Users: {strategy.popularity.users}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Rating: {strategy.popularity.rating}/5</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isMarketplace ? (
                  <>
                    <Button className="w-full gradient-button">
                      <Copy className="w-4 h-4 mr-2" />
                      Clone Strategy
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Creator Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full gradient-button">
                      {strategy.status === "live" ? "Stop Strategy" : "Deploy Strategy"}
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Strategy
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
