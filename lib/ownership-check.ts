import { getAssetIdByOwnerAndCollection } from './get-asset-id';

/**
 * ウォレットが指定コレクションの NFT を既に所有しているかオンチェーンで確認
 * @param walletAddress ウォレットアドレス
 * @param collectionMint コレクションミントアドレス
 * @param heliusApiKey Helius API キー
 * @param isMainnet メインネットかどうか（true: mainnet-beta, false: devnet）
 * @returns 所有している場合は assetId、所有していない場合は null
 */
export async function checkOwnedAssetIdByWalletAndCollection(
  walletAddress: string,
  collectionMint: string,
  heliusApiKey: string | undefined,
  isMainnet: boolean
): Promise<string | null> {
  if (!heliusApiKey) {
    console.log('Helius API key not provided, skipping on-chain ownership check');
    return null;
  }

  try {
    const assetId = await getAssetIdByOwnerAndCollection(
      walletAddress,
      collectionMint,
      heliusApiKey,
      isMainnet
    );

    if (assetId) {
      console.log(`On-chain ownership detected for wallet ${walletAddress} in collection ${collectionMint}: ${assetId}`);
    }

    return assetId;
  } catch (error) {
    console.error('Error checking on-chain ownership:', error);
    // エラーが発生してもプロセスは継続（null を返す）
    return null;
  }
}

/**
 * ネットワーク文字列を isMainnet ブール値に変換
 * @param network "mainnet-beta" または "devnet"
 * @returns mainnet-beta の場合 true、それ以外は false
 */
export function networkToIsMainnet(network: string): boolean {
  const n = (network || '').toLowerCase()
  return n === 'mainnet' || n === 'mainnet-beta'
}