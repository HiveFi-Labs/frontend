"use client"

import { useState, lazy, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingState } from "@/components/ui/loading-state"

// 遅延ロードでコンポーネントをインポート
const PortfolioOverview = lazy(() => import("@/components/portfolio/portfolio-overview"))
const ActiveStrategies = lazy(() => import("@/components/portfolio/active-strategies"))
const RiskManagement = lazy(() => import("@/components/portfolio/risk-management"))
const FundManagement = lazy(() => import("@/components/portfolio/fund/fund-management"))
const AlertSettings = lazy(() => import("@/components/portfolio/alert-settings"))

// タブの型定義
type PortfolioTab = "overview" | "strategies" | "risk" | "funds" | "alerts"

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>("overview")

  // タブが変更されたときのハンドラー
  const handleTabChange = (value: string) => {
    setActiveTab(value as PortfolioTab)
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">My Portfolio</h1>
            <p className="text-zinc-400 mt-2">Manage your active strategies and monitor your portfolio performance</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 mb-6 w-full flex justify-start overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="strategies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Active Strategies
            </TabsTrigger>
            <TabsTrigger
              value="risk"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Risk Management
            </TabsTrigger>
            <TabsTrigger
              value="funds"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Fund Management
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Alert Settings
            </TabsTrigger>
          </TabsList>

          {/* Suspenseを使用して各タブコンテンツをラップし、ローディング状態を表示 */}
          <TabsContent value="overview" className="mt-0">
            <Suspense fallback={<LoadingState text="Loading portfolio overview..." />}>
              {activeTab === "overview" && <PortfolioOverview />}
            </Suspense>
          </TabsContent>

          <TabsContent value="strategies" className="mt-0">
            <Suspense fallback={<LoadingState text="Loading active strategies..." />}>
              {activeTab === "strategies" && <ActiveStrategies />}
            </Suspense>
          </TabsContent>

          <TabsContent value="risk" className="mt-0">
            <Suspense fallback={<LoadingState text="Loading risk management..." />}>
              {activeTab === "risk" && <RiskManagement />}
            </Suspense>
          </TabsContent>

          <TabsContent value="funds" className="mt-0">
            <Suspense fallback={<LoadingState text="Loading fund management..." />}>
              {activeTab === "funds" && <FundManagement />}
            </Suspense>
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <Suspense fallback={<LoadingState text="Loading alert settings..." />}>
              {activeTab === "alerts" && <AlertSettings />}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
