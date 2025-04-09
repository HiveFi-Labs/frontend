"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import portfolioData from "@/services/portfolio-data"
import type { Rebalance } from "@/types/portfolio"

export default function RebalanceHistory() {
  const [rebalanceHistory, setRebalanceHistory] = useState<Rebalance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await portfolioData.getRebalanceHistory()
        setRebalanceHistory(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch rebalance history", err)
        setError("Failed to load rebalance data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
          <div className="h-4 bg-zinc-800 rounded w-2/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-zinc-800/50 rounded-lg"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-zinc-300">Rebalance History</CardTitle>
            <CardDescription>Record of portfolio rebalancing operations</CardDescription>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Rebalances</SelectItem>
              <SelectItem value="auto">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rebalanceHistory.map((rebalance) => (
            <div key={rebalance.id} className="p-4 bg-zinc-800/30 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    {new Date(rebalance.date).toLocaleDateString()}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`
                    ${rebalance.type === "automatic" ? "border-blue-500 text-blue-400 bg-blue-900/20" : "border-purple-500 text-purple-400 bg-purple-900/20"}
                  `}
                >
                  {rebalance.type === "automatic" ? "Automatic" : "Manual"}
                </Badge>
              </div>
              <div className="space-y-3">
                {rebalance.changes.map((change, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3 text-sm text-zinc-300">{change.strategy}</div>
                    <div className="w-1/3 flex items-center">
                      <span className="text-sm text-zinc-400">{change.before}%</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600 mx-2" />
                      <span className="text-sm text-zinc-300">{change.after}%</span>
                    </div>
                    <div className="w-1/3">
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 relative">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-zinc-600"
                          style={{ width: `${change.before}%` }}
                        ></div>
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-purple-500"
                          style={{ width: `${change.after}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
