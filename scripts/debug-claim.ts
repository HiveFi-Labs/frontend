#!/usr/bin/env tsx

import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function debugClaim() {
  console.log('\n🔍 Debugging claim process...\n')
  
  // Check environment variables
  console.log('Environment check:')
  console.log('- SOLANA_MERKLE_TREE_ADDRESS:', process.env.SOLANA_MERKLE_TREE_ADDRESS ? '✅ Set' : '❌ Missing')
  console.log('- SOLANA_COLLECTION_MINT:', process.env.SOLANA_COLLECTION_MINT ? '✅ Set' : '❌ Missing')
  console.log('- SOLANA_BACKEND_PRIVATE_KEY:', process.env.SOLANA_BACKEND_PRIVATE_KEY ? '✅ Set' : '❌ Missing')
  console.log('- HELIUS_API_KEY:', process.env.HELIUS_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('- NEXT_PUBLIC_SOLANA_NETWORK:', process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'NOT SET')
  
  console.log('\n📝 Recommendation:')
  console.log('If asset IDs are missing from new claims, check the server logs during minting.')
  console.log('The asset ID is calculated from the merkle tree address and leaf index.')
  console.log('\nTo see detailed logs, run the server with: npm run dev')
  console.log('Then try claiming an NFT and watch for "Calculated asset ID:" in the logs.')
}

debugClaim()