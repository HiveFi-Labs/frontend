"use client"

import { useEffect, useState } from "react"
import portfolioData from "@/services/index"
import type { TradeHistoryItem } from "@/types/strategy-development"

export default function TradeHistory() {
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getTradeHistory()
        setTradeHistory(data)
      } catch (err) {
        console.error("Failed to fetch trade history", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-zinc-800/50 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/70 rounded-lg p-4">
      <h3 className="text-lg font-medium text-white mb-4">Trade History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">#</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Entry Price</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Exit Price</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">P&L</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Duration</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.map((trade) => (
              <tr key={trade.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-3 px-4 text-sm text-zinc-300">{trade.id}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      trade.type === "LONG" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-zinc-300">${trade.entry}</td>
                <td className="py-3 px-4 text-sm text-zinc-300">${trade.exit}</td>
                <td
                  className={`py-3 px-4 text-sm font-medium ${
                    trade.pnl.startsWith("+") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.pnl}
                </td>
                <td className="py-3 px-4 text-sm text-zinc-300">{trade.duration}</td>
                <td className="py-3 px-4 text-sm text-zinc-300">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
