#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'

// Example metadata for HiveFi Early Adopter NFT
const metadata = {
  name: "HiveFi Early Adopter NFT",
  symbol: "HIVE",
  description: "This exclusive NFT grants early adopters of HiveFi special access to features, rewards, and governance rights within the HiveFi ecosystem.",
  image: "https://arweave.net/YOUR_IMAGE_HASH", // Replace with actual image URL
  external_url: "https://hivefi.app",
  attributes: [
    {
      trait_type: "Type",
      value: "Early Adopter"
    },
    {
      trait_type: "Tier",
      value: "Genesis"
    },
    {
      trait_type: "Benefits",
      value: "Premium Access"
    },
    {
      trait_type: "Minted",
      value: new Date().toISOString()
    }
  ],
  properties: {
    files: [
      {
        uri: "https://arweave.net/YOUR_IMAGE_HASH", // Replace with actual image URL
        type: "image/png"
      }
    ],
    category: "image",
    creators: [
      {
        address: "Adwe8j9u7p9KJJcw5PcTpE2hQmcmFFfRYrrZ4uS3hNUE", // Replace with your creator address
        share: 100
      }
    ]
  }
}

async function main() {
  console.log('📝 NFT Metadata Upload Helper\n')
  
  // Save metadata to file
  const metadataPath = path.join(__dirname, 'nft-metadata.json')
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
  
  console.log('✅ Metadata file created:', metadataPath)
  console.log('\n📋 Metadata content:')
  console.log(JSON.stringify(metadata, null, 2))
  
  console.log('\n🚀 Next steps to upload metadata:')
  console.log('\n1. Upload to Arweave (Recommended for permanence):')
  console.log('   - Use ArDrive: https://ardrive.io')
  console.log('   - Use Bundlr: https://bundlr.network')
  console.log('   - Use Akord: https://akord.com')
  
  console.log('\n2. Upload to IPFS (Alternative):')
  console.log('   - Use Pinata: https://pinata.cloud')
  console.log('   - Use NFT.Storage: https://nft.storage')
  console.log('   - Use Web3.Storage: https://web3.storage')
  
  console.log('\n3. Upload to centralized storage (Quick testing):')
  console.log('   - Use AWS S3')
  console.log('   - Use Google Cloud Storage')
  console.log('   - Use any public URL service')
  
  console.log('\n📌 After uploading:')
  console.log('1. Get the metadata URL (e.g., https://arweave.net/abc123...)')
  console.log('2. Update the URI in app/api/claim/route.ts:')
  console.log("   uri: 'YOUR_METADATA_URL_HERE'")
  console.log('\n💡 For production, ensure the metadata URL is permanent and immutable!')
  
  // Example with Bundlr Network
  console.log('\n📦 Example: Upload with Bundlr CLI')
  console.log('1. Install: npm install -g @bundlr-network/client')
  console.log('2. Fund wallet: bundlr fund 0.1 -h https://node1.bundlr.network -c arweave -w wallet.json')
  console.log(`3. Upload: bundlr upload ${metadataPath} -h https://node1.bundlr.network -c arweave -w wallet.json`)
  console.log('4. Copy the returned URL and update your code')
}

// Run the script
main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})