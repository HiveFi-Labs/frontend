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
  Play,
  Zap,
  Hammer,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useV1Backtest from '@/hooks/useV1Backtest'
import useV0Backtest from '@/hooks/useV0Backtest'
import { useStrategyStore } from '@/stores/strategyStore'
import ReactMarkdown from 'react-markdown'
import ChatInput from './chatInput'
interface AICollaborationProps {
  sessionId: string | null
  postChat: (message: string) => void
  isPending: boolean
  error: Error | null
  cancelRequest: () => void
}

// 環境変数からAPI V1が利用可能かどうかを確認
const isApiV1Enabled = process.env.NEXT_PUBLIC_ENABLE_API_V1 === 'true'

// ステータスバーを表示・非表示にする
const enableMarketControls =
  process.env.NEXT_PUBLIC_ENABLE_MARKET_CONTROLS === 'true'

export default function AICollaboration({
  sessionId,
  postChat,
  isPending,
  error,
  cancelRequest,
}: AICollaborationProps) {
  const apiVersion = useStrategyStore((s) => s.apiVersion)
  const setApiVersion = useStrategyStore((s) => s.setApiVersion)
  const [inputMessage, setInputMessage] = useState('')
  const [tradingPair, setTradingPair] = useState('solusdc')
  const [timeframe, setTimeframe] = useState('1h')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2025-01-01')

  /* ---------------- store ---------------- */
  const conversations = useStrategyStore((s) => s.messages)
  const resetSessionState = useStrategyStore((s) => s.resetSessionState)
  const backtestStatus = useStrategyStore((s) => s.backtestStatus)
  const hasConversations = conversations.length > 0

  /* ---------------- refs ---------------- */
  const containerRef = useRef<HTMLDivElement>(null)

  /* ---------------- hooks ---------------- */

  const { run: runBacktest, error: btError } = useV1Backtest(
    apiVersion === 'v1' ? sessionId : null,
  )
  const { startBacktest, error: v0BtError } = useV0Backtest(
    apiVersion === 'v0' ? sessionId : null,
  )
  const currentParams = useStrategyStore((state) => state.currentParams)

  const [isBacktestButtonDisabled, setIsBacktestButtonDisabled] =
    useState(false)

  /* ---------------- effects ---------------- */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [conversations])

  /* ---------------- helpers ---------------- */
  const sendMessage = () => {
    if (!inputMessage.trim() || isPending) return
    postChat(inputMessage)
    setInputMessage('')
    setIsBacktestButtonDisabled(false)
  }

  const sending =
    isPending ||
    backtestStatus === 'prompt' ||
    backtestStatus === 'code' ||
    backtestStatus === 'backtest'
  const statusLabel: Record<string, string> = {
    idle: '',
    prompt: 'Generating prompt…',
    code: 'Generating code…',
    backtest: 'Running back-test…',
    completed: 'Done!',
  }

  const StatusIcon = () => {
    switch (backtestStatus) {
      case 'prompt':
        return <Lightbulb className="w-4 h-4 text-yellow-300 animate-pulse" />
      case 'code':
        return <Code className="w-4 h-4 text-blue-300 animate-pulse" />
      case 'backtest':
        return <BarChart4 className="w-4 h-4 text-green-300 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const handleRunBacktest = () => {
    startBacktest()
    postChat('Run backtest')
    setIsBacktestButtonDisabled(true)
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

  /* =========================================================================
   *  JSX
   * ========================================================================= */
  return (
    <Card
      className={`glass-card overflow-hidden flex flex-col flex-1 min-h-0 ${!hasConversations ? 'justify-center' : ''}`}
    >
      {/* === Top bar === */}
      <div
        className={`bg-zinc-800/80 border-zinc-700 py-2 px-4 flex items-start justify-between ${hasConversations ? 'border-b' : ''}`}
      >
        {/* left side (market conf) */}
        <div className="flex flex-col md:flex-row md:items-center text-xs">
          <div className="flex items-center">
            {/* pair */}
            <div className="flex items-center relative group">
              <Select
                value={tradingPair}
                onValueChange={setTradingPair}
              disabled={!enableMarketControls}
            >
              <SelectTrigger
                className={`bg-transparent border-0 text-zinc-500 h-6 p-0 min-w-20 w-auto text-xs font-medium ${!enableMarketControls ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <SelectValue>{tradingPairDisplay[tradingPair]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {Object.entries(tradingPairDisplay).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!enableMarketControls && (
              <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 top-8 left-0 shadow-lg z-10">
                Coming soon
              </div>
              )}
            <span className="text-zinc-500 mx-2">|</span>
            {/* timeframe */}
            <div className="flex items-center relative group">
              <Select
                value={timeframe}
                onValueChange={setTimeframe}
                disabled={!enableMarketControls}
              >
              <SelectTrigger
                className={`bg-transparent border-0 text-zinc-500 h-6 p-0 min-w-20 w-auto text-xs font-medium ${!enableMarketControls ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <SelectValue>{timeframeDisplay[timeframe]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {Object.entries(timeframeDisplay).map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!enableMarketControls && (
              <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 top-8 left-0 shadow-lg z-10">
                Coming soon
              </div>
              )}
          </div>
          <div className="flex items-center relative group mt-1 md:mt-0 md:ml-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`bg-transparent text-zinc-500 border-0 p-0 w-auto text-xs font-medium ${!enableMarketControls ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!enableMarketControls}
            />
            <span className="text-zinc-500 mx-2">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`bg-transparent text-zinc-500 border-0 p-0 w-auto text-xs font-medium ${!enableMarketControls ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!enableMarketControls}
            />
            {!enableMarketControls && (
              <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 top-8 left-0 shadow-lg z-10">
                Coming soon
              </div>
              )}
          </div>
        </div>

        {/* settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-300"
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
              className={`text-xs focus:bg-zinc-600 cursor-pointer ${apiVersion === 'v0' ? 'text-purple-300 font-semibold' : 'text-zinc-200'}`}
              onClick={() => setApiVersion('v0')}
              disabled={apiVersion === 'v0'}
            >
              <Zap className="h-3.5 w-3.5 mr-2 text-zinc-300" />
              Easy Mode
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`text-xs focus:bg-zinc-600 cursor-pointer ${apiVersion === 'v1' ? 'text-purple-300 font-semibold' : 'text-zinc-200'}`}
              onClick={() => setApiVersion('v1')}
              disabled={apiVersion === 'v1' || !isApiV1Enabled}
            >
              <Hammer className="h-3.5 w-3.5 mr-2 text-zinc-300" />
              Build Mode
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-600" />
            <DropdownMenuItem
              className="text-xs text-zinc-200 focus:text-white focus:bg-zinc-600 cursor-pointer"
              onClick={resetSessionState}
              disabled={isPending}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2 text-zinc-300" />
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* === Body === */}
      <CardContent
        className={`p-0 bg-zinc-900 flex flex-col min-h-0 overflow-hidden ${hasConversations ? 'flex-2 ' : ''}`}
        style={{
          height: hasConversations ? 'calc(100vh - 123px)' : '100%',
        }}
      >
        {/* messages */}
        <div
          ref={containerRef}
          className={`${hasConversations ? 'flex-1 overflow-y-auto pr-2 flex-2 space-y-4 ' : 'h-0'}`}
        >
          {conversations.map((m, i) => (
            <div
              key={i}
              className={`flex m-3 gap-3 ${m.agent === 'user' ? 'justify-end' : ''}`}
            >
              {m.agent !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                  {m.agent === 'strategist' && (
                    <Lightbulb className="w-4 h-4 text-white" />
                  )}
                  {m.agent === 'developer' && (
                    <Code className="w-4 h-4 text-white" />
                  )}
                  {m.agent === 'analyst' && (
                    <BarChart4 className="w-4 h-4 text-white" />
                  )}
                  {m.agent === 'optimizer' && (
                    <RefreshCw className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              <div
                className={`glass-card p-3 rounded-xl max-w-[85%] ${m.agent === 'user' ? 'bg-purple-800/30' : 'bg-zinc-700/30'}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold capitalize mr-2">
                    {m.agent === 'user' ? 'You' : m.agent}
                  </span>
                  <span className="text-xs text-zinc-300 flex-shrink-0 ml-auto">
                    {m.timestamp}
                  </span>
                </div>
                {m.agent === 'user' ? (
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                    {m.message}
                  </p>
                ) : (
                  <>
                    <div className="prose prose-sm prose-invert max-w-none markdown-content">
                      <ReactMarkdown>{m.message}</ReactMarkdown>
                    </div>

                    {m.attachment && m.attachment.type === 'code' && (
                      <div className="mt-3 p-3 bg-zinc-600/50 rounded-lg overflow-x-auto">
                        <pre className="text-sm text-zinc-300 font-mono">
                          <code>{m.attachment.data}</code>
                        </pre>
                      </div>
                    )}

                    {/* ===== Run Back-test (v1 only) ===== */}
                    {i === conversations.length - 1 && apiVersion === 'v1' && (
                      <div className="border-t border-zinc-700 p-2 flex justify-end">
                        <Button
                          disabled={sending || conversations.length === 0}
                          onClick={runBacktest}
                          className="gradient-button flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Run Backtest
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {i === conversations.length - 1 &&
                  m.agent !== 'user' &&
                  currentParams &&
                  apiVersion === 'v0' && (
                    <div className="border-t border-zinc-700 p-2 flex justify-end">
                      <Button
                        disabled={
                          conversations.length === 0 || isBacktestButtonDisabled
                        }
                        onClick={handleRunBacktest}
                        className="gradient-button flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Run Backtest
                      </Button>
                    </div>
                  )}
              </div>
              {m.agent === 'user' && (
                <div className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* loading bubbles */}
          {sending && (
            <div className="flex gap-3 m-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card p-3 rounded-xl bg-zinc-700/30 w-auto">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-blue-200">
                    <StatusIcon />
                    <span>{statusLabel[backtestStatus]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(error || btError || v0BtError) && (
            <div className="text-red-500 text-sm text-center m-3">
              Failed to get response: {(error || btError || v0BtError)?.message}
            </div>
          )}
        </div>

        {/* input */}
        <div className={hasConversations ? 'mt-4' : ''}>
          <ChatInput
            disabled={!sessionId}
            sending={isPending}
            onCancel={cancelRequest}
            onSend={(msg) => {
              postChat(msg)
              setIsBacktestButtonDisabled(false)
            }}
            hasConversations={hasConversations}
          />
        </div>
      </CardContent>
    </Card>
  )
}
