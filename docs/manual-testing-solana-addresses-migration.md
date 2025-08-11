# 手動テスト手順: Solana アドレス管理の config 移行確認

このドキュメントは、`.env` から `config/solana-addresses.ts` への移行後に、ローカル環境で人間の手で変更が正しく動作しているかを検証するための手順をまとめたものです。

## 前提条件

- Node.js と pnpm がインストール済み
- 依存関係がインストール済み
  ```bash
  pnpm install
  ```
- 必須の秘密情報が `.env.local` に設定済み（例）
  ```env
  # ネットワーク別の秘密鍵（NEXT_PUBLIC_SOLANA_NETWORK の値に応じて自動選択）
  DEVNET_BACKEND_PRIVATE_KEY=[1,2,3,...] # Devnet 用（JSON配列、Base64、Base58 のいずれか）
  MAINNET_BACKEND_PRIVATE_KEY=[1,2,3,...] # Mainnet 用（JSON配列、Base64、Base58 のいずれか）
  # または、両ネットワーク共通の鍵を使用する場合
  SOLANA_BACKEND_PRIVATE_KEY=[1,2,3,...] # 後方互換性のため残存
  HELIUS_API_KEY=your_helius_api_key
  ```
- `config/solana-addresses.ts` に `mainnet` / `devnet` のアドレスがセット済み
  ```ts
  export const SOLANA_ADDRESSES = {
    mainnet: { merkleTreeAddress: '...', collectionMint: '...' },
    devnet:  { merkleTreeAddress: '...', collectionMint: '...' },
  }
  ```

## 検証観点（概要）

- ネットワーク切替に応じて API とスクリプトが `config` のアドレスを参照する
- `.env` の `SOLANA_*_ADDRESS` に依存していない（環境変数未設定でも動作）
- 必須秘密情報（`DEVNET_BACKEND_PRIVATE_KEY`/`MAINNET_BACKEND_PRIVATE_KEY`/`SOLANA_BACKEND_PRIVATE_KEY`/`HELIUS_API_KEY`）が無い場合は適切にエラーになる
- 既存機能（クレーム済み判定・DAS参照等）の回帰が無い

## 1. ネットワーク切替の基本確認

1) デフォルトネットワークの確認
```bash
pnpm check-network
```
- 期待結果
  - `NEXT_PUBLIC_SOLANA_NETWORK` の表示
  - `config/solana-addresses.ts` から読み出した `merkleTreeAddress`/`collectionMint` が表示

2) `--network` フラグでの切替確認
```bash
pnpx tsx scripts/check-network-config.ts --network=devnet
pnpx tsx scripts/check-network-config.ts --network=mainnet
```
- 期待結果
  - 指定ネットワークに応じた `config` のアドレスが表示

3) 環境変数切替での確認
```bash
export NEXT_PUBLIC_SOLANA_NETWORK=devnet
pnpm check-network
export NEXT_PUBLIC_SOLANA_NETWORK=mainnet
pnpm check-network
```
- 期待結果
  - それぞれ devnet/mainnet のアドレスが表示

## 2. スクリプトの動作確認

1) ツリー権限チェック（読み取り系）
```bash
pnpx tsx scripts/check-tree-authority.ts --network=devnet
```
- 期待結果
  - `config` から取得した `merkleTreeAddress` で権限情報が確認できる

2) コレクション件数（読み取り系）
```bash
pnpm test-collection -- --network=devnet
```
- 期待結果
  - `collectionMint` に対する件数が表示される（0でもOK）

3) ウォレット残高（秘密鍵必須）
```bash
pnpm check-balance
```
- 期待結果
  - ウォレット残高が表示
- 失敗例と対処
  - `❌ DEVNET_BACKEND_PRIVATE_KEY not found in environment` → `.env.local` に devnet 用の鍵を設定
  - `❌ MAINNET_BACKEND_PRIVATE_KEY not found in environment` → `.env.local` に mainnet 用の鍵を設定
  - `❌ SOLANA_BACKEND_PRIVATE_KEY not found in environment` → `.env.local` に共通の鍵を設定

## 3. API の動作確認

サーバ起動:
```bash
pnpm dev
```

