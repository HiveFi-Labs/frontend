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

# バックエンドウォレットの秘密鍵
# 形式: JSON配列、Base64、またはBase58
SOLANA_BACKEND_PRIVATE_KEY=あなたの秘密鍵

# RPC URL（オプション - デフォルトで適切なURLが選択されます）
SOLANA_RPC_URL=

# Merkle Tree アドレス（後で設定）
SOLANA_MERKLE_TREE_ADDRESS=

# コレクション NFT のミントアドレス（後で設定）
SOLANA_COLLECTION_MINT=

# NFT メタデータ URI（オプション）
NFT_METADATA_URI=
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

### 3. 環境変数を更新

出力された `SOLANA_MERKLE_TREE_ADDRESS` を `.env.local` に追加：

```env
SOLANA_MERKLE_TREE_ADDRESS=4MZS5aYvSkAzvToyY4crZEFzWwULxubDsAc4t7X2AnU5
```

### Merkle Tree の仕様

- **maxDepth**: 14（最大 16,384 個の NFT を格納可能）
- **maxBufferSize**: 64（同時処理可能な変更数）
- **canopyDepth**: 0（コスト削減のため）

## コレクション NFT の準備

cNFT はコレクションに属する必要があります。既存のコレクションを使用するか、新しく作成します。

### 既存のコレクションを使用

```env
# .env.local に追加
SOLANA_COLLECTION_MINT=YR6XuTDu8F6hc5HHPgXk5Vunw7MoZW6MJtze2oTD8DL
```

### 新しいコレクションを作成

通常の NFT としてコレクションを作成する必要があります。詳細は Metaplex のドキュメントを参照してください。

## メタデータの設定

NFT の表示情報（名前、説明、画像）を設定します。

### 1. メタデータファイルの生成

```bash
npx ts-node scripts/upload-metadata.ts
```

これにより `scripts/nft-metadata.json` が生成されます：

```json
{
  "name": "HiveFi Early Adopter NFT",
  "symbol": "HIVE",
  "description": "This exclusive NFT grants early adopters...",
  "image": "https://arweave.net/YOUR_IMAGE_HASH",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Early Adopter"
    }
  ]
}
```

### 2. メタデータのアップロード

#### Arweave（推奨）

永続的なストレージで、一度アップロードすれば永久に保存されます。

- [ArDrive](https://ardrive.io)
- [Bundlr](https://bundlr.network)
- [Akord](https://akord.com)

#### IPFS

分散型ストレージですが、ピン留めが必要です。

- [Pinata](https://pinata.cloud)
- [NFT.Storage](https://nft.storage)
- [Web3.Storage](https://web3.storage)

### 3. 環境変数を更新

アップロード後、取得した URL を設定：

```env
NFT_METADATA_URI=https://arweave.net/あなたのメタデータハッシュ
```

## 動作確認

### 1. devnet で SOL を取得

```bash
# devnet で無料の SOL を取得
solana airdrop 2 --url devnet
```

### 2. cNFT を発行

1. ブラウザで `/claim` ページにアクセス
2. ウォレットを接続
3. "Claim NFT" ボタンをクリック

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

# mainnet 用の RPC（オプション - より高速な RPC を推奨）
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 2. mainnet で Merkle Tree を作成

```bash
# mainnet で作成（確認プロンプトが表示されます）
npx ts-node scripts/create-merkle-tree.ts --network=mainnet

# 確認プロンプトで "yes" を入力
```

### 3. 新しいアドレスで環境変数を更新

```env
# mainnet の Merkle Tree アドレス
SOLANA_MERKLE_TREE_ADDRESS=mainnetで作成したアドレス

# mainnet のコレクションミントアドレス
SOLANA_COLLECTION_MINT=mainnetのコレクションアドレス
```

### 4. 本番用メタデータをアップロード

本番環境では、プロフェッショナルな画像とメタデータを使用することを推奨します。

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