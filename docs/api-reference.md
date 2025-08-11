# API リファレンス

HiveFi cNFT Claim API のエンドポイントと使用方法について説明します。

## エンドポイント一覧

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/claim` | POST | Compressed NFT を発行 |
| `/api/claim/check` | POST | NFT 発行済みかチェック |
| `/api/nft/metadata` | POST | NFT メタデータを取得 |

## POST /api/claim

ユーザーのウォレットアドレスに Compressed NFT を発行します。

### リクエスト

#### Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

**重要**: Bearer トークン認証が必須になりました。Privy から取得したアクセストークンを使用してください。

#### Body

```json
{
  "walletAddress": "ユーザーのSolanaウォレットアドレス",
  "privyUserId": "did:privy:xxxxxxxx"
}
```

#### パラメータ

| 名前 | 型 | 必須 | 説明 |
|-----|---|-----|------|
| walletAddress | string | ✓ | NFT を受け取るウォレットアドレス |
| privyUserId | string | ✗ | **非推奨**: Bearer トークンから自動的に取得されます |

### レスポンス

#### 成功時 (200 OK)

```json
{
  "success": true,
  "signature": "トランザクション署名（base58形式）",
  "leafIndex": 8,
  "message": "NFT claimed successfully!",
  "network": "devnet",
  "assetId": "7NsvbeHySssWQLQNPxGVEec3Y3GhBBSna5qoWzYhbQxA"
}
```

#### レスポンスフィールド

| 名前 | 型 | 説明 |
|-----|---|------|
| success | boolean | リクエストの成功状態 |
| signature | string | Solana トランザクション署名 |
| leafIndex | number | Merkle Tree 内の NFT の位置（optional） |
| message | string | 成功メッセージ |
| network | string | 使用されたネットワーク（devnet/mainnet） |
| assetId | string | 発行された NFT の Asset ID（optional） |

#### エラー時 (400/500)

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

### エラーコード

| コード | エラーメッセージ | 説明 |
|-------|---------------|------|
| 400 | Invalid wallet address format | ウォレットアドレスの形式が不正 |
| 400 | Wallet address is required | ウォレットアドレスが未指定 |
| 400 | Wallet not linked to account | 指定されたウォレットがアカウントにリンクされていない |
| 401 | Authentication required | Authorization ヘッダーまたは Bearer トークンが未提供 |
| 401 | Invalid or expired access token | アクセストークンが無効または期限切れ |
| 403 | You are not eligible to claim this NFT | ユーザーがホワイトリストに含まれていない |
| 500 | Server configuration error | サーバー設定エラー（秘密鍵など） |
| 500 | NFT collection not configured | Merkle Tree またはコレクションが未設定 |
| 500 | The Merkle tree is not properly initialized | Merkle Tree が初期化されていない |
| 500 | Invalid Merkle tree configuration | 指定されたアドレスが Merkle Tree ではない |
| 500 | Insufficient SOL balance for transaction fees | SOL 残高不足 |

### 使用例

#### JavaScript (Fetch API)

```javascript
async function claimNFT(walletAddress, accessToken) {
  try {
    const response = await fetch('/api/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // 必須: Privy のアクセストークン
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        // privyUserId は不要（トークンから自動取得）
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('NFT claimed successfully!');
      console.log('Transaction:', data.signature);
      console.log('View on Explorer:', 
        `https://explorer.solana.com/tx/${data.signature}${
          data.network === 'devnet' ? '?cluster=devnet' : ''
        }`
      );
    } else {
      console.error('Claim failed:', data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

#### cURL

```bash
# devnet での例
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "walletAddress": "J4BweLUqaxu7GKCkJJ7xvLJB2GMBLMZbNobgmZcFhDpW"
  }'
```

### 環境変数

API の動作に必要な環境変数：

| 変数名 | 説明 | 例 |
|-------|------|---|
| DEVNET_BACKEND_PRIVATE_KEY | Devnet 用の秘密鍵 | JSON配列、Base64、Base58形式 |
| MAINNET_BACKEND_PRIVATE_KEY | Mainnet 用の秘密鍵 | JSON配列、Base64、Base58形式 |
| SOLANA_BACKEND_PRIVATE_KEY | 両ネットワーク共通の秘密鍵（後方互換） | JSON配列、Base64、Base58形式 |
| NEXT_PUBLIC_SOLANA_NETWORK | ネットワーク設定 | 'mainnet' または 'devnet' |
| DEVNET_RPC_URL | Devnet RPC URL | https://api.devnet.solana.com |
| MAINNET_RPC_URL | Mainnet RPC URL | https://mainnet.helius-rpc.com/?api-key=... |
| HELIUS_API_KEY | Helius API キー | DAS API 用（必須） |

**注意**: 
1. Merkle Tree アドレスとコレクションミントアドレスは `config/solana-addresses.ts` で管理されるようになりました。環境変数での設定は不要です。
2. 秘密鍵は `NEXT_PUBLIC_SOLANA_NETWORK` の値に基づいて自動的に選択されます：
   - `devnet` の場合: `DEVNET_BACKEND_PRIVATE_KEY` → `SOLANA_BACKEND_PRIVATE_KEY` の順で検索
   - `mainnet` の場合: `MAINNET_BACKEND_PRIVATE_KEY` → `SOLANA_BACKEND_PRIVATE_KEY` の順で検索

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

### レート制限

現在、レート制限は実装されていませんが、本番環境では以下を推奨：

- 1ウォレットあたり1日1回の制限
- IPアドレスあたり1分間に10リクエストまで

### セキュリティ

1. **CORS 設定**
   - 本番環境では適切な CORS ヘッダーを設定

2. **認証**
   - Bearer トークンによる認証が必須
   - Privy のアクセストークンを使用
   - トークンからユーザー ID を自動取得し、ホワイトリストを確認

3. **入力検証**
   - ウォレットアドレスの形式を厳密に検証
   - SQLインジェクション対策（データベース使用時）

### トランザクション詳細

#### 使用されるプログラム

- **Bubblegum Program**: `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY`
- **SPL Account Compression**: `cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK`
- **SPL Noop**: `noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV`

#### トランザクション費用

- **devnet**: 無料（エアドロップで取得可能）
- **mainnet**: 約 0.00001 SOL（ネットワーク状況により変動）

### 発行された NFT の確認

#### 1. トランザクション署名で確認

```
https://explorer.solana.com/tx/{signature}?cluster=devnet
```

#### 2. スクリプトで確認

```bash
npx ts-node scripts/view-cnft.ts {merkleTreeAddress} {leafIndex}
```

#### 3. DAS API で確認

```bash
curl "https://api.helius.xyz/v0/addresses/{walletAddress}/assets?api-key=YOUR_KEY"
```

## POST /api/claim/check

ウォレットアドレスが既に NFT を発行済みかチェックします。

### リクエスト

```json
{
  "walletAddress": "ウォレットアドレス"
}
```

### レスポンス

```json
{
  "hasClaimed": true,
  "assetId": "7NsvbeHySssWQLQNPxGVEec3Y3GhBBSna5qoWzYhbQxA",
  "message": "This wallet has already claimed the NFT",
  "network": "devnet"
}
```

## POST /api/nft/metadata

NFT の詳細なメタデータを取得します。

### リクエスト

```json
{
  "assetId": "NFT の Asset ID"
}
```

### レスポンス

```json
{
  "success": true,
  "metadata": {
    "name": "HiveFi Genesis Pioneer #1",
    "symbol": "PIONEER",
    "description": "Genesis Pioneer NFT for HiveFi early adopters",
    "image": "https://violet-hilarious-ocelot-223.mypinata.cloud/ipfs/...",
    "assetId": "7NsvbeHySssWQLQNPxGVEec3Y3GhBBSna5qoWzYhbQxA"
  }
}
```

### よくある質問

**Q: 同じウォレットに複数の NFT を発行できますか？**
A: いいえ、1つのウォレットアドレスまたは Privy ユーザー ID につき1つの NFT のみ発行可能です。

**Q: NFT の転送はできますか？**
A: cNFT の転送には別のエンドポイントが必要です。現在は実装されていません。

**Q: メタデータを後から変更できますか？**
A: NFT が mutable の場合は可能ですが、別のエンドポイントが必要です。