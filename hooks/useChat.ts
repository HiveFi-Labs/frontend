import { useCallback, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@/types/strategy-development'
import { apiV0 } from '@/lib/backtest.api'
import { useStrategyStore } from '@/stores/strategyStore'

/* =========================================================================
 *  型
 * ========================================================================= */
type UseChatResponse = {
  postChat: (input: string) => void
  isPending: boolean
  error: Error | null
  cancelRequest: () => void
}

type UseChatProps = {
  sessionId: string
}

/* =========================================================================
 *  Hook 本体
 * ========================================================================= */
export default function useChat({ sessionId }: UseChatProps): UseChatResponse {
  const queryClient = useQueryClient()
  const abortControllerRef = useRef<AbortController | null>(null)

  /* -------- zustand store アクセス -------- */
  const addMessage = useStrategyStore((state) => state.addMessage)
  const setParams = useStrategyStore((state) => state.setParams)
  const setResults = useStrategyStore((state) => state.setResults)

  /* -------- React-Query Mutation 定義 -------- */
  const chatMutation = useMutation({
    mutationFn: async (input: string) => {
      if (!sessionId)
        throw new Error('Session ID is required for chat mutation.')

      /* -- AbortController を毎回作り直す -- */
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      /* -- v0 API 呼び出し -- */
      return apiV0.postChatMessage(sessionId, input, signal)
    },

    onMutate: async (input: string) => {
      const userMessage: ChatMessage = {
        agent: 'user',
        message: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      addMessage(userMessage)
    },

    onSuccess: (data) => {
      if (data.status === 'success' && data.response) {
        const aiMessage: ChatMessage = {
          agent: 'strategist',
          message: data.response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
        addMessage(aiMessage)

        if (data.current_params !== undefined) setParams(data.current_params)
        if (data.result_metrics !== undefined) setResults(data.result_metrics)
      } else if (data.status === 'error') {
        console.error(
          'API Error reported:',
          data.message || 'Unknown API error',
        )
      }
    },

    onError: (error: Error) => {
      /* AbortError はユーザー操作なので無視 */
      if (error.name === 'AbortError') {
        console.log('Request was cancelled')
        return
      }
      console.error('Chat Mutation Network/Fetch Error:', error.message)
    },
  })

  /* -------- 公開関数 -------- */
  const postChat = useCallback(
    (input: string) => {
      chatMutation.mutate(input)
    },
    [chatMutation],
  )

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('User cancelled request')
      abortControllerRef.current = null

      chatMutation.reset()

      const cancelMessage: ChatMessage = {
        agent: 'strategist',
        message: '_Request cancelled by user_',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      addMessage(cancelMessage)
    }
  }, [addMessage, chatMutation])

  /* -------- 戻り値 -------- */
  return {
    postChat,
    isPending: chatMutation.isPending,
    error: chatMutation.error,
    cancelRequest,
  }
}
