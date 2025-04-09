"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ComingSoonModal from "@/components/coming-soon-modal"
import WaitlistModal from "@/components/waitlist/waitlist-modal"
import { DiscIcon } from "lucide-react"
import HiveFiLogo from "@/components/hivefi-logo"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    feature: "",
  })
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
          isScrolled ? "py-3 bg-black/80 backdrop-blur-lg border-b border-zinc-800/50" : "py-5 bg-transparent"
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
            <button
              onClick={() => showComingSoon("Strategy Builder")}
              className="text-zinc-300 hover:text-white transition-colors relative group"
            >
              <span>Strategy</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => showComingSoon("Strategy Marketplace")}
              className="text-zinc-300 hover:text-white transition-colors relative group"
            >
              <span>Strategies</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => showComingSoon("Portfolio Management")}
              className="text-zinc-300 hover:text-white transition-colors relative group"
            >
              <span>Portfolio</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <Button
              className="gradient-button text-white border-0 ml-4 flex items-center gap-2"
              onClick={() => window.open("https://discord.gg/hivefi", "_blank")}
            >
              <DiscIcon className="w-4 h-4" />
              Join Discord
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-zinc-800/50 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  showComingSoon("Strategy Builder")
                }}
                className="text-zinc-300 hover:text-white transition-colors py-2"
              >
                Strategy
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  showComingSoon("Strategy Marketplace")
                }}
                className="text-zinc-300 hover:text-white transition-colors py-2"
              >
                Strategies
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  showComingSoon("Portfolio Management")
                }}
                className="text-zinc-300 hover:text-white transition-colors py-2"
              >
                Portfolio
              </button>
              <Button
                className="gradient-button text-white border-0 flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false)
                  window.open("https://discord.gg/hivefi", "_blank")
                }}
              >
                <DiscIcon className="w-4 h-4" />
                Join Discord
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({ isOpen: false, feature: "" })}
        feature={comingSoonModal.feature}
      />

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} />
    </>
  )
}
