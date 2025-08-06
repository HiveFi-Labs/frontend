#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { publicKey } from '@metaplex-foundation/umi'

// Load environment variables
dotenv.config()

async function checkNFTMetadata(assetId: string) {
  const IS_MAINNET = process.env.SOLANA_USE_MAINNET === 'true'
  const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'
  const heliusApiKey = process.env.HELIUS_API_KEY
  
  if (!heliusApiKey) {
    console.error('❌ HELIUS_API_KEY not found')
    return
  }
  
  console.log(`\n🔍 Checking NFT metadata on ${NETWORK}...\n`)
  console.log('Asset ID:', assetId)
  
  try {
    // Setup Umi with DAS API
    const dasRpcUrl = IS_MAINNET 
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    
    const umi = createUmi(dasRpcUrl).use(dasApi())
    
    // Get asset details
    const asset = await umi.rpc.getAsset(publicKey(assetId))
    
    console.log('\n📊 Asset Information:')
    console.log('Name:', asset.content?.metadata?.name)
    console.log('Symbol:', asset.content?.metadata?.symbol)
    console.log('Description:', asset.content?.metadata?.description?.substring(0, 100) + '...')
    
    console.log('\n🔗 URIs:')
    console.log('Metadata URI:', asset.content?.json_uri)
    console.log('Image URI:', asset.content?.links?.image)
    
    console.log('\n📋 Collection:')
    if (asset.grouping && asset.grouping.length > 0) {
      const collection = asset.grouping.find(g => g.group_key === 'collection')
      if (collection) {
        console.log('Collection Mint:', collection.group_value)
        console.log('Verified:', collection.verified || false)
      }
    }
    
    console.log('\n👥 Creators:')
    if (asset.creators && asset.creators.length > 0) {
      asset.creators.forEach((creator, index) => {
        console.log(`Creator ${index + 1}:`)
        console.log('  Address:', creator.address)
        console.log('  Verified:', creator.verified)
        console.log('  Share:', creator.share, '%')
      })
    }
    
    console.log('\n🏷️ Attributes:')
    if (asset.content?.metadata?.attributes) {
      asset.content.metadata.attributes.forEach(attr => {
        console.log(`${attr.trait_type}: ${attr.value}`)
      })
    }
    
    // Fetch and display the actual metadata JSON
    if (asset.content?.json_uri) {
      console.log('\n📄 Fetching metadata JSON...')
      try {
        const response = await fetch(asset.content.json_uri)
        const metadata = await response.json()
        console.log('Metadata content:', JSON.stringify(metadata, null, 2))
      } catch (error) {
        console.error('Failed to fetch metadata:', error)
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Get asset ID from command line argument
const assetId = process.argv[2]
if (!assetId) {
  console.error('Please provide an asset ID as argument')
  console.log('Usage: npm run check-nft <asset-id>')
  process.exit(1)
}

checkNFTMetadata(assetId)