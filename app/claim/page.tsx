'use client'

import { useState, useEffect } from 'react'
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, Loader2, Wallet, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ClaimPage() {
  const { authenticated, ready, login, user } = usePrivy()
  const { wallets } = useSolanaWallets()
  const { toast } = useToast()
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [network, setNetwork] = useState<string>('devnet')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Get the user's primary Solana wallet
  const userWallet = wallets[0]

  useEffect(() => {
    // Check if user has already claimed (you could store this in localStorage or fetch from API)
    const hasClaimed = localStorage.getItem(`claimed_${userWallet?.address}`)
    if (hasClaimed) {
      setClaimed(true)
      setTxSignature(hasClaimed)
    }
  }, [userWallet?.address])

  const handleClaim = async () => {
    if (!userWallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to claim the NFT.',
        variant: 'destructive',
      })
      return
    }

    setClaiming(true)
    setErrorMessage('') // Clear any previous error messages

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: userWallet.address,
          privyUserId: user?.id, // Send Privy user ID for whitelist check
        }),
      })

      // Check status code first
      if (!response.ok) {
        if (response.status === 403) {
          setErrorMessage('You are not on the whitelist for this NFT claim. Only early adopters can claim at this time.')
          return
        }
        
        // Try to parse error message from response
        try {
          const errorData = await response.json()
          setErrorMessage(errorData.error || 'An error occurred while claiming the NFT.')
        } catch {
          setErrorMessage('An error occurred while claiming the NFT.')
        }
        return
      }

      // Success case
      const data = await response.json()
      setClaimed(true)
      setTxSignature(data.signature)
      setNetwork(data.network || 'devnet')
      // Store claim status
      localStorage.setItem(`claimed_${userWallet.address}`, data.signature)
      
      toast({
        title: 'NFT Claimed Successfully!',
        description: 'Your GENESIS PIONEER BEE NFT has been minted.',
      })
    } catch (error) {
      console.error('Claim error:', error)
      setErrorMessage('Failed to connect to the server. Please try again later.')
    } finally {
      setClaiming(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Claim Your NFT</span>
            </h1>
            <p className="text-xl text-zinc-400">
              Be part of the HiveFi early adopter community
            </p>
          </div>

          {/* Main Card */}
          <Card className="glass-card border-zinc-800">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">GENESIS PIONEER BEE NFT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!authenticated ? (
                <>
                  <div className="text-center text-zinc-400">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                    <p>Connect your wallet to claim your NFT</p>
                  </div>
                  <Button
                    onClick={login}
                    className="w-full gradient-button"
                    size="lg"
                  >
                    Connect Wallet
                  </Button>
                </>
              ) : claimed ? (
                <>
                  <div className="text-center">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold mb-2">NFT Claimed!</h3>
                    <p className="text-zinc-400 mb-4">
                      You have successfully claimed your GENESIS PIONEER BEE NFT
                    </p>
                    {txSignature && (
                      <div className="space-y-2">
                        <p className="text-sm text-zinc-500">Transaction Signature:</p>
                        <p className="text-xs font-mono text-zinc-400 break-all bg-zinc-900 p-3 rounded-lg">
                          {txSignature}
                        </p>
                        <Link
                          href={`https://explorer.solana.com/tx/${txSignature}${network === 'devnet' ? '?cluster=devnet' : ''}`}
                          target="_blank"
                          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          View on Solana Explorer ({network}) →
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <h4 className="font-semibold mb-2">About this NFT:</h4>
                      <p className="text-sm text-zinc-400">
                        This NFT serves as proof of being one of the earliest committed members of the HiveFi community. Join us in shaping the future of HiveFi together.
                      </p>
                    </div>

                    <div className="text-center text-sm text-zinc-500">
                      <p>Connected wallet:</p>
                      <p className="font-mono text-zinc-400">
                        {userWallet?.address.slice(0, 4)}...{userWallet?.address.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleClaim}
                    disabled={claiming || !userWallet}
                    className={cn(
                      "w-full gradient-button",
                      claiming && "opacity-70 cursor-not-allowed"
                    )}
                    size="lg"
                  >
                    {claiming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Claiming NFT...
                      </>
                    ) : (
                      'Claim NFT'
                    )}
                  </Button>

                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
                      <p className="text-sm text-red-400 text-center">{errorMessage}</p>
                    </div>
                  )}

                  <p className="text-xs text-center text-zinc-500">
                    This NFT is completely free to claim with no gas fees.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}