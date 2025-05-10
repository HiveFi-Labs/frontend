import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { ChatMessage } from '@/types/strategy-development'
import { apiV0, apiV1 } from '@/lib/backtest.api'
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
  apiVersion: 'v0' | 'v1'
}

/* =========================================================================
 *  Hook
 * ========================================================================= */
export default function useChat({
  sessionId,
  apiVersion,
}: UseChatProps): UseChatResponse {
  const abortControllerRef = useRef<AbortController | null>(null)

  const addMessage = useStrategyStore((s) => s.addMessage)
  const setParams = useStrategyStore((s) => s.setParams)
  const setResults = useStrategyStore((s) => s.setResults)

  /* --------- v1 セッション初期化フラグ --------- */
  const v1SessionReadyRef = useRef(false)

  /* --------- Mutation --------- */
  const chatMutation = useMutation({
    mutationFn: async (input: string) => {
      if (!sessionId) throw new Error('Session ID is required.')

      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      /* ==== v0 ==== */
      if (apiVersion === 'v0') {
        return apiV0.postChatMessage(sessionId, input, signal)
      }

      /* ==== v1 ==== */
      // 1. セッションをまだ作っていなければ作成
      if (!v1SessionReadyRef.current) {
        await apiV1.createSession(sessionId) // user_id に sessionId を使うだけ
        v1SessionReadyRef.current = true
      }

      // 2. メッセージ送信
      const res = await apiV1.sendMessage(sessionId, input)

      // v0 互換の形に整形して返す
      return {
        status: 'success',
        response: res.assistant_message.content,
        current_params: null,
        result_metrics: null,
      } as const
    },

    onMutate: async (input: string) => {
      /* ローカルにユーザーメッセージを即座に追加 */
      const userMsg: ChatMessage = {
        agent: 'user',
        message: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      addMessage(userMsg)
    },

    onSuccess: (data) => {
      /* アシスタント応答をローカルに追加 */
      const aiMsg: ChatMessage = {
        agent: 'strategist',
        message: data.response ?? '',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      addMessage(aiMsg)

      /* v0 固有パラメータはそのまま反映（v1 は今のところ null） */
      if (data.current_params !== undefined) setParams(data.current_params)
      if (data.result_metrics !== undefined) setResults(data.result_metrics)
    },

    onError: (error) => {
      if (error.name === 'AbortError') {
        console.log('Request cancelled by user.')
        return
      }
      console.error('Chat error:', error)
    },
  })

  /* --------- 公開メソッド --------- */
  const postChat = useCallback(
    (input: string) => {
      chatMutation.mutate(input)
    },
    [chatMutation],
  )

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      chatMutation.reset()

      addMessage({
        agent: 'strategist',
        message: '_Request cancelled by user_',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    }
  }, [addMessage, chatMutation])

  return {
    postChat,
    isPending: chatMutation.isPending,
    error: chatMutation.error,
    cancelRequest,
  }
}
