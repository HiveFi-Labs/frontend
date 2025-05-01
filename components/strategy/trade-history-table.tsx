'use client'

import { useEffect, useState } from 'react'
import { useStrategyStore } from '@/stores/strategyStore'
import type { PlotlyDataObject } from '@/lib/backtest.api'

/* ────────────────────────────────────────────────────────────────
 *  型定義
 * ───────────────────────────────────────────────────────────── */
export type Trade = {
  id: number
  side: 'LONG' | 'SHORT'
  entryTime: string
  exitTime?: string | null
  entryPrice: number
  exitPrice?: number | null
  pnl: number
  pnlPct: number
  durationMin: number
}

/* ========================================================================
 *  シグナル (Buy / Sell / Close) → Trade[] 変換ユーティリティ
 * ===================================================================== */
const buildTradesFromSignals = (chart: PlotlyDataObject | null): Trade[] => {
  if (!chart?.data?.length) return []

  /* ---- 1) シグナル点をフラットな配列にする -------------------------------- */
  type RawSignal = { time: string; price: number; kind: 'Buy' | 'Sell' | 'Close'; qty: number }
  const signals: RawSignal[] = []

  chart.data.forEach((trace: any) => {
    if (!['Buy', 'Sell', 'Close'].includes(trace.name)) return
    const xs = trace.x as string[]
    const ys = trace.y as number[]
    const cds = (trace.customdata as any[]) ?? []

    xs.forEach((t, idx) => {
      signals.push({
        time : t,
        price: ys[idx],
        kind : trace.name,
        qty  : cds[idx]?.qty ?? 1, // customdata.qty があれば採用
      })
    })
  })

  if (!signals.length) return []

  /* ---- 2) 時系列順に並べて疑似的な約定ペアリング -------------------------- */
  signals.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  const trades: Trade[] = []
  let open: { entry: RawSignal; side: 'LONG' | 'SHORT' } | null = null

  for (const sig of signals) {
    if (sig.kind === 'Buy') {
      if (!open) {
        // LONG エントリー
        open = { entry: sig, side: 'LONG' }
      } else if (open.side === 'SHORT') {
        // SHORT 決済
        const { entry } = open
        const pnl = entry.price - sig.price
        const pnlPct = pnl / entry.price
        const duration =
          (new Date(sig.time).getTime() - new Date(entry.time).getTime()) / 60000

        trades.push({
          id: trades.length + 1,
          side: 'SHORT',
          entryTime: entry.time,
          exitTime: sig.time,
          entryPrice: entry.price,
          exitPrice: sig.price,
          pnl,
          pnlPct,
          durationMin: duration,
        })
        open = null
      }
    }

    if (sig.kind === 'Sell') {
      if (!open) {
        // SHORT エントリー
        open = { entry: sig, side: 'SHORT' }
      } else if (open.side === 'LONG') {
        // LONG 決済
        const { entry } = open
        const pnl = sig.price - entry.price
        const pnlPct = pnl / entry.price
        const duration =
          (new Date(sig.time).getTime() - new Date(entry.time).getTime()) / 60000

        trades.push({
          id: trades.length + 1,
          side: 'LONG',
          entryTime: entry.time,
          exitTime: sig.time,
          entryPrice: entry.price,
          exitPrice: sig.price,
          pnl,
          pnlPct,
          durationMin: duration,
        })
        open = null
      }
    }

    if (sig.kind === 'Close' && open) {
      // 任意の Close シグナルで強制決済
      const { entry, side } = open
      const pnl =
        side === 'LONG'
          ? sig.price - entry.price
          : entry.price - sig.price
      const pnlPct = pnl / entry.price
      const duration =
        (new Date(sig.time).getTime() - new Date(entry.time).getTime()) / 60000

      trades.push({
        id: trades.length + 1,
        side,
        entryTime: entry.time,
        exitTime: sig.time,
        entryPrice: entry.price,
        exitPrice: sig.price,
        pnl,
        pnlPct,
        durationMin: duration,
      })
      open = null
    }
  }

  /* ---- 3) 決済されず残ったポジション（Open trace）があれば追加 ----------- */
  if (open) {
    const { entry, side } = open
    trades.push({
      id: trades.length + 1,
      side,
      entryTime: entry.time,
      exitTime: null,
      entryPrice: entry.price,
      exitPrice: null,
      pnl: 0,
      pnlPct: 0,
      durationMin:
        (Date.now() - new Date(entry.time).getTime()) / 60000,
    })
  }

  /* ---- 4) UI は新しい順で欲しいのでソート -------------------------------- */
  return trades.sort(
    (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime(),
  )
}

/* ========================================================================
 *  メインコンポーネント
 * ===================================================================== */
export default function TradeHistoryTable() {
  const chartJson = useStrategyStore((s) => s.backtestResultsJson)
  const [isLoading, setIsLoading] = useState(true)
  const [trades, setTrades] = useState<Trade[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    if (!chartJson) return
    setIsLoading(true)
    setTrades(buildTradesFromSignals(chartJson))
    setCurrentPage(1) // ページをリセット
    setIsLoading(false)
  }, [chartJson])

  /* ------------ ページネーション用計算 ------------------------------- */
  const totalPages = Math.ceil(trades.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTrades = trades.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  /* ---------------- Skeleton / Empty ---------------------------------- */
  if (isLoading) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-6"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-zinc-800/50 rounded mb-2"></div>
        ))}
      </div>
    )
  }

  if (!trades.length) {
    return (
      <div className="bg-zinc-900/70 rounded-lg p-6 text-center text-zinc-500">
        No trade history in this back-test.
      </div>
    )
  }

  /* ---------------- テーブル ------------------------------------------ */
  return (
    <div className="bg-zinc-900/70 rounded-lg p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Trade History</h3>
        
        {trades.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1) // ページ数変更時は最初のページに戻る
              }}
              className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1"
            >
              {[10, 25, 50, 100].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="border-b border-zinc-800 text-xs font-medium text-zinc-400">
            <th className="py-3 px-4 text-left">Side</th>
            <th className="py-3 px-4 text-left">Entry&nbsp;Time</th>
            <th className="py-3 px-4 text-left">Exit&nbsp;Time</th>
            <th className="py-3 px-4 text-left">Entry&nbsp;Price</th>
            <th className="py-3 px-4 text-left">Exit&nbsp;Price</th>
            <th className="py-3 px-4 text-left">PnL</th>
            <th className="py-3 px-4 text-left">PnL&nbsp;%</th>
            <th className="py-3 px-4 text-left">Duration&nbsp;(min)</th>
          </tr>
        </thead>
        <tbody>
          {currentTrades.map((t) => {
            const isProfit = t.pnl >= 0
            const sideColor =
              t.side === 'LONG' ? 'text-green-400' : 'text-red-400'
            const pnlColor = isProfit ? 'text-green-400' : 'text-red-400'

            return (
              <tr
                key={t.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 text-xs"
              >
                <td className={`py-3 px-4 font-medium ${sideColor}`}>{t.side}</td>
                <td className="py-3 px-4 text-zinc-300">
                  {new Date(t.entryTime).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-zinc-300">
                  {t.exitTime ? new Date(t.exitTime).toLocaleString() : '-'}
                </td>
                <td className="py-3 px-4 text-zinc-300">
                  {t.entryPrice.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-zinc-300">
                  {t.exitPrice ? t.exitPrice.toLocaleString() : '-'}
                </td>
                <td className={`py-3 px-4 font-medium ${pnlColor}`}>
                  {t.pnl.toLocaleString()}
                </td>
                <td className={`py-3 px-4 font-medium ${pnlColor}`}>
                  {(t.pnlPct * 100).toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-zinc-300">{t.durationMin}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* ページネーションコントロール */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center text-xs text-zinc-400 space-y-2">
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' 
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              &laquo;
            </button>
            
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' 
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              &lsaquo;
            </button>
            
            {/* 現在のページの周辺のページ番号を表示 */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              // 表示するページ番号を決定（現在のページを中心に最大5ページ表示）
              let pageNum: number;
              if (totalPages <= 5) {
                // 全部で5ページ以下なら全ページ表示
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                // 現在のページが先頭付近なら1〜5を表示
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                // 現在のページが末尾付近ならtotalPages-4〜totalPagesを表示
                pageNum = totalPages - 4 + idx;
              } else {
                // それ以外なら現在のページを中心に前後2ページずつ表示
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' 
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              &rsaquo;
            </button>
            
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' 
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              &raquo;
            </button>
          </div>
          
          <div>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, trades.length)} of {trades.length} trades
          </div>
        </div>
      )}
    </div>
  )
}
