'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface CodeLoadingProps {
  className?: string
}

/**
 * コード生成中のローディング表示を行うコンポーネント
 */
export default function CodeLoading({ className }: CodeLoadingProps) {
  const [lines, setLines] = useState<number[]>([])

  // 異なる長さのコード行を生成する関数
  useEffect(() => {
    // ランダムな長さの配列を生成（30〜50行）
    const lineCount = Math.floor(Math.random() * 30) + 30

    // 画面サイズによって調整可能
    const generateLines = () => {
      const newLines = []
      for (let i = 0; i < lineCount; i++) {
        // パターンに基づいて異なる長さの行を生成
        if (i % 12 === 0) {
          // 関数定義っぽく見せる行は中程度
          newLines.push(Math.floor(Math.random() * 15) + 40)
        } else if (i % 12 === 1 || (i + 1) % 12 === 0) {
          // 開始括弧と終了括弧行は短い
          newLines.push(10)
        } else if (i % 5 === 0) {
          // コメント風の少し長い行（まれに）
          newLines.push(Math.floor(Math.random() * 20) + 50)
        } else if (i % 3 === 0) {
          // 変数宣言や条件式など（中程度）
          newLines.push(Math.floor(Math.random() * 15) + 25)
        } else if (i % 7 === 2) {
          // 短めの行（制御構文など）
          newLines.push(Math.floor(Math.random() * 10) + 15)
        } else {
          // 標準的なコード行（短めから中程度）
          newLines.push(Math.floor(Math.random() * 25) + 20)
        }
      }
      setLines(newLines)
    }

    generateLines()

    // 定期的に行の長さを更新して、コード生成のアニメーション効果を出す
    const interval = setInterval(() => {
      generateLines()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // インデントレベルを計算する関数
  const getIndentLevel = (index: number): number => {
    // 関数の開始部分や終了部分はインデントなし
    if (index % 12 === 0 || (index + 1) % 12 === 0) {
      return 0
    }
    // 関数内部は基本インデント1レベル
    let level = 1

    // if文やループなどによる追加インデント
    if ((index % 12 > 2 && index % 12 < 6) || index % 7 === 3) {
      level = 2
    }

    // さらに深いネスト（少なめに）
    if (index % 23 === 5) {
      level = 3
    }

    return level
  }

  return (
    <div
      className={cn(
        'w-full h-full min-h-[400px] p-6 rounded-lg bg-zinc-900/50 overflow-hidden',
        className,
      )}
    >
      {/* コード生成中の表示 */}
      <div className="space-y-1.5 w-full">
        {lines.map((width, index) => (
          <div key={index} className="flex">
            {/* 行番号のような表示 */}
            <div className="w-8 mr-4 text-right text-zinc-600 text-xs py-0.5">
              {index + 1}
            </div>

            {/* インデントをパターンに基づいて表現 */}
            <div style={{ width: `${getIndentLevel(index) * 16}px` }}></div>

            {/* メインのコード行 */}
            <div
              className="h-3.5 bg-zinc-800 rounded-sm animate-pulse"
              style={{ width: `${width}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}
