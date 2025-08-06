import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { publicKey } from '@metaplex-foundation/umi'

export async function getAssetIdByOwnerAndCollection(
  ownerAddress: string,
  collectionMint: string,
  heliusApiKey: string,
  isMainnet: boolean = false
): Promise<string | null> {
  try {
    // Setup Umi with DAS API
    const dasRpcUrl = isMainnet 
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    
    const umi = createUmi(dasRpcUrl).use(dasApi())
    
    // Get all assets owned by the wallet
    const assets = await umi.rpc.getAssetsByOwner({
      owner: publicKey(ownerAddress),
    })
    
    // Find the most recent asset from our collection
    const collectionAssets = assets.items.filter(asset => {
      if (asset.grouping && asset.grouping.length > 0) {
        return asset.grouping.some(group => 
          group.group_key === 'collection' && 
          group.group_value === collectionMint
        )
      }
      return false
    })
    
    if (collectionAssets.length > 0) {
      // Return the first (most recent) asset
      return collectionAssets[0].id
    }
    
    return null
  } catch (error) {
    console.error('Error getting asset ID:', error)
    return null
  }
}