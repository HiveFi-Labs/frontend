'use client'

import { useEffect, useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { AlertTriangle } from 'lucide-react'
import portfolioData from '@/services/portfolio-data'
import type { FundSummary } from '@/types/portfolio'

export default function FundSettings() {
  const [fundSummary, setFundSummary] = useState<FundSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await portfolioData.getFundSummary()
        setFundSummary(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch fund summary', err)
        setError('Failed to load fund data. Please try again later.')
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

  if (!fundSummary) return null

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-zinc-300">
          Fund Management Settings
        </CardTitle>
        <CardDescription>
          Configure automatic rebalancing and profit handling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              Auto-Rebalance Settings
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                Enable Auto-Rebalance
              </span>
              <Switch
                defaultChecked={fundSummary.autoRebalanceSettings.enabled}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Rebalance Frequency</span>
              <Select
                defaultValue={fundSummary.autoRebalanceSettings.frequency.toLowerCase()}
              >
                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Drift Threshold</span>
              <Select
                defaultValue={fundSummary.autoRebalanceSettings.threshold.toString()}
              >
                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="3">3%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500">
                Rebalance will be triggered when any strategy allocation drifts
                by more than this percentage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Profit Handling</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                Auto-Reinvest Profits
              </span>
              <Switch defaultChecked={true} />
            </div>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Profit Taking</span>
              <Select defaultValue="none">
                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Select profit taking method" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="threshold">Threshold-based</SelectItem>
                  <SelectItem value="periodic">Periodic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Withdrawal Method</span>
              <Select defaultValue="manual">
                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Select withdrawal method" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="threshold">Threshold-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <p className="text-xs text-zinc-400">
              Changing rebalancing settings may trigger taxable events. Please
              consult with a tax professional before making significant changes
              to your portfolio management strategy.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="gradient-button"
            onClick={() => console.log('Settings saved')}
          >
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