1) クレーム可否チェック `/api/claim/check`
- 正常系（未クレームのウォレット）
```bash
curl -s -X POST http://localhost:3000/api/claim/check \
  -H 'Content-Type: application/json' \
  -d '{"walletAddress":"<WALLET_ADDRESS>"}' | jq
```
- 期待結果
  - `hasClaimed: false`、`message: 'No NFT found for this wallet'` または `...has already claimed...` が返る
  - ログに `Using collection: <collectionMint>` が出力され、`config` の値が使われていることが分かる
- 異常系（HELIUS_API_KEY未設定）
  - 期待結果: `message: 'DAS API configuration error. Please set HELIUS_API_KEY.'`

2) クレーム実行 `/api/claim`
- 正常系（`privyUserId` と `walletAddress` を指定）
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H 'Content-Type: application/json' \
  -d '{"walletAddress":"<WALLET_ADDRESS>","privyUserId":"<PRIVY_USER_ID>"}' | jq
```
- 期待結果
  - 成功時: `{"success":true, ...}` が返却。レスポンスに `network` が含まれ、`config` のネットワークと一致
  - 二重実行時: `{"success":false, "error":"You have already claimed this NFT."}`
- 異常系（秘密鍵未設定）
  - 期待結果: ネットワークに応じて以下のいずれかのログ、エラーレスポンス
    - Devnet: `DEVNET_BACKEND_PRIVATE_KEY not found in environment`
    - Mainnet: `MAINNET_BACKEND_PRIVATE_KEY not found in environment`
    - 共通鍵も未設定の場合: `SOLANA_BACKEND_PRIVATE_KEY not found in environment`

3) GET 経由のチェック（ラップ動作）
```bash
curl -s "http://localhost:3000/api/claim/check?wallet=<WALLET_ADDRESS>" | jq
```
- 期待結果
  - POST と同等の結果

## 4. クレーム履歴の確認・リセット

- 保存先: `data/claimed-nfts.json`
- 取得（手動確認）:
```bash
cat data/claimed-nfts.json | jq
```
- リセット（手動）:
```bash
rm -f data/claimed-nfts.json
```
- ブラウザの localStorage を整理する補助ツール（UI）:
  - `http://localhost:3000/clear-claims.html` を開き、ネットワーク切替時に古いキーをクリア

## 5. 回帰確認（`.env` 依存の排除）

- `.env.local` から以下の行を削除／未設定にして動作確認
  - `SOLANA_MERKLE_TREE_ADDRESS`
  - `SOLANA_COLLECTION_MINT`
- 期待結果
  - API とスクリプトが `config/solana-addresses.ts` を参照して動作し続ける

## 6. チェックリスト（最終確認）

- [ ] `check-network` と `--network` フラグの両方で mainnet/devnet が正しく切替わる
- [ ] `/api/claim/check` のレスポンスに `config` の `collectionMint` が反映されている（ログ確認）
- [ ] `/api/claim` が成功し、2回目以降は二重実行防止が効く
- [ ] `.env.local` に `SOLANA_*_ADDRESS` が無くても動作する
- [ ] `HELIUS_API_KEY` 未設定時に適切なエラーメッセージが返る
- [ ] ネットワーク別の秘密鍵（`DEVNET_BACKEND_PRIVATE_KEY`/`MAINNET_BACKEND_PRIVATE_KEY`）または共通鍵（`SOLANA_BACKEND_PRIVATE_KEY`）未設定時に適切なエラーハンドリングとなる
- [ ] `data/claimed-nfts.json` の記録内容が正しい。必要に応じて削除でリセットできる
- [ ] `clear-claims.html` で localStorage の不要データを整理できる

## トラブルシューティング（抜粋）

- `NFT collection not configured` が出る
  - `config/solana-addresses.ts` の `merkleTreeAddress` / `collectionMint` が空でないか確認
- `DAS API configuration error` が出る
  - `.env.local` に `HELIUS_API_KEY` を設定し、サーバを再起動
- 秘密鍵関連のエラーが出る
  - `DEVNET_BACKEND_PRIVATE_KEY not found` → `.env.local` に devnet 用の鍵を設定
  - `MAINNET_BACKEND_PRIVATE_KEY not found` → `.env.local` に mainnet 用の鍵を設定
  - `SOLANA_BACKEND_PRIVATE_KEY not found` → `.env.local` に共通の鍵を設定
  - 設定後、スクリプト／サーバを再起動 