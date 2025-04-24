import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@/types/strategy-development'
import { postChatMessage } from '@/lib/backtest.api'
import { useStrategyStore } from '@/stores/strategyStore'

type UseChatResponse = {
  postChat: (input: string) => void
  isPending: boolean
  error: Error | null
}

type UseChatProps = {
  sessionId: string
}

export default function useChat({ sessionId }: UseChatProps): UseChatResponse {
  const queryClient = useQueryClient()

  const addMessage = useStrategyStore((state) => state.addMessage)
  const setParams = useStrategyStore((state) => state.setParams)
  const setResults = useStrategyStore((state) => state.setResults)

  const chatMutation = useMutation({
    mutationFn: (input: string) => {
      if (!sessionId) {
        throw new Error('Session ID is required for chat mutation.')
      }
      return postChatMessage(sessionId, input)
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
    onSuccess: (data, variables, context) => {
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

        if (data.current_params !== undefined) {
          setParams(data.current_params)
        }
        if (data.result_metrics !== undefined) {
          setResults(data.result_metrics)
        }
      } else if (data.status === 'error') {
        console.error(
          'API Error reported:',
          data.message || 'Unknown API error',
        )
      }
    },
    onError: (error: Error, variables, context) => {
      console.error('Chat Mutation Network/Fetch Error:', error.message)
    },
  })

  const postChat = useCallback(
    (input: string) => {
      chatMutation.mutate(input)
    },
    [chatMutation],
  )

  return {
    postChat,
    isPending: chatMutation.isPending,
    error: chatMutation.error,
  }
}
