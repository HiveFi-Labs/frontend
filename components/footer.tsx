"use client"

import { useState } from "react"
import { Twitter, Github, DiscIcon as Discord, Mail } from "lucide-react"
import ComingSoonModal from "@/components/coming-soon-modal"
import HiveFiLogo from "@/components/hivefi-logo"

export default function Footer() {
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    feature: "",
  })

  const showComingSoon = (feature: string) => {
    setComingSoonModal({
      isOpen: true,
      feature,
    })
  }

  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="py-16 border-t border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Brand Column */}
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <HiveFiLogo size={40} />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  HiveFi
                </span>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => showComingSoon("Twitter")}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5 text-zinc-300" />
                </button>
                <button
                  onClick={() => showComingSoon("Discord")}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <Discord className="w-5 h-5 text-zinc-300" />
                </button>
                <button
                  onClick={() => showComingSoon("GitHub")}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5 text-zinc-300" />
                </button>
                <button
                  onClick={() => showComingSoon("Contact Us")}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <Mail className="w-5 h-5 text-zinc-300" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center">
            <p className="text-zinc-500 text-sm text-center">© 2025 HiveFi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({ isOpen: false, feature: "" })}
        feature={comingSoonModal.feature}
      />
    </>
  )
}
