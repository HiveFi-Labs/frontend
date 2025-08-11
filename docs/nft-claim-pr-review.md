# NFT Claim 機能 - PR レビューガイド

このドキュメントは、`add-nft-claim` ブランチで実装された NFT Claim 機能のレビューを支援するためのガイドです。

## 概要

HiveFi の早期アダプター向けに、Solana の圧縮 NFT (cNFT) を発行する機能を実装しました。この NFT は、2025年4月以前にアカウント登録したユーザー（18,755名）のみが取得可能です。

## 主要な機能

### 1. NFT Claim ページ (`/claim`)
- Privy 認証によるウォレット接続
- ホワイトリストによる権限チェック
- ガス代不要（バックエンドウォレットが負担）
- NFT の画像とメタデータ表示
- 発行済み NFT の確認機能

### 2. 技術スタック
- **Solana Compressed NFTs (cNFTs)**: Metaplex Bubblegum を使用
- **認証**: Privy による Web3 認証
- **メタデータストレージ**: Irys 経由で Arweave に保存
- **RPC/DAS API**: Helius を使用

## 設定手順

### 必要な環境変数

```bash
# ネットワーク設定（devnet または mainnet）
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Helius API キー（DAS API 用）
# https://www.helius.dev/ で無料取得可能
HELIUS_API_KEY=your_helius_api_key_here

# バックエンドウォレット（Base58 形式）
# このウォレットが Merkle Tree の権限を持ち、ガス代を支払います
# ネットワーク別の秘密鍵（NEXT_PUBLIC_SOLANA_NETWORK に応じて自動選択）
DEVNET_BACKEND_PRIVATE_KEY=your_devnet_private_key  # Devnet 用
MAINNET_BACKEND_PRIVATE_KEY=your_mainnet_private_key  # Mainnet 用
# または、両ネットワーク共通の鍵を使用する場合
SOLANA_BACKEND_PRIVATE_KEY=your_private_key_here  # 後方互換性のため残存

# RPC URL（オプション）
DEVNET_RPC_URL=https://api.devnet.solana.com
MAINNET_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
```

**重要な変更**: Merkle Tree アドレスとコレクションミントアドレスは、環境変数ではなく `config/solana-addresses.ts` で管理されるようになりました。

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

### 事前準備

