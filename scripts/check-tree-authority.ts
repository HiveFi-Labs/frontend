#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'
import bs58 from 'bs58'
import { getSolanaAddresses, getActiveNetworkFromEnv, getSolanaAddressesForNetwork, ClusterType } from '../config/solana-addresses'
import { Command } from 'commander'
import { getBackendWallet } from '../lib/get-backend-wallet'

// Load environment variables
dotenv.config()

async function checkTreeAuthority(options: { network?: ClusterType }) {
  // Use command line network if provided, otherwise detect from env
  const envNetwork = getActiveNetworkFromEnv()
  const selectedNetwork = options.network || envNetwork
  const IS_MAINNET = selectedNetwork === 'mainnet'
  const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'
  
  // Get addresses from config
  const addresses = getSolanaAddressesForNetwork(selectedNetwork)
  const MERKLE_TREE = addresses.merkleTreeAddress
  
  console.log(`\n🌳 Checking Merkle Tree authority on ${NETWORK}${options.network ? ' (override via --network)' : ''}...\n`)
  
  // Get backend wallet using network-specific private key
  let backendWallet: Keypair
  try {
    // Temporarily set the network for the utility function
    const originalNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK
    process.env.NEXT_PUBLIC_SOLANA_NETWORK = selectedNetwork
    
    backendWallet = getBackendWallet()
    console.log(`✅ Successfully loaded backend wallet for ${selectedNetwork}`)
    
    // Restore original network
    if (originalNetwork) {
      process.env.NEXT_PUBLIC_SOLANA_NETWORK = originalNetwork
    } else {
      delete process.env.NEXT_PUBLIC_SOLANA_NETWORK
    }
  } catch (walletError) {
    console.error('❌ Failed to get backend wallet:', walletError)
    return
  }
  
  console.log('Backend wallet:', backendWallet.publicKey.toBase58())
  console.log('Merkle tree:', MERKLE_TREE)
  
  // Setup connection
  const rpcUrl = IS_MAINNET 
    ? process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com'
    : process.env.DEVNET_RPC_URL || 'https://api.devnet.solana.com'
    
  const umi = createUmi(rpcUrl).use(mplBubblegum())
  
  try {
    // Get tree config
    const treeConfig = await umi.rpc.getAccount(publicKey(MERKLE_TREE))
    
    if (!treeConfig.exists) {
      console.error('❌ Merkle tree account does not exist')
      return
    }
    
    console.log('\n📊 Tree Information:')
    console.log('   Account exists: ✅')
    console.log('   Data size:', treeConfig.data.length, 'bytes')
    
    // For cNFTs, the tree authority is derived from the tree address
    const [treeAuthority] = PublicKey.findProgramAddressSync(
      [new PublicKey(MERKLE_TREE).toBuffer()],
      new PublicKey('BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY')
    )
    
    console.log('\n🔑 Authority Information:')
    console.log('   Tree authority PDA:', treeAuthority.toBase58())
    console.log('   Your wallet:', backendWallet.publicKey.toBase58())
    
    // Note: The tree authority PDA is derived from the tree address
    // The actual minting authority is the wallet that created the tree
    console.log('\n📝 Note:')
    console.log('   The Tree Authority PDA is a derived address.')
    console.log('   Your wallet controls the tree if it was the creator.')
    console.log('   Testing actual minting capability is the best verification.')
    
    // Check if the wallet can actually mint (best test)
    console.log('\n🧪 Testing minting capability:')
    console.log('   Run a test mint to verify your wallet has authority.')
    console.log('   If minting succeeds, your wallet has the correct permissions.')
    
  } catch (error) {
    console.error('❌ Error checking tree authority:', error)
  }
}

// CLI setup
const program = new Command()

program
  .name('check-tree-authority')
  .description('Check Merkle tree authority configuration')
  .option('-n, --network <network>', 'network to check (mainnet or devnet)', (value) => {
    if (value !== 'mainnet' && value !== 'devnet') {
      throw new Error('Network must be mainnet or devnet')
    }
    return value as ClusterType
  })
  .action(checkTreeAuthority)

program.parse(process.argv)