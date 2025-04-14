'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PortfolioOverview from '@/components/portfolio/portfolio-overview'
import ActiveStrategies from '@/components/portfolio/active-strategies'
import RiskManagement from '@/components/portfolio/risk-management'
import FundManagement from '@/components/portfolio/fund/fund-management'
import AlertSettings from '@/components/portfolio/alert-settings'

// タブの型定義
type PortfolioTab = 'overview' | 'strategies' | 'risk' | 'funds' | 'alerts'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('overview')

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">My Portfolio</h1>
            <p className="text-zinc-400 mt-2">
              Manage your active strategies and monitor your portfolio
              performance
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as PortfolioTab)}
          className="w-full"
        >
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

          <TabsContent value="overview" className="mt-0">
            <PortfolioOverview />
          </TabsContent>

          <TabsContent value="strategies" className="mt-0">
            <ActiveStrategies />
          </TabsContent>

          <TabsContent value="risk" className="mt-0">
            <RiskManagement />
          </TabsContent>

          <TabsContent value="funds" className="mt-0">
            <FundManagement />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <AlertSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
