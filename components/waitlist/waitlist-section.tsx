"use client"

import { Rocket, DiscIcon as Discord } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WaitlistSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[150px] animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 mb-4">
            <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-400" /> Early Access
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text glow-text">Join Our Discord Community</h2>

          <p className="text-zinc-300 text-lg mb-8">
            Be among the first to experience the future of algorithmic trading in DeFi. Join our Discord server to get
            early access, exclusive benefits, and connect with like-minded traders.
          </p>

          <div className="flex justify-center">
            <Button
              className="gradient-button text-white border-0 h-12 px-8 text-lg flex items-center gap-2"
              onClick={() => window.open("https://discord.gg/hivefi", "_blank")}
            >
              <Discord className="w-5 h-5" />
              Join Our Discord
            </Button>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm inline-block">
            <p className="text-zinc-400 text-sm">
              Community-driven • Real-time updates • Priority access for early members
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
