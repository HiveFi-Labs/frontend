import { PrivyClient } from '@privy-io/server-auth'
import type { NextRequest } from 'next/server'

// Initialize Privy client
let privyClient: PrivyClient | null = null

function getPrivyClient(): PrivyClient {
  if (!privyClient) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const appSecret = process.env.PRIVY_APP_SECRET

    if (!appId || !appSecret) {
      throw new Error('NEXT_PUBLIC_PRIVY_APP_ID and PRIVY_APP_SECRET must be set in environment variables')
    }

    privyClient = new PrivyClient(appId, appSecret)
  }
  
  return privyClient
}

/**
 * Extract access token from request headers
 * @param req NextRequest object
 * @returns Access token or null if not found
 */
export function getAccessTokenFromRequest(req: NextRequest): string | null {
  // CloudFront/LB 配下では Authorization ヘッダーが別名に転送される場合がある
  const headerCandidates = [
    req.headers.get('authorization'),
    req.headers.get('x-forwarded-authorization'),
    req.headers.get('x-authorization'),
  ].filter(Boolean) as string[]

  for (const header of headerCandidates) {
    if (header.startsWith('Bearer ')) {
      return header.substring(7)
    }
  }

  // フォールバック: Bearer プレフィックスが無い場合でもトークン文字列を返す
  if (headerCandidates.length > 0) {
    return headerCandidates[0] || null
  }

  return null
}

/**
 * Verify Privy access token
 * @param token Access token to verify
 * @returns Verified token data including userId
 * @throws Error if token is invalid
 */
export async function verifyAccessToken(token: string): Promise<{ userId: string }> {
  const privy = getPrivyClient()
  
  try {
    const verifiedClaims = await privy.verifyAuthToken(token)
    
    if (!verifiedClaims.userId) {
      throw new Error('Token does not contain userId')
    }
    
    return { userId: verifiedClaims.userId }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token verification failed: ${error.message}`)
    }
    throw new Error('Token verification failed')
  }
}

/**
 * Get user and their linked wallets
 * @param userId Privy user ID
 * @returns User's linked wallet addresses
 * @throws Error if user not found
 */
export async function getUserAndWallets(userId: string): Promise<string[]> {
  const privy = getPrivyClient()
  
  try {
    const user = await privy.getUser(userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Log user details for debugging
    console.log('User object:', JSON.stringify(user, null, 2))
    console.log('User linked accounts:', JSON.stringify(user.linkedAccounts, null, 2))
    
    // Extract Solana wallet addresses
    type WalletAccount = { type: string; chainType?: string; address?: string }
    const wallets = (user.linkedAccounts as WalletAccount[])
      .filter(account => account.type === 'wallet' && account.chainType === 'solana')
      .map(account => account.address as string)
    
    return wallets
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user wallets: ${error.message}`)
    }
    throw new Error('Failed to get user wallets')
  }
}

/**
 * Assert that a wallet address belongs to a user
 * @param walletAddress Wallet address to check
 * @param userWallets List of user's wallet addresses
 * @throws Error if wallet does not belong to user
 */
export function assertWalletBelongsToUser(walletAddress: string, userWallets: string[]): void {
  const normalizedWalletAddress = walletAddress.toLowerCase()
  const belongsToUser = userWallets.some(
    wallet => wallet.toLowerCase() === normalizedWalletAddress
  )
  
  if (!belongsToUser) {
    throw new Error('Wallet address does not belong to the authenticated user')
  }
}