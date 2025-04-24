'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Upload, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AICollaboration from '@/components/strategy/ai-collaboration'
import BacktestingResults from '@/components/strategy/backtesting-results'
import { useStrategyStore } from '@/stores/strategyStore'

export default function StrategyPage() {
  const sessionId = useStrategyStore((state) => state.sessionId)
  const setSessionId = useStrategyStore((state) => state.setSessionId)

  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4())
    }
  }, [sessionId, setSessionId])

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Strategy Development & Backtesting
            </h1>
            <p className="text-zinc-400 mt-2">
              Create, test, and optimize your trading strategies with AI
              assistance
            </p>
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

        {/* Split layout: Left side for results, right side for AI chat */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">
          {/* Left side - Backtesting Results */}
          <div className="lg:w-3/5 overflow-auto">
            <BacktestingResults showCode={showCode} setShowCode={setShowCode} />
          </div>

          {/* Right side - AI Collaboration */}
          <div className="lg:w-2/5 overflow-hidden flex flex-col">
            {sessionId ? (
              <AICollaboration sessionId={sessionId} />
            ) : (
              <div className="flex justify-center items-center h-full">
                Generating session...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
