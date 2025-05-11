'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

type Props = {
  /** true のときは入力欄と送信ボタンを無効化 */
  disabled?: boolean
  /** 送信ハンドラ。trim 済み文字列を渡す */
  onSend: (message: string) => void
  /** リクエスト中に ✕ ボタンでキャンセルしたい場合に渡す */
  onCancel?: () => void
  /** true なら ✕ ボタンを表示 */
  sending?: boolean
}

export default function ChatInput({
  disabled,
  onSend,
  onCancel,
  sending,
}: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const MAX_ROWS = 5
  const LINE_HEIGHT = 24

  /** IME 確定 Enter を除外して送信 */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing && // 変換中ガード
      (e.nativeEvent as any).keyCode !== 229 // Safari フォールバック
    ) {
      e.preventDefault()
      submit()
    }
  }

  /** 自動リサイズ */
  const handleInput = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, MAX_ROWS * LINE_HEIGHT) + 'px'
  }

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    const el = ref.current
    if (el) el.style.height = 'auto'
  }

  return (
    <div className="relative rounded-b-lg border border-zinc-700 bg-zinc-800/50">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        enterKeyHint="send"
        placeholder={
          disabled ? 'Loading…' : 'Ask AI to help you create a trading strategy…'
        }
        className="w-full min-h-[60px] max-h-[120px] bg-transparent py-3 pl-4 pr-12 text-zinc-300 resize-none focus:outline-none"
      />
      <div className="absolute bottom-2 right-2">
        {sending ? (
          <Button
            aria-label="Cancel request"
            onClick={onCancel}
            className="h-8 w-8 rounded-full bg-red-400 hover:bg-red-500 p-0"
          >
            <span className="text-white text-xs font-bold">✕</span>
          </Button>
        ) : (
          <Button
            aria-label="Send message"
            disabled={!text.trim() || disabled}
            onClick={submit}
            className="h-8 w-8 rounded-full gradient-button p-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
