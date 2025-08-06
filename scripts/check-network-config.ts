#!/usr/bin/env tsx

import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function checkNetworkConfig() {
  console.log('\n🔍 Checking network configuration...\n')
  
  const isMainnet = process.env.SOLANA_USE_MAINNET === 'true'
  const publicNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK
  const merkleTree = process.env.SOLANA_MERKLE_TREE_ADDRESS
  const collection = process.env.SOLANA_COLLECTION_MINT
  
  console.log('Configuration:')
  console.log(`- SOLANA_USE_MAINNET: ${process.env.SOLANA_USE_MAINNET} (${isMainnet ? 'mainnet' : 'devnet'})`)
  console.log(`- NEXT_PUBLIC_SOLANA_NETWORK: ${publicNetwork || 'NOT SET ❌'}`)
  console.log(`- SOLANA_MERKLE_TREE_ADDRESS: ${merkleTree || 'NOT SET ❌'}`)
  console.log(`- SOLANA_COLLECTION_MINT: ${collection || 'NOT SET ❌'}`)
  
  // Check consistency
  console.log('\n🔧 Configuration Check:')
  
  if (isMainnet && publicNetwork !== 'mainnet') {
    console.log('❌ MISMATCH: SOLANA_USE_MAINNET=true but NEXT_PUBLIC_SOLANA_NETWORK is not "mainnet"')
  } else if (!isMainnet && publicNetwork !== 'devnet') {
    console.log('❌ MISMATCH: SOLANA_USE_MAINNET=false but NEXT_PUBLIC_SOLANA_NETWORK is not "devnet"')
  } else {
    console.log('✅ Network configuration is consistent')
  }
  
  if (!merkleTree || !collection) {
    console.log('❌ Missing merkle tree or collection address')
  } else {
    console.log('✅ Merkle tree and collection addresses are set')
  }
  
  console.log('\n📝 localStorage Key Pattern:')
  console.log(`- Key format: claimed_${publicNetwork || 'devnet'}_genesis-pioneer-bee-v1_<wallet-address>`)
  
  console.log('\n⚠️  Important:')
  console.log('- Restart the Next.js server after changing environment variables')
  console.log('- Clear browser localStorage if switching between networks')
  console.log('- Ensure merkle tree and collection addresses match the network')
}

checkNetworkConfig()