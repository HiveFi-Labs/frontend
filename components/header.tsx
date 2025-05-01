'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ComingSoonModal from '@/components/coming-soon-modal'
import WaitlistModal from '@/components/waitlist/waitlist-modal'
import {
  useLoginWithOAuth,
  usePrivy,
  useSolanaWallets,
} from '@privy-io/react-auth'
import HiveFiLogo from '@/components/hivefi-logo'
import Image from 'next/image'
import { shortenAddress } from '@/utils/wallet-utils'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    feature: '',
  })
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false)
  const { wallets, ready: walletReady } = useSolanaWallets()
  const { authenticated, ready, logout, login } = usePrivy()
  const desiredWallet = wallets[0]?.address

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showComingSoon = (feature: string) => {
    setComingSoonModal({
      isOpen: true,
      feature,
    })
  }

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-black/80 backdrop-blur-lg border-b border-zinc-800/50'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <HiveFiLogo size={48} />
            </Link>
            <Link href="/">
              <span className="text-2xl font-bold gradient-text">HiveFi</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/strategy"
              className="text-zinc-300 hover:text-white transition-colors relative group"
            >
              <span>Builder</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <button
              onClick={() => showComingSoon('Strategy Marketplace')}
              className="text-zinc-300 hover:text-white transition-colors relative group"
            >
              <span>Strategies</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => showComingSoon('Portfolio Management')}
              className="text-zinc-300 hover:text-white transition-colors relative group"
            >
              <span>Portfolio</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            {desiredWallet ? (
              <div className="flex items-center gap-2">
                <div className="text-zinc-300 px-3 py-2 bg-zinc-800/50 rounded-md flex items-center">
                  <Image
                    src="/solana.webp"
                    alt="Solana"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {shortenAddress(desiredWallet)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                className="gradient-button text-white border-0"
                onClick={login}
                disabled={!ready}
              >
                {!ready || !walletReady ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-zinc-800/50 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <Link
                href="/strategy"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white transition-colors py-2"
              >
                Builder
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  showComingSoon('Strategy Marketplace')
                }}
                className="text-zinc-300 hover:text-white transition-colors py-2"
              >
                Strategies
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  showComingSoon('Portfolio Management')
                }}
                className="text-zinc-300 hover:text-white transition-colors py-2"
              >
                Portfolio
              </button>
              {walletReady && desiredWallet ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-zinc-300 px-3 py-2 bg-zinc-800/50 rounded-md flex items-center justify-center">
                    <Image
                      src="/solana.webp"
                      alt="Solana"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    {shortenAddress(desiredWallet)}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      logout()
                    }}
                    className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  >
                    Logout
                  </Button>
                </div>
              ) : authenticated ? (
                <div className="text-zinc-300 px-3 py-2 bg-zinc-800/50 rounded-md flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                <Button
                  className="gradient-button text-white border-0"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    login()
                  }}
                  disabled={!ready}
                >
                  {!ready ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({ isOpen: false, feature: '' })}
        feature={comingSoonModal.feature}
      />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistModalOpen}
        onClose={() => setWaitlistModalOpen(false)}
      />
    </>
  )
}
