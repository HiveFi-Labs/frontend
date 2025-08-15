// Collection metadata configuration
export interface CollectionMetadata {
  name: string
  symbol: string
  description: string
  imageUrl: string
}

// Get collection-specific metadata based on collection mint address
export function getCollectionMetadata(collectionMint?: string): CollectionMetadata {
  // Default collection metadata
  const defaultMetadata: CollectionMetadata = {
    name: 'HiveFi Pioneer Bee',
    symbol: 'HGPB',
    description: 'HiveFi Genesis Pioneer - Early Adopter Badge',
    imageUrl: 'https://arweave.net/UiXkg2lr2zK5V2mMig1tqkjeV1dOZyGg_53rFeIUAhQ'
  }
  
  if (!collectionMint) {
    return defaultMetadata
  }
  
  // Collection-specific configurations
  // You can add more collections here as needed
  const collectionConfigs: Record<string, CollectionMetadata> = {
    // Example: Different metadata for different collections
    '7riAEfpG1EyJ2TQK6k17rqCrAyNfpBNAe3r3Pu1joVD5': {
      name: 'HiveFi Pioneer Bee',
      symbol: 'HGPB',
      description: 'HiveFi Genesis Pioneer - Early Adopter Badge',
      imageUrl: 'https://arweave.net/UiXkg2lr2zK5V2mMig1tqkjeV1dOZyGg_53rFeIUAhQ'
    },
    // Add more collections as needed
  }
  
  return collectionConfigs[collectionMint] || defaultMetadata
}