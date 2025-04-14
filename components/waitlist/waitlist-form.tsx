'use client'

import type React from 'react'

import { useState } from 'react'
import { z } from 'zod'
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerForWaitlist } from '@/app/actions/waitlist-actions'

// Email validation schema
const emailSchema = z.string().email('Please enter a valid email address')

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset status
    setStatus('loading')
    setErrorMessage('')

    // Validate email
    try {
      emailSchema.parse(email)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStatus('error')
        setErrorMessage(error.errors[0].message)
        return
      }
    }

    try {
      // Submit to server action
      const result = await registerForWaitlist(email)

      if (result.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(
          result.message || 'Failed to register. Please try again.',
        )
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('An unexpected error occurred. Please try again.')
      console.error('Waitlist registration error:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500 h-12"
            disabled={status === 'loading' || status === 'success'}
            aria-label="Email address"
          />
        </div>

        <Button
          type="submit"
          className="gradient-button w-full h-12"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {status === 'success' ? "You're on the list!" : 'Join the Waitlist'}
        </Button>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Thank you! We&apos;ll notify you when we launch.</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  )
}
