import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Keypair, PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { 
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintToCollectionV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi'
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters'
import { z } from 'zod'
import bs58 from 'bs58'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { user_whitelist } from '@/data/user_whitelist'
import { getClaimQueue, getQueueStats } from '@/lib/claim-queue'

// Request body validation schema
const claimRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  privyUserId: z.string().optional(), // Privy user ID for whitelist check
})

// Response types
type SuccessResponse = {
  success: true
  signature: string
  leafIndex?: number
  message: string
  network?: string
}

type ErrorResponse = {
  success: false
  error: string
  queuePosition?: number
}

// Network configuration
const IS_MAINNET = process.env.SOLANA_USE_MAINNET === 'true'
const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'

// Merkle tree and collection configuration
const MERKLE_TREE_ADDRESS = process.env.SOLANA_MERKLE_TREE_ADDRESS
const COLLECTION_MINT = process.env.SOLANA_COLLECTION_MINT

// Keep track of processed claims to prevent duplicates
const processedClaims = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = claimRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { walletAddress, privyUserId } = validationResult.data
    
    // Check if user is in whitelist
    if (privyUserId) {
      const isWhitelisted = user_whitelist.some(user => user.id === privyUserId)
      if (!isWhitelisted) {
        console.log(`User ${privyUserId} is not in whitelist`)
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            error: 'You are not eligible to claim this NFT. Only whitelisted users can claim.',
          },
          { status: 403 }
        )
      }
      console.log(`User ${privyUserId} is whitelisted`)
    } else {
      // If no privyUserId is provided, reject the request
      console.log('No Privy user ID provided')
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Authentication required. Please sign in with Privy to claim the NFT.',
        },
        { status: 401 }
      )
    }

    // Check if this user has already claimed
    const claimKey = `${privyUserId}-${walletAddress}`
    if (processedClaims.has(claimKey)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'You have already claimed this NFT.',
        },
        { status: 400 }
      )
    }

    // Get queue stats before adding to queue
    const queueStatsBefore = getQueueStats()
    console.log('Queue stats before:', queueStatsBefore)

    // Add claim request to queue
    const queue = getClaimQueue()
    
    const result = await queue.add(async () => {
      try {
        // Double-check if already processed (in case of race condition)
        if (processedClaims.has(claimKey)) {
          throw new Error('Already claimed')
        }

        // Mark as processing
        processedClaims.add(claimKey)

        // Validate wallet address format
        let recipientPublicKey: PublicKey
        try {
          recipientPublicKey = new PublicKey(walletAddress)
        } catch (error) {
          processedClaims.delete(claimKey) // Remove from processed if invalid
          throw new Error('Invalid wallet address format')
        }

        // Get backend wallet from environment
        const privateKeyString = process.env.SOLANA_BACKEND_PRIVATE_KEY
        if (!privateKeyString) {
          console.error('SOLANA_BACKEND_PRIVATE_KEY not found in environment')
          processedClaims.delete(claimKey)
          throw new Error('Server configuration error')
        }

        // Check if Merkle tree is configured
        if (!MERKLE_TREE_ADDRESS || !COLLECTION_MINT) {
          console.error('Merkle tree or collection not configured')
          processedClaims.delete(claimKey)
          throw new Error('NFT collection not configured')
        }

        // Parse private key
        let backendWallet: Keypair
        try {
          // Try parsing as JSON array first
          const privateKeyArray = JSON.parse(privateKeyString)
          backendWallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray))
          console.log('Successfully parsed private key as JSON array')
        } catch (jsonError) {
          try {
            // Try parsing as base64
            const privateKeyBuffer = Buffer.from(privateKeyString, 'base64')
            backendWallet = Keypair.fromSecretKey(privateKeyBuffer)
            console.log('Successfully parsed private key as base64')
          } catch (base64Error) {
            try {
              // Try parsing as base58 (common Solana format)
              const privateKeyBytes = bs58.decode(privateKeyString)
              backendWallet = Keypair.fromSecretKey(privateKeyBytes)
              console.log('Successfully parsed private key as base58')
            } catch (bs58Error) {
              console.error('Failed to parse backend wallet private key')
              processedClaims.delete(claimKey)
              throw new Error('Server configuration error: Invalid private key format')
            }
          }
        }

        // Setup Umi with network-specific RPC URL
        const defaultRpcUrl = IS_MAINNET 
          ? 'https://api.mainnet-beta.solana.com' 
          : 'https://api.devnet.solana.com'
        const rpcUrl = process.env.SOLANA_RPC_URL || defaultRpcUrl
        const umi = createUmi(rpcUrl)
          .use(mplBubblegum())
          .use(keypairIdentity(fromWeb3JsKeypair(backendWallet)))

        // Verify Merkle Tree exists and is initialized
        try {
          const merkleTreePubkey = publicKey(MERKLE_TREE_ADDRESS)
          const merkleTreeAccount = await umi.rpc.getAccount(merkleTreePubkey)
          
          if (!merkleTreeAccount.exists) {
            console.error('Merkle tree account does not exist:', MERKLE_TREE_ADDRESS)
            processedClaims.delete(claimKey)
            throw new Error('NFT collection not properly configured. Merkle tree not found.')
          }
          
          console.log('Merkle tree account found, size:', merkleTreeAccount.data.length)
          
          // Check if this is actually a Merkle Tree account
          const accountSize = merkleTreeAccount.data.length
          
          if (accountSize < 1787) {
            console.error(`Account size (${accountSize}) is too small for a Merkle Tree.`)
            processedClaims.delete(claimKey)
            throw new Error('Invalid Merkle tree configuration.')
          }
          
        } catch (verifyError) {
          console.error('Error verifying Merkle tree:', verifyError)
          processedClaims.delete(claimKey)
          throw new Error('Failed to verify NFT collection configuration')
        }

        // Prepare metadata for the cNFT
        const metadata = {
          name: 'HiveFi Early Adopter NFT',
          symbol: 'HIVE',
          uri: process.env.NFT_METADATA_URI || 'https://arweave.net/placeholder-metadata.json',
          sellerFeeBasisPoints: 0,
          collection: {
            key: publicKey(COLLECTION_MINT),
            verified: false,
          },
          creators: [
            {
              address: umi.identity.publicKey,
              verified: false,
              share: 100,
            },
          ],
        }

        console.log('Minting cNFT to:', walletAddress)
        console.log('Network:', NETWORK)
        console.log('Using Merkle tree:', MERKLE_TREE_ADDRESS)
        console.log('Collection:', COLLECTION_MINT)

        // Mint cNFT to the user with retry logic
        let mintResult: any
        let retryCount = 0
        const maxRetries = 3
        
        while (retryCount < maxRetries) {
          try {
            mintResult = await mintToCollectionV1(umi, {
              leafOwner: publicKey(recipientPublicKey.toBase58()),
              merkleTree: publicKey(MERKLE_TREE_ADDRESS),
              collectionMint: publicKey(COLLECTION_MINT),
              metadata,
            }).sendAndConfirm(umi, {
              confirm: { commitment: 'confirmed' },
            })
            
            console.log('cNFT minted successfully!')
            break
          } catch (mintError: any) {
            retryCount++
            console.error(`Mint attempt ${retryCount} failed:`, mintError)
            
            if (retryCount >= maxRetries) {
              processedClaims.delete(claimKey)
              throw mintError
            }
            
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
          }
        }

        const { signature } = mintResult
        console.log('Transaction signature:', signature)
        
        // Try to parse the leaf information
        let leafInfo = null
        retryCount = 0
        
        while (retryCount < maxRetries && !leafInfo) {
          try {
            if (retryCount > 0) {
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
            
            leafInfo = await parseLeafFromMintToCollectionV1Transaction(
              umi,
              signature
            )
            
            if (leafInfo) {
              console.log('Leaf index:', leafInfo.nonce)
            }
          } catch (parseError) {
            console.warn(`Failed to parse leaf info (attempt ${retryCount + 1}):`, parseError)
            retryCount++
          }
        }

        // Convert signature to base58 string
        let signatureString: string
        try {
          if (signature instanceof Uint8Array) {
            signatureString = bs58.encode(signature)
          } else if (typeof signature === 'object' && 'toString' in signature) {
            signatureString = signature.toString()
          } else {
            signatureString = base58.deserialize(signature)[0]
          }
        } catch (conversionError) {
          console.error('Failed to convert signature:', conversionError)
          signatureString = String(signature)
        }
        
        console.log('Final signature string:', signatureString)
        
        return {
          success: true,
          signature: signatureString,
          leafIndex: leafInfo?.nonce ? Number(leafInfo.nonce) : undefined,
          message: 'NFT claimed successfully!',
          network: NETWORK,
        }
      } catch (error) {
        // Remove from processed claims on error (except for "already claimed")
        if (error instanceof Error && error.message !== 'Already claimed') {
          processedClaims.delete(claimKey)
        }
        throw error
      }
    }, {
      priority: Date.now(), // Use timestamp as priority (FIFO)
    })

    return NextResponse.json<SuccessResponse>(result as SuccessResponse)
  } catch (error) {
    console.error('Error in claim API:', error)
    
    let errorMessage = 'An unexpected error occurred'
    
    if (error instanceof Error) {
      if (error.message === 'Already claimed') {
        errorMessage = 'You have already claimed this NFT.'
      } else if (error.message.includes('Operation timed out')) {
        errorMessage = 'The claim request timed out. Please try again.'
      } else if (error.message.includes('AccountNotInitialized')) {
        errorMessage = 'The Merkle tree is not properly initialized. Please contact support.'
      } else if (error.message.includes('custom program error: 0xbc4')) {
        errorMessage = 'NFT minting failed: Merkle tree not initialized'
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient SOL balance for transaction fees'
      } else {
        errorMessage = error.message
      }
    }

    // Include queue position in error response if queue is busy
    const queueStats = getQueueStats()
    const response: ErrorResponse = {
      success: false,
      error: errorMessage,
    }
    
    if (queueStats.size > 0 || queueStats.pending > 0) {
      response.queuePosition = queueStats.size + queueStats.pending
    }

    return NextResponse.json<ErrorResponse>(
      response,
      { status: error instanceof Error && error.message === 'Already claimed' ? 400 : 500 }
    )
  }
}

// Optional: Add a GET endpoint to check queue status
export async function GET(request: NextRequest) {
  const stats = getQueueStats()
  return NextResponse.json({
    queue: {
      size: stats.size,
      pending: stats.pending,
      isPaused: stats.isPaused,
    },
    processedClaims: processedClaims.size,
  })
}