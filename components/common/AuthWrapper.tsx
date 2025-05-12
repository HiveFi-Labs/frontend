'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'

type AuthWrapperProps = {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { authenticated, login } = usePrivy()
  const [loginAttempted, setLoginAttempted] = useState(false)

  useEffect(() => {
    if (!authenticated && !loginAttempted) {
      setLoginAttempted(true)
    }
  }, [authenticated, loginAttempted])

  useEffect(() => {
    if (loginAttempted && !authenticated) {
      login()
    }
  }, [loginAttempted, authenticated])

  return <>{children}</>
}
