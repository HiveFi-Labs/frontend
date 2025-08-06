# API リファレンス

HiveFi cNFT Claim API のエンドポイントと使用方法について説明します。

## エンドポイント一覧

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/claim` | POST | Compressed NFT を発行 |

## POST /api/claim

ユーザーのウォレットアドレスに Compressed NFT を発行します。

### リクエスト

#### Headers

```http
Content-Type: application/json
```

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
| privyUserId | string | ✓ | Privy ユーザー ID（ホワイトリストチェック用） |

### レスポンス

#### 成功時 (200 OK)

```json
{
  "success": true,
  "signature": "トランザクション署名（base58形式）",
  "leafIndex": 8,
  "message": "NFT claimed successfully!",
  "network": "devnet"
}
```

#### レスポンスフィールド

| 名前 | 型 | 説明 |
|-----|---|------|
| success | boolean | リクエストの成功状態 |
| signature | string | Solana トランザクション署名 |
| leafIndex | number | Merkle Tree 内の NFT の位置（optional） |
| message | string | 成功メッセージ |
| network | string | 使用されたネットワーク（devnet/mainnet-beta） |

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
| 401 | Authentication required | Privy ユーザー ID が未提供 |
| 403 | You are not eligible to claim this NFT | ユーザーがホワイトリストに含まれていない |
| 500 | Server configuration error | サーバー設定エラー（秘密鍵など） |
| 500 | NFT collection not configured | Merkle Tree またはコレクションが未設定 |
| 500 | The Merkle tree is not properly initialized | Merkle Tree が初期化されていない |
| 500 | Invalid Merkle tree configuration | 指定されたアドレスが Merkle Tree ではない |
| 500 | Insufficient SOL balance for transaction fees | SOL 残高不足 |

### 使用例

#### JavaScript (Fetch API)

```javascript
async function claimNFT(walletAddress, privyUserId) {
  try {
    const response = await fetch('/api/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        privyUserId: privyUserId, // Required for whitelist check
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
  -d '{
    "walletAddress": "J4BweLUqaxu7GKCkJJ7xvLJB2GMBLMZbNobgmZcFhDpW",
    "privyUserId": "did:privy:cm9fr4642006dlb0ni8dkhpbq"
  }'
```

### 環境変数

API の動作に必要な環境変数：

| 変数名 | 説明 | 例 |
|-------|------|---|
| SOLANA_BACKEND_PRIVATE_KEY | NFT 発行用の秘密鍵 | JSON配列、Base64、Base58形式 |
| NEXT_PUBLIC_SOLANA_NETWORK | ネットワーク設定 | 'mainnet' または 'devnet' |
| SOLANA_RPC_URL | カスタム RPC URL | https://api.devnet.solana.com |
| SOLANA_MERKLE_TREE_ADDRESS | Merkle Tree アドレス | 4MZS5aYvSkAzvTo... |
| SOLANA_COLLECTION_MINT | コレクションミントアドレス | YR6XuTDu8F6hc5... |
| NFT_METADATA_URI | メタデータ URI | https://arweave.net/... |

### レート制限

現在、レート制限は実装されていませんが、本番環境では以下を推奨：

- 1ウォレットあたり1日1回の制限
- IPアドレスあたり1分間に10リクエストまで

### セキュリティ

1. **CORS 設定**
   - 本番環境では適切な CORS ヘッダーを設定

2. **認証**
   - 本番環境では JWT トークンなどの認証を実装

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

### よくある質問

**Q: 同じウォレットに複数の NFT を発行できますか？**
A: はい、可能です。現在の実装では制限はありませんが、本番環境では制限を設けることを推奨します。

**Q: NFT の転送はできますか？**
A: cNFT の転送には別のエンドポイントが必要です。現在は実装されていません。

**Q: メタデータを後から変更できますか？**
A: NFT が mutable の場合は可能ですが、別のエンドポイントが必要です。