"use client"

import { useState } from "react"
import { TrendingUp, DiscIcon } from "lucide-react"
import { useDataFetch } from "@/hooks/use-data-fetch"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ComingSoonModal from "@/components/coming-soon-modal"
import WaitlistModal from "@/components/waitlist/waitlist-modal"
import portfolioData from "@/services/index"
import type { HeroData } from "@/types/home"
import HiveFiLogo from "@/components/hivefi-logo"

export default function HeroSection() {
  const { data: heroData, isLoading, error } = useDataFetch<HeroData>(() => portfolioData.getHeroData())
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    feature: "",
  })
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false)

  const showComingSoon = (feature: string) => {
    setComingSoonModal({
      isOpen: true,
      feature,
    })
  }

  if (isLoading) {
    return (
      <section className="min-h-screen pt-32 pb-20 relative overflow-hidden flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[100px] animate-pulse-slow"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-pulse">
              <Skeleton width="66%" height={40} />
              <Skeleton width="100%" height={64} />
              <Skeleton width="83%" height={64} />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton width={160} height={48} />
                <Skeleton width={160} height={48} />
              </div>
            </div>
            <div className="relative animate-pulse">
              <Skeleton width="100%" height={400} className="rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !heroData) {
    return (
      <section className="min-h-screen pt-32 pb-20 relative overflow-hidden flex items-center">
        <div className="container mx-auto px-4">
          <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error?.message || "Failed to load hero data"}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="min-h-screen pt-32 pb-20 relative overflow-hidden flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[100px] animate-pulse-slow"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 animate-float">
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <HiveFiLogo size={24} /> Revolutionizing DeFi Trading
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text glow-text leading-tight">{heroData.title}</h1>
              <p className="text-lg md:text-xl text-zinc-300">{heroData.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="gradient-button text-white border-0 h-12 px-8 text-lg flex items-center gap-2"
                  onClick={() => window.open("https://discord.gg/hivefi", "_blank")}
                >
                  <DiscIcon className="w-5 h-5" />
                  Join Discord
                </Button>
              </div>
              {/* ユーザー数の表示を削除 */}
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl blur-xl animate-pulse-slow"></div>
              <div className="relative glass-card rounded-xl overflow-hidden border border-zinc-700/50 backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">Strategy Performance</h3>
                      <p className="text-zinc-400 text-sm">Last 30 days</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-xs font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +24.8%
                    </div>
                  </div>
                  <div className="h-64 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
                          <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,150 C50,120 100,180 150,140 C200,100 250,160 300,120 C350,80 400,100 400,70"
                        fill="none"
                        stroke="url(#purple-gradient)"
                        strokeWidth="3"
                        className="text-purple-500"
                      />
                      <path
                        d="M0,150 C50,120 100,180 150,140 C200,100 250,160 300,120 C350,80 400,100 400,70"
                        fill="url(#gradient)"
                        opacity="0.5"
                        transform="translate(0, 30)"
                      />
                      <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </svg>
                    <div className="absolute bottom-0 left-0 w-full grid grid-cols-7 px-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                        <div key={i} className="text-center text-xs text-zinc-500">
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="space-y-1">
                      <p className="text-zinc-400 text-xs">Total Value</p>
                      <p className="font-bold text-lg">$24,568</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-400 text-xs">Profit/Loss</p>
                      <p className="font-bold text-lg text-green-400">+$4,892</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-400 text-xs">Sharpe Ratio</p>
                      <p className="font-bold text-lg">2.8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
