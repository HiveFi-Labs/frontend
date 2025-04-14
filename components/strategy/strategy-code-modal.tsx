'use client'

import { useState, useEffect } from 'react'
import { X, Settings, Save, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import portfolioData from '@/services/index'

export default function StrategyCode({ onClose }) {
  const [activeTab, setActiveTab] = useState('strategy')
  const [strategyCode, setStrategyCode] = useState('')
  const [indicatorsCode, setIndicatorsCode] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getStrategyCode()
        setStrategyCode(data.main)
        setIndicatorsCode(data.indicators)
      } catch (err) {
        console.error('Failed to fetch strategy code', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCodeChange = (e, type) => {
    if (type === 'strategy') {
      setStrategyCode(e.target.value)
    } else {
      setIndicatorsCode(e.target.value)
    }
    setHasChanges(true)
  }

  const handleSave = () => {
    // Here you would typically save the code to your backend
    setHasChanges(false)
    // Show a success message or notification
    alert('Code changes saved successfully!')
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    // Show a success message or notification
    alert('Code copied to clipboard!')
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-pulse">
          <div className="p-4 border-b border-zinc-800">
            <div className="h-6 bg-zinc-800 rounded w-1/4"></div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="h-[500px] bg-zinc-800/50 rounded"></div>
          </div>
          <div className="p-4 border-t border-zinc-800">
            <div className="h-10 bg-zinc-800 rounded w-1/6 ml-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white">
              Strategy Code Editor
            </h3>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="ml-4"
            >
              <TabsList className="bg-zinc-800">
                <TabsTrigger
                  value="strategy"
                  className="data-[state=active]:bg-zinc-700"
                >
                  TrendFollowingStrategy.js
                </TabsTrigger>
                <TabsTrigger
                  value="indicators"
                  className="data-[state=active]:bg-zinc-700"
                >
                  indicators.js
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800"
              >
                <DropdownMenuLabel>Code Options</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                  onClick={() =>
                    handleCopy(
                      activeTab === 'strategy' ? strategyCode : indicatorsCode,
                    )
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                  <Download className="h-4 w-4 mr-2" />
                  Download Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} className="w-full h-full">
            <TabsContent value="strategy" className="mt-0 h-full">
              <div className="bg-zinc-950 rounded-lg p-4 h-full overflow-auto">
                <textarea
                  className="w-full h-[500px] bg-transparent text-sm text-zinc-300 font-mono resize-none focus:outline-none"
                  value={strategyCode}
                  onChange={(e) => handleCodeChange(e, 'strategy')}
                  spellCheck="false"
                ></textarea>
              </div>
            </TabsContent>
            <TabsContent value="indicators" className="mt-0 h-full">
              <div className="bg-zinc-950 rounded-lg p-4 h-full overflow-auto">
                <textarea
                  className="w-full h-[500px] bg-transparent text-sm text-zinc-300 font-mono resize-none focus:outline-none"
                  value={indicatorsCode}
                  onChange={(e) => handleCodeChange(e, 'indicators')}
                  spellCheck="false"
                ></textarea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="p-4 border-t border-zinc-800 flex justify-between">
          <div>
            {hasChanges && (
              <span className="text-yellow-400 text-sm">
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="gradient-button"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
