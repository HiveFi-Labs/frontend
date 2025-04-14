"use client"

import { useState } from "react"
import { ArrowRight, DiscIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import ComingSoonModal from "@/components/coming-soon-modal"
import WaitlistModal from "@/components/waitlist/waitlist-modal"

export default function CTASection() {
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

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[150px] animate-pulse-slow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text glow-text">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-zinc-300 text-lg mb-8">
              Join HiveFi today and experience the future of algorithmic trading in DeFi. Create strategies with AI
              assistance, invest in verified algorithms, and maximize your capital efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="gradient-button text-white border-0 h-12 px-8 text-lg flex items-center gap-2"
                onClick={() => window.open("https://discord.gg/u93QSsPNd6", "_blank")}
              >
                <DiscIcon className="w-5 h-5" />
                Join Discord <ArrowRight className="ml-1 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 h-12 px-8 text-lg backdrop-blur-sm"
                onClick={() => showComingSoon("Demo Scheduling")}
              >
                Schedule a Demo
              </Button>
            </div>
            <div className="mt-8 p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm inline-block">
              <p className="text-zinc-400 text-sm">No credit card required • Free trial available • Cancel anytime</p>
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
