#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

// Load environment variables
dotenv.config()

async function fixMissingAssetIds() {
  const claimsPath = path.join(process.cwd(), 'data', 'claimed-nfts.json')
  const IS_MAINNET = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
  const COLLECTION_MINT = process.env.SOLANA_COLLECTION_MINT
  const heliusApiKey = process.env.HELIUS_API_KEY
  
  if (!heliusApiKey || !COLLECTION_MINT) {
    console.error('Missing required environment variables')
    return
  }
  
  try {
    const data = await fs.readFile(claimsPath, 'utf-8')
    const claims = JSON.parse(data)
    
    console.log('\n🔧 Attempting to fix missing asset IDs...\n')
    
    // Setup Umi with DAS API
    const dasRpcUrl = IS_MAINNET 
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    
    const umi = createUmi(dasRpcUrl)
      .use(mplBubblegum())
      .use(dasApi())
    
    let updated = false
    
    for (const claim of claims) {
      if (!claim.assetId && claim.walletAddress) {
        console.log(`Checking wallet: ${claim.walletAddress}`)
        
        try {
          // Get all assets owned by the wallet
          const assets = await umi.rpc.getAssetsByOwner({
            owner: publicKey(claim.walletAddress),
          })
          
          // Find assets from our collection
          const collectionAssets = assets.items.filter(asset => {
            if (asset.grouping && asset.grouping.length > 0) {
              return asset.grouping.some(group => 
                group.group_key === 'collection' && 
                group.group_value === COLLECTION_MINT
              )
            }
            return false
          })
          
          if (collectionAssets.length > 0) {
            const assetId = collectionAssets[0].id
            console.log(`✅ Found asset ID: ${assetId}`)
            claim.assetId = assetId
            updated = true
          } else {
            console.log(`❌ No assets found from collection`)
          }
        } catch (error) {
          console.error(`Error checking wallet ${claim.walletAddress}:`, error)
        }
      }
    }
    
    if (updated) {
      await fs.writeFile(claimsPath, JSON.stringify(claims, null, 2))
      console.log('\n✅ Updated claim records with missing asset IDs')
    } else {
      console.log('\n❌ No asset IDs could be recovered')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

fixMissingAssetIds()