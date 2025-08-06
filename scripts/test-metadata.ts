#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
dotenv.config()

async function testMetadata() {
  const claimsPath = path.join(process.cwd(), 'data', 'claimed-nfts.json')
  
  try {
    const data = await fs.readFile(claimsPath, 'utf-8')
    const claims = JSON.parse(data)
    
    console.log('\n📋 Current claimed NFTs:\n')
    
    for (const claim of claims) {
      console.log(`Wallet: ${claim.walletAddress}`)
      console.log(`Privy ID: ${claim.privyUserId}`)
      console.log(`Asset ID: ${claim.assetId || '❌ MISSING - Cannot fetch metadata'}`)
      console.log(`Claimed at: ${claim.claimedAt}`)
      console.log(`Network: ${claim.network}`)
      
      if (!claim.assetId) {
        console.log('\n⚠️  This claim record is missing an asset ID.')
        console.log('   The user will need to claim again to get proper metadata.')
      }
      console.log('---\n')
    }
    
    // Summary
    const totalClaims = claims.length
    const claimsWithAssetId = claims.filter(c => c.assetId).length
    const claimsWithoutAssetId = totalClaims - claimsWithAssetId
    
    console.log('📊 Summary:')
    console.log(`   Total claims: ${totalClaims}`)
    console.log(`   With asset ID: ${claimsWithAssetId} ✅`)
    console.log(`   Without asset ID: ${claimsWithoutAssetId} ${claimsWithoutAssetId > 0 ? '❌' : ''}`)
    
    if (claimsWithoutAssetId > 0) {
      console.log('\n⚠️  Some claims are missing asset IDs. These users may need to reclaim.')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

testMetadata()