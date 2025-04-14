'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  feature = 'This feature',
}: ComingSoonModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // モーダルを開く代わりにページにリダイレクト
      router.push(`/coming-soon?feature=${encodeURIComponent(feature)}`)
      // モーダルを閉じる
      onClose()
    }
  }, [isOpen, feature, router, onClose])

  // 何も表示しない
  return null
}
