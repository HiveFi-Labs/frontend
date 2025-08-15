# Solana Compressed NFT Scripts

このディレクトリには、Compressed NFT の設定と管理に必要なスクリプトが含まれています。

## 📋 スクリプト一覧

### セットアップ用
1. **create-merkle-tree.ts** - Merkle Tree を作成

### 確認・デバッグ用
2. **view-cnft.ts** - 発行済み cNFT の情報を表示
3. **check-wallet-balance.ts** - ウォレットの SOL 残高を確認
4. **check-tree-authority.ts** - Merkle Tree の権限を確認
5. **check-nft-metadata.ts** - NFT メタデータを確認
6. **check-irys-balance.ts** - Irys アカウントの残高を確認
7. **check-network-config.ts** - ネットワーク設定を確認
8. **test-collection-count.ts** - コレクション内の NFT 数を確認

## create-merkle-tree.ts

Compressed NFT を格納するための Merkle Tree を作成するスクリプトです。

### 使用方法

1. 環境変数を設定（`.env.local`）:
   ```env
   # ネットワーク別の秘密鍵（NEXT_PUBLIC_SOLANA_NETWORK に応じて自動選択）
   DEVNET_BACKEND_PRIVATE_KEY=your_devnet_private_key  # Devnet 用
   MAINNET_BACKEND_PRIVATE_KEY=your_mainnet_private_key  # Mainnet 用
   # または、両ネットワーク共通の鍵を使用する場合
   SOLANA_BACKEND_PRIVATE_KEY=your_private_key_here  # 後方互換性のため残存
   
   NEXT_PUBLIC_SOLANA_NETWORK=devnet  # 'mainnet' or 'devnet'
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

3. 出力されたアドレスを `config/solana-addresses.ts` に追加

### ネットワークの選択

- **コマンドライン引数**: `--network=devnet` または `--network=mainnet`
- **環境変数**: `NEXT_PUBLIC_SOLANA_NETWORK=mainnet` または `devnet`
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


## 🎨 cNFT を表示する方法

### 1. スクリプトを使用

```bash
npx tsx scripts/view-cnft.ts 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5 8
```

## その他の便利なスクリプト

### check-wallet-balance.ts

ウォレットの SOL 残高を確認します。

```bash
npx tsx scripts/check-wallet-balance.ts
```

### check-tree-authority.ts

Merkle Tree の権限を確認します。TreeAuthorityIncorrect エラーのデバッグに有用です。

```bash
# 現在のネットワークを使用
npx tsx scripts/check-tree-authority.ts

# 特定のネットワークを指定
npx tsx scripts/check-tree-authority.ts --network mainnet
```

### check-irys-balance.ts

Irys アカウントの残高を確認します。Mainnet でのメタデータアップロードに必要です。

```bash
npx tsx scripts/check-irys-balance.ts
```

### test-collection-count.ts

コレクション内の NFT 数を確認します。

```bash
# 現在のネットワークを使用
npx tsx scripts/test-collection-count.ts

# 特定のネットワークを指定
npx tsx scripts/test-collection-count.ts --network devnet
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
2. `config/solana-addresses.ts` の該当ネットワークのアドレスを更新する
3. API を再起動する

### 秘密鍵が見つからないエラー

`DEVNET_BACKEND_PRIVATE_KEY not found` または `MAINNET_BACKEND_PRIVATE_KEY not found` エラーが発生する場合：

解決方法：
1. 現在のネットワーク（`NEXT_PUBLIC_SOLANA_NETWORK`）を確認
2. 対応する秘密鍵を `.env.local` に設定：
   - Devnet の場合: `DEVNET_BACKEND_PRIVATE_KEY=...`
   - Mainnet の場合: `MAINNET_BACKEND_PRIVATE_KEY=...`
   - または共通: `SOLANA_BACKEND_PRIVATE_KEY=...`
3. サーバー/スクリプトを再起動

### insufficient funds エラー

ウォレットに十分な SOL がない場合に発生します。

解決方法：
- devnet: `solana airdrop 2` コマンドで SOL を取得
- mainnet: SOL を購入してウォレットに送金

## 📝 重要な情報

### アドレスの設定

**重要**: Merkle Tree アドレスとコレクションミントアドレスは `config/solana-addresses.ts` で管理されるようになりました。

```typescript
// config/solana-addresses.ts
const addresses = {
  mainnet: {
    merkleTreeAddress: '7PoSJh8sBRx26h2zNmRocSXFEV2tBD8MjkCAQhQsbiXR',
    collectionMint: 'CoDTKqGbfQpqZx8dM5DcudFYCiQYEuRjnzj3LjSgxfSS'
  },
  devnet: {
    merkleTreeAddress: '5KZa3rFaX8FJNuZZfXQjJa5KysBmBcKNfQb6wJBhgcMU',
    collectionMint: '2LArGnJgJxJcgKdRjdtBxk8ZJAy8bnMNSL46s4fyLSFN'
  }
}
```

**環境変数（.env.local）:**
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # または mainnet
```

### 必須環境変数チェックリスト

- [ ] `NEXT_PUBLIC_SOLANA_NETWORK` - ネットワーク設定
- [ ] `HELIUS_API_KEY` - DAS API 用（必須）
- [ ] 秘密鍵（以下のいずれか）：
  - [ ] `DEVNET_BACKEND_PRIVATE_KEY` - Devnet 用バックエンドウォレット
  - [ ] `MAINNET_BACKEND_PRIVATE_KEY` - Mainnet 用バックエンドウォレット
  - [ ] `SOLANA_BACKEND_PRIVATE_KEY` - 両ネットワーク共通バックエンドウォレット

### config ファイルの確認

- [ ] `config/solana-addresses.ts` - 各ネットワークのアドレスが正しく設定されているか確認