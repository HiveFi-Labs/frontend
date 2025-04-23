'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  MessageSquare,
  Lightbulb,
  Code,
  BarChart4,
  RefreshCw,
  ArrowRight,
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import StrategySettingsModal from '@/components/strategy/strategy-settings-modal'
import portfolioData from '@/services/index'
import type { ChatMessage } from '@/types/strategy-development'

export default function AICollaboration() {
  const [activeAgent, setActiveAgent] = useState('strategist')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [conversations, setConversations] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioData.getChatConversations()
        setConversations(data)
      } catch (err) {
        console.error('Failed to fetch chat conversations', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-zinc-800 rounded w-full" />
            <div className="h-[400px] bg-zinc-800/50 rounded" />
            <div className="h-20 bg-zinc-800/50 rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Strategy Development</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800"
              >
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                  Reset Conversation
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                  Change Agent Behavior
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                  Export Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-zinc-400">
            Configure and develop your trading strategy with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Key Strategy Settings */}
          <div className="bg-zinc-900/30 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="trading-pair" className="text-sm text-zinc-400">
                  Trading Pair
                </label>
                <Select defaultValue="btcusdt">
                  <SelectTrigger
                    id="trading-pair"
                    className="bg-zinc-900/50 border-zinc-800 text-zinc-300"
                  >
                    <SelectValue placeholder="Select trading pair" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="btcusdt">BTC/USDT</SelectItem>
                    <SelectItem value="ethusdt">ETH/USDT</SelectItem>
                    <SelectItem value="solusdt">SOL/USDT</SelectItem>
                    <SelectItem value="bnbusdt">BNB/USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="timeframe" className="text-sm text-zinc-400">
                  Timeframe
                </label>
                <Select defaultValue="1h">
                  <SelectTrigger
                    id="timeframe"
                    className="bg-zinc-900/50 border-zinc-800 text-zinc-300"
                  >
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="5m">5 minutes</SelectItem>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="1d">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="strategy-template"
                  className="text-sm text-zinc-400"
                >
                  Strategy Template
                </label>
                <Select defaultValue="trend">
                  <SelectTrigger
                    id="strategy-template"
                    className="bg-zinc-900/50 border-zinc-800 text-zinc-300"
                  >
                    <SelectValue placeholder="Select strategy template" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="trend">Trend Following</SelectItem>
                    <SelectItem value="mean">Mean Reversion</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="custom">Custom Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
                onClick={() => setShowSettingsModal(true)}
              >
                <Sliders className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>

          {/* AI Collaboration */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeAgent === 'strategist' ? 'default' : 'outline'}
              size="sm"
              className={
                activeAgent === 'strategist'
                  ? 'gradient-button'
                  : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800/50'
              }
              onClick={() => setActiveAgent('strategist')}
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Strategist
            </Button>
            <Button
              variant={activeAgent === 'developer' ? 'default' : 'outline'}
              size="sm"
              className={
                activeAgent === 'developer'
                  ? 'gradient-button'
                  : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800/50'
              }
              onClick={() => setActiveAgent('developer')}
            >
              <Code className="w-4 h-4 mr-1" />
              Developer
            </Button>
            <Button
              variant={activeAgent === 'analyst' ? 'default' : 'outline'}
              size="sm"
              className={
                activeAgent === 'analyst'
                  ? 'gradient-button'
                  : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800/50'
              }
              onClick={() => setActiveAgent('analyst')}
            >
              <BarChart4 className="w-4 h-4 mr-1" />
              Analyst
            </Button>
            <Button
              variant={activeAgent === 'optimizer' ? 'default' : 'outline'}
              size="sm"
              className={
                activeAgent === 'optimizer'
                  ? 'gradient-button'
                  : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800/50'
              }
              onClick={() => setActiveAgent('optimizer')}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Optimizer
            </Button>
          </div>

          <div className="h-[400px] overflow-y-auto pr-2 space-y-4 mb-4">
            {conversations.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.agent === 'user' ? 'justify-end' : ''}`}
              >
                {message.agent !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                    {message.agent === 'strategist' && (
                      <Lightbulb className="w-4 h-4 text-white" />
                    )}
                    {message.agent === 'developer' && (
                      <Code className="w-4 h-4 text-white" />
                    )}
                    {message.agent === 'analyst' && (
                      <BarChart4 className="w-4 h-4 text-white" />
                    )}
                    {message.agent === 'optimizer' && (
                      <RefreshCw className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
                <div
                  className={`glass-card p-3 rounded-xl max-w-[85%] ${message.agent === 'user' ? 'bg-purple-900/30' : 'bg-zinc-900/30'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold capitalize">
                      {message.agent === 'user' ? 'You' : message.agent}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{message.message}</p>

                  {message.attachment &&
                    message.attachment.type === 'chart' && (
                      <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                        <div className="text-sm font-medium mb-2">
                          {message.attachment.data.title}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(message.attachment.data.metrics).map(
                            ([key, value], i) => (
                              <div key={i} className="text-center">
                                <div className="text-xs text-zinc-400 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div
                                  className={`text-sm font-medium ${value.startsWith('+') ? 'text-green-400' : value.startsWith('-') ? 'text-red-400' : 'text-zinc-300'}`}
                                >
                                  {value}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {message.attachment && message.attachment.type === 'code' && (
                    <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg overflow-x-auto">
                      <pre className="text-xs text-zinc-300 font-mono">
                        <code>{message.attachment.data}</code>
                      </pre>
                    </div>
                  )}
                </div>
                {message.agent === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <textarea
                placeholder={`Message the ${activeAgent} agent...`}
                className="w-full min-h-[80px] max-h-[200px] bg-transparent py-3 px-4 text-zinc-300 focus:outline-none resize-none"
                rows={3}
              />
              <div className="absolute bottom-2 right-2">
                <Button className="h-8 w-8 rounded-full gradient-button p-0 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Settings Modal */}
      {showSettingsModal && (
        <StrategySettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </>
  )
}
