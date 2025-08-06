#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { getCollectionMintCount, getNextCollectionId } from '../lib/get-collection-count'

// Load environment variables
dotenv.config()

async function testCollectionCount() {
  const IS_MAINNET = process.env.SOLANA_USE_MAINNET === 'true'
  const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'
  const COLLECTION_MINT = process.env.SOLANA_COLLECTION_MINT
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY
  
  console.log(`\n📊 Testing collection count on ${NETWORK}...\n`)
  
  if (!COLLECTION_MINT || !HELIUS_API_KEY) {
    console.error('❌ Missing required environment variables')
    return
  }
  
  console.log('Collection mint:', COLLECTION_MINT)
  
  try {
    // Get current count
    const currentCount = await getCollectionMintCount(COLLECTION_MINT, HELIUS_API_KEY, IS_MAINNET)
    console.log(`\n✅ Current NFT count in collection: ${currentCount}`)
    
    // Get next ID
    const nextId = await getNextCollectionId(COLLECTION_MINT, HELIUS_API_KEY, IS_MAINNET)
    console.log(`📝 Next NFT ID will be: #${nextId}`)
    
    console.log('\n🎯 Benefits of this approach:')
    console.log('   - IDs are consistent across all servers')
    console.log('   - No local state to manage or sync')
    console.log('   - Accurate count based on blockchain data')
    console.log('   - Works even after server restarts')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testCollectionCount()