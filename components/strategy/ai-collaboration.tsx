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
import useChat from '@/hooks/useChat'
import useV1Backtest from '@/hooks/useV1Backtest'
import { useStrategyStore } from '@/stores/strategyStore'
import ReactMarkdown from 'react-markdown'
import { apiV1 } from '@/lib/backtest.api'

interface Props {
  sessionId: string | null
}

export default function AICollaboration({ sessionId }: Props) {
  /* ---------------- state ---------------- */
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
  const {
    postChat,
    isPending: chatPending,
    error: chatErr,
    cancelRequest,
  } = useChat({ sessionId: sessionId || '', apiVersion })

  const { run: runBacktest, error: btError } = useV1Backtest(
    apiVersion === 'v1' ? sessionId : null,
  )

  /* ---------------- effects ---------------- */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [conversations])

  /* ---------------- helpers ---------------- */
  const sendMessage = () => {
    if (!inputMessage.trim() || chatPending) return
    postChat(inputMessage)
    setInputMessage('')
  }

  const sending =
    chatPending ||
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
      className={`glass-card overflow-hidden flex flex-col mt-2 flex-1 min-h-0 ${!hasConversations ? 'justify-center' : ''}`}
    >
      {/* === Top bar === */}
      <div
        className={`bg-zinc-800/80 border-zinc-700 py-2 px-4 flex items-center justify-between ${hasConversations ? 'border-b' : ''}`}
      >
        {/* left side (market conf) */}
        <div className="flex items-center text-xs">
          {/* pair */}
          <Select value={tradingPair} onValueChange={setTradingPair}>
            <SelectTrigger className="bg-transparent border-0 h-6 p-0 min-w-20 text-xs text-zinc-300 hover:text-purple-400">
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
          <span className="mx-2 text-zinc-300">|</span>

          {/* timeframe */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="bg-transparent border-0 h-6 p-0 min-w-8 text-xs text-zinc-200 hover:text-purple-300">
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
          <span className="mx-2 text-zinc-500">|</span>

          {/* date range */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent text-xs w-auto text-zinc-200"
          />
          <span className="mx-2 text-zinc-300">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-xs w-auto text-zinc-200"
          />
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
              Easy Mode (v0)
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`text-xs focus:bg-zinc-600 cursor-pointer ${apiVersion === 'v1' ? 'text-purple-300 font-semibold' : 'text-zinc-200'}`}
              onClick={() => setApiVersion('v1')}
              disabled={apiVersion === 'v1'}
            >
              <Hammer className="h-3.5 w-3.5 mr-2 text-zinc-300" />
              Build Mode (v1)
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-600" />
            <DropdownMenuItem
              className="text-xs text-zinc-200 focus:text-white focus:bg-zinc-600 cursor-pointer"
              onClick={resetSessionState}
              disabled={chatPending}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2 text-zinc-300" />
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* === Body === */}
      <CardContent
        className={`p-0 bg-zinc-900 flex flex-col min-h-0 overflow-hidden ${hasConversations ? 'flex-2 h-[calc(81vh)]' : ''}`}
      >
        {/* messages */}
        <div
          ref={containerRef}
          className={`${hasConversations ? 'flex-1 overflow-y-auto pr-2 space-y-4' : 'h-0'}`}
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
                  <span className="text-sm font-semibold capitalize">
                    {m.agent === 'user' ? 'You' : m.agent}
                  </span>
                  <span className="text-xs text-zinc-300">{m.timestamp}</span>
                </div>
                {m.agent === 'user' ? (
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                    {m.message}
                  </p>
                ) : (
                  <>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{m.message}</ReactMarkdown>
                    </div>

                    {/* ===== Run Back-test (v1 only) ===== */}
                    {apiVersion === 'v1' && (
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
              <div className="glass-card p-3 rounded-xl bg-zinc-700/30">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}

          {(chatErr || btError) && (
            <div className="text-red-500 text-sm text-center m-3">
              Failed to get response: {(chatErr || btError)?.message}
            </div>
          )}
        </div>

        {/* input */}
        <div className={hasConversations ? 'mt-4' : ''}>
          <div className="relative rounded-b-lg border border-zinc-700 bg-zinc-800/50">
            <textarea
              disabled={!sessionId}
              placeholder={
                sessionId
                  ? 'Ask AI to help you create a trading strategy...'
                  : 'Loading...'
              }
              className="w-full min-h-[60px] max-h-[120px] bg-transparent py-3 pl-4 pr-12 text-zinc-300 resize-none focus:outline-none"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.nativeEvent.isComposing &&
                  !e.shiftKey
                ) {
                  e.preventDefault()
                }
              }}
            />
            <div className="absolute bottom-2 right-2">
              {chatPending ? (
                <Button
                  onClick={cancelRequest}
                  className="h-8 w-8 rounded-full bg-red-400 hover:bg-red-500 p-0"
                >
                  <span className="text-white text-xs font-bold">✕</span>
                </Button>
              ) : (
                <Button
                  disabled={!inputMessage.trim()}
                  onClick={sendMessage}
                  className="h-8 w-8 rounded-full gradient-button p-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
