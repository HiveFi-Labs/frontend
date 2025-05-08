'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import portfolioData from '@/services/index'

export default function StrategyCode() {
  const [strategyCode, setStrategyCode] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getStrategyCode()
        setStrategyCode(data.main)
      } catch (err) {
        console.error('Failed to fetch strategy code', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStrategyCode(e.target.value)
    setHasChanges(true)
  }

  const handleSave = () => {
    // Here you would typically save the code to your backend
    setHasChanges(false)
    // Show a success message or notification
    alert('Code changes saved successfully!')
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    // Show a success message or notification
    alert('Code copied to clipboard!')
  }

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="w-full animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4"></div>
          <div className="h-[500px] bg-zinc-800/50 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-xl h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-zinc-800/50 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-zinc-300">
            Strategy Code Editor
          </h2>
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
                  onClick={() => handleCopy(strategyCode)}
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
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col p-4 space-y-4">
        <div className="flex-grow bg-zinc-950 rounded-lg h-full">
          <textarea
            className="w-full h-full bg-transparent text-sm text-zinc-300 font-mono resize-none focus:outline-none p-4"
            value={strategyCode}
            onChange={handleCodeChange}
            spellCheck="false"
          ></textarea>
        </div>

        <div className="flex justify-between items-center flex-shrink-0">
          <div>
            {hasChanges && (
              <span className="text-yellow-400 text-sm">
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-purple-700 hover:bg-purple-600 text-white button-sm"
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
