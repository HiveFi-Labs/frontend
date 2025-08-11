#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { getSolanaAddresses, getActiveNetworkFromEnv, getSolanaAddressesForNetwork } from '../config/solana-addresses'
import { Command } from 'commander'

// Load environment variables
dotenv.config()

async function checkNetworkConfig(options: { network?: 'mainnet' | 'devnet' }) {
  console.log('\n🔍 Checking network configuration...\n')
  
  // Use command line network if provided, otherwise detect from env
  const envNetwork = getActiveNetworkFromEnv()
  const selectedNetwork = options.network || envNetwork
  const isMainnet = selectedNetwork === 'mainnet'
  const publicNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK
  
  // Get addresses from config
  const addresses = getSolanaAddressesForNetwork(selectedNetwork)
  const merkleTree = addresses.merkleTreeAddress
  const collection = addresses.collectionMint
  
  console.log('Configuration:')
  console.log(`- NEXT_PUBLIC_SOLANA_NETWORK: ${publicNetwork || 'NOT SET'} (${isMainnet ? 'mainnet' : 'devnet'})`)
  console.log(`- Active Network: ${selectedNetwork}${options.network ? ' (override via --network)' : ''}`)
  console.log(`- SOLANA_RPC_URL: ${process.env.SOLANA_RPC_URL || 'default (devnet/mainnet)'}`)
  console.log(`- Merkle Tree Address: ${merkleTree} (from config)`)
  console.log(`- Collection Mint: ${collection} (from config)`)
  
  // Check consistency
  console.log('\n🔧 Configuration Check:')
  
  if (!publicNetwork) {
    console.log('❌ ERROR: NEXT_PUBLIC_SOLANA_NETWORK is not set')
  } else if (publicNetwork !== 'mainnet' && publicNetwork !== 'devnet') {
    console.log(`❌ ERROR: NEXT_PUBLIC_SOLANA_NETWORK has invalid value: ${publicNetwork}`)
  } else {
    console.log('✅ Network configuration is valid')
  }
  
  console.log('✅ Merkle tree and collection addresses loaded from config')
  
  // Show both network configs if different from env
  if (options.network && options.network !== envNetwork) {
    console.log('\n📊 Other Network Configuration:')
    const otherAddresses = getSolanaAddressesForNetwork(envNetwork)
    console.log(`- ${envNetwork} Merkle Tree: ${otherAddresses.merkleTreeAddress}`)
    console.log(`- ${envNetwork} Collection: ${otherAddresses.collectionMint}`)
  }
  
  console.log('\n📝 localStorage Key Pattern:')
  console.log(`- Key format: claimed_${selectedNetwork}_genesis-pioneer-bee-v1_<wallet-address>`)
  
  console.log('\n⚠️  Important:')
  console.log('- Restart the Next.js server after changing NEXT_PUBLIC_SOLANA_NETWORK')
  console.log('- Clear browser localStorage if switching between networks')
  console.log('- Addresses are now loaded from config/solana-addresses.ts')
}

// CLI setup
const program = new Command()

program
  .name('check-network-config')
  .description('Check Solana network configuration')
  .option('-n, --network <network>', 'network to check (mainnet or devnet)', (value) => {
    if (value !== 'mainnet' && value !== 'devnet') {
      throw new Error('Network must be mainnet or devnet')
    }
    return value as 'mainnet' | 'devnet'
  })
  .action(checkNetworkConfig)

program.parse(process.argv)