'use client'
import { X, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WaitlistForm from './waitlist-form'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md">
        <div className="p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 text-zinc-400 hover:text-zinc-300"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center space-y-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mx-auto glow">
              <Rocket className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold gradient-text">
              Join Our Waitlist
            </h2>

            <p className="text-zinc-300">
              Be the first to know when HiveFi launches. Get early access to our
              algorithmic trading platform and exclusive benefits.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </div>
    </div>
  )
}
