// lib/backtest.api.ts

// Updated base path to /api/v0
// Corrected fallback logic for environment variable
const backendApiUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
const API_BASE_URL = `${backendApiUrl}/api/v0`

interface ChatMessage {
  message: string
}

// Define the expected API response structure based on the documentation.
// You might want to create more specific types for params and results.
interface ChatResponse {
  status: 'success' | 'error'
  response?: string
  current_params?: Record<string, unknown> | null // Use a more specific type if possible
  result_metrics?: Record<string, unknown> | null // Use a more specific type if possible
  intent?: 'backtest' | 'parameter_suggestion' | 'general_chat'
  message?: string // Used for error messages from the API
}

// For GET /status/{session_id} response
interface SessionStatusResponse {
  session_id: string
  has_parameters: boolean
  has_backtest_results: boolean
  chat_history_length: number
  current_params: Record<string, unknown> | null // Or a more specific type
  // Note: API doc uses 'backtest_results', ChatResponse uses 'result_metrics'. Clarify which key is correct for status.
  backtest_results: Record<string, unknown> | null // Or a more specific type
}

// For POST /reset/{session_id} response
interface ResetSessionResponse {
  status: 'success'
  message: string
}

// Export the interface
export interface PlotlyDataObject {
  data: Array<Record<string, unknown>>
  layout: Record<string, unknown>
}

export type BacktestResultsJsonResponse = PlotlyDataObject

/**
 * Sends a message to the chat API endpoint.
 * @param sessionId The unique identifier for the chat session.
 * @param message The user's message content.
 * @returns A promise that resolves with the API response.
 */
export const postChatMessage = async (
  sessionId: string,
  message: string,
): Promise<ChatResponse> => {
  // Construct URL using the updated base URL
  const url = `${API_BASE_URL}/chat/${sessionId}`
  const payload: ChatMessage = { message }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData)
      throw new Error(
        `API request failed with status ${response.status}: ${responseData?.message || responseData?.detail || response.statusText}`,
      )
    }

    return responseData as ChatResponse
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

// --- New API Client Functions ---

/**
 * Retrieves the current status of a specific chat session.
 * @param sessionId The unique identifier for the chat session.
 * @returns A promise that resolves with the session status.
 */
export const getSessionStatus = async (
  sessionId: string,
): Promise<SessionStatusResponse> => {
  const url = `${API_BASE_URL}/status/${sessionId}`
  try {
    const response = await fetch(url, { method: 'GET' })
    const responseData = await response.json()
    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData)
      throw new Error(
        `API request failed with status ${response.status}: ${responseData?.detail || response.statusText}`,
      )
    }
    return responseData as SessionStatusResponse
  } catch (error) {
    console.error('Error fetching session status:', error)
    throw error
  }
}

/**
 * Resets a specific chat session.
 * @param sessionId The unique identifier for the chat session.
 * @returns A promise that resolves with the reset confirmation.
 */
export const resetSession = async (
  sessionId: string,
): Promise<ResetSessionResponse> => {
  const url = `${API_BASE_URL}/reset/${sessionId}`
  try {
    const response = await fetch(url, { method: 'POST' }) // Corrected method to POST
    const responseData = await response.json()
    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData)
      throw new Error(
        `API request failed with status ${response.status}: ${responseData?.detail || response.statusText}`,
      )
    }
    return responseData as ResetSessionResponse
  } catch (error) {
    console.error('Error resetting session:', error)
    throw error
  }
}

/**
 * Retrieves the raw JSON backtest results for a specific chat session.
 * @param sessionId The unique identifier for the chat session.
 * @returns A promise that resolves with the backtest results JSON (as PlotlyDataObject).
 */
export const getBacktestResults = async (
  sessionId: string,
): Promise<PlotlyDataObject> => {
  // Return type updated
  const url = `${API_BASE_URL}/results/${sessionId}`
  try {
    const response = await fetch(url, { method: 'GET' })
    const responseData = await response.json()
    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData)
      throw new Error(
        `API request failed with status ${response.status}: ${responseData?.detail || response.statusText}`,
      )
    }
    // Type assertion updated
    return responseData as PlotlyDataObject
  } catch (error) {
    console.error('Error fetching backtest results:', error)
    throw error
  }
}
