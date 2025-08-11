# Compressed NFT (cNFT) セットアップガイド

このガイドでは、HiveFi プラットフォームで Compressed NFT (cNFT) を発行するための完全なセットアップ手順を説明します。

## 目次

1. [概要](#概要)
2. [前提条件](#前提条件)
3. [環境変数の設定](#環境変数の設定)
4. [Merkle Tree の作成](#merkle-tree-の作成)
5. [コレクション NFT の準備](#コレクション-nft-の準備)
6. [メタデータの設定](#メタデータの設定)
7. [動作確認](#動作確認)
8. [本番環境への移行](#本番環境への移行)

## 概要

Compressed NFT (cNFT) は、Solana のスケーラビリティを大幅に向上させる新しい NFT 規格です。通常の NFT と比較して：

- **コスト効率**: 1000分の1以下のコストで発行可能
- **大規模発行**: 数百万個の NFT を効率的に管理
- **Merkle Tree**: オンチェーンストレージを最小化

## 前提条件

### 必要なツール

- Node.js v18 以上
- pnpm パッケージマネージャー
- Solana CLI（オプション）

### 必要な知識

- Solana の基本的な概念（ウォレット、トランザクション）
- 環境変数の設定方法
- コマンドラインの基本操作

### アクセス権限

- **重要**: cNFT の発行は、`data/user_whitelist.ts` にリストされた Privy ユーザーのみが可能です
- ホワイトリストに追加するには、管理者に連絡してください

## 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定します：

```env
# ネットワーク設定（devnet または mainnet）
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # 'devnet' または 'mainnet'

# Helius API キー（DAS API 用 - 必須）
# https://www.helius.dev/ で無料取得可能
HELIUS_API_KEY=あなたの_API_キー

# バックエンドウォレットの秘密鍵
# 形式: JSON配列、Base64、またはBase58
# ネットワーク別の秘密鍵（NEXT_PUBLIC_SOLANA_NETWORK に応じて自動選択）
DEVNET_BACKEND_PRIVATE_KEY=あなたの_devnet_秘密鍵
MAINNET_BACKEND_PRIVATE_KEY=あなたの_mainnet_秘密鍵
# または、両ネットワーク共通の鍵を使用する場合
SOLANA_BACKEND_PRIVATE_KEY=あなたの秘密鍵  # 後方互換性のため残存

# RPC URL（オプション）
DEVNET_RPC_URL=https://api.devnet.solana.com
MAINNET_RPC_URL=https://mainnet.helius-rpc.com/?api-key=あなたの_API_キー
```

### 重要な変更点

1. **Merkle Tree アドレスとコレクションミントアドレスは `config/solana-addresses.ts` で管理されるようになりました。**

2. **秘密鍵はネットワーク別に管理できるようになりました。**
   - `NEXT_PUBLIC_SOLANA_NETWORK` の値に基づいて自動的に選択されます
   - Devnet: `DEVNET_BACKEND_PRIVATE_KEY` → `SOLANA_BACKEND_PRIVATE_KEY` の順で検索
   - Mainnet: `MAINNET_BACKEND_PRIVATE_KEY` → `SOLANA_BACKEND_PRIVATE_KEY` の順で検索

各ネットワークのアドレスは以下のファイルで確認できます：
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

### 秘密鍵の形式

秘密鍵は以下の3つの形式をサポートしています：

1. **JSON 配列形式**（Solana CLI で生成）
   ```
   [123,45,67,89,...]  # 64バイトの配列
   ```

2. **Base64 形式**
   ```
   SGVsbG8gV29ybGQ=...
   ```

3. **Base58 形式**（Phantom ウォレットなど）
   ```
   5K9ft3F4CDHMdGbeUZSyt77b1TJHxgQh7yVtaqVfMaRphceT
   ```

### ウォレットの作成（新規の場合）

```bash
# Solana CLI を使用してウォレットを作成
solana-keygen new --outfile wallet.json

# 内容を確認
cat wallet.json
```

## Merkle Tree の作成

Compressed NFT を格納するための Merkle Tree を作成します。

### 1. devnet で作成

```bash
# devnet で Merkle Tree を作成（デフォルト）
npx ts-node scripts/create-merkle-tree.ts

# または明示的にネットワークを指定
npx ts-node scripts/create-merkle-tree.ts --network=devnet
```

### 2. 出力例

```
🌳 Creating Merkle Tree for Compressed NFTs...

📡 Network: devnet
🔗 RPC URL: https://api.devnet.solana.com

💳 Tree Creator: あなたのウォレットアドレス

🔨 Creating Merkle Tree...
🌲 Merkle Tree Address: 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5

✅ Merkle Tree created successfully!
📝 Transaction Signature: トランザクション署名
👤 Tree Authority: あなたのウォレットアドレス

📋 Add this to your .env.local file:
SOLANA_MERKLE_TREE_ADDRESS=4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5
```

### 3. アドレスの更新

新しい Merkle Tree を作成した場合は、`config/solana-addresses.ts` を更新してください：

```typescript
// config/solana-addresses.ts の該当ネットワーク部分を更新
devnet: {
  merkleTreeAddress: '4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5', // 新しいアドレス
  collectionMint: '既存のコレクションミントアドレス'
}
```

### Merkle Tree の仕様

- **maxDepth**: 14（最大 16,384 個の NFT を格納可能）
- **maxBufferSize**: 64（同時処理可能な変更数）
- **canopyDepth**: 0（コスト削減のため）

## コレクション NFT の準備

cNFT はコレクションに属する必要があります。既存のコレクションを使用するか、新しく作成します。

### 既存のコレクションを使用

`config/solana-addresses.ts` で該当ネットワークのコレクションミントアドレスを更新：

```typescript
// config/solana-addresses.ts
devnet: {
  merkleTreeAddress: '既存のMerkleTreeアドレス',
  collectionMint: 'YR6XuTDu8F6hc5HHPgXk5Vunw7MoZW6MJtze2oTD8DL' // 更新
}
```

### 新しいコレクションを作成

通常の NFT としてコレクションを作成する必要があります。詳細は Metaplex のドキュメントを参照してください。

## メタデータの設定

NFT の表示情報（名前、説明、画像）は、Irys を使用して自動的に Arweave にアップロードされます。

### メタデータの構造

各 NFT には以下の情報が含まれます：

```json
{
  "name": "HiveFi Genesis Pioneer #1",
  "symbol": "PIONEER",
  "description": "Genesis Pioneer NFT for HiveFi early adopters. This NFT represents your commitment as one of the earliest members of the HiveFi community.",
  "image": "https://violet-hilarious-ocelot-223.mypinata.cloud/ipfs/QmPwjsATJHe3bvKMfh3XkYLRpqDP5o7XNZoNEoNfTfhhcK",
  "external_url": "https://hivefi.xyz",
  "attributes": [
    {
      "trait_type": "Collection",
      "value": "8DHG6biZnpRYYxX4fneUH9A9fErZfzF8ssFcsLiz1HTR"
    },
    {
      "trait_type": "ID",
      "value": "1"
    },
    {
      "trait_type": "Mint Order",
      "value": 1
    }
  ]
}
```

### コレクションメタデータ

コレクションの情報は `lib/collection-metadata.ts` で管理されています：

- **Devnet**: HiveFi Early Adopter NFT
- **Mainnet**: HiveFi Genesis Pioneer

### メタデータのアップロード

NFT 発行時に自動的に実行されます：

1. NFT 固有のメタデータが生成される
2. Irys 経由で Arweave にアップロード
3. 返された URI を NFT に設定

**注意**: バックエンドウォレットに十分な SOL が必要です（Irys のアップロード料金用）。

## 動作確認

### 1. devnet で SOL を取得

```bash
# devnet で無料の SOL を取得
solana airdrop 2 --url devnet
```

### 2. cNFT を発行

1. ブラウザで `/claim` ページにアクセス
2. Privy でログイン（ホワイトリストに含まれるアカウントを使用）
3. ウォレットを接続
4. "Claim NFT" ボタンをクリック

### 3. 発行された cNFT を確認

```bash
# スクリプトで確認（Merkle Tree アドレスと Leaf Index を指定）
npx ts-node scripts/view-cnft.ts 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5 8
```

出力例：
```
🔍 Fetching Compressed NFT information...

📡 Network: devnet
🌲 Merkle Tree: 4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5
🍃 Leaf Index: 8

✅ Compressed NFT found!

📋 Asset Information:
================================
Name: HiveFi Early Adopter NFT
Symbol: HIVE
Owner: 受信者のウォレットアドレス

🎨 Metadata:
URI: https://arweave.net/あなたのメタデータ
```

### 4. エクスプローラーで確認

トランザクション署名を使用して Solana Explorer で確認：

```
https://explorer.solana.com/tx/トランザクション署名?cluster=devnet
```

## 本番環境への移行

### 1. 環境変数を mainnet 用に更新

```env
# mainnet を使用
NEXT_PUBLIC_SOLANA_NETWORK=mainnet

# mainnet 用の RPC（Helius RPC を推奨）
MAINNET_RPC_URL=https://mainnet.helius-rpc.com/?api-key=あなたの_API_キー
```

### 2. mainnet で Merkle Tree を作成

```bash
# mainnet で作成（確認プロンプトが表示されます）
npx ts-node scripts/create-merkle-tree.ts --network=mainnet

# 確認プロンプトで "yes" を入力
```

### 3. 新しいアドレスで config を更新

`config/solana-addresses.ts` の mainnet セクションを更新：

```typescript
// config/solana-addresses.ts
mainnet: {
  merkleTreeAddress: 'mainnetで作成したアドレス',
  collectionMint: 'mainnetのコレクションアドレス'
}
```

### 4. Irys アカウントの確認

Mainnet では、Irys アカウントに十分な資金があるか確認：

```bash
npx tsx scripts/check-irys-balance.ts
```

必要に応じて Irys アカウントに資金を追加してください。

## セキュリティの考慮事項

1. **秘密鍵の管理**
   - 本番環境では環境変数を安全に管理
   - AWS Secrets Manager、HashiCorp Vault などの使用を推奨

2. **アクセス制御**
   - API エンドポイントに適切な認証を実装
   - レート制限を設定

3. **監査とログ**
   - すべての NFT 発行をログに記録
   - 異常なアクティビティを監視

## 次のステップ

- [API リファレンス](./api-reference.md) - API エンドポイントの詳細
- [トラブルシューティング](./troubleshooting.md) - よくある問題と解決方法
- [scripts/README.md](../scripts/README.md) - スクリプトの詳細な使用方法