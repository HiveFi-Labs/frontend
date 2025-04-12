"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, DiscIcon, Rocket, Calendar, Bell } from "lucide-react"
import { useEffect } from "react"

interface PageProps {
  searchParams: {
    feature?: string
  }
}

export default function ComingSoonPage({ searchParams }: PageProps) {
  const feature = searchParams.feature || "This feature"

  useEffect(() => {
    // ページがロードされたら最上部にスクロール
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700">
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-purple-400" /> Coming Soon
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold gradient-text">{feature} is on the way</h1>

              <p className="text-zinc-300 text-base md:text-lg">
                We're working hard to bring you this feature. Join our Discord community to get updates and be the first
                to know when it launches.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#waitlist">
                  <Button
                    className="gradient-button text-white border-0 flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Get Early Access
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl blur-xl animate-pulse-slow"></div>
              <div className="relative glass-card rounded-xl overflow-hidden border border-zinc-700/50 p-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Development Timeline</h3>
                    <div className="px-3 py-1 rounded-full bg-purple-900/30 border border-purple-800/50 text-purple-400 text-xs font-medium">
                      In Progress
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-300">Planning Phase</span>
                          <span className="text-xs text-green-400">Completed</span>
                        </div>
                        <p className="text-xs text-zinc-500">Requirements gathering and feature planning</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-purple-800/50 flex items-center justify-center flex-shrink-0">
                        <Rocket className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-300">Development</span>
                          <span className="text-xs text-purple-400">In Progress</span>
                        </div>
                        <p className="text-xs text-zinc-500">Building core functionality and user interface</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-300">Testing & Launch</span>
                          <span className="text-xs text-zinc-500">Coming Soon</span>
                        </div>
                        <p className="text-xs text-zinc-500">Final testing and public release</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/50">
                    <p className="text-xs text-zinc-400">
                      Join our Discord community for early access and to provide feedback during development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
