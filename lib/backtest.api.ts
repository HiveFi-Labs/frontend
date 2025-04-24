// lib/backtest.api.ts

// Assume API base URL comes from environment variables or config.
// Adjust as needed.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

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
  const url = `${API_BASE_URL}/api/v0/chat/${sessionId}`
  const payload: ChatMessage = { message }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers like Authorization if needed
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      // Log the detailed error from the API if available
      console.error(`API Error (${response.status}):`, responseData)
      throw new Error(
        `API request failed with status ${response.status}: ${responseData?.message || response.statusText}`,
      )
    }

    return responseData as ChatResponse
  } catch (error) {
    console.error('Error sending chat message:', error)
    // Propagate the error so the caller can handle it
    throw error // Or return a standardized error object
  }
}

// Placeholder for other API functions - you can add implementations for
// getStatus, resetSession, getResults here following a similar pattern.

// Example structure for getStatus
// export const getSessionStatus = async (sessionId: string): Promise<any> => {
//   const url = `${API_BASE_URL}/api/v0/status/${sessionId}`;
//   // ... fetch logic ...
// };

// Example structure for resetSession
// export const resetSession = async (sessionId: string): Promise<any> => {
//   const url = `${API_BASE_URL}/api/v0/reset/${sessionId}`;
//   // ... fetch logic for POST request ...
// };

// Example structure for getResults
// export const getBacktestResults = async (sessionId: string): Promise<any> => {
//   const url = `${API_BASE_URL}/api/v0/results/${sessionId}`;
//   // ... fetch logic ...
// };
