"use client"

import { useEffect, useState } from "react"
import { Rocket, CheckCircle2, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import portfolioData from "@/services/index"
import type { OptimizationResult } from "@/types/strategy-development"

export default function ParameterOptimization() {
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getOptimizationResults()
        setOptimizationResults(data)
      } catch (err) {
        console.error("Failed to fetch optimization results", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-zinc-800 rounded w-1/4"></div>
          <div className="h-8 bg-zinc-800 rounded w-1/6"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-zinc-800/50 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/70 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Parameter Optimization Results</h3>
        <Button className="gradient-button text-white border-0 text-xs h-8">
          <Rocket className="w-3 h-3 mr-1" />
          Apply Best Parameters
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">RSI Period</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Fast MA</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Slow MA</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Stop Loss %</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Return</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Sharpe</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400"></th>
            </tr>
          </thead>
          <tbody>
            {optimizationResults.map((result, index) => (
              <tr
                key={index}
                className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 ${index === 0 ? "bg-green-900/10" : ""}`}
              >
                <td className="py-3 px-4 text-sm text-zinc-300">{result.rsiPeriod}</td>
                <td className="py-3 px-4 text-sm text-zinc-300">{result.fastMA}</td>
                <td className="py-3 px-4 text-sm text-zinc-300">{result.slowMA}</td>
                <td className="py-3 px-4 text-sm text-zinc-300">{result.stopLoss}%</td>
                <td className="py-3 px-4 text-sm font-medium text-green-400">{result.return}</td>
                <td className="py-3 px-4 text-sm text-zinc-300">{result.sharpe}</td>
                <td className="py-3 px-4 text-sm">
                  {index === 0 && (
                    <span className="inline-flex items-center text-xs font-medium text-green-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Best
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium mb-1">AI Optimization Insights</div>
            <p className="text-sm text-zinc-400">
              The optimal parameters suggest a medium-term RSI (14) combined with a 10/30 moving average crossover
              system. This configuration provides the best balance between return and risk, with a Sharpe ratio of 1.8.
              Consider using a trailing stop loss of 2% to protect profits while allowing for sufficient price movement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
