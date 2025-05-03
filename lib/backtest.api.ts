/* =========================================================================
 *  共通設定・ユーティリティ
 * ========================================================================= */
const backendApiUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

/** API バージョン → ベース URLを返す */
const base = (ver: 'v0' | 'v1') => `${backendApiUrl}/api/${ver}`

/* ----------------- 共通型定義（v0/v1 で使い回す） ----------------- */
export interface PlotlyDataObject {
  data: Array<Record<string, unknown>>
  layout: Record<string, unknown>
}
export type BacktestResultsJsonResponse = PlotlyDataObject

/* =========================================================================
 *  1. v0 クライアント（以前のコードを移植）
 * ========================================================================= */
namespace V0 {
  /* ========== 型 ========== */
  interface ChatMessage {
    message: string
  }
  interface ChatResponse {
    status: 'success' | 'error'
    response?: string
    current_params?: Record<string, unknown> | null
    result_metrics?: Record<string, unknown> | null
    intent?: 'backtest' | 'parameter_suggestion' | 'general_chat'
    message?: string
  }
  interface SessionStatusResponse {
    session_id: string
    has_parameters: boolean
    has_backtest_results: boolean
    chat_history_length: number
    current_params: Record<string, unknown> | null
    backtest_results: Record<string, unknown> | null
  }
  interface ResetSessionResponse {
    status: 'success'
    message: string
  }
  interface CsvGenerationResponse {
    status: 'success' | 'error'
  }

  /* ========== fetch ラッパ ========== */
  const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, init)
    const data = await res.json()
    if (!res.ok)
      throw new Error(data?.message || data?.detail || res.statusText)
    return data as T
  }

  /* ========== エンドポイント ========== */
  const API = base('v0')

  export const postChatMessage = (
    sessionId: string,
    message: string,
    signal?: AbortSignal,
  ) =>
    fetchJson<ChatResponse>(`${API}/chat/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message } satisfies ChatMessage),
      signal,
    })

  export const getSessionStatus = (sessionId: string) =>
    fetchJson<SessionStatusResponse>(`${API}/status/${sessionId}`)

  export const resetSession = (sessionId: string) =>
    fetchJson<ResetSessionResponse>(`${API}/reset/${sessionId}`, {
      method: 'POST',
    })

  export const getBacktestResults = (sessionId: string) =>
    fetchJson<PlotlyDataObject>(`${API}/results/${sessionId}`)
}

/* =========================================================================
 *  2. v1 クライアント（新規追加）
 *    openapi_v1.yaml に合わせ最低限の主要エンドポイントを実装
 * ========================================================================= */
namespace V1 {
  /* ========== 型（OpenAPI の schema を TypeScript に落とし込み） ========== */
  // --- Session 周り ---
  export interface SessionCreated {
    session_id: string
    user_id: string
  }
  export interface SessionState {
    session_id: string
    messages: ChatMessage[]
    current_prompt: string | null
    backtest_results: Record<string, unknown> | null
  }
  export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
  }
  export interface AssistantResponse {
    session_id: string
    user_message: ChatMessage
    assistant_message: ChatMessage
    current_prompt: string | null
  }
  // --- Prompt ---
  export interface PromptResponse {
    session_id: string
    current_prompt: string
  }
  // --- Code Generation ---
  export interface CodeGenerationResponse {
    session_id: string
    code_generation_job_id: string
    script_path: string
    status: 'success' | 'needs_fix' | 'fixed' | 'failed'
    // sync 実装では generated_code を返してくる場合もある
    script?: string
  }
  // --- Backtest ---
  export interface BacktestResponse {
    session_id: string
    backtest_results: Record<string, unknown>
  }

  /* ========== fetch ラッパ ========== */
  const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, init)
    const data = await res.json()
    if (!res.ok)
      throw new Error(data?.message ?? data?.detail ?? res.statusText)
    return data as T
  }

  /* ========== エンドポイント実装 ========== */
  const API = base('v1')

  /* --- セッション --- */
  /** 新規セッション作成 */
  export const createSession = (userId: string) =>
    fetchJson<SessionCreated>(`${API}/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })

  /** セッション状態取得 */
  export const getSession = (sessionId: string) =>
    fetchJson<SessionState>(`${API}/v1/sessions/${sessionId}`)

  /* --- メッセージ --- */
  export const sendMessage = (sessionId: string, message: string) =>
    fetchJson<AssistantResponse>(`${API}/v1/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

  export const getMessages = (sessionId: string) =>
    fetchJson<ChatMessage[]>(`${API}/v1/sessions/${sessionId}/messages`)

  /* --- プロンプト --- */
  export const setStrategyPrompt = (sessionId: string, prompt: string) =>
    fetchJson<PromptResponse>(
      `${API}/v1/sessions/${sessionId}/strategy/prompt`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      },
    )

  export const getStrategyPrompt = (sessionId: string) =>
    fetchJson<PromptResponse>(`${API}/v1/sessions/${sessionId}/strategy/prompt`)

  /* --- コード生成（現行は同期 200） --- */
  export const generateCode = (sessionId: string) =>
    fetchJson<CodeGenerationResponse>(
      `${API}/v1/sessions/${sessionId}/strategy/code`,
      { method: 'POST' },
    )

  export const getLatestGeneratedCode = (sessionId: string) =>
    fetchJson<CodeGenerationResponse>(
      `${API}/v1/sessions/${sessionId}/strategy/code`,
    )

  /* --- バックテスト（現行は同期 200） --- */
  export const runBacktest = (sessionId: string, code_reference: string) =>
    fetchJson<BacktestResponse>(`${API}/v1/sessions/${sessionId}/backtests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code_reference }),
    })

  export const getLatestBacktest = (sessionId: string) =>
    fetchJson<BacktestResponse>(`${API}/v1/sessions/${sessionId}/backtests`)
}

/* =========================================================================
 *  3. export
 * ========================================================================= */
/** 既存コードはそのまま apiV0 を import して使える */
export const apiV0 = {
  ...V0,
}

/** 新しい v1 用クライアント */
export const apiV1 = {
  ...V1,
}
