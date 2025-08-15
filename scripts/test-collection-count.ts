#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { Command } from 'commander'
import { getCollectionMintCount, getNextCollectionId } from '../lib/get-collection-count'
import { getSolanaAddresses, getActiveNetworkFromEnv, getSolanaAddressesForNetwork, ClusterType } from '../config/solana-addresses'

// Load environment variables
dotenv.config()

async function testCollectionCount(options: { network?: ClusterType }) {
  // Use command line network if provided, otherwise detect from env
  const envNetwork = getActiveNetworkFromEnv()
  const selectedNetwork = options.network || envNetwork
  const IS_MAINNET = selectedNetwork === 'mainnet'
  const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'
  
  // Get addresses from config
  const addresses = getSolanaAddressesForNetwork(selectedNetwork)
  const COLLECTION_MINT = addresses.collectionMint
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY
  
  console.log(`\n📊 Testing collection count on ${NETWORK}${options.network ? ' (override via --network)' : ''}...\n`)
  
  if (!HELIUS_API_KEY) {
    console.error('❌ Missing HELIUS_API_KEY environment variable')
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

// CLI setup
const program = new Command()

program
  .name('test-collection-count')
  .description('Test collection NFT count')
  .option('-n, --network <network>', 'network to check (mainnet or devnet)', (value) => {
    if (value !== 'mainnet' && value !== 'devnet') {
      throw new Error('Network must be mainnet or devnet')
    }
    return value as ClusterType
  })
  .action(testCollectionCount)

program.parse(process.argv)