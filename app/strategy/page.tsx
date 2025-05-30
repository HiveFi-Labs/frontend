'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { v4 as uuidv4 } from 'uuid'
import { ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AICollaboration from '@/components/strategy/ai-collaboration'
import BacktestingResults from '@/components/strategy/backtesting-results'
import { useStrategyStore } from '@/stores/strategyStore'
import { apiV1 } from '@/lib/backtest.api'
import { usePrivy } from '@privy-io/react-auth'
import useChat from '@/hooks/useChat'
import AuthWrapper from '@/components/common/AuthWrapper'
import ComingSoonScreen from '@/components/common/ComingSoonScreen'

export default function StrategyPage() {
  const { authenticated, user } = usePrivy()
  const sessionId = useStrategyStore((state) => state.sessionId)
  const setSessionId = useStrategyStore((state) => state.setSessionId)
  const apiVersion = useStrategyStore((s) => s.apiVersion)
  const setApiVersion = useStrategyStore((s) => s.setApiVersion)
  const backtestStatus = useStrategyStore((s) => s.backtestStatus)
  const backtestResults = useStrategyStore((state) => state.backtestResults)
  const backtestResultsJson = useStrategyStore(
    (state) => state.backtestResultsJson,
  )
  const conversations = useStrategyStore((s) => s.messages)
  const hasConversations = conversations.length > 0

  /* ---- split ---- */
  const [splitRatio, setSplitRatio] = useState(50)
  const isMobile = useIsMobile()

  const { postChat, isPending, error, cancelRequest } = useChat({
    sessionId: sessionId || '',
    apiVersion: apiVersion,
  })

  useEffect(() => {
    const initializeSession = async (userId: string) => {
      console.log('initializeSession', apiVersion, sessionId, userId)
      if (apiVersion === 'v1') {
        try {
          const response = await apiV1.createSession(userId)
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
    if (!sessionId && user?.id) initializeSession(user.id)
  }, [authenticated, user?.id, apiVersion, sessionId, setSessionId])

  /* ---- split auto adjust ---- */
  const isRunning = backtestStatus === 'code' || backtestStatus === 'backtest'

  useEffect(() => {
    // モバイル表示の場合はsplitRatioを100%に固定
    if (isMobile) {
      setSplitRatio(100)
    } else {
      setSplitRatio(
        backtestResults || backtestResultsJson || isRunning ? 50 : 100,
      )
    }
  }, [backtestResults, backtestResultsJson, isRunning, isMobile])

  /* ---- resize handler ---- */
  const handleResize = (e: MouseEvent) => {
    const container = document.querySelector('.split-container')
    if (!container) return
    const { left, width } = container.getBoundingClientRect()
    const newRatio = ((e.clientX - left) / width) * 100
    const clampedRatio = Math.min(Math.max(newRatio, 20), 80)
    setSplitRatio(clampedRatio)

    e.preventDefault()
  }

  const showSplit =
    !isMobile && (!!backtestResults || !!backtestResultsJson || isRunning)

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

  return (
    <AuthWrapper>
      <ComingSoonScreen>
        <div
          className="min-h-screen h-screen bg-black text-white pt-20 flex flex-col overflow-auto"
          style={{
            height: 'calc(100vh - 120px)',
          }}
        >
          <div
            className={`container mx-auto ${isMobile ? 'px-1' : 'px-4'} max-w-full h-full`}
          >
            <div
              className={`flex flex-col md:flex-row gap-0 flex-1 h-full relative split-container ${!showSplit ? 'justify-center' : ''}`}
            >
              {/* -------- Left (chat) -------- */}
              <div
                className={` flex flex-col min-h-0 ${!hasConversations ? 'pb-20' : ''} ${isMobile || !showSplit ? 'max-w-3xl self-center' : ''}`}
                style={{
                  width: !isMobile && showSplit ? `${splitRatio}%` : '100%',
                }}
              >
                {!hasConversations && (
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Let's begin.</h2>
                    <p className="text-zinc-400">
                      Currently, as this is an alpha version, only a limited set
                      of strategies can be executed.
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
                  showSplit={showSplit}
                />

                {!hasConversations && (
                  <div className="mt-2 ml-1">
                    <Button
                      className={`rounded-full bg-black border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 button-sm`}
                      onClick={() => handleSamplePrompt('v0')}
                      aria-label="Use Sample Prompt"
                      disabled={!sessionId}
                      style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        padding: '0em 1em',
                        lineHeight: '1.5',
                        height: 'auto',
                        minHeight: '2em',
                      }}
                    >
                      Create an ATR breakout strategy for moderately volatile
                      markets.{' '}
                      <ArrowUpIcon className="inline-block ml-0 text-xs" />
                    </Button>
                  </div>
                )}
              </div>
              {/* リサイズハンドラー */}
              {showSplit && !isMobile && (
                <div
                  className="w-1 transition-colors cursor-col-resize"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    const move = (ev: MouseEvent) => {
                      handleResize(ev)
                      document.body.style.cursor = 'col-resize'
                    }
                    const up = () => {
                      document.removeEventListener('mousemove', move)
                      document.removeEventListener('mouseup', up)
                      document.body.style.cursor = ''
                    }
                    document.addEventListener('mousemove', move)
                    document.addEventListener('mouseup', up)
                  }}
                />
              )}

              {/* -------- Right (results) -------- */}
              {showSplit && (
                <div
                  className="overflow-hidden flex flex-col flex-1 min-h-0"
                  style={{ width: !isMobile ? `${100 - splitRatio}%` : '100%' }}
                >
                  <BacktestingResults />
                </div>
              )}
            </div>
          </div>

          {/* モバイル表示時のバックテストパネル */}
          {isMobile &&
            (backtestResults || backtestResultsJson || isRunning) && (
              <BacktestingResults />
            )}
        </div>
      </ComingSoonScreen>
    </AuthWrapper>
  )
}
