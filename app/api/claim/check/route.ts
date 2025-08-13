import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { z } from 'zod'
import { hasClaimedNFT } from '@/lib/claim-storage'
import { getSolanaAddresses } from '@/config/solana-addresses'
import { checkOwnedAssetIdByWalletAndCollection, networkToIsMainnet } from '@/lib/ownership-check'

// Request validation schema
const checkRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
})

// Response types
type CheckResponse = {
  hasClaimed: boolean
  assetId?: string
  message: string
  network?: string
}

// Network configuration
const IS_MAINNET = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'

// Get addresses from config
const { merkleTreeAddress: MERKLE_TREE_ADDRESS, collectionMint: COLLECTION_MINT } = getSolanaAddresses()

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = checkRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          hasClaimed: false,
          message: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { walletAddress } = validationResult.data

    // First check if wallet has already claimed from our persistent storage
    const claimRecord = await hasClaimedNFT(undefined, walletAddress, NETWORK)
    if (claimRecord) {
      console.log(`Wallet ${walletAddress} has already claimed NFT on ${NETWORK}`)
      return NextResponse.json<CheckResponse>({
        hasClaimed: true,
        assetId: claimRecord.assetId,
        message: `This wallet has already claimed the NFT on ${NETWORK}`,
        network: claimRecord.network || NETWORK,
      })
    }

    // Validate wallet address format
    let walletPublicKey: PublicKey
    try {
      walletPublicKey = new PublicKey(walletAddress)
    } catch (error) {
      return NextResponse.json(
        {
          hasClaimed: false,
          message: 'Invalid wallet address format',
        },
        { status: 400 }
      )
    }

    // Check if Merkle tree is configured
    if (!MERKLE_TREE_ADDRESS || !COLLECTION_MINT) {
      console.error('Merkle tree or collection not configured')
      return NextResponse.json(
        {
          hasClaimed: false,
          message: 'NFT collection not configured',
        },
        { status: 500 }
      )
    }

    // Check on-chain ownership using the shared function
    console.log('Checking NFT ownership on-chain for:', walletAddress)
    console.log('Using collection:', COLLECTION_MINT)

    const heliusApiKey = process.env.HELIUS_API_KEY
    const ownedAssetId = await checkOwnedAssetIdByWalletAndCollection(
      walletAddress,
      COLLECTION_MINT,
      heliusApiKey,
      networkToIsMainnet(NETWORK)
    )

    if (ownedAssetId) {
      console.log(`Wallet owns NFT from our collection: ${ownedAssetId}`)
      return NextResponse.json<CheckResponse>({
        hasClaimed: true,
        assetId: ownedAssetId,
        message: 'This wallet has already claimed the NFT',
        network: NETWORK,
      })
    }

    return NextResponse.json<CheckResponse>({
      hasClaimed: false,
      message: 'No NFT found for this wallet',
    })

  } catch (error) {
    console.error('Error in check API:', error)
    
    return NextResponse.json<CheckResponse>(
      {
        hasClaimed: false,
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// GET endpoint for simple status check
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('wallet')
  
  if (!walletAddress) {
    return NextResponse.json(
      {
        hasClaimed: false,
        message: 'Wallet address is required',
      },
      { status: 400 }
    )
  }

  // Forward to POST handler
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    })
  )
}