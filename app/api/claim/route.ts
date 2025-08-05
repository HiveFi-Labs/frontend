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
}

// Network configuration
const IS_MAINNET = process.env.SOLANA_USE_MAINNET === 'true'
const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'

// Merkle tree and collection configuration
const MERKLE_TREE_ADDRESS = process.env.SOLANA_MERKLE_TREE_ADDRESS
const COLLECTION_MINT = process.env.SOLANA_COLLECTION_MINT

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

    // Validate wallet address format
    let recipientPublicKey: PublicKey
    try {
      recipientPublicKey = new PublicKey(walletAddress)
    } catch (error) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid wallet address format',
        },
        { status: 400 }
      )
    }

    // Get backend wallet from environment
    const privateKeyString = process.env.SOLANA_BACKEND_PRIVATE_KEY
    if (!privateKeyString) {
      console.error('SOLANA_BACKEND_PRIVATE_KEY not found in environment')
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      )
    }

    // Check if Merkle tree is configured
    if (!MERKLE_TREE_ADDRESS || !COLLECTION_MINT) {
      console.error('Merkle tree or collection not configured')
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'NFT collection not configured',
        },
        { status: 500 }
      )
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
          console.error('JSON error:', jsonError)
          console.error('Base64 error:', base64Error)
          console.error('Base58 error:', bs58Error)
          console.error('Private key format hint: Use JSON array [1,2,3...], base64 string, or base58 string')
          return NextResponse.json<ErrorResponse>(
            {
              success: false,
              error: 'Server configuration error: Invalid private key format',
            },
            { status: 500 }
          )
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
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            error: 'NFT collection not properly configured. Merkle tree not found.',
          },
          { status: 500 }
        )
      }
      
      console.log('Merkle tree account found, size:', merkleTreeAccount.data.length)
      
      // Check if this is actually a Merkle Tree account
      // Bubblegum Merkle Trees typically have specific sizes
      const accountSize = merkleTreeAccount.data.length
      
      if (accountSize < 1787) {
        console.error(`Account size (${accountSize}) is too small for a Merkle Tree. This might be a regular NFT or token account.`)
        console.error('Expected minimum size: 1787 bytes for a Merkle Tree')
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            error: 'Invalid Merkle tree configuration. The provided address does not appear to be a Merkle Tree.',
          },
          { status: 500 }
        )
      }
      
      // Log account owner for debugging
      console.log('Account owner:', merkleTreeAccount.owner)
      console.log('Account is executable:', merkleTreeAccount.executable)
      
    } catch (verifyError) {
      console.error('Error verifying Merkle tree:', verifyError)
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to verify NFT collection configuration',
        },
        { status: 500 }
      )
    }

    // Prepare metadata for the cNFT
    const metadata = {
      name: 'HiveFi Early Adopter NFT',
      symbol: 'HIVE',
      uri: process.env.NFT_METADATA_URI || 'https://arweave.net/placeholder-metadata.json', // TODO: Replace with actual metadata URI
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

    // Mint cNFT to the user
    const { signature, result } = await mintToCollectionV1(umi, {
      leafOwner: publicKey(recipientPublicKey.toBase58()),
      merkleTree: publicKey(MERKLE_TREE_ADDRESS),
      collectionMint: publicKey(COLLECTION_MINT),
      metadata,
    }).sendAndConfirm(umi, {
      confirm: { commitment: 'confirmed' },
    })

    console.log('cNFT minted successfully!')
    console.log('Transaction signature:', signature)
    
    // Try to parse the leaf information with retry logic
    let leafInfo = null
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries && !leafInfo) {
      try {
        // Wait a bit for the transaction to be fully propagated
        if (retryCount > 0) {
          console.log(`Retry ${retryCount}: Waiting for transaction to propagate...`)
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
        
        if (retryCount >= maxRetries) {
          console.error('Could not parse leaf info after retries. Transaction was successful but leaf index is unknown.')
          // Don't fail the entire request - the NFT was minted successfully
        }
      }
    }

    // Convert signature to base58 string
    let signatureString: string
    try {
      // If signature is a Uint8Array, convert it to base58
      if (signature instanceof Uint8Array) {
        signatureString = bs58.encode(signature)
      } else if (typeof signature === 'object' && 'toString' in signature) {
        // If it's an object with toString method
        signatureString = signature.toString()
      } else {
        // Try to deserialize using Umi's base58
        signatureString = base58.deserialize(signature)[0]
      }
    } catch (conversionError) {
      console.error('Failed to convert signature:', conversionError)
      // Fallback: try direct string conversion
      signatureString = String(signature)
    }
    
    console.log('Final signature string:', signatureString)
    
    return NextResponse.json<SuccessResponse>({
      success: true,
      signature: signatureString,
      leafIndex: leafInfo?.nonce ? Number(leafInfo.nonce) : undefined,
      message: 'NFT claimed successfully!',
      network: NETWORK,
    })
  } catch (error) {
    console.error('Error in claim API:', error)
    
    let errorMessage = 'An unexpected error occurred'
    
    if (error instanceof Error) {
      // Parse specific Bubblegum program errors
      if (error.message.includes('AccountNotInitialized') && error.message.includes('tree_authority')) {
        errorMessage = 'The Merkle tree is not properly initialized. Please contact support.'
      } else if (error.message.includes('custom program error: 0xbc4')) {
        errorMessage = 'NFT minting failed: Merkle tree not initialized'
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient SOL balance for transaction fees'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}