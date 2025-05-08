'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Settings,
  MessageSquare,
  Lightbulb,
  Code,
  BarChart4,
  RefreshCw,
  ArrowRight,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useChat from '@/hooks/useChat'
import { useStrategyStore } from '@/stores/strategyStore'
import ReactMarkdown from 'react-markdown'

interface AICollaborationProps {
  sessionId: string | null,
  postChat: (message: string) => void,
  isPending: boolean,
  error: Error | null,
  cancelRequest: () => void,
}

export default function AICollaboration({ sessionId, postChat, isPending, error, cancelRequest }: AICollaborationProps) {
  const [activeAgent] = useState('strategist')
  const [inputMessage, setInputMessage] = useState('')
  const [tradingPair, setTradingPair] = useState('solusdc')
  const [timeframe, setTimeframe] = useState('1h')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2025-01-01')

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const conversations = useStrategyStore((state) => state.messages)
  const hasConversations = conversations.length > 0

  const resetSessionState = useStrategyStore((state) => state.resetSessionState)

  // const { postChat, isPending, error, cancelRequest } = useChat({
  //   sessionId: sessionId || '',
  // })

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [conversations])

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isPending) return

    const messageToSend = inputMessage
    postChat(messageToSend)
    setInputMessage('')
  }

  const handleResetConversation = () => {
    console.log('Resetting session:', sessionId)
    resetSessionState()
  }

  const handleCancelRequest = () => {
    cancelRequest()
  }

  const tradingPairDisplay: Record<string, string> = {
    btcusdt: 'BTC-PERP',
    ethusdt: 'ETH-PERP',
    solusdc: 'SOL-PERP',
    bnbusdt: 'BNB-PERP',
  }

  const timeframeDisplay: Record<string, string> = {
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
  }

  return (
    <Card
      className={`glass-card overflow-hidden flex flex-col mt-2 flex-1 min-h-0 ${!hasConversations ? 'flex justify-center ' : ''}`}
    >
      {/* Status Bar */}
      <div
        className={`bg-zinc-800/80 border-zinc-700 py-2 px-4 flex items-center justify-between ${hasConversations ? 'border-b' : ''}`}
      >
        <div className="flex items-center text-xs">
          <div className="flex items-center relative group">
            <Select value={tradingPair} onValueChange={setTradingPair} disabled={true}>
              <SelectTrigger className="bg-transparent border-0 text-zinc-500 h-6 p-0 min-w-20 w-auto text-xs font-medium cursor-not-allowed opacity-50">
                <SelectValue>{tradingPairDisplay[tradingPair]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="btcusdt">BTC/USDT</SelectItem>
                <SelectItem value="ethusdt">ETH/USDT</SelectItem>
                <SelectItem value="solusdc">SOL/USDC</SelectItem>
                <SelectItem value="bnbusdt">BNB/USDT</SelectItem>
              </SelectContent>
            </Select>
            <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 top-8 left-0 shadow-lg z-10">
              Coming soon
            </div>
            <span className="text-zinc-500 mx-2">|</span>
          </div>

          <div className="flex items-center relative group">
            <Select value={timeframe} onValueChange={setTimeframe} disabled={true}>
              <SelectTrigger className="bg-transparent border-0 text-zinc-500 h-6 p-0 min-w-8 w-auto text-xs font-medium cursor-not-allowed opacity-50">
                <SelectValue>{timeframeDisplay[timeframe]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
                <SelectItem value="1d">1d</SelectItem>
              </SelectContent>
            </Select>
            <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 top-8 left-0 shadow-lg z-10">
              Coming soon
            </div>
            <span className="text-zinc-500 mx-2">|</span>
          </div>

          <div className="flex items-center relative group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-zinc-500 border-0 p-0 w-auto text-xs font-medium cursor-not-allowed opacity-50"
              disabled={true}
            />
            <span className="text-zinc-500 mx-2">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-zinc-500 border-0 p-0 w-auto text-xs font-medium cursor-not-allowed opacity-50"
              disabled={true}
            />
            <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 top-8 left-0 shadow-lg z-10">
              Coming soon
            </div>
          </div>
        </div>

        {/* 設定ボタン */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-300 hover:text-purple-300 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-700 border-zinc-600"
            >
              <DropdownMenuLabel className="text-xs">
                Chat Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-600" />
              <DropdownMenuItem
                className="text-xs text-zinc-200 focus:text-white focus:bg-zinc-600 cursor-pointer"
                onClick={handleResetConversation}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2 text-zinc-300" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent
        className={`p-0 bg-zinc-900 flex flex-col min-h-0 overflow-hidden ${hasConversations ? 'flex-2 h-[calc(81vh)] min-h-[calc(480px)]' : ''}`}
      >
        <div
          ref={messagesContainerRef}
          className={`${hasConversations ? 'flex-1 min-h-0 overflow-y-auto pr-2 space-y-4' : 'h-0 overflow-hidden'}`}
        >
          {conversations.map((message, index) => (
            <div
              key={`${message.agent}-${message.timestamp}-${index}`}
              className={`flex m-3 gap-3  ${message.agent === 'user' ? 'justify-end' : ''}`}
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
                className={`glass-card p-3 rounded-xl max-w-[85%] ${message.agent === 'user' ? 'bg-purple-800/30' : 'bg-zinc-700/30'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold capitalize mr-2">
                    {message.agent === 'user' ? 'You' : message.agent}
                  </span>
                  <span className="text-xs text-zinc-300">
                    {message.timestamp}
                  </span>
                </div>
                {message.agent === 'user' ? (
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                    {message.message}
                  </p>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                )}

                {message.attachment && message.attachment.type === 'chart' && (
                  <div className="mt-3 p-3 bg-zinc-600/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      {message.attachment.data.title}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(message.attachment.data.metrics).map(
                        ([key, value], i) => (
                          <div key={key} className="text-center">
                            <div className="text-xs text-zinc-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div
                              className={`text-sm font-medium ${(value as string).startsWith('+') ? 'text-green-400' : (value as string).startsWith('-') ? 'text-red-400' : 'text-zinc-300'}`}
                            >
                              {value as React.ReactNode}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {message.attachment && message.attachment.type === 'code' && (
                  <div className="mt-3 p-3 bg-zinc-600/50 rounded-lg overflow-x-auto">
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

          {isPending && (
            <div className="flex gap-3 m-3 ">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card p-3 rounded-xl max-w-[85%] bg-zinc-700/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm p-2 text-center m-3 ">
              Failed to get response: {error.message}
            </div>
          )}
        </div>

        <div className={hasConversations ? 'mt-4' : ''}>
          <div className="relative rounded-b-lg border border-zinc-700 bg-zinc-800/50 overflow-hidden">
            <textarea
              disabled={!sessionId}
              placeholder={
                sessionId
                  ? 'Ask AI to help you create a trading strategy...'
                  : 'Loading...'
              }
              className="w-full min-h-[60px] max-h-[120px] bg-transparent py-3 pl-4 pr-12 text-zinc-300 focus:outline-none resize-none block"
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                  setTimeout(() => setInputMessage(''), 0)
                }
              }}
            />
            <div className="absolute bottom-2 right-2">
              {isPending ? (
                <Button
                  className="h-8 w-8 rounded-full bg-red-400 hover:bg-red-500 p-0 flex items-center justify-center"
                  onClick={handleCancelRequest}
                  aria-label="Cancel request"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                </Button>
              ) : (
                <Button
                  className="h-8 w-8 rounded-full gradient-button p-0 flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  disabled={!inputMessage.trim()}
                  aria-label="Send message"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
            {hasConversations && (
              <p className="text-xs text-zinc-500 mt-1 text-center">
                Currently, as this is an alpha version, only a limited set of strategies can be executed.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
