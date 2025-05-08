import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage } from '@/types/strategy-development'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Here you would call an external LLM API
    // For example: OpenAI API

    // Test response
    const aiMessage: ChatMessage = {
      agent: 'strategist',
      message:
        "Thank you for your question. I'm here to support you with strategy development.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    return NextResponse.json(aiMessage)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
