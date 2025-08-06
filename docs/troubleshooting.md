# トラブルシューティングガイド

Compressed NFT の実装でよく発生する問題と解決方法をまとめています。

## 目次

1. [環境設定の問題](#環境設定の問題)
2. [Merkle Tree 関連のエラー](#merkle-tree-関連のエラー)
3. [トランザクションエラー](#トランザクションエラー)
4. [API エラー](#api-エラー)
5. [表示・確認の問題](#表示確認の問題)

## 環境設定の問題

### Failed to parse backend wallet private key

**エラーメッセージ:**
```
Failed to parse backend wallet private key
```

**原因:**
秘密鍵の形式が正しくない、または環境変数が設定されていない。

**解決方法:**

1. `.env.local` ファイルに `SOLANA_BACKEND_PRIVATE_KEY` が設定されているか確認

2. 秘密鍵の形式を確認（以下のいずれか）：
   - JSON 配列: `[123,45,67,...]`
   - Base64: `SGVsbG8gV29ybGQ=...`
   - Base58: `5K9ft3F4CDHMdGbeUZSyt77b1TJHxgQh...`

3. Solana CLI でウォレットを作成：
   ```bash
   solana-keygen new --outfile wallet.json
   cat wallet.json  # この内容をコピー
   ```

### SOLANA_MERKLE_TREE_ADDRESS not found

**エラーメッセージ:**
```
NFT collection not configured
```

**原因:**
Merkle Tree のアドレスが環境変数に設定されていない。

**解決方法:**

1. Merkle Tree を作成：
   ```bash
   npx ts-node scripts/create-merkle-tree.ts
   ```

2. 出力されたアドレスを `.env.local` に追加：
   ```env
   SOLANA_MERKLE_TREE_ADDRESS=生成されたアドレス
   ```

## Merkle Tree 関連のエラー

### AccountNotInitialized エラー

**エラーメッセージ:**
```
AnchorError caused by account: tree_authority. Error Code: AccountNotInitialized. Error Number: 3012.
```

**原因:**
指定されたアドレスが正しい Merkle Tree ではない、または初期化されていない。

**解決方法:**

1. 環境変数の `SOLANA_MERKLE_TREE_ADDRESS` が正しいか確認

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

### メタデータが表示されない

**問題:**
NFT の名前や画像が表示されない。

**原因:**
メタデータ URI が設定されていない、またはアクセスできない。

**解決方法:**

1. メタデータをアップロード：
   ```bash
   npx ts-node scripts/upload-metadata.ts
   ```

2. 環境変数を設定：
   ```env
   NFT_METADATA_URI=https://arweave.net/あなたのメタデータハッシュ
   ```

3. メタデータ URI がアクセス可能か確認：
   ```bash
   curl https://arweave.net/あなたのメタデータハッシュ
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