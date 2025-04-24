import { useCallback, useState } from 'react'
import type { ChatMessage } from '@/types/strategy-development'
import { postChatMessage } from '@/lib/backtest.api'

type UseChatResponse = {
  messages: ChatMessage[]
  error?: Error
  postChat: (input: string) => Promise<void>
  isLoading: boolean
}

type UseChatProps = {
  sessionId: string
  onSuccess?: (messages: ChatMessage[]) => void
  initialMessages?: ChatMessage[]
}

export default function useChat({
  sessionId,
  onSuccess,
  initialMessages = [],
}: UseChatProps): UseChatResponse {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const postChat = useCallback(
    async (input: string) => {
      if (!sessionId) {
        console.error('Session ID is missing.')
        setError(new Error('Session ID is missing.'))
        return
      }

      setIsLoading(true)
      setError(undefined)

      // Add user message
      const userMessage: ChatMessage = {
        agent: 'user',
        message: input,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

      try {
        // ---------------------------------------------
        // API Call using the new function
        // ---------------------------------------------
        const apiResponse = await postChatMessage(sessionId, input)

        if (apiResponse.status === 'success' && apiResponse.response) {
          // Add AI response
          const aiMessage: ChatMessage = {
            agent: 'strategist',
            message: apiResponse.response,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }

          const finalMessages = [...updatedMessages, aiMessage]
          setMessages(finalMessages)

          if (onSuccess) {
            onSuccess(finalMessages)
          }
        } else {
          // Handle API errors reported in the response body
          const errorMessage =
            apiResponse.message || 'API returned an error without a message.'
          console.error('API Error:', errorMessage)
          setError(new Error(errorMessage))
        }
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('An error occurred while sending chat')
        setError(error)
        console.error('Chat sending error:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, onSuccess, sessionId],
  )

  return { messages, error, postChat, isLoading }
}
