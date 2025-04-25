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
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ChatMessage } from '@/types/strategy-development'
import useChat from '@/hooks/useChat'
import { useStrategyStore } from '@/stores/strategyStore'
import ReactMarkdown from 'react-markdown'

interface AICollaborationProps {
  sessionId: string
}

export default function AICollaboration({ sessionId }: AICollaborationProps) {
  const [activeAgent] = useState('strategist')
  const [inputMessage, setInputMessage] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const conversations = useStrategyStore((state) => state.messages)
  const resetSessionState = useStrategyStore((state) => state.resetSessionState)

  const { postChat, isPending, error, cancelRequest } = useChat({ sessionId })

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [conversations])

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isPending) return

    const messageToSend = inputMessage
    setInputMessage('')
    postChat(messageToSend)
  }

  const handleResetConversation = () => {
    console.log('Resetting session:', sessionId)
    resetSessionState()
  }

  const handleCancelRequest = () => {
    cancelRequest()
  }

  return (
    <Card className="glass-card overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Strategy Development</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isPending}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800"
            >
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                onClick={handleResetConversation}
                disabled={isPending}
              >
                Reset Conversation
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                disabled
              >
                Change Agent Behavior
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                disabled
              >
                Export Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-zinc-400">
          Configure and develop your trading strategy with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-full overflow-hidden">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4"
          style={{ maxHeight: 'calc(100vh - 350px)' }}
        >
          {conversations.map((message, index) => (
            <div
              key={`${message.agent}-${message.timestamp}-${index}`}
              className={`flex gap-3 ${message.agent === 'user' ? 'justify-end' : ''}`}
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
                className={`glass-card p-3 rounded-xl max-w-[85%] ${message.agent === 'user' ? 'bg-purple-900/30' : 'bg-zinc-900/30'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold capitalize">
                    {message.agent === 'user' ? 'You' : message.agent}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {message.timestamp}
                  </span>
                </div>
                {message.agent === 'user' ? (
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                    {message.message}
                  </p>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                )}

                {message.attachment && message.attachment.type === 'chart' && (
                  <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
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
                  <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg overflow-x-auto">
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
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card p-3 rounded-xl max-w-[85%] bg-zinc-900/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-xs text-zinc-400 ml-1">Generating response...</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm p-2 text-center">
              Failed to get response: {error.message}
            </div>
          )}
        </div>

        <div className="mt-auto py-2">
          <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <textarea
              placeholder={`Message the ${activeAgent} agent...`}
              className="w-full min-h-[60px] max-h-[120px] bg-transparent py-3 pl-4 pr-12 text-zinc-300 focus:outline-none resize-none block"
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
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
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  aria-label="Send message"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          {isPending && (
            <div className="text-xs text-zinc-400 mt-1 text-center">
              You can cancel the request or continue typing while waiting
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

