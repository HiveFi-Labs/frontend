'use client'

import { useState } from 'react'
import { Mail, BookOpen } from 'lucide-react'
import { SiX, SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'
import ComingSoonModal from '@/components/coming-soon-modal'
import HiveFiLogo from '@/components/hivefi-logo'
import Link from 'next/link'
export default function Footer() {
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    feature: '',
  })

  const showComingSoon = (feature: string) => {
    setComingSoonModal({
      isOpen: true,
      feature,
    })
  }

  return (
    <>
      <footer className="py-16 border-t border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Brand Column */}
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Link href="/" className="mb-2">
                  <HiveFiLogo size={28} />
                </Link>
                <Link href="/">
                  <span className="text-2xl font-bold bg-clip-text text-[#FFFFFF]">
                    HiveFi
                  </span>
                </Link>
              </div>
              <div className="flex space-x-4 justify-center">
                <a
                  href="https://x.com/Hivefi_X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="HiveFi on X"
                >
                  <SiX className="w-5 h-5 text-zinc-300" />
                </a>
                <a
                  href="https://discord.gg/u93QSsPNd6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="HiveFi Discord server"
                >
                  <SiDiscord className="w-5 h-5 text-zinc-300" />
                </a>
                <a
                  href="https://github.com/HiveFi-Labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="HiveFi on GitHub"
                >
                  <SiGithub className="w-5 h-5 text-zinc-300" />
                </a>
                <a
                  href="https://hivefi.gitbook.io/hivefi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="HiveFi Documentation"
                >
                  <BookOpen className="w-5 h-5 text-zinc-300" />
                </a>
                <a
                  href="mailto:maff@hive.xyz"
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="Contact HiveFi"
                >
                  <Mail className="w-5 h-5 text-zinc-300" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center">
            <p className="text-zinc-500 text-sm text-center">
              © 2025 HiveFi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({ isOpen: false, feature: '' })}
        feature={comingSoonModal.feature}
      />
    </>
  )
}
