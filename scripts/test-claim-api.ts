#!/usr/bin/env ts-node

/**
 * Test script for the NFT claim API
 * Usage: npx tsx scripts/test-claim-api.ts
 */

async function testClaimAPI() {
  const API_URL = 'http://localhost:3000/api/claim'
  
  // Test wallet address (devnet)
  const testWalletAddress = 'HN7cABqLq46Es1jh92dQQisAi662SmxELLLsHHe4YWrH'
  
  console.log('Testing NFT Claim API...')
  console.log('API URL:', API_URL)
  console.log('Test wallet:', testWalletAddress)
  console.log('')
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: testWalletAddress,
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText)
      console.error('Response:', data)
      return
    }
    
    if (data.success) {
      console.log('✅ NFT minted successfully!')
      console.log('Transaction signature:', data.signature)
      console.log('Mint address:', data.mintAddress)
      console.log('Token account:', data.tokenAccount)
      console.log('')
      console.log('View transaction on Solana Explorer:')
      console.log(`https://explorer.solana.com/tx/${data.signature}?cluster=devnet`)
    } else {
      console.error('❌ Failed to mint NFT:', data.error)
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }
}

// Run the test
testClaimAPI()