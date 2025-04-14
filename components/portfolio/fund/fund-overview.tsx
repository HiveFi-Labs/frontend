'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDownLeft, RefreshCw } from 'lucide-react'
import portfolioData from '@/services/portfolio-data'
import type { FundSummary, RecentActivity } from '@/types/portfolio'

export default function FundOverview() {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-zinc-800 rounded w-2/3 mb-3"></div>
              <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
            </CardContent>
          </Card>
        ))}
      </div>
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

  // 再利用可能なアクティビティアイテムコンポーネントを作成
  const ActivityItem = ({
    activity,
    index,
  }: {
    activity: RecentActivity
    index: number
  }) => (
    <div key={index}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {activity.type === 'deposit' && (
              <ArrowDownLeft className="w-4 h-4 text-green-400" />
            )}
            {activity.type === 'transfer' && (
              <RefreshCw className="w-4 h-4 text-blue-400" />
            )}
            <span className="text-sm text-zinc-300">
              {activity.type === 'deposit' ? 'Deposit' : 'Transfer'}
            </span>
          </div>
          <div className="text-sm font-medium text-green-400">
            {activity.type === 'deposit' ? '+' : ''}$
            {activity.amount.toLocaleString()}
          </div>
        </div>
        <div className="text-xs text-zinc-500">
          {new Date(activity.date).toLocaleDateString()} •
          {activity.status === 'pending' ? ' Pending' : ' Completed'}
          {activity.strategy && ` • To ${activity.strategy}`}
        </div>
      </div>
      {index < fundSummary.recentActivity.length - 1 && (
        <div className="my-2 border-t border-zinc-800/50"></div>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            ${fundSummary.totalBalance.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400 mt-1">
            Available: ${fundSummary.availableBalance.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">
            Allocated: ${fundSummary.allocatedBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fundSummary.recentActivity.map((activity, index) => (
            <ActivityItem key={index} activity={activity} index={index} />
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">
            Auto-Rebalance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-zinc-400">Status</span>
            <Badge
              variant="outline"
              className="border-green-500 text-green-400 bg-green-900/20"
            >
              {fundSummary.autoRebalanceSettings.enabled
                ? 'Enabled'
                : 'Disabled'}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Frequency</span>
              <span className="text-sm text-zinc-300">
                {fundSummary.autoRebalanceSettings.frequency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Next Rebalance</span>
              <span className="text-sm text-zinc-300">
                {new Date(
                  fundSummary.autoRebalanceSettings.nextRebalance,
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Threshold</span>
              <span className="text-sm text-zinc-300">
                {fundSummary.autoRebalanceSettings.threshold}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
