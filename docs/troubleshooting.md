# トラブルシューティングガイド

Compressed NFT の実装でよく発生する問題と解決方法をまとめています。

## 目次

1. [環境設定の問題](#環境設定の問題)
2. [認証関連のエラー](#認証関連のエラー)
3. [Merkle Tree 関連のエラー](#merkle-tree-関連のエラー)
4. [トランザクションエラー](#トランザクションエラー)
5. [API エラー](#api-エラー)
6. [表示・確認の問題](#表示確認の問題)

## 環境設定の問題

### Failed to parse backend wallet private key

**エラーメッセージ:**
```
Failed to parse backend wallet private key
```

**原因:**
秘密鍵の形式が正しくない、または環境変数が設定されていない。

**解決方法:**

1. `.env.local` ファイルに秘密鍵が設定されているか確認：
   - ネットワーク別： `DEVNET_BACKEND_PRIVATE_KEY` または `MAINNET_BACKEND_PRIVATE_KEY`
   - 共通： `SOLANA_BACKEND_PRIVATE_KEY`
   - 秘密鍵は `NEXT_PUBLIC_SOLANA_NETWORK` の値に基づいて自動選択されます

2. 秘密鍵の形式を確認（以下のいずれか）：
   - JSON 配列: `[123,45,67,...]`
   - Base64: `SGVsbG8gV29ybGQ=...`
   - Base58: `5K9ft3F4CDHMdGbeUZSyt77b1TJHxgQh...`

3. Solana CLI でウォレットを作成：
   ```bash
   solana-keygen new --outfile wallet.json
   cat wallet.json  # この内容をコピー
   ```

### ネットワーク別秘密鍵が見つからない

**エラーメッセージ:**
```
DEVNET_BACKEND_PRIVATE_KEY not found in environment
または
MAINNET_BACKEND_PRIVATE_KEY not found in environment
```

**原因:**
現在のネットワークに対応する秘密鍵が設定されていない。

**解決方法:**
1. `NEXT_PUBLIC_SOLANA_NETWORK` の値を確認
2. 対応する秘密鍵を `.env.local` に設定：
   - Devnet の場合: `DEVNET_BACKEND_PRIVATE_KEY=...`
   - Mainnet の場合: `MAINNET_BACKEND_PRIVATE_KEY=...`
   - または共通: `SOLANA_BACKEND_PRIVATE_KEY=...`
3. サーバーまたはスクリプトを再起動

### NFT collection not configured

**エラーメッセージ:**
```
NFT collection not configured
```

**原因:**
Merkle Tree またはコレクションミントのアドレスが `config/solana-addresses.ts` に正しく設定されていない。

**解決方法:**

1. `config/solana-addresses.ts` を確認し、現在のネットワークのアドレスが設定されているか確認：
   ```typescript
   const addresses = {
     mainnet: {
       merkleTreeAddress: 'メインネットのMerkleTreeアドレス',
       collectionMint: 'メインネットのコレクションアドレス'
     },
     devnet: {
       merkleTreeAddress: 'devnetのMerkleTreeアドレス',
       collectionMint: 'devnetのコレクションアドレス'
     }
   }
   ```

2. 新しい Merkle Tree を作成した場合は、config ファイルを更新：
   ```bash
   npx tsx scripts/create-merkle-tree.ts
   ```

### HELIUS_API_KEY not found

**エラーメッセージ:**
```
DAS API configuration error. Please set HELIUS_API_KEY.
```

**原因:**
Helius API キーが設定されていない。

**解決方法:**

1. [Helius](https://www.helius.dev/) でアカウントを作成
2. API キーを取得（無料プランでOK）
3. `.env.local` に追加：
   ```env
   HELIUS_API_KEY=あなたの_API_キー
   ```

## 認証関連のエラー

### Authentication required (401)

**エラーメッセージ:**
```
Authentication required
```

**原因:**
Authorization ヘッダーまたは Bearer トークンが提供されていない。

**解決方法:**

1. Privy でログインしてアクセストークンを取得
2. API リクエストに Authorization ヘッダーを追加：
   ```javascript
   const response = await fetch('/api/claim', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`
     },
     body: JSON.stringify({ walletAddress })
   });
   ```

### Invalid or expired access token (401)

**エラーメッセージ:**
```
Invalid or expired access token
```

**原因:**
提供されたアクセストークンが無効または期限切れ。

**解決方法:**

1. Privy で再度ログイン
2. 新しいアクセストークンを取得
3. 新しいトークンでリクエストを再試行

### Wallet not linked to account (400)

**エラーメッセージ:**
```
Wallet not linked to account
```

**原因:**
指定されたウォレットアドレスが、認証されたユーザーのアカウントにリンクされていない。

**解決方法:**

1. Privy のアカウント設定でウォレットをリンク
2. リンクされているウォレットアドレスを使用
3. 正しいアカウントでログインしているか確認

## Merkle Tree 関連のエラー

### AccountNotInitialized エラー

**エラーメッセージ:**
```
AnchorError caused by account: tree_authority. Error Code: AccountNotInitialized. Error Number: 3012.
```

**原因:**
指定されたアドレスが正しい Merkle Tree ではない、または初期化されていない。

**解決方法:**

1. `config/solana-addresses.ts` のアドレスが正しいか確認

2. アドレスが通常の NFT ではなく、Merkle Tree であることを確認：
   - Merkle Tree: アカウントサイズが 1787 バイト以上
   - 通常の NFT: アカウントサイズが 82 バイト程度

3. 新しい Merkle Tree を作成：
   ```bash
   npx ts-node scripts/create-merkle-tree.ts
   ```

### Invalid Merkle tree configuration

**エラーメッセージ:**
```
Invalid Merkle tree configuration. The provided address does not appear to be a Merkle Tree.
```

**原因:**
通常の NFT のアドレスを Merkle Tree として使用しようとしている。

**解決方法:**

1. 正しい Merkle Tree アドレスを確認
2. `create-merkle-tree.ts` スクリプトで新しい Merkle Tree を作成

### TreeAuthorityIncorrect エラー

**エラーメッセージ:**
```
TreeAuthorityIncorrect. Error Number: 6007
```

**原因:**
バックエンドウォレットが Merkle Tree の権限を持っていない。

**解決方法:**

1. 権限を確認：
   ```bash
   npx tsx scripts/check-tree-authority.ts
   ```

2. 同じウォレットで Merkle Tree を再作成：
   ```bash
   npx tsx scripts/create-merkle-tree.ts
   ```

## トランザクションエラー

### Could not get transaction from signature

**エラーメッセージ:**
```
Error: Could not get transaction from signature
```

**原因:**
トランザクション情報が RPC ノードにまだ伝播していない。

**解決方法:**
このエラーは自動的にリトライされるため、通常は問題ありません。NFT は正常に発行されています。

### insufficient funds

**エラーメッセージ:**
```
Insufficient SOL balance for transaction fees
```

**原因:**
ウォレットに十分な SOL がない。

**解決方法:**

1. **devnet の場合:**
   ```bash
   solana airdrop 2 --url devnet
   ```

2. **mainnet の場合:**
   - 取引所で SOL を購入
   - ウォレットに送金

### Transaction simulation failed

**エラーメッセージ:**
```
Transaction simulation failed: Error processing Instruction 0: custom program error: 0xbc4
```

**原因:**
様々な原因が考えられますが、多くは設定ミスによるもの。

**解決方法:**

1. すべての環境変数が正しく設定されているか確認
2. ネットワーク設定（devnet/mainnet）が正しいか確認
3. Merkle Tree の所有者が設定したウォレットと一致するか確認

## API エラー

### 署名のフォーマットエラー

**問題:**
Solana Explorer で署名が無効と表示される（例: `108%2C188%2C172%2C...`）

**原因:**
署名が URL エンコードされた配列形式になっている。

**解決方法:**
最新のコードでは修正済みです。`git pull` で最新版を取得してください。

### CORS エラー

**エラーメッセージ:**
```
Access to fetch at '/api/claim' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**原因:**
クロスオリジンリクエストがブロックされている。

**解決方法:**

1. 同一オリジンからリクエストを送信
2. Next.js の API Routes を使用（現在の実装）
3. 本番環境では適切な CORS ヘッダーを設定

## 表示・確認の問題

### cNFT がウォレットに表示されない

**問題:**
NFT は正常に発行されたが、ウォレットに表示されない。

**原因:**
多くのウォレットはまだ cNFT を完全にサポートしていない。

**解決方法:**

1. **スクリプトで確認:**
   ```bash
   npx ts-node scripts/view-cnft.ts MerkleTreeアドレス LeafIndex
   ```

2. **DAS API で確認:**
   ```bash
   curl "https://api.helius.xyz/v0/addresses/ウォレットアドレス/assets?api-key=YOUR_KEY"
   ```

3. **対応ウォレットを使用:**
   - Backpack Wallet
   - 一部の機能は Phantom でも確認可能

4. **NFT メタデータ API で確認:**
   ```bash
   curl -X POST http://localhost:3000/api/nft/metadata \
     -H "Content-Type: application/json" \
     -d '{"assetId": "NFTのAssetID"}'   
   ```

### メタデータが表示されない

**問題:**
NFT の名前や画像が表示されない。

**原因:**
1. Helius API キーが設定されていない
2. DAS API が利用できない
3. メタデータが Arweave にアップロードされていない

**解決方法:**

1. Helius API キーを設定：
   ```env
   HELIUS_API_KEY=あなたの_API_キー
   ```

2. NFT メタデータを確認：
   ```bash
   npx tsx scripts/check-nft-metadata.ts NFTのAssetID
   ```

3. Irys アカウントの残高を確認：
   ```bash
   npx tsx scripts/check-irys-balance.ts
   ```

### RPC の制限

**問題:**
一部の情報が取得できない、エラーが発生する。

**原因:**
デフォルトの RPC エンドポイントは機能が制限されている。

**解決方法:**

1. **DAS 対応 RPC を使用:**
   - [Helius](https://helius.xyz)
   - [Triton](https://triton.one)
   - [QuickNode](https://quicknode.com)

2. 環境変数で設定：
   ```env
   SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_API_KEY
   ```

## デバッグのヒント

### ログの確認

1. **サーバーログ:**
   ```bash
   npm run dev
   # コンソールでログを確認
   ```

2. **ブラウザコンソール:**
   - F12 で開発者ツールを開く
   - Console タブでエラーを確認

### ネットワークの確認

1. **現在のネットワーク:**
   ```bash
   echo $NEXT_PUBLIC_SOLANA_NETWORK
   ```

2. **RPC の応答確認:**
   ```bash
   curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
   ```

3. **ネットワーク設定の確認:**
   ```bash
   npx tsx scripts/check-network-config.ts
   # 特定のネットワークをチェック
   npx tsx scripts/check-network-config.ts --network mainnet
   ```

4. **アドレス設定の確認:**
   ```bash
   # 現在のネットワークのアドレスを表示
   cat config/solana-addresses.ts
   ```

### トランザクションの詳細確認

1. **Solana Explorer:**
   ```
   https://explorer.solana.com/tx/トランザクション署名?cluster=devnet
   ```

2. **CLI で確認:**
   ```bash
   solana confirm -v トランザクション署名
   ```

## サポート

問題が解決しない場合は、以下の情報と共に Issue を作成してください：

1. エラーメッセージの全文
2. 実行したコマンド
3. 環境変数の設定（秘密鍵は除く）
4. ネットワーク（devnet/mainnet）
5. ブラウザとOSの情報

## よくある問題とエラーメッセージ

### ホワイトリスト関連

**"You are not eligible to claim this NFT"**
- Privy ユーザー ID が `data/user_whitelist.ts` に含まれていない

**"Authentication required"**
- Bearer トークンが提供されていない
- Authorization ヘッダーが設定されていない

**"Invalid or expired access token"**
- アクセストークンの有効期限が切れている
- 無効なトークンが提供されている

**"Wallet not linked to account"**
- 指定したウォレットがアカウントにリンクされていない
- 別のアカウントのウォレットを使用しようとしている

### NFT 発行関連

**"You have already claimed this NFT"**
- 同じウォレットまたは Privy ID で既に NFT を発行済み

**"Asset not found"**
- NFT の Asset ID が正しくないか、まだインデックスされていない