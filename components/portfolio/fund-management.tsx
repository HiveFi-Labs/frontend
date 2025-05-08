'use client'

import { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import portfolioData from '@/services/portfolio-data'
import type {
  Transaction,
  Rebalance,
  FundSummary,
  ProfitHandlingSettings,
} from '@/types/portfolio'

export default function FundManagement() {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rebalanceHistory, setRebalanceHistory] = useState<Rebalance[]>([])
  const [fundSummary, setFundSummary] = useState<FundSummary | null>(null)
  const [profitHandlingSettings, setProfitHandlingSettings] =
    useState<ProfitHandlingSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [transactionsData, rebalanceData, fundData, profitData] =
          await Promise.all([
            portfolioData.getTransactions(),
            portfolioData.getRebalanceHistory(),
            portfolioData.getFundSummary(),
            portfolioData.getProfitHandlingSettings(),
          ])

        setTransactions(transactionsData)
        setRebalanceHistory(rebalanceData)
        setFundSummary(fundData)
        setProfitHandlingSettings(profitData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch fund management data', err)
        setError('Failed to load fund management data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse"></div>
          <div className="h-10 w-32 bg-zinc-800 rounded-md animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-zinc-800/50 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>

        <div className="h-64 bg-zinc-800/50 rounded-xl animate-pulse"></div>
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

  if (!fundSummary || !profitHandlingSettings) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Fund Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
            onClick={() => setShowDepositModal(true)}
          >
            <ArrowDownLeft className="w-4 h-4 mr-2 text-green-400" />
            Deposit
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
            onClick={() => setShowWithdrawModal(true)}
          >
            <ArrowUpRight className="w-4 h-4 mr-2 text-red-400" />
            Withdraw
          </Button>
          <Button
            className="gradient-button"
            onClick={() => setShowTransferModal(true)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Transfer
          </Button>
        </div>
      </div>

      {/* Fund Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-zinc-300">
              Total Balance
            </CardTitle>
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
                    {new Date(activity.date).toLocaleDateString()} •{' '}
                    {activity.status === 'pending' ? 'Pending' : 'Completed'}
                    {activity.strategy && ` • To ${activity.strategy}`}
                  </div>
                </div>
                {index < fundSummary.recentActivity.length - 1 && (
                  <div className="my-2 border-t border-zinc-800/50"></div>
                )}
              </div>
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

      {/* Transaction History and Rebalance History */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 mb-4">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Transaction History
          </TabsTrigger>
          <TabsTrigger
            value="rebalance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Rebalance History
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Fund Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-0">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-zinc-300">
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    Record of all deposits, withdrawals, and transfers
                  </CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px] bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdraw">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-t border-zinc-800/50 hover:bg-zinc-800/30"
                      >
                        <td className="py-3 px-4 text-sm text-zinc-300">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {transaction.type === 'deposit' && (
                              <ArrowDownLeft className="w-4 h-4 text-green-400" />
                            )}
                            {transaction.type === 'withdraw' && (
                              <ArrowUpRight className="w-4 h-4 text-red-400" />
                            )}
                            {transaction.type === 'transfer' && (
                              <RefreshCw className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-sm text-zinc-300 capitalize">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          <span
                            className={
                              transaction.type === 'deposit'
                                ? 'text-green-400'
                                : transaction.type === 'withdraw'
                                  ? 'text-red-400'
                                  : 'text-blue-400'
                            }
                          >
                            {transaction.type === 'deposit'
                              ? '+'
                              : transaction.type === 'withdraw'
                                ? '-'
                                : ''}
                            ${transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-zinc-300">
                          {transaction.description}
                          {transaction.strategy && (
                            <span className="text-zinc-500">
                              {' '}
                              • {transaction.strategy}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`
                              ${transaction.status === 'completed' ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-yellow-500 text-yellow-400 bg-yellow-900/20'}
                            `}
                          >
                            {transaction.status === 'completed'
                              ? 'Completed'
                              : 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800/50 pt-4 flex justify-between">
              <div className="text-sm text-zinc-400">
                Showing {transactions.length} of {transactions.length}{' '}
                transactions
              </div>
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
              >
                View All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rebalance" className="mt-0">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-zinc-300">
                    Rebalance History
                  </CardTitle>
                  <CardDescription>
                    Record of portfolio rebalancing operations
                  </CardDescription>
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
                  <div
                    key={rebalance.id}
                    className="p-4 bg-zinc-800/30 rounded-lg"
                  >
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
                          ${rebalance.type === 'automatic' ? 'border-blue-500 text-blue-400 bg-blue-900/20' : 'border-purple-500 text-purple-400 bg-purple-900/20'}
                        `}
                      >
                        {rebalance.type === 'automatic'
                          ? 'Automatic'
                          : 'Manual'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {rebalance.changes.map((change, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-1/3 text-sm text-zinc-300">
                            {change.strategy}
                          </div>
                          <div className="w-1/3 flex items-center">
                            <span className="text-sm text-zinc-400">
                              {change.before}%
                            </span>
                            <ArrowRight className="w-4 h-4 text-zinc-600 mx-2" />
                            <span className="text-sm text-zinc-300">
                              {change.after}%
                            </span>
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
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
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
                    <span className="text-sm text-zinc-400">
                      Rebalance Frequency
                    </span>
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
                    <span className="text-sm text-zinc-400">
                      Drift Threshold
                    </span>
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
                      Rebalance will be triggered when any strategy allocation
                      drifts by more than this percentage.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">
                    Profit Handling
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      Auto-Reinvest Profits
                    </span>
                    <Switch
                      defaultChecked={profitHandlingSettings.autoReinvest}
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-zinc-400">Profit Taking</span>
                    <Select defaultValue={profitHandlingSettings.profitTaking}>
                      <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Select profit taking method" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="threshold">
                          Threshold-based
                        </SelectItem>
                        <SelectItem value="periodic">Periodic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-zinc-400">
                      Withdrawal Method
                    </span>
                    <Select
                      defaultValue={profitHandlingSettings.withdrawalMethod}
                    >
                      <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Select withdrawal method" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="manual">Manual Only</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="threshold">
                          Threshold-based
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <p className="text-xs text-zinc-400">
                    Changing rebalancing settings may trigger taxable events.
                    Please consult with a tax professional before making
                    significant changes to your portfolio management strategy.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="gradient-button">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals would be added here in a real implementation */}
    </div>
  )
}
