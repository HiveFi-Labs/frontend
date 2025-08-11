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
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters'
import { z } from 'zod'
import bs58 from 'bs58'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { user_whitelist } from '@/data/user_whitelist'
import { getClaimQueue, getQueueStats } from '@/lib/claim-queue'
import { hasClaimedNFT, saveClaimRecord } from '@/lib/claim-storage'
import { getCollectionMetadata } from '@/lib/collection-metadata'
import { getAssetIdByOwnerAndCollection } from '@/lib/get-asset-id'
import { getNextCollectionId } from '@/lib/get-collection-count'
import { getSolanaAddresses } from '@/config/solana-addresses'
import { getBackendWallet } from '@/lib/get-backend-wallet'
import { getAccessTokenFromRequest, verifyAccessToken, getUserAndWallets, assertWalletBelongsToUser } from '@/lib/auth/privy'

// Request body validation schema
const claimRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  privyUserId: z.string().optional(), // Deprecated - will be ignored
})

// Response types
type SuccessResponse = {
  success: true
  signature: string
  leafIndex?: number
  message: string
  network?: string
  assetId?: string
}

type ErrorResponse = {
  success: false
  error: string
  queuePosition?: number
}

// Network configuration
const IS_MAINNET = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'

// Get addresses from config
const { merkleTreeAddress: MERKLE_TREE_ADDRESS, collectionMint: COLLECTION_MINT } = getSolanaAddresses()

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

    const { walletAddress } = validationResult.data
    
    // Extract and verify access token
    const accessToken = getAccessTokenFromRequest(request)
    if (!accessToken) {
      console.log('No access token provided')
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Authentication required. Please provide a valid access token.',
        },
        { status: 401 }
      )
    }
    
    // Verify the access token
    let userId: string
    try {
      const tokenData = await verifyAccessToken(accessToken)
      userId = tokenData.userId
      console.log(`Access token verified for user: ${userId}`)
    } catch (error) {
      console.log('Access token verification failed:', error)
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid or expired access token.',
        },
        { status: 401 }
      )
    }
    
    // Check if user is in whitelist
    const isWhitelisted = user_whitelist.some(user => user.id === userId)
    if (!isWhitelisted) {
      console.log(`User ${userId} is not in whitelist`)
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'You are not eligible to claim this NFT. Only whitelisted users can claim.',
        },
        { status: 403 }
      )
    }
    console.log(`User ${userId} is whitelisted`)
    
    // Get user's linked wallets
    let userWallets: string[]
    try {
      userWallets = await getUserAndWallets(userId)
      console.log(`User ${userId} has ${userWallets.length} linked wallet(s)`)
    } catch (error) {
      console.error('Failed to get user wallets:', error)
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to retrieve user wallet information.',
        },
        { status: 500 }
      )
    }
    
    // Verify that the wallet belongs to the user
    try {
      assertWalletBelongsToUser(walletAddress, userWallets)
      console.log(`Wallet ${walletAddress} verified for user ${userId}`)
    } catch (error) {
      console.log(`Wallet ${walletAddress} does not belong to user ${userId}`)
      
      // Temporary workaround: Allow whitelisted users to claim with any wallet
      // This should be removed once Privy wallet linking is properly implemented
      const ALLOW_UNLINKED_WALLETS = process.env.ALLOW_UNLINKED_WALLETS === 'true' // Default: false
      
      if (!ALLOW_UNLINKED_WALLETS) {
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            error: 'The provided wallet address is not linked to your account. Please link your wallet in your Privy account settings.',
          },
          { status: 400 }
        )
      }
      
      console.log('WARNING: Allowing unlinked wallet for whitelisted user (temporary workaround)')
    }

    // Check if this user has already claimed (from persistent storage)
    const existingClaim = await hasClaimedNFT(userId, walletAddress, NETWORK)
    if (existingClaim) {
      console.log(`User ${userId} has already claimed NFT on ${NETWORK}`)
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: `You have already claimed this NFT on ${NETWORK}.`,
        },
        { status: 400 }
      )
    }
    
    // Also check in-memory claims (for current session)
    const claimKey = `${userId}-${walletAddress}`
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

        // Get backend wallet using network-specific private key
        let backendWallet: Keypair
        try {
          backendWallet = getBackendWallet()
          console.log('Successfully loaded backend wallet for network:', NETWORK)
        } catch (walletError) {
          console.error('Failed to get backend wallet:', walletError)
          processedClaims.delete(claimKey)
          throw new Error('Server configuration error')
        }

        // Check if Merkle tree is configured
        if (!MERKLE_TREE_ADDRESS || !COLLECTION_MINT) {
          console.error('Merkle tree or collection not configured')
          processedClaims.delete(claimKey)
          throw new Error('NFT collection not configured')
        }

        // Setup Umi with network-specific RPC URL
        const defaultRpcUrl = IS_MAINNET 
          ? 'https://api.mainnet-beta.solana.com' 
          : 'https://api.devnet.solana.com'
        
        // Check for network-specific RPC URLs first
        const networkSpecificRpc = IS_MAINNET 
          ? process.env.MAINNET_RPC_URL 
          : process.env.DEVNET_RPC_URL
        
        const rpcUrl = networkSpecificRpc || process.env.SOLANA_RPC_URL || defaultRpcUrl
        const umi = createUmi(rpcUrl)
          .use(mplBubblegum())
          .use(keypairIdentity(fromWeb3JsKeypair(backendWallet)))
          .use(irysUploader())

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

        // Get next NFT ID from the collection
        const heliusApiKey = process.env.HELIUS_API_KEY
        if (!heliusApiKey) {
          console.error('HELIUS_API_KEY not found')
          processedClaims.delete(claimKey)
          throw new Error('Server configuration error: Missing HELIUS_API_KEY')
        }
        
        const nftId = await getNextCollectionId(COLLECTION_MINT, heliusApiKey, IS_MAINNET)
        console.log('Minting NFT with ID:', nftId, '(based on collection count)')
        
        // Get collection-specific metadata
        const collectionMetadata = getCollectionMetadata(COLLECTION_MINT)
        
        // Prepare individual NFT metadata
        const nftMetadata = {
          name: `${collectionMetadata.name} #${nftId}`,
          symbol: collectionMetadata.symbol,
          description: `${collectionMetadata.description}. This NFT represents your commitment as one of the earliest members of the HiveFi community.`,
          image: collectionMetadata.imageUrl,
          external_url: 'https://hivefi.xyz',
          attributes: [
            {
              trait_type: 'Collection',
              value: COLLECTION_MINT || 'Genesis Pioneer'
            },
            {
              trait_type: 'ID',
              value: nftId.toString()
            },
            {
              trait_type: 'Mint Order',
              value: nftId
            }
          ],
          properties: {
            files: [
              {
                uri: collectionMetadata.imageUrl,
                type: 'image/png'
              }
            ],
            category: 'image',
            creators: [
              {
                address: backendWallet.publicKey.toBase58(),
                share: 100
              }
            ]
          }
        }
        
        // Upload metadata to Arweave using Irys
        let metadataUri: string
        
        try {
          console.log('Uploading metadata to Arweave...')
          metadataUri = await umi.uploader.uploadJson(nftMetadata)
          console.log('Metadata uploaded to:', metadataUri)
          
          // Wait for Arweave propagation
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (uploadError) {
          console.error('Failed to upload metadata to Arweave:', uploadError)
          // Fallback to environment variable or placeholder
          metadataUri = process.env.NFT_METADATA_URI || 'https://arweave.net/placeholder-metadata.json'
          console.log('Using fallback metadata URI:', metadataUri)
        }
        
        // Prepare metadata for the cNFT
        const metadata = {
          name: nftMetadata.name,
          symbol: nftMetadata.symbol,
          uri: metadataUri,
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
        console.log('User ID:', userId)
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
        let assetId: string | undefined
        retryCount = 0
        
        // First, try to parse leaf info to get the nonce/leaf index
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
              console.log('Leaf info parsed successfully')
              console.log('Leaf info keys:', Object.keys(leafInfo))
              console.log('Leaf nonce/index:', leafInfo.nonce)
              break
            }
          } catch (parseError) {
            console.warn(`Failed to parse leaf info (attempt ${retryCount + 1}):`, parseError)
            retryCount++
          }
        }
        
        // Calculate asset ID
        if (leafInfo && leafInfo.nonce !== undefined) {
          try {
            const { findLeafAssetIdPda } = await import('@metaplex-foundation/mpl-bubblegum')
            const assetIdPda = findLeafAssetIdPda(umi, {
              merkleTree: publicKey(MERKLE_TREE_ADDRESS),
              leafIndex: Number(leafInfo.nonce)
            })
            assetId = assetIdPda[0].toString()
            console.log('✅ Successfully calculated asset ID from leaf:', assetId)
          } catch (assetIdError) {
            console.error('❌ Failed to calculate asset ID from leaf:', assetIdError)
          }
        } else {
          console.warn('⚠️  Could not calculate asset ID from leaf - trying DAS API')
        }
        
        // If we couldn't get asset ID from leaf, try DAS API
        if (!assetId) {
          console.log('Attempting to get asset ID via DAS API...')
          const heliusApiKey = process.env.HELIUS_API_KEY
          if (heliusApiKey) {
            // Wait a bit for the transaction to be indexed
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            assetId = await getAssetIdByOwnerAndCollection(
              walletAddress,
              COLLECTION_MINT,
              heliusApiKey,
              IS_MAINNET
            ) || undefined
            
            if (assetId) {
              console.log('✅ Successfully retrieved asset ID from DAS API:', assetId)
            } else {
              console.warn('❌ Could not find asset ID via DAS API')
            }
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
        
        // Save claim record to persistent storage
        try {
          await saveClaimRecord({
            privyUserId: userId,
            walletAddress,
            signature: signatureString,
            assetId: assetId || (leafInfo?.id ? leafInfo.id.toString() : undefined),
            claimedAt: new Date().toISOString(),
            network: NETWORK,
          })
          console.log('Claim record saved to storage')
        } catch (saveError) {
          console.error('Failed to save claim record:', saveError)
          // Don't fail the entire request if storage fails
          // The NFT was minted successfully
        }
        
        return {
          success: true,
          signature: signatureString,
          leafIndex: leafInfo?.nonce ? Number(leafInfo.nonce) : undefined,
          message: 'NFT claimed successfully!',
          network: NETWORK,
          assetId: assetId || (leafInfo?.id ? leafInfo.id.toString() : undefined), // Include asset ID for metadata fetching
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
export async function GET() {
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