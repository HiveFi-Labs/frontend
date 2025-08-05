# Solana Compressed NFT Scripts

このディレクトリには、Compressed NFT の設定と管理に必要なスクリプトが含まれています。

## 📋 スクリプト一覧

1. **create-merkle-tree.ts** - Merkle Tree を作成
2. **view-cnft.ts** - 発行済み cNFT の情報を表示
3. **upload-metadata.ts** - NFT メタデータのアップロード準備

## create-merkle-tree.ts

Compressed NFT を格納するための Merkle Tree を作成するスクリプトです。

### 使用方法

1. 環境変数を設定（`.env.local`）:
   ```env
   SOLANA_BACKEND_PRIVATE_KEY=your_private_key_here
   SOLANA_USE_MAINNET=false  # true for mainnet
   SOLANA_RPC_URL=https://api.devnet.solana.com  # optional
   ```

2. スクリプトを実行:
   ```bash
   # 依存関係をインストール
   pnpm install

   # Devnet で実行（デフォルト）
   npx ts-node scripts/create-merkle-tree.ts
   
   # または明示的にネットワークを指定
   npx ts-node scripts/create-merkle-tree.ts --network=devnet
   
   # Mainnet で実行（確認プロンプトが表示されます）
   npx ts-node scripts/create-merkle-tree.ts --network=mainnet
   ```

3. 出力された `SOLANA_MERKLE_TREE_ADDRESS` を `.env.local` に追加

### ネットワークの選択

- **コマンドライン引数**: `--network=devnet` または `--network=mainnet`
- **環境変数**: `SOLANA_USE_MAINNET=true` または `false`
- **優先順位**: コマンドライン引数 > 環境変数 > デフォルト（devnet）

### Merkle Tree の設定

- **maxDepth**: 14（最大 16,384 個の NFT を格納可能）
- **maxBufferSize**: 64（同時に処理できる変更の最大数）
- **canopyDepth**: 0（コスト削減のため。composability が必要な場合は増やす）

### 注意事項

- Merkle Tree の作成には SOL が必要です（devnet では無料の SOL を取得可能）
- Tree Authority は自動的に作成者のウォレットに設定されます
- 一度作成した Merkle Tree は削除できません
- mainnet で作成する前に、必ず devnet でテストしてください

## view-cnft.ts

発行済みの Compressed NFT の情報を表示するスクリプトです。

### 使用方法

```bash
# cNFT の情報を表示
npx ts-node scripts/view-cnft.ts <merkle-tree-address> <leaf-index>

# 例（あなたの発行した cNFT）
npx ts-node scripts/view-cnft.ts 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5 8
```

### 注意事項

- デフォルトの RPC では一部の情報が取得できない場合があります
- DAS API 対応の RPC（Helius、Triton など）の使用を推奨

## upload-metadata.ts

NFT のメタデータ（名前、説明、画像など）をアップロードするための準備スクリプトです。

### 使用方法

```bash
# メタデータファイルを生成
npx ts-node scripts/upload-metadata.ts
```

### メタデータのアップロード先

1. **Arweave**（推奨）- 永続的なストレージ
   - ArDrive: https://ardrive.io
   - Bundlr: https://bundlr.network

2. **IPFS** - 分散型ストレージ
   - Pinata: https://pinata.cloud
   - NFT.Storage: https://nft.storage

3. **その他** - テスト用
   - AWS S3、Google Cloud Storage など

## 🎨 cNFT を表示する方法

### 1. スクリプトを使用

```bash
npx ts-node scripts/view-cnft.ts 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5 8
```

### 2. DAS API を使用

Helius などの DAS API 対応サービスを使用：

```bash
curl https://api.helius.xyz/v0/addresses/YOUR_WALLET_ADDRESS/assets?api-key=YOUR_API_KEY
```

### 3. cNFT 対応ウォレット

- Phantom Wallet（一部対応）
- Backpack Wallet
- その他の cNFT 対応ウォレット

### 4. エクスプローラー

現在、多くの Solana エクスプローラーは cNFT を完全にはサポートしていませんが、以下で確認できる場合があります：

- Solana Explorer（限定的なサポート）
- Solscan（一部対応）
- Explorer.solana.com

## エラーが発生した場合

### AccountNotInitialized エラー

このエラーは、Merkle Tree が正しく初期化されていない場合に発生します。

解決方法：
1. 新しい Merkle Tree を作成する（上記のスクリプトを使用）
2. `.env.local` の `SOLANA_MERKLE_TREE_ADDRESS` を更新する
3. API を再起動する

### insufficient funds エラー

ウォレットに十分な SOL がない場合に発生します。

解決方法：
- devnet: `solana airdrop 2` コマンドで SOL を取得
- mainnet: SOL を購入してウォレットに送金

## 📝 重要な情報

発行された cNFT の情報：
- **Merkle Tree**: `4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5`
- **Leaf Index**: `8`
- **Collection**: `BWd5NGvGex4ikVFRzZuxSaFPw5TLcdXeL2PofLcJFtwy`
- **Network**: devnet

この情報を使用して、cNFT の詳細を確認できます。