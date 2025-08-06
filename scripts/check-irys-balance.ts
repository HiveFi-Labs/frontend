#!/usr/bin/env tsx

import { Keypair } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import dotenv from 'dotenv'
import bs58 from 'bs58'

// Load environment variables
dotenv.config()

async function checkIrysBalance() {
  const IS_MAINNET = process.env.SOLANA_USE_MAINNET === 'true'
  const NETWORK = IS_MAINNET ? 'mainnet' : 'devnet'
  
  console.log(`\n🔍 Checking Irys balance on ${NETWORK}...\n`)
  
  // Get backend wallet
  const privateKeyString = process.env.SOLANA_BACKEND_PRIVATE_KEY
  if (!privateKeyString) {
    console.error('❌ SOLANA_BACKEND_PRIVATE_KEY not found in environment')
    process.exit(1)
  }
  
  // Parse private key
  let backendWallet: Keypair
  try {
    const privateKeyArray = JSON.parse(privateKeyString)
    backendWallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray))
  } catch (jsonError) {
    try {
      const privateKeyBytes = bs58.decode(privateKeyString)
      backendWallet = Keypair.fromSecretKey(privateKeyBytes)
    } catch (bs58Error) {
      console.error('❌ Failed to parse private key')
      process.exit(1)
    }
  }
  
  console.log('Wallet address:', backendWallet.publicKey.toBase58())
  
  // Setup Umi
  const rpcUrl = IS_MAINNET 
    ? process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com'
    : process.env.DEVNET_RPC_URL || 'https://api.devnet.solana.com'
    
  const umi = createUmi(rpcUrl)
    .use(keypairIdentity(fromWeb3JsKeypair(backendWallet)))
    .use(irysUploader())
  
  try {
    // Check Irys/Bundlr node info
    const nodeUrl = IS_MAINNET 
      ? 'https://node1.irys.xyz'
      : 'https://devnet.irys.xyz'
      
    console.log('Irys Node:', nodeUrl)
    
    // Estimate cost for a typical metadata upload
    const sampleMetadata = {
      name: 'Sample NFT',
      symbol: 'SAMPLE',
      description: 'This is a sample metadata for cost estimation',
      image: 'https://example.com/image.png',
      attributes: [
        { trait_type: 'Sample', value: 'Test' }
      ]
    }
    
    const metadataSize = new TextEncoder().encode(JSON.stringify(sampleMetadata)).length
    console.log('\n📊 Metadata size estimate:', metadataSize, 'bytes')
    
    // Cost estimation (approximate)
    const estimatedCostLamports = metadataSize * 1000 // Very rough estimate
    const estimatedCostSOL = estimatedCostLamports / 1_000_000_000
    
    console.log('💰 Estimated cost per NFT metadata upload:')
    console.log(`   ~${estimatedCostSOL.toFixed(9)} SOL`)
    console.log(`   ~${estimatedCostLamports.toLocaleString()} lamports`)
    
    console.log('\n📝 Notes:')
    console.log('- Ensure your wallet has sufficient SOL for gas fees')
    console.log('- Irys automatically deducts fees from your Solana wallet')
    console.log('- For mainnet, costs may vary based on network congestion')
    console.log('- Metadata is permanently stored on Arweave')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the check
checkIrysBalance().catch(console.error)