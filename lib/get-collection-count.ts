import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { publicKey } from '@metaplex-foundation/umi'

/**
 * Get the total number of NFTs minted in a collection
 * This uses DAS API to get all assets in the collection and count them
 */
export async function getCollectionMintCount(
  collectionMint: string,
  heliusApiKey: string,
  isMainnet: boolean = false
): Promise<number> {
  try {
    // Setup Umi with DAS API
    const dasRpcUrl = isMainnet 
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    
    const umi = createUmi(dasRpcUrl).use(dasApi())
    
    console.log(`Fetching collection count for: ${collectionMint}`)
    
    // Get all assets in the collection
    // Note: This approach works well for small collections
    // For very large collections (>1000 NFTs), you'd need pagination
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionMint,
      limit: 1000, // Maximum limit per request
    })
    
    const totalCount = assets.total || assets.items.length
    console.log(`Found ${totalCount} NFTs in collection`)
    
    return totalCount
  } catch (error) {
    console.error('Error getting collection count:', error)
    // Return 0 if we can't get the count, so minting can continue
    return 0
  }
}

/**
 * Get the next NFT ID for a collection
 * Returns the count + 1 (so if there are 5 NFTs, next ID is 6)
 */
export async function getNextCollectionId(
  collectionMint: string,
  heliusApiKey: string,
  isMainnet: boolean = false
): Promise<number> {
  const currentCount = await getCollectionMintCount(collectionMint, heliusApiKey, isMainnet)
  return currentCount + 1
}