1. **Helius API キーの取得**
   - [Helius](https://www.helius.dev/) でアカウント作成
   - 無料プランで十分（月 100,000 クレジット）

2. **バックエンドウォレットの準備**
   ```bash
   # 新規ウォレット作成（既存のものを使用する場合は不要）
   solana-keygen new --outfile backend-wallet.json
   
   # アドレスを確認
   solana address -k backend-wallet.json
   
   # 秘密鍵を Base58 形式で取得
   cat backend-wallet.json | jq -r '. | @base64d' | base58
   ```
   
   **注意**: ネットワーク別に異なるウォレットを使用する場合は、それぞれの秘密鍵を設定してください。

3. **SOL の補充**
   - Devnet: `solana airdrop 2 <WALLET_ADDRESS> --url devnet`
   - Mainnet: 取引所等から SOL を送金（最低 0.1 SOL 推奨）

### ローカル開発での動作確認

1. 環境変数を設定
2. `npm run dev` でサーバー起動
3. `/claim` ページにアクセス
4. Privy でログイン（ホワイトリストに含まれるアカウントを使用）
5. NFT を Claim

**重要**: API の直接テストでは、Privy から取得した Bearer トークンが必須です。

## 主要な変更点

### 新規追加ファイル

#### ページ・コンポーネント
- `/app/claim/page.tsx` - NFT Claim UI ページ

#### API ルート
- `/app/api/claim/route.ts` - NFT 発行エンドポイント
- `/app/api/claim/check/route.ts` - 発行済み確認エンドポイント
- `/app/api/nft/metadata/route.ts` - NFT メタデータ取得エンドポイント

#### ライブラリ
- `/lib/claim-constants.ts` - Claim 機能の定数定義
- `/lib/claim-queue.ts` - 同時リクエスト処理用キュー
- `/lib/claim-storage.ts` - 発行記録の永続化
- `/lib/collection-metadata.ts` - コレクションメタデータ管理
- `/lib/get-asset-id.ts` - Asset ID 取得ユーティリティ
- `/lib/get-collection-count.ts` - コレクション内の NFT 数カウント

#### データ
- `/data/user_whitelist.ts` - ホワイトリスト（18,755名）

#### ユーティリティスクリプト
- `/scripts/create-merkle-tree.ts` - Merkle Tree 作成
- `/scripts/check-wallet-balance.ts` - ウォレット残高確認
- `/scripts/check-tree-authority.ts` - Tree 権限確認
- `/scripts/check-nft-metadata.ts` - NFT メタデータ確認
- その他デバッグ用スクリプト

### 既存ファイルの変更
- `/components/header.tsx` - "Claim NFT" リンク追加
- `/lib/constants.ts` - Solana ネットワーク定数追加

## 実装の特徴

### 1. キューシステム
`p-queue` を使用して同時リクエストを制御し、Merkle Tree への同時書き込みエラーを防止。

### 2. 永続ストレージ
`/data/claimed-nfts.json` に発行記録を保存。サーバー再起動後も発行履歴を保持。

### 3. メタデータ管理
- 各 NFT に固有の ID を付与（コレクション内の発行順）
- Irys を使用して個別メタデータを Arweave にアップロード
- DAS API を使用してメタデータを取得・表示

### 4. エラーハンドリング
- ホワイトリスト外のユーザーへの明確なエラーメッセージ
- ネットワークエラー時のリトライ機能
- 残高不足時の適切なエラー表示

## セキュリティ考慮事項

1. **認証**: Bearer トークンによる API 認証が必須
2. **ホワイトリスト**: Privy ユーザー ID による厳格な権限管理
3. **ウォレット検証**: アカウントにリンクされたウォレットのみ許可
4. **二重発行防止**: 永続ストレージとメモリキャッシュの二重チェック
5. **プライベートキー**: 環境変数で管理、コードにハードコードなし

## テスト方法

### Devnet でのテスト
1. Devnet 用の環境変数を設定
2. バックエンドウォレットに Devnet SOL を補充
   ```bash
   solana airdrop 2 <WALLET_ADDRESS> --url devnet
   ```
3. Merkle Tree と Collection を作成（既存のものがない場合）
   ```bash
   npx tsx scripts/create-merkle-tree.ts
   ```
4. 作成された Merkle Tree と Collection のアドレスを `config/solana-addresses.ts` に設定
5. テスト用 Privy アカウントを作成
6. `user_whitelist.ts` にテストアカウントを追加
7. NFT 発行をテスト

#### API テストの例

```bash
# Bearer トークンを使用したテスト
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -d '{
    "walletAddress": "YOUR_WALLET_ADDRESS"
  }'

# 認証なしでのテスト（401 エラーが期待される）
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "YOUR_WALLET_ADDRESS"
  }'

# 無効なトークンでのテスト（401 エラーが期待される）
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{
    "walletAddress": "YOUR_WALLET_ADDRESS"
  }'
```

### Mainnet への移行
1. `NEXT_PUBLIC_SOLANA_NETWORK=mainnet` に変更
2. Mainnet 用の Merkle Tree と Collection を設定
3. バックエンドウォレットに十分な SOL を確保
4. Irys アカウントの資金確認

## トラブルシューティング

### よくある問題

1. **"Authentication required" エラー**
   - Bearer トークンが提供されているか確認
   - Authorization ヘッダーの形式が正しいか確認

2. **"Invalid or expired access token" エラー**
   - トークンの有効期限を確認
   - Privy で再ログインして新しいトークンを取得

3. **"Wallet not linked to account" エラー**
   - 指定したウォレットがログイン中のアカウントにリンクされているか確認

4. **"You are not on the whitelist" エラー**
   - Privy ユーザー ID がホワイトリストに含まれているか確認

2. **"Insufficient SOL balance" エラー**
   - バックエンドウォレットの残高を確認
   - `scripts/check-wallet-balance.ts` を使用

3. **NFT 画像が表示されない**
   - Helius API キーが正しく設定されているか確認
   - DAS API がネットワークで利用可能か確認

## パフォーマンス最適化

1. **LocalStorage キャッシュ**: 発行済み確認の高速化
2. **並列処理**: メタデータ取得と画像表示の非同期処理
3. **キュー管理**: 大量の同時リクエストに対応

## 今後の拡張可能性

1. NFT の特典機能追加
2. 複数コレクションのサポート
3. NFT のトレード機能
4. ダイナミックメタデータの実装

## レビューポイント

PR レビュー時には以下の点を確認してください：

1. [ ] 環境変数が適切に設定されているか
2. [ ] エラーハンドリングが適切か
3. [ ] セキュリティ上の懸念がないか
4. [ ] パフォーマンスの問題がないか
5. [ ] コードの可読性と保守性
6. [ ] TypeScript の型定義が適切か

## 参考リンク

- [Metaplex Bubblegum Documentation](https://developers.metaplex.com/bubblegum)
- [Helius DAS API](https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api)
- [Privy Documentation](https://docs.privy.io/)
- [Irys Documentation](https://docs.irys.xyz/)