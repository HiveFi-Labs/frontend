import { create } from 'zustand'
import type { ChatMessage } from '@/types/strategy-development'

// APIレスポンスの型に合わせて Params と Results の型を定義 (必要に応じて調整)
type BacktestParams = Record<string, unknown> | null
type BacktestResults = Record<string, unknown> | null // APIレスポンスの result_metrics に対応

interface StrategyState {
  sessionId: string | null
  setSessionId: (id: string | null) => void

  messages: ChatMessage[] // チャットメッセージをストアで管理
  addMessage: (message: ChatMessage) => void
  resetMessages: () => void

  currentParams: BacktestParams
  setParams: (params: BacktestParams) => void

  backtestResults: BacktestResults // result_metrics に対応
  setResults: (results: BacktestResults) => void

  // セッションリセット時にまとめてクリアするアクション
  resetSessionState: () => void
}

export const useStrategyStore = create<StrategyState>((set) => ({
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),

  messages: [], // 初期メッセージは空配列
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })), // Correctly update messages array
  resetMessages: () => set({ messages: [] }),

  currentParams: null,
  setParams: (params) => set({ currentParams: params }),

  backtestResults: null,
  setResults: (results) => set({ backtestResults: results }),

  resetSessionState: () =>
    set({
      messages: [],
      currentParams: null,
      backtestResults: null,
      // sessionId はリセットしない（新しいセッションが開始される想定）
    }),
}))
