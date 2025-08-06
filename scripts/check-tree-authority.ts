#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'
import bs58 from 'bs58'

// Load environment variables
dotenv.config()

async function checkTreeAuthority() {
  const IS_MAINNET = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
  const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'
  const MERKLE_TREE = process.env.SOLANA_MERKLE_TREE_ADDRESS
  
  console.log(`\n🌳 Checking Merkle Tree authority on ${NETWORK}...\n`)
  
  if (!MERKLE_TREE) {
    console.error('❌ SOLANA_MERKLE_TREE_ADDRESS not found in environment')
    return
  }
  
  // Get backend wallet
  const privateKeyString = process.env.SOLANA_BACKEND_PRIVATE_KEY
  if (!privateKeyString) {
    console.error('❌ SOLANA_BACKEND_PRIVATE_KEY not found in environment')
    return
  }
  
  // Parse private key
  let backendWallet: Keypair
  try {
    const privateKeyArray = JSON.parse(privateKeyString)
    backendWallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray))
  } catch {
    try {
      const privateKeyBytes = bs58.decode(privateKeyString)
      backendWallet = Keypair.fromSecretKey(privateKeyBytes)
    } catch {
      console.error('❌ Failed to parse private key')
      return
    }
  }
  
  console.log('Backend wallet:', backendWallet.publicKey.toBase58())
  console.log('Merkle tree:', MERKLE_TREE)
  
  // Setup connection
  const rpcUrl = IS_MAINNET 
    ? process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com'
    : process.env.DEVNET_RPC_URL || 'https://api.devnet.solana.com'
    
  const umi = createUmi(rpcUrl).use(mplBubblegum())
  
  try {
    // Get tree config
    const treeConfig = await umi.rpc.getAccount(publicKey(MERKLE_TREE))
    
    if (!treeConfig.exists) {
      console.error('❌ Merkle tree account does not exist')
      return
    }
    
    console.log('\n📊 Tree Information:')
    console.log('   Account exists: ✅')
    console.log('   Data size:', treeConfig.data.length, 'bytes')
    
    // For cNFTs, the tree authority is derived from the tree address
    const [treeAuthority] = PublicKey.findProgramAddressSync(
      [new PublicKey(MERKLE_TREE).toBuffer()],
      new PublicKey('BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY')
    )
    
    console.log('\n🔑 Authority Information:')
    console.log('   Tree authority PDA:', treeAuthority.toBase58())
    console.log('   Your wallet:', backendWallet.publicKey.toBase58())
    
    // Check if they match
    if (backendWallet.publicKey.equals(treeAuthority)) {
      console.log('\n✅ Your wallet is the tree authority!')
    } else {
      console.log('\n❌ Your wallet is NOT the tree authority')
      console.log('   The wallet that created this tree must be used to mint NFTs')
      
      // Provide helpful suggestions
      console.log('\n📝 Solutions:')
      console.log('   1. Use the correct private key that created this Merkle tree')
      console.log('   2. Create a new Merkle tree with your current wallet')
      console.log('   3. Have the tree creator delegate authority to your wallet')
    }
    
  } catch (error) {
    console.error('❌ Error checking tree authority:', error)
  }
}

// Run the check
checkTreeAuthority().catch(console.error)