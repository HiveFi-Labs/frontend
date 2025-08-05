#!/usr/bin/env ts-node

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { 
  mplBubblegum,
  getAssetWithProof,
  getAssetFromLeaf,
} from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function main() {
  // Check command line arguments
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.error('❌ Usage: npx ts-node scripts/view-cnft.ts <merkle-tree-address> <leaf-index>')
    console.error('Example: npx ts-node scripts/view-cnft.ts 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5 8')
    process.exit(1)
  }

  const merkleTreeAddress = args[0]
  const leafIndex = parseInt(args[1])

  if (isNaN(leafIndex)) {
    console.error('❌ Error: Leaf index must be a number')
    process.exit(1)
  }

  console.log('🔍 Fetching Compressed NFT information...\n')

  // Determine network
  const isMainnet = process.env.SOLANA_USE_MAINNET === 'true'
  const network = isMainnet ? 'mainnet-beta' : 'devnet'
  const defaultRpcUrl = isMainnet 
    ? 'https://api.mainnet-beta.solana.com' 
    : 'https://api.devnet.solana.com'
  const rpcUrl = process.env.SOLANA_RPC_URL || defaultRpcUrl

  console.log(`📡 Network: ${network}`)
  console.log(`🌲 Merkle Tree: ${merkleTreeAddress}`)
  console.log(`🍃 Leaf Index: ${leafIndex}\n`)

  try {
    // Setup Umi
    const umi = createUmi(rpcUrl).use(mplBubblegum())

    // Get asset with proof
    const assetWithProof = await getAssetWithProof(umi, {
      merkleTree: publicKey(merkleTreeAddress),
      leafIndex,
      // For devnet, we might need to use a different RPC that supports the DAS API
      // You can replace this with a Helius or other RPC endpoint
    })

    console.log('✅ Compressed NFT found!')
    console.log('\n📋 Asset Information:')
    console.log('================================')
    
    const asset = assetWithProof.asset
    console.log(`Name: ${asset.name}`)
    console.log(`Symbol: ${asset.symbol}`)
    console.log(`Owner: ${asset.leafOwner}`)
    console.log(`Delegate: ${asset.leafDelegate || 'None'}`)
    console.log(`Nonce: ${asset.nonce}`)
    
    console.log('\n🎨 Metadata:')
    console.log(`URI: ${asset.uri}`)
    console.log(`Seller Fee: ${asset.sellerFeeBasisPoints / 100}%`)
    
    if (asset.creators && asset.creators.length > 0) {
      console.log('\n👥 Creators:')
      asset.creators.forEach((creator, index) => {
        console.log(`  ${index + 1}. ${creator.address} (${creator.share}%)${creator.verified ? ' ✓' : ''}`)
      })
    }
    
    console.log('\n🔗 Proof Information:')
    console.log(`Root: ${assetWithProof.root}`)
    console.log(`Proof Path Length: ${assetWithProof.proof.length}`)
    console.log(`Data Hash: ${assetWithProof.dataHash}`)
    console.log(`Creator Hash: ${assetWithProof.creatorHash}`)
    
    console.log('\n💡 To view this cNFT:')
    console.log(`1. Visit the metadata URI: ${asset.uri}`)
    console.log(`2. Use a cNFT-compatible wallet or explorer`)
    console.log(`3. DAS API endpoint: https://api.helius.xyz/v0/addresses/${asset.leafOwner}/assets`)
    
    // Fetch and display metadata if possible
    if (asset.uri) {
      console.log('\n📄 Fetching metadata from URI...')
      try {
        const response = await fetch(asset.uri)
        const metadata = await response.json()
        console.log('\nMetadata Content:')
        console.log(JSON.stringify(metadata, null, 2))
        
        if (metadata.image) {
          console.log(`\n🖼️  Image URL: ${metadata.image}`)
        }
      } catch (error) {
        console.log('⚠️  Could not fetch metadata from URI')
      }
    }

  } catch (error) {
    console.error('❌ Error fetching cNFT:', error)
    console.error('\n💡 Tips:')
    console.error('1. Make sure the merkle tree address and leaf index are correct')
    console.error('2. The default RPC might not support the required methods')
    console.error('3. Consider using a DAS-enabled RPC like Helius, Triton, or others')
    console.error('\nFor better results, set a custom RPC URL in .env.local:')
    console.error('SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_API_KEY')
  }
}

// Alternative: Get cNFT info using DAS API
async function fetchWithDAS(ownerAddress: string, network: string) {
  console.log('\n🔄 Alternative: Fetching via DAS API...')
  
  // Example using Helius DAS API (requires API key)
  const heliusUrl = `https://api.helius.xyz/v0/addresses/${ownerAddress}/assets?api-key=YOUR_API_KEY`
  
  console.log(`\nTo view all cNFTs owned by ${ownerAddress}:`)
  console.log(`1. Get a free API key from https://helius.xyz`)
  console.log(`2. Use this URL: ${heliusUrl}`)
  console.log(`3. Or use Solana Explorer (may not show cNFTs): https://explorer.solana.com/address/${ownerAddress}${network === 'devnet' ? '?cluster=devnet' : ''}`)
}

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})