'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Sliders, Download } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import portfolioData from '@/services/portfolio-data'
import type { RiskMetrics } from '@/types/portfolio'

export default function RiskManagement() {
  const [riskData, setRiskData] = useState<RiskMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setIsLoading(true)
        const data = await portfolioData.getRiskMetrics()
        setRiskData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch risk metrics', err)
        setError('Failed to load risk data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRiskData()
  }, [])

  // Generate colors for strategies
  const getColorForIndex = (index) => {
    const colors = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b']
    return colors[index % colors.length]
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse"></div>
          <div className="h-10 w-32 bg-zinc-800 rounded-md animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 bg-zinc-800/50 rounded-xl animate-pulse"
            ></div>
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

  if (!riskData) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Risk Management</h2>
        <div className="flex gap-2">
          <Select defaultValue="portfolio">
            <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="portfolio">Portfolio View</SelectItem>
              <SelectItem value="strategy">Strategy View</SelectItem>
              <SelectItem value="correlation">Correlation View</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Portfolio Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">
              Portfolio Risk Overview
            </CardTitle>
            <CardDescription>
              Overall risk assessment of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">
                      Overall Risk Level
                    </span>
                  </div>
                  <span className="text-sm font-medium text-zinc-300">
                    Medium
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                    style={{ width: `${riskData.overall}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Volatility</span>
                  <p className="text-lg font-semibold text-zinc-300">
                    {riskData.volatility}%
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Max Drawdown</span>
                  <p className="text-lg font-semibold text-red-400">
                    -{riskData.drawdown}%
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Sharpe Ratio</span>
                  <p className="text-lg font-semibold text-zinc-300">
                    {riskData.sharpeRatio}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-400">Sortino Ratio</span>
                  <p className="text-lg font-semibold text-zinc-300">
                    {riskData.sortinoRatio}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">
                      Value at Risk (95%)
                    </span>
                    <span className="text-sm font-medium text-red-400">
                      -{riskData.var95}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${riskData.var95 * 10}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    There is a 95% chance that your portfolio will not lose more
                    than {riskData.var95}% in a single day.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">
                      Value at Risk (99%)
                    </span>
                    <span className="text-sm font-medium text-red-400">
                      -{riskData.var99}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${riskData.var99 * 5}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    There is a 99% chance that your portfolio will not lose more
                    than {riskData.var99}% in a single day.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">
              Risk Contribution
            </CardTitle>
            <CardDescription>Risk breakdown by strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.riskContribution.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getColorForIndex(index) }}
                      ></div>
                      <span className="text-sm text-zinc-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-400">
                      {item.value}%
                    </span>
                  </div>
                  <Progress
                    value={item.value}
                    className="h-1.5 bg-zinc-800"
                    indicatorClassName={`bg-[${getColorForIndex(index)}]`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Matrix */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">
            Strategy Correlation Matrix
          </CardTitle>
          <CardDescription>
            How your strategies correlate with each other
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">
                    Strategy
                  </th>
                  {riskData.strategies.map((strategy, index) => (
                    <th
                      key={index}
                      className="text-left py-2 px-4 text-xs font-medium text-zinc-400"
                    >
                      {strategy.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riskData.strategies.map((strategy, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-zinc-800/50">
                    <td className="py-2 px-4 text-sm text-zinc-300">
                      {strategy.name}
                    </td>
                    {strategy.correlation.map((value, colIndex) => (
                      <td key={colIndex} className="py-2 px-4">
                        <div
                          className={`w-10 h-10 rounded flex items-center justify-center ${
                            rowIndex === colIndex
                              ? 'bg-purple-900/30 text-purple-400'
                              : value < 0.3
                                ? 'bg-green-900/30 text-green-400'
                                : value < 0.7
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {value.toFixed(1)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-zinc-400">Low Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-zinc-400">Medium Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-zinc-400">High Correlation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors and Risk Adjustment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">
              Risk Factors
            </CardTitle>
            <CardDescription>Breakdown of risk sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.riskFactors.map((factor, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-300">{factor.name}</span>
                    <span className="text-sm font-medium text-zinc-400">
                      {factor.value}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${factor.value}%`,
                        backgroundColor: getColorForIndex(index),
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                <p className="text-xs text-zinc-400">
                  Market risk is currently your highest risk factor. Consider
                  diversifying your strategies to reduce exposure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">
              Risk Adjustment
            </CardTitle>
            <CardDescription>
              Adjust your portfolio risk tolerance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">
                    Portfolio Risk Tolerance
                  </span>
                  <span className="text-sm font-medium text-zinc-300">
                    Medium (65%)
                  </span>
                </div>
                <Slider
                  defaultValue={[65]}
                  max={100}
                  step={1}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">
                  Maximum Drawdown Limit
                </span>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[15]}
                    min={5}
                    max={30}
                    step={1}
                    className="flex-1 py-1"
                  />
                  <span className="text-sm font-medium text-zinc-300 w-12 text-right">
                    15%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">
                  Maximum Allocation Per Strategy
                </span>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[40]}
                    min={10}
                    max={80}
                    step={5}
                    className="flex-1 py-1"
                  />
                  <span className="text-sm font-medium text-zinc-300 w-12 text-right">
                    40%
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gradient-button">
                  <Sliders className="w-4 h-4 mr-2" />
                  Apply Risk Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drawdown Analysis */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">
            Drawdown Analysis
          </CardTitle>
          <CardDescription>
            Historical drawdowns and recovery periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] relative mb-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="drawdown-gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.5)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line
                x1="10"
                y1="10"
                x2="90"
                y2="10"
                stroke="#374151"
                strokeWidth="0.1"
                strokeDasharray="0.5"
              />
              <line
                x1="10"
                y1="30"
                x2="90"
                y2="30"
                stroke="#374151"
                strokeWidth="0.1"
                strokeDasharray="0.5"
              />
              <line
                x1="10"
                y1="50"
                x2="90"
                y2="50"
                stroke="#374151"
                strokeWidth="0.1"
                strokeDasharray="0.5"
              />
              <line
                x1="10"
                y1="70"
                x2="90"
                y2="70"
                stroke="#374151"
                strokeWidth="0.1"
                strokeDasharray="0.5"
              />
              <line
                x1="10"
                y1="90"
                x2="90"
                y2="90"
                stroke="#374151"
                strokeWidth="0.1"
                strokeDasharray="0.5"
              />

              {/* Drawdown chart (simplified) */}
              <path
                d="M10,10 L15,10 L20,15 L25,30 L30,40 L35,25 L40,10 L45,10 L50,20 L55,40 L60,60 L65,30 L70,10 L75,15 L80,25 L85,10 L90,10"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.5"
              />

              {/* Area fill */}
              <path
                d="M10,10 L15,10 L20,15 L25,30 L30,40 L35,25 L40,10 L45,10 L50,20 L55,40 L60,60 L65,30 L70,10 L75,15 L80,25 L85,10 L90,10 L90,90 L10,90 Z"
                fill="url(#drawdown-gradient)"
                opacity="0.3"
              />
            </svg>

            {/* Y-axis labels */}
            <div className="absolute top-0 left-0 h-full flex flex-col justify-between py-2">
              <div className="text-xs text-zinc-500">0%</div>
              <div className="text-xs text-zinc-500">-5%</div>
              <div className="text-xs text-zinc-500">-10%</div>
              <div className="text-xs text-zinc-500">-15%</div>
              <div className="text-xs text-zinc-500">-20%</div>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full grid grid-cols-6 px-2">
              <div className="text-center text-xs text-zinc-500">Jan</div>
              <div className="text-center text-xs text-zinc-500">Mar</div>
              <div className="text-center text-xs text-zinc-500">May</div>
              <div className="text-center text-xs text-zinc-500">Jul</div>
              <div className="text-center text-xs text-zinc-500">Sep</div>
              <div className="text-center text-xs text-zinc-500">Nov</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">
                    Period
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">
                    Max Drawdown
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">
                    Duration
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">
                    Recovery Time
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-zinc-400">
                    Primary Cause
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-zinc-800/50">
                  <td className="py-2 px-4 text-sm text-zinc-300">Jan 2023</td>
                  <td className="py-2 px-4 text-sm text-red-400">-8.2%</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">5 days</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">12 days</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">
                    Market volatility
                  </td>
                </tr>
                <tr className="border-t border-zinc-800/50">
                  <td className="py-2 px-4 text-sm text-zinc-300">Mar 2023</td>
                  <td className="py-2 px-4 text-sm text-red-400">-12.3%</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">8 days</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">21 days</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">
                    Banking crisis
                  </td>
                </tr>
                <tr className="border-t border-zinc-800/50">
                  <td className="py-2 px-4 text-sm text-zinc-300">Jun 2023</td>
                  <td className="py-2 px-4 text-sm text-red-400">-6.5%</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">3 days</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">7 days</td>
                  <td className="py-2 px-4 text-sm text-zinc-300">
                    Regulatory news
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
