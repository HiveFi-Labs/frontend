"use client"

import { useEffect, useState } from "react"
import portfolioData from "@/services/index"
import type { PerformanceMetric } from "@/types/strategy-development"

export default function PerformanceMetrics() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getPerformanceMetrics()
        setPerformanceMetrics(data)
      } catch (err) {
        console.error("Failed to fetch performance metrics", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {performanceMetrics.map((metric, index) => (
        <div key={index} className="glass-card p-4 rounded-lg">
          <div className="text-sm text-zinc-400 mb-1">{metric.name}</div>
          <div
            className={`text-xl font-semibold ${
              metric.status === "positive"
                ? "text-green-400"
                : metric.status === "negative"
                  ? "text-red-400"
                  : "text-zinc-300"
            }`}
          >
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  )
}
