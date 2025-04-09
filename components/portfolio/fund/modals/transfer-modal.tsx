"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, AlertTriangle } from "lucide-react"
import portfolioData from "@/services/portfolio-data"
import type { ModalProps, FundSummary, Strategy } from "@/types/portfolio"

export default function TransferModal({ onClose }: ModalProps) {
  const [fundSummary, setFundSummary] = useState<FundSummary | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fundData, strategiesData] = await Promise.all([
          portfolioData.getFundSummary(),
          portfolioData.getUserStrategies(),
        ])
        setFundSummary(fundData)
        setStrategies(strategiesData)
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading || !fundSummary) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6">
          <div className="h-6 bg-zinc-800 rounded w-1/2 mb-4 animate-pulse"></div>
          <div className="h-64 bg-zinc-800/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold text-white">Transfer Funds</h3>
          <p className="text-sm text-zinc-400">Move funds between strategies</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-zinc-400">From</span>
            <Select defaultValue="available">
              <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="available">
                  Available Balance (${fundSummary.availableBalance.toLocaleString()})
                </SelectItem>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={`strategy-${strategy.id}`}>
                    {strategy.name} (${strategy.allocation ? strategy.allocation.toLocaleString() : "0"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-zinc-400">To</span>
            <Select defaultValue={strategies.length > 0 ? `strategy-${strategies[0].id}` : ""}>
              <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="available">Available Balance</SelectItem>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={`strategy-${strategy.id}`}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-zinc-400">Amount</span>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                type="number"
                placeholder="0.00"
                defaultValue=""
                className="pl-10 bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500"
              />
            </div>
          </div>

          <div className="bg-zinc-800/30 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <p className="text-xs text-zinc-400">
                Transferring funds between strategies will change your portfolio allocation and may affect your risk
                profile.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
          <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={onClose}>
            Cancel
          </Button>
          <Button className="gradient-button" onClick={onClose}>
            Transfer Funds
          </Button>
        </div>
      </div>
    </div>
  )
}
