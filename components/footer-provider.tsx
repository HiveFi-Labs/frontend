'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Footer from '@/components/footer'

interface FooterProviderProps {
  children: ReactNode
}

export function FooterProvider({ children }: FooterProviderProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <div className="flex flex-col min-h-screen">
      {children}
      {isHomePage && <Footer />}
    </div>
  )
}
