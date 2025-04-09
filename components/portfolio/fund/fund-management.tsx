"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react"

import FundOverview from "./fund-overview"
import TransactionHistory from "./transaction-history"
import RebalanceHistory from "./rebalance-history"
import FundSettings from "./fund-settings"
import DepositModal from "./modals/deposit-modal"
import WithdrawModal from "./modals/withdraw-modal"
import TransferModal from "./modals/transfer-modal"

export default function FundManagement() {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

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
          <Button className="gradient-button" onClick={() => setShowTransferModal(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Transfer
          </Button>
        </div>
      </div>

      {/* Fund Overview */}
      <FundOverview />

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
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="rebalance" className="mt-0">
          <RebalanceHistory />
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <FundSettings />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showDepositModal && <DepositModal onClose={() => setShowDepositModal(false)} />}
      {showWithdrawModal && <WithdrawModal onClose={() => setShowWithdrawModal(false)} />}
      {showTransferModal && <TransferModal onClose={() => setShowTransferModal(false)} />}
    </div>
  )
}
