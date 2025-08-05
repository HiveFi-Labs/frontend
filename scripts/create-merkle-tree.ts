#!/usr/bin/env ts-node

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { 
  createTree,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  keypairIdentity,
  generateSigner,
} from '@metaplex-foundation/umi'
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function main() {
  console.log('🌳 Creating Merkle Tree for Compressed NFTs...\n')
  
  // Check command line arguments
  const args = process.argv.slice(2)
  const networkArg = args.find(arg => arg.startsWith('--network='))
  const networkFromArg = networkArg ? networkArg.split('=')[1] : null
  
  // Determine network
  let isMainnet = process.env.SOLANA_USE_MAINNET === 'true'
  if (networkFromArg) {
    if (networkFromArg === 'mainnet') {
      isMainnet = true
    } else if (networkFromArg === 'devnet') {
      isMainnet = false
    } else {
      console.error('❌ Error: Invalid network. Use --network=devnet or --network=mainnet')
      process.exit(1)
    }
  }

  // Check environment variables
  const privateKeyString = process.env.SOLANA_BACKEND_PRIVATE_KEY
  if (!privateKeyString) {
    console.error('❌ Error: SOLANA_BACKEND_PRIVATE_KEY not found in .env.local')
    process.exit(1)
  }

  const network = isMainnet ? 'mainnet-beta' : 'devnet'
  const defaultRpcUrl = isMainnet 
    ? 'https://api.mainnet-beta.solana.com' 
    : 'https://api.devnet.solana.com'
  const rpcUrl = process.env.SOLANA_RPC_URL || defaultRpcUrl

  console.log(`📡 Network: ${network}`)
  console.log(`🔗 RPC URL: ${rpcUrl}`)
  
  if (isMainnet) {
    console.log('⚠️  WARNING: You are creating a Merkle Tree on MAINNET!')
    console.log('⚠️  This will cost real SOL. Continue? (yes/no)')
    
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    
    const answer = await new Promise<string>((resolve) => {
      rl.question('', (answer: string) => {
        rl.close()
        resolve(answer.toLowerCase())
      })
    })
    
    if (answer !== 'yes' && answer !== 'y') {
      console.log('❌ Operation cancelled')
      process.exit(0)
    }
  }
  
  console.log()

  // Parse private key
  let backendWallet: Keypair
  try {
    // Try parsing as JSON array first
    const privateKeyArray = JSON.parse(privateKeyString)
    backendWallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray))
  } catch {
    try {
      // Try parsing as base64
      const privateKeyBuffer = Buffer.from(privateKeyString, 'base64')
      backendWallet = Keypair.fromSecretKey(privateKeyBuffer)
    } catch {
      try {
        // Try parsing as base58
        const privateKeyBytes = bs58.decode(privateKeyString)
        backendWallet = Keypair.fromSecretKey(privateKeyBytes)
      } catch (error) {
        console.error('❌ Error: Failed to parse private key')
        console.error('Supported formats: JSON array, base64, or base58')
        process.exit(1)
      }
    }
  }

  console.log(`💳 Tree Creator: ${backendWallet.publicKey.toBase58()}\n`)

  // Setup Umi
  const umi = createUmi(rpcUrl)
    .use(mplBubblegum())
    .use(keypairIdentity(fromWeb3JsKeypair(backendWallet)))

  try {
    // Generate a new signer for the merkle tree
    const merkleTree = generateSigner(umi)
    
    console.log('🔨 Creating Merkle Tree...')
    console.log(`🌲 Merkle Tree Address: ${merkleTree.publicKey}\n`)

    // Create the tree
    // maxDepth: Maximum number of levels in the tree (14 = 16,384 leaves)
    // maxBufferSize: Maximum number of concurrent changes (64 is typical)
    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: 14,
      maxBufferSize: 64,
      canopyDepth: 0, // Set to 0 for lower cost, increase for better composability
    })

    // Send and confirm the transaction
    const result = await builder.sendAndConfirm(umi)

    console.log('✅ Merkle Tree created successfully!')
    console.log(`📝 Transaction Signature: ${result.signature}`)
    console.log(`🌲 Merkle Tree Address: ${merkleTree.publicKey}`)
    console.log(`👤 Tree Authority: ${backendWallet.publicKey.toBase58()}\n`)

    console.log('📋 Add this to your .env.local file:')
    console.log(`SOLANA_MERKLE_TREE_ADDRESS=${merkleTree.publicKey}`)
    console.log('\n💡 Note: The tree authority is automatically set to the creator wallet')
    console.log(`🔍 View on Explorer: https://explorer.solana.com/address/${merkleTree.publicKey}${isMainnet ? '' : '?cluster=devnet'}`)

  } catch (error) {
    console.error('❌ Error creating Merkle Tree:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    process.exit(1)
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})