import { create } from 'zustand'
import type { ChatMessage } from '@/types/strategy-development'

// 環境変数からAPI V1が利用可能かどうかを確認
const isApiV1Enabled = process.env.NEXT_PUBLIC_ENABLE_API_V1 === 'true'
// デフォルトのAPIバージョンを環境変数から取得 (未設定時はV0)
const defaultApiVersion = isApiV1Enabled ? 'v1' : 'v0'

// Plotly のデータ構造に合わせて型定義 (必要であれば拡張)
interface PlotlyDataObject {
  data: Array<Record<string, unknown>>
  layout: Record<string, unknown>
  // table?: Array<Record<string, unknown>>; // 必要に応じて追加
}

// APIレスポンスの型に合わせて Params と Results の型を定義 (必要に応じて調整)
type BacktestParams = Record<string, unknown> | null
type BacktestResults = Record<string, unknown> | null // APIレスポンスの result_metrics に対応
type BacktestStatus =
  | 'idle'
  | 'prompt'
  | 'code'
  | 'backtest'
  | 'completed'
  | 'error'

interface StrategyState {
  sessionId: string | null
  setSessionId: (id: string | null) => void

  // APIバージョン設定を追加
  apiVersion: 'v0' | 'v1'
  setApiVersion: (version: 'v0' | 'v1') => void

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

  // バックテストのステータスを追加
  backtestStatus: BacktestStatus
  setBacktestStatus: (status: BacktestStatus) => void

  // セッションリセット時にまとめてクリアするアクション
  resetSessionState: () => void
}

export const useStrategyStore = create<StrategyState>((set) => ({
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),

  // APIバージョンのデフォルト値と更新関数
  apiVersion: defaultApiVersion,
  setApiVersion: (version) => {
    // V1が無効化されている場合は強制的にV0を使用
    const validVersion = isApiV1Enabled ? version : 'v0'
    set({ apiVersion: validVersion })
  },

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

  // バックテストステータスの初期値を設定
  backtestStatus: 'idle',
  setBacktestStatus: (status) => set({ backtestStatus: status }),

  resetSessionState: () =>
    set({
      messages: [],
      currentParams: null,
      backtestResults: null,
      backtestResultsJson: null, // 結果 JSON もリセット
      backtestStatus: 'idle', // ステータスもリセット
      // apiVersionはリセットしない
    }),
}))
