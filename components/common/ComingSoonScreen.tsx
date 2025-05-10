'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { user_whitelist } from '@/data/user_whitelist'

type ComingSoonScreenProps = {
  children: React.ReactNode
}

const whitelistPosition = parseInt(
  process.env.NEXT_PUBLIC_WHITELIST_POSITION || '0',
  10,
)
const disableComingSoon = process.env.NEXT_PUBLIC_DISABLE_COMING_SOON === 'true'

export default function ComingSoonScreen({ children }: ComingSoonScreenProps) {
  const { user } = usePrivy()
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [position, setPosition] = useState<number>(user_whitelist.length + 1)

  const checkUserId = (userId: string) => {
    const userEntry = user_whitelist.find((entry) => entry.id === userId)
    return userEntry ? userEntry.index : user_whitelist.length + 1
  }

  useEffect(() => {
    if (user?.id) {
      const userPosition = checkUserId(user.id)
      setPosition(userPosition)

      if (disableComingSoon) {
        setShowComingSoon(false)
      } else {
        const isWhitelisted = userPosition <= whitelistPosition
        setShowComingSoon(!isWhitelisted)
      }
    }
  }, [user?.id])

  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-10 flex items-center justify-center">
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-zinc-800/50 backdrop-blur-md max-w-lg mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Coming Soon
          </h2>
          <p className="text-zinc-300 mb-6">
            Features will be gradually unlocked for whitelisted users. Please
            wait patiently as we work to provide access.
          </p>
          <p className="text-zinc-300 ">
            {position > user_whitelist.length
              ? `You are beyond position ${position} in the whitelist.`
              : `You are number ${position} in the whitelist.`}
          </p>
          <p className="text-zinc-300 mb-6">
            Currently, up to position {whitelistPosition} is open.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="gradient-button text-white border-0 px-4 py-2 rounded-full"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
