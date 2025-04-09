"use client"

import { useState } from "react"
import { Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import AICollaboration from "@/components/strategy/ai-collaboration"
import BacktestingResults from "@/components/strategy/backtesting-results"

export default function StrategyPage() {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Strategy Development & Backtesting</h1>
            <p className="text-zinc-400 mt-2">Create, test, and optimize your trading strategies with AI assistance</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 backdrop-blur-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button className="gradient-button text-white border-0 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Strategy
            </Button>
          </div>
        </div>

        {/* AI Collaboration with integrated Strategy Settings */}
        <div className="mb-6">
          <AICollaboration />
        </div>

        {/* Backtesting Results - Full width */}
        <div>
          <BacktestingResults showCode={showCode} setShowCode={setShowCode} />
        </div>
      </div>
    </div>
  )
}
