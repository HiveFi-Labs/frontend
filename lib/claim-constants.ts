// Constants for NFT claiming
export const CLAIM_CONSTANTS = {
  // Collection identifier - change this when deploying a new collection
  // This ensures localStorage keys are unique per collection
  COLLECTION_ID: process.env.NEXT_PUBLIC_COLLECTION_ID || 'genesis-pioneer-bee-v1',
  
  // Get network identifier dynamically
  getNetwork: () => process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  
  // Generate localStorage key for claims
  getClaimKey: (walletAddress: string) => {
    const network = CLAIM_CONSTANTS.getNetwork()
    return `claimed_${network}_${CLAIM_CONSTANTS.COLLECTION_ID}_${walletAddress}`
  },
  
  // Clear old claim keys from localStorage
  clearOldClaimKeys: () => {
    if (typeof window === 'undefined') return
    
    // Remove all old claimed_ keys that don't match the current network and collection
    const network = CLAIM_CONSTANTS.getNetwork()
    const currentKeyPrefix = `claimed_${network}_${CLAIM_CONSTANTS.COLLECTION_ID}_`
    Object.keys(localStorage)
      .filter(key => key.startsWith('claimed_') && !key.startsWith(currentKeyPrefix))
      .forEach(key => {
        console.log(`Removing old claim key: ${key}`)
        localStorage.removeItem(key)
      })
  }
}