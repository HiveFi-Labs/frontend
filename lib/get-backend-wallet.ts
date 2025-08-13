import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

/**
 * ネットワークに基づいて適切なバックエンドウォレットを取得
 * @returns Solana Keypair
 * @throws Error if private key is not configured or invalid
 */
export function getBackendWallet(): Keypair {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
  const isMainnet = network === 'mainnet' || network === 'mainnet-beta'
  
  // ネットワークに応じて適切な秘密鍵を選択
  const privateKeyString = isMainnet
    ? process.env.MAINNET_BACKEND_PRIVATE_KEY
    : process.env.DEVNET_BACKEND_PRIVATE_KEY
  
  if (!privateKeyString) {
    const networkName = isMainnet ? 'MAINNET' : 'DEVNET'
    throw new Error(`${networkName}_BACKEND_PRIVATE_KEY not found in environment`)
  }
  
  // 秘密鍵のパース（複数フォーマットに対応）
  try {
    // Try parsing as JSON array first
    const privateKeyArray = JSON.parse(privateKeyString)
    return Keypair.fromSecretKey(new Uint8Array(privateKeyArray))
  } catch (jsonError) {
    try {
      // Try parsing as base64
      const privateKeyBuffer = Buffer.from(privateKeyString, 'base64')
      return Keypair.fromSecretKey(privateKeyBuffer)
    } catch (base64Error) {
      try {
        // Try parsing as base58 (common Solana format)
        const privateKeyBytes = bs58.decode(privateKeyString)
        return Keypair.fromSecretKey(privateKeyBytes)
      } catch (bs58Error) {
        throw new Error('Invalid private key format. Supported formats: JSON array, base64, base58')
      }
    }
  }
}

/**
 * 現在のネットワーク設定を取得
 * @returns 'mainnet' | 'devnet'
 */
export function getCurrentNetwork(): 'mainnet' | 'devnet' {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
  return (network === 'mainnet' || network === 'mainnet-beta') ? 'mainnet' : 'devnet'
}