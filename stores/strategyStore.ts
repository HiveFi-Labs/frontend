import { create } from 'zustand'
import type { ChatMessage } from '@/types/strategy-development'

// Plotly のデータ構造に合わせて型定義 (必要であれば拡張)
interface PlotlyDataObject {
  data: Array<Record<string, unknown>>
  layout: Record<string, unknown>
  // table?: Array<Record<string, unknown>>; // 必要に応じて追加
}

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

  // 結果 JSON を保持する state を追加
  backtestResultsJson: PlotlyDataObject | null
  setBacktestResultsJson: (jsonData: PlotlyDataObject | null) => void

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

  // 初期値 null を設定
  backtestResultsJson: null,
  setBacktestResultsJson: (jsonData) => set({ backtestResultsJson: jsonData }),

  resetSessionState: () =>
    set({
      messages: [],
      currentParams: null,
      backtestResults: null,
      backtestResultsJson: null, // 結果 JSON もリセット
      // sessionId はリセットしない（新しいセッションが開始される想定）
    }),
}))
