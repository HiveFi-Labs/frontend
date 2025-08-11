#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import bs58 from 'bs58'
import { getBackendWallet } from '../lib/get-backend-wallet'

// Load environment variables
dotenv.config()

async function checkWalletBalance() {
  const IS_MAINNET = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet'
  const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'
  
  console.log(`\n💰 Checking wallet balance on ${NETWORK}...\n`)
  
  // Get backend wallet using network-specific private key
  let backendWallet: Keypair
  try {
    backendWallet = getBackendWallet()
    console.log(`✅ Successfully loaded backend wallet for ${NETWORK}`)
  } catch (walletError) {
    console.error('❌ Failed to get backend wallet:', walletError)
    process.exit(1)
  }
  
  const walletAddress = backendWallet.publicKey.toBase58()
  console.log('Wallet address:', walletAddress)
  
  // Setup connection
  const rpcUrl = IS_MAINNET 
    ? process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com'
    : process.env.DEVNET_RPC_URL || 'https://api.devnet.solana.com'
    
  const connection = new Connection(rpcUrl)
  
  try {
    // Get balance
    const balance = await connection.getBalance(backendWallet.publicKey)
    const balanceInSOL = balance / LAMPORTS_PER_SOL
    
    console.log('\n📊 Wallet Balance:')
    console.log(`   ${balanceInSOL.toFixed(9)} SOL`)
    console.log(`   ${balance.toLocaleString()} lamports`)
    
    // Estimate costs
    console.log('\n💸 Estimated Costs per NFT:')
    console.log('   - Transaction fees: ~0.00025 SOL')
    console.log('   - Irys metadata upload: ~0.00001 SOL')
    console.log('   - Total: ~0.00026 SOL per mint')
    
    // Check if balance is sufficient
    const minRequired = 0.001 // Minimum recommended balance
    if (balanceInSOL < minRequired) {
      console.log(`\n❌ Insufficient balance! You need at least ${minRequired} SOL`)
      console.log(`   Current: ${balanceInSOL.toFixed(9)} SOL`)
      console.log(`   Required: ${minRequired} SOL`)
      
      if (IS_MAINNET) {
        console.log('\n📝 To add funds:')
        console.log('   1. Send SOL to:', walletAddress)
        console.log('   2. Use an exchange or wallet to transfer SOL')
      } else {
        console.log('\n📝 To get devnet SOL:')
        console.log(`   Run: solana airdrop 1 ${walletAddress} --url devnet`)
        console.log('   Or visit: https://faucet.solana.com/')
      }
    } else {
      console.log(`\n✅ Balance is sufficient for minting`)
      const estimatedMints = Math.floor(balanceInSOL / 0.00026)
      console.log(`   Estimated mints possible: ~${estimatedMints}`)
    }
    
  } catch (error) {
    console.error('❌ Error checking balance:', error)
  }
}

// Run the check
checkWalletBalance().catch(console.error)