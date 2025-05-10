'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useQuery } from '@tanstack/react-query'
import { Upload, Save, Loader2, LockIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AICollaboration from '@/components/strategy/ai-collaboration'
import BacktestingResults from '@/components/strategy/backtesting-results'
import { useStrategyStore } from '@/stores/strategyStore'
import {
  apiV0, // ← 成果の取得はまだ v0 のみ
  type PlotlyDataObject,
} from '@/lib/backtest.api'
import { apiV1 } from '@/lib/backtest.api'
import { user_whitelist } from '@/data/user_whitelist'
import { usePrivy } from '@privy-io/react-auth'
import useChat from '@/hooks/useChat'

const whitelistPosition = parseInt(
  process.env.NEXT_PUBLIC_WHITELIST_POSITION || '0',
  10,
)
const disableComingSoon = process.env.NEXT_PUBLIC_DISABLE_COMING_SOON === 'true'

export default function StrategyPage() {
  const { authenticated, login, user } = usePrivy()
  const sessionId = useStrategyStore((state) => state.sessionId)
  const setSessionId = useStrategyStore((state) => state.setSessionId)
  const apiVersion = useStrategyStore((s) => s.apiVersion)
  const setApiVersion = useStrategyStore((s) => s.setApiVersion)
  const backtestResults = useStrategyStore((state) => state.backtestResults)
  const backtestResultsJson = useStrategyStore(
    (state) => state.backtestResultsJson,
  )
  const setBacktestResultsJson = useStrategyStore(
    (s) => s.setBacktestResultsJson,
  )
  const conversations = useStrategyStore((s) => s.messages)
  const hasConversations = conversations.length > 0

  /* ---- split ---- */
  const [splitRatio, setSplitRatio] = useState(50)
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [position, setPosition] = useState<number>(user_whitelist.length + 1)

  const { postChat, isPending, error, cancelRequest } = useChat({
    sessionId: sessionId || '',
    apiVersion: apiVersion,
  })

  useEffect(() => {
    const initializeSession = async () => {
      console.log('initializeSession', apiVersion, sessionId)
      if (apiVersion === 'v1') {
        try {
          const randomUserId = `user_${Math.random().toString(36).substring(2, 9)}`
          const response = await apiV1.createSession(randomUserId)
          if (response && response.session_id) {
            setSessionId(response.session_id)
          }
        } catch (error) {
          console.error('Failed to create v1 session:', error)
        }
      } else {
        // v0の場合はUUIDを使用
        setSessionId(uuidv4())
      }
    }
    if (!sessionId) initializeSession()
  }, [authenticated, apiVersion, sessionId, setSessionId])

  useEffect(() => {
    if (!authenticated && !loginAttempted) {
      setLoginAttempted(true)
    }
  }, [authenticated, loginAttempted])

  useEffect(() => {
    if (loginAttempted && !authenticated) {
      login()
    }
  }, [loginAttempted, authenticated])

  /* ---- back-test JSON (v0 only for now) ---- */
  const shouldFetchV0 = apiVersion === 'v0' && conversations.length > 0
  const { data: fetchedJson, isSuccess } = useQuery<PlotlyDataObject, Error>({
    queryKey: ['backtestResultsJson', sessionId],
    queryFn: () => {
      if (!sessionId) throw new Error('Session ID is required')
      return apiV0.getBacktestResults(sessionId)
    },
    enabled:
      shouldFetchV0 && !!sessionId && !!backtestResults && !backtestResultsJson,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSuccess && fetchedJson && !backtestResultsJson) {
      setBacktestResultsJson(fetchedJson)
    }
  }, [isSuccess, fetchedJson, backtestResultsJson, setBacktestResultsJson])

  /* ---- split auto adjust ---- */
  useEffect(() => {
    setSplitRatio(backtestResults || backtestResultsJson ? 50 : 100)
  }, [backtestResults, backtestResultsJson])

  /* ---- resize handler ---- */
  const handleResize = (e: MouseEvent) => {
    const container = document.querySelector('.split-container')
    if (!container) return
    const { left, width } = container.getBoundingClientRect()
    const ratio = Math.min(Math.max(((e.clientX - left) / width) * 100, 20), 80)
    setSplitRatio(ratio)
  }

  const showSplit = !!backtestResults || !!backtestResultsJson

  const checkUserId = (userId: string) => {
    const user = user_whitelist.find((user) => user.id === userId)
    return user ? user.index : user_whitelist.length + 1
  }

  useEffect(() => {
    if (user?.id) {
      const userPosition = checkUserId(user.id)
      setPosition(userPosition)
      if (disableComingSoon) {
        setShowComingSoon(false)
      } else {
        const currentUser = user_whitelist.find((u) => u.id === user.id)
        const isWhitelisted =
          currentUser &&
          currentUser.index !== undefined &&
          currentUser.index <= whitelistPosition
        setShowComingSoon(!isWhitelisted)
      }
    }
  }, [user])

  const handleSamplePrompt = (version: string) => {
    if (version === 'v0') {
      setApiVersion('v0')
      postChat(
        'Create an ATR breakout strategy for moderately volatile markets.',
      )
    } else {
      setApiVersion('v1')
      postChat(
        'Create an ATR breakout strategy for moderately volatile markets.',
      )
    }
  }

  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-10 flex items-center justify-center">
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-zinc-800/50 backdrop-blur-md max-w-lg mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Coming Soon
          </h2>
          <p className="text-zinc-300 mb-6">
            Features will be gradually unlocked for whitelisted users. Please
            wait patiently as we work to provide access.
          </p>
          <p className="text-zinc-300 ">
            {position > user_whitelist.length
              ? `You are beyond position ${position} in the whitelist.`
              : `You are number ${position} in the whitelist.`}
          </p>
          <p className="text-zinc-300 mb-6">
            Currently, up to position {whitelistPosition} is open.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="gradient-button text-white border-0 px-4 py-2 rounded-full"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-full">
        <div
          className={`flex flex-row gap-0 h-[calc(90vh)] min-h-[500px] overflow-hidden relative split-container ${!showSplit ? 'justify-center' : ''}`}
        >
          {/* -------- Left (chat) -------- */}
          <div
            className={`overflow-hidden flex flex-col flex-1 min-h-0 ${!hasConversations ? 'pb-20' : ''} ${!showSplit ? 'max-w-3xl self-center' : ''}`}
            style={{ width: showSplit ? `${splitRatio}%` : '100%' }}
          >
            {!hasConversations && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Let's begin.</h2>
                <p className="text-zinc-400">
                  Currently, as this is an alpha version, only a limited set of
                  strategies can be executed.
                </p>
              </div>
            )}

            {/* -------- Splitter -------- */}

            <AICollaboration
              sessionId={sessionId}
              postChat={postChat}
              isPending={isPending}
              error={error}
              cancelRequest={cancelRequest}
            />

            {!hasConversations && (
              <div className="mt-2 ml-1">
                <Button
                  className="px-4 py-0 h-8 rounded-full bg-black border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 button-sm"
                  onClick={() => handleSamplePrompt('v0')}
                  aria-label="Use Sample Prompt"
                  disabled={!sessionId}
                >
                  Create an ATR breakout strategy for moderately volatile
                  markets. <ArrowUpIcon className="inline-block ml-0 text-xs" />
                </Button>
              </div>
            )}
          </div>
          {/* リサイズハンドラー - showSplitLayoutがtrueの時のみ表示 */}
          {showSplit && (
            <div
              className="w-1 cursor-col-resize"
              onMouseDown={(e) => {
                e.preventDefault()
                const move = (ev: MouseEvent) => handleResize(ev)
                const up = () => {
                  document.removeEventListener('mousemove', move)
                  document.removeEventListener('mouseup', up)
                }
                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', up)
              }}
            />
          )}

          {/* -------- Right (results) -------- */}
          {showSplit && (
            <div
              className="overflow-hidden flex flex-col"
              style={{ width: `${100 - splitRatio}%` }}
            >
              <BacktestingResults />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
