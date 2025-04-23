"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react"
import portfolioData from "@/services/portfolio-data"
import type { Transaction } from "@/types/portfolio"

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await portfolioData.getTransactions()
        setTransactions(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch transactions", err)
        setError("Failed to load transaction data. Please try again later.")
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
            <CardTitle className="text-lg text-zinc-300">Transaction History</CardTitle>
            <CardDescription>Record of all deposits, withdrawals, and transfers</CardDescription>
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
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Description</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-3 px-4 text-sm text-zinc-300">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === "deposit" && <ArrowDownLeft className="w-4 h-4 text-green-400" />}
                      {transaction.type === "withdraw" && <ArrowUpRight className="w-4 h-4 text-red-400" />}
                      {transaction.type === "transfer" && <RefreshCw className="w-4 h-4 text-blue-400" />}
                      <span className="text-sm text-zinc-300 capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    <span
                      className={
                        transaction.type === "deposit"
                          ? "text-green-400"
                          : transaction.type === "withdraw"
                            ? "text-red-400"
                            : "text-blue-400"
                      }
                    >
                      {transaction.type === "deposit" ? "+" : transaction.type === "withdraw" ? "-" : ""}$
                      {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-300">
                    {transaction.description}
                    {transaction.strategy && <span className="text-zinc-500"> • {transaction.strategy}</span>}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`
                        ${transaction.status === "completed" ? "border-green-500 text-green-400 bg-green-900/20" : "border-yellow-500 text-yellow-400 bg-yellow-900/20"}
                      `}
                    >
                      {transaction.status === "completed" ? "Completed" : "Pending"}
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
          Showing {transactions.length} of {transactions.length} transactions
        </div>
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
          View All
        </Button>
      </CardFooter>
    </Card>
  )
}
