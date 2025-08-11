export type ClusterType = 'mainnet' | 'devnet'

export interface SolanaAddresses {
  merkleTreeAddress: string
  collectionMint: string
}

const addresses: Record<ClusterType, SolanaAddresses> = {
  mainnet: {
    merkleTreeAddress: '3PzT8RYNpWuPPoacQDwHFtUREQRS71Hc2XRJ41XjZkBv',
    collectionMint: '8DHG6biZnpRYYxX4fneUH9A9fErZfzF8ssFcsLiz1HTR'
  },
  devnet: {
    merkleTreeAddress: '7nGJxDfiYp3wqpnoxKNDRKjSsfnbDaE4iVeuZVE7Mzau',
    collectionMint: '7riAEfpG1EyJ2TQK6k17rqCrAyNfpBNAe3r3Pu1joVD5'
  }
}

/**
 * 環境変数からアクティブなネットワークを取得
 */
export function getActiveNetworkFromEnv(): ClusterType {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || process.env.SOLANA_NETWORK || 'mainnet'
  
  if (network !== 'mainnet' && network !== 'devnet') {
    console.warn(`Invalid network "${network}", defaulting to mainnet`)
    return 'mainnet'
  }
  
  return network as ClusterType
}

/**
 * 現在のネットワークの Solana アドレスを取得
 */
export function getSolanaAddresses(): SolanaAddresses {
  const network = getActiveNetworkFromEnv()
  return addresses[network]
}

/**
 * 特定のネットワークの Solana アドレスを取得
 */
export function getSolanaAddressesForNetwork(network: ClusterType): SolanaAddresses {
  return addresses[network]
}