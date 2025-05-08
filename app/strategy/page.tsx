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
  getBacktestResults,
  type BacktestResultsJsonResponse,
  type PlotlyDataObject,
} from '@/lib/backtest.api'
import { usePrivy } from '@privy-io/react-auth'
import { user_whitelist } from '@/data/user_whitelist'
import useChat from '@/hooks/useChat'

const whitelistPosition = parseInt(process.env.NEXT_PUBLIC_WHITELIST_POSITION || '0', 10);

export default function StrategyPage() {
  const { authenticated, login, user } = usePrivy()
  const sessionId = useStrategyStore((state) => state.sessionId)
  const setSessionId = useStrategyStore((state) => state.setSessionId)
  const backtestResults = useStrategyStore((state) => state.backtestResults)
  const backtestResultsJson = useStrategyStore(
    (state) => state.backtestResultsJson,
  )
  const setBacktestResultsJson = useStrategyStore(
    (state) => state.setBacktestResultsJson,
  )
  const conversations = useStrategyStore((state) => state.messages)
  const hasConversations = conversations.length > 0

  const [splitRatio, setSplitRatio] = useState(50)
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [position, setPosition] = useState<number>(user_whitelist.length + 1);

  const { postChat, isPending, error, cancelRequest } = useChat({
    sessionId: sessionId || '',
  })

  useEffect(() => {
    if (authenticated && !sessionId) {
      setSessionId(uuidv4())
    }
  }, [authenticated, sessionId, setSessionId])

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

  const {
    data: fetchedResultsJson,
    isLoading: isLoadingResultsJson,
    error: errorResultsJson,
    isSuccess,
  } = useQuery<PlotlyDataObject, Error>({
    queryKey: ['backtestResultsJson', sessionId],
    queryFn: () => {
      if (!sessionId) {
        return Promise.reject(new Error('Session ID is required'))
      }
      return getBacktestResults(sessionId)
    },
    enabled:
      !!sessionId && !!backtestResults && !backtestResultsJson && authenticated,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSuccess && fetchedResultsJson) {
      if (!backtestResultsJson) {
        console.log(
          'Fetched backtest results JSON (Saving full data):',
          fetchedResultsJson,
        )
        setBacktestResultsJson(fetchedResultsJson)
      }
    }
  }, [
    isSuccess,
    fetchedResultsJson,
    setBacktestResultsJson,
    backtestResultsJson,
  ])

  useEffect(() => {
    if (errorResultsJson) {
      console.error('Error fetching backtest results JSON:', errorResultsJson)
    }
  }, [errorResultsJson])

  const handleResize = (e: MouseEvent) => {
    const splitContainer = document.querySelector('.split-container')
    if (!splitContainer) return

    const containerWidth = splitContainer.clientWidth
    const mouseX = e.clientX - splitContainer.getBoundingClientRect().left
    const newRatio = Math.min(Math.max((mouseX / containerWidth) * 100, 20), 80)
    setSplitRatio(newRatio)
  }

  const showSplitLayout = !!backtestResults || !!backtestResultsJson

  // バックテスト開始時にsplitRatioを調整
  useEffect(() => {
    if (backtestResults || backtestResultsJson) {
      setSplitRatio(50) // バックテスト結果が揃った時に50%に設定
    } else {
      setSplitRatio(100) // バックテスト未開始時はチャットUIを100%に
    }
  }, [backtestResults, backtestResultsJson])

  const checkUserId = (userId: string) => {
    const user = user_whitelist.find(user => user.id === userId);
    return user ? user.index : user_whitelist.length + 1;
  }

  useEffect(() => {
    if (user?.id) {
      const userPosition = checkUserId(user.id)
      setPosition(userPosition)
      const currentUser = user_whitelist.find((u) => u.id === user.id)
      const isWhitelisted =
        currentUser &&
        currentUser.index !== undefined &&
        currentUser.index <= whitelistPosition
      setShowComingSoon(!isWhitelisted)
    }
  }, [user])

  const handleSamplePrompt = () => {
    postChat('Create an ATR breakout strategy for moderately volatile markets.')
  }

  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-10 flex items-center justify-center">
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-zinc-800/50 backdrop-blur-md max-w-lg mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Coming Soon</h2>
          <p className="text-zinc-300 mb-6">Features will be gradually unlocked for whitelisted users. Please wait patiently as we work to provide access.</p>
          <p className="text-zinc-300 ">
            {position > user_whitelist.length ? 
              `You are beyond position ${position} in the whitelist.` : 
              `You are number ${position} in the whitelist.`
            }
          </p>
          <p className="text-zinc-300 mb-6">
            Currently, up to position {whitelistPosition} is open.
          </p>
          <button onClick={() => window.location.href = '/'} className="gradient-button text-white border-0 px-4 py-2 rounded-full">Return to Homepage</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-full">
        <div
          className={`flex flex-row gap-0 h-[calc(90vh)] min-h-[calc(500px)] overflow-hidden relative split-container ${!showSplitLayout ? 'justify-center' : ''}`}
        >
          {/* Left side - AI Collaboration */}
          <div
            className={`overflow-hidden flex flex-col flex-1 min-h-0 ${!hasConversations ? 'pb-20' : ''} ${!showSplitLayout ? 'max-w-3xl self-center' : ''}`}
            style={{ width: showSplitLayout ? `${splitRatio}%` : '100%' }}
          >
            {!hasConversations && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Let's begin.</h2>
                <p className="text-zinc-400">
                  Currently, as this is an alpha version, only a limited set of strategies can be executed.
                </p>
              </div>
            )}

            <AICollaboration sessionId={sessionId} postChat={postChat} isPending={isPending} error={error} cancelRequest={cancelRequest} />

            {!hasConversations && (
              <div className="mt-2 ml-1">
                <Button
                  className="px-4 py-0 h-8 rounded-full bg-black border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 button-sm"
                  onClick={handleSamplePrompt}
                  aria-label="Use Sample Prompt"
                  disabled={!sessionId}
                >
                  Create an ATR breakout strategy for moderately volatile markets. <ArrowUpIcon className="inline-block ml-0 text-xs" />
                </Button>
              </div>
            )}
          </div>
          {/* リサイズハンドラー - showSplitLayoutがtrueの時のみ表示 */}
          {showSplitLayout && (
            <div
              className="w-1 cursor-col-resize"
              onMouseDown={(e: React.MouseEvent) => {
                e.preventDefault()

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  handleResize(moveEvent)
                }

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }

                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            />
          )}

          {/* Right side - Backtesting Results - showSplitLayoutがtrueの時のみ表示 */}
          {showSplitLayout && (
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
