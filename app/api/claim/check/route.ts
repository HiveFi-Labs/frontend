import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'
import { z } from 'zod'
import { hasClaimedNFT } from '@/lib/claim-storage'
import { getSolanaAddresses } from '@/config/solana-addresses'

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

    // Setup Umi with DAS API
    const heliusApiKey = process.env.HELIUS_API_KEY
    
    if (!heliusApiKey) {
      console.error('HELIUS_API_KEY not found in environment')
      return NextResponse.json<CheckResponse>({
        hasClaimed: false,
        message: 'DAS API configuration error. Please set HELIUS_API_KEY.',
      })
    }
    
    // Use Helius RPC with API key
    const dasRpcUrl = IS_MAINNET 
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    
    const umi = createUmi(dasRpcUrl)
      .use(mplBubblegum())
      .use(dasApi())

    console.log('Checking NFT ownership on-chain for:', walletAddress)
    console.log('Using collection:', COLLECTION_MINT)

    // Even if not in our records, still check on-chain 
    // (in case records were lost or NFT was minted before tracking started)
    try {
      // Get all assets owned by the wallet
      const assets = await umi.rpc.getAssetsByOwner({
        owner: publicKey(walletAddress),
      })

      console.log(`Found ${assets.items.length} assets for wallet`)

      // Check if any of the assets belong to our collection
      const ownedFromCollection = assets.items.filter(asset => {
        // Check if the asset is from our collection
        if (asset.grouping && asset.grouping.length > 0) {
          return asset.grouping.some(group => 
            group.group_key === 'collection' && 
            group.group_value === COLLECTION_MINT
          )
        }
        return false
      })

      if (ownedFromCollection.length > 0) {
        console.log(`Wallet owns ${ownedFromCollection.length} NFTs from our collection`)
        const firstAsset = ownedFromCollection[0]
        
        return NextResponse.json<CheckResponse>({
          hasClaimed: true,
          assetId: firstAsset.id,
          message: 'This wallet has already claimed the NFT',
          network: NETWORK,
        })
      }

      return NextResponse.json<CheckResponse>({
        hasClaimed: false,
        message: 'No NFT found for this wallet',
      })
      
    } catch (error) {
      console.error('Error checking NFT ownership:', error)
      
      // If DAS API is not available, fall back to a simple response
      if (error instanceof Error && (error.message?.includes('Method not found') || error.message?.includes('getAssetsByOwner'))) {
        console.log('DAS API not available on this RPC endpoint')
        return NextResponse.json<CheckResponse>({
          hasClaimed: false,
          message: 'Unable to verify ownership (DAS API not available)',
        })
      }
      
      return NextResponse.json<CheckResponse>({
        hasClaimed: false,
        message: 'Unable to verify ownership at this time',
      })
    }

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