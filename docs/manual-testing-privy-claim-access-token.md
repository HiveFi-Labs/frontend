# 手動テスト手順: Claim API の Privy アクセストークン検証

このドキュメントは、`/api/claim` に導入した Privy アクセストークン（Bearer トークン）検証と、ユーザーのリンク済みウォレット照合が正しく動作しているかをローカルで手動確認するための手順です。

## 前提条件

- 依存関係インストール済み
  ```bash
  pnpm install
  ```
- 必須の環境変数が設定済み（`.env.local` など）
  ```env
  # Privy サーバ認証
  PRIVY_APP_ID=your_privy_app_id
  PRIVY_APP_SECRET=your_privy_app_secret

  # Helius（DAS API 用）
  HELIUS_API_KEY=your_helius_api_key

  # Solana バックエンド鍵（ネットワークに応じて自動選択）
  DEVNET_BACKEND_PRIVATE_KEY=[1,2,3,...]
  MAINNET_BACKEND_PRIVATE_KEY=[1,2,3,...]
  # または共通鍵
  # SOLANA_BACKEND_PRIVATE_KEY=[1,2,3,...]

  # 公開ネットワーク設定
  NEXT_PUBLIC_SOLANA_NETWORK=devnet # or mainnet
  ```
- `config/solana-addresses.ts` に `merkleTreeAddress` / `collectionMint` が設定済み
- テストで使用する Privy アカウントでログイン可能（リンク済みウォレットがあることが望ましい）

## 起動

```bash
pnpm dev
```
- サーバログが表示されるターミナルをテスト中は開いたままにして、期待ログを確認します。

## アクセストークンの取得方法（いずれか）

- 方法A: フロントエンドから取得（推奨）
  1. ローカルでアプリにログイン（Privy）
  2. 対象のフロー（クレーム画面等）で API を叩く実装がある場合、Network タブで `/api/claim` を選択し、`Request Headers` の `Authorization: Bearer <token>` をコピー
  3. 以降の cURL で `<token>` を使用

- 方法B: フロント側に暫定のデバッグボタンを設けて `getAccessToken()` を `console.log` 出力（開発向け一時対応）

- 方法C: 既存のログやプロキシ（Postman/Insomnia の拡張）で Authorization を確認・流用

注意: トークンは短時間で期限切れになるため、取得後は速やかにテストを実施してください。

## テストケース

### 1) 401: トークンなし
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}' | jq
```
- 期待レスポンス
  ```json
  { "success": false, "error": "Authentication required. Please provide a valid access token." }
  ```
- 期待ログ
  - 認証エラー（トークン未提供）

### 2) 401: 無効/期限切れトークン
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}' | jq
```
- 期待レスポンス
  ```json
  { "success": false, "error": "Invalid or expired access token." }
  ```
- 期待ログ
  - トークン検証失敗

### 3) 403: ホワイトリスト外ユーザー
- 前提: `data/user_whitelist.ts` に存在しないユーザーでログイン（または一時的に該当ユーザーをリストから外す）
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}' | jq
```
- 期待レスポンス
  ```json
  { "success": false, "error": "You are not eligible to claim this NFT. Only whitelisted users can claim." }
  ```
- 期待ログ
  - `User <userId> is not in whitelist`

### 4) 400: ユーザーに未リンクのウォレット
- 前提: ログイン中のユーザーに紐づいていない Solana アドレスを指定
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -d '{"walletAddress":"NOT_LINKED_WALLET_ADDRESS"}' | jq
```
- 期待レスポンス
  ```json
  { "success": false, "error": "The provided wallet address is not linked to your account." }
  ```
- 期待ログ
  - ウォレット未照合のエラー

### 5) 400: 無効なウォレット形式
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -d '{"walletAddress":"invalid"}' | jq
```
- 期待レスポンス
  ```json
  { "success": false, "error": "Invalid wallet address format" }
  ```

### 6) 200: 正常系（ミント成功）
- 前提:
  - `PRIVY_APP_ID`/`PRIVY_APP_SECRET` が有効
  - ログインユーザーがホワイトリストに存在
  - リクエストの `walletAddress` が当該ユーザーにリンク済み
  - `config/solana-addresses.ts` が正しく設定
  - `HELIUS_API_KEY` 設定済み
```bash
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -d '{"walletAddress":"YOUR_LINKED_WALLET_ADDRESS"}' | jq
```
- 期待レスポンス（例）
  ```json
  {
    "success": true,
    "signature": "...",
    "leafIndex": 123,
    "message": "NFT claimed successfully!",
    "network": "devnet",
    "assetId": "..."
  }
  ```
- 期待ログ（例）
  - `Access token verified for user: <userId>`（短縮表示）
  - `User <userId> is whitelisted`
  - `User <userId> has N linked wallet(s)`
  - `Wallet <address> verified for user <userId>`
  - `Minting cNFT to: <address>`
  - `Network: <network>`
  - `Using Merkle tree: <tree>` / `Collection: <mint>`

### 7) 400: 二重クレーム防止の確認（メモリキャッシュ）
- 正常系実行後に同じユーザー/ウォレットでもう一度実行
- 期待レスポンス
  ```json
  { "success": false, "error": "You have already claimed this NFT." }
  ```

### 8) 400: サーバー再起動後の二重クレーム防止（永続ストレージ）
- 正常系実行後、サーバーを再起動してから再度実行
```bash
# 1. 正常系でミント成功後、サーバーを停止
# Ctrl+C でサーバーを停止

# 2. サーバーを再起動
pnpm dev

# 3. 新しいアクセストークンを取得（期限切れの可能性があるため）
# 4. 同じウォレットで再度クレームを試行
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NEW_ACCESS_TOKEN" \
  -d '{"walletAddress":"YOUR_LINKED_WALLET_ADDRESS"}' | jq
```
- 期待レスポンス（いずれか）
  ```json
  { "success": false, "error": "You have already claimed this NFT on devnet." }
  ```
  または（DAS API が有効な場合）
  ```json
  { 
    "success": false, 
    "error": "This wallet already owns an NFT from this collection on devnet.",
    "assetId": "..."
  }
  ```
- 期待ログ
  - 永続ストレージ検出: `User <userId> has already claimed NFT on devnet`
  - またはオンチェーン検出: `Wallet <address> already owns NFT from collection <mint>`

### 9) 400: オンチェーン所有検証（DAS API）
- 前提: `HELIUS_API_KEY` が設定されている
- 既に NFT を所有しているウォレットで、`data/claims.json` に記録がない状態でテスト
```bash
# 1. claims.json をクリア（または該当レコードを削除）
rm -f data/claims.json

# 2. 既存 NFT を所有するウォレットでクレーム試行
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -d '{"walletAddress":"WALLET_WITH_EXISTING_NFT"}' | jq
```
- 期待レスポンス
  ```json
  { 
    "success": false, 
    "error": "This wallet already owns an NFT from this collection on devnet.",
    "assetId": "..."
  }
  ```
- 期待ログ
  - `On-chain ownership detected for wallet <address> in collection <mint>: <assetId>`

## 追加確認ポイント

- `privyUserId` をボディに渡しても無視され、トークン由来の `userId` が使用されること（ログで `User <userId> ...` を確認）
- `NEXT_PUBLIC_SOLANA_NETWORK` を `mainnet`/`devnet` で切替えた際、ログのネットワーク・使用アドレスが切り替わること
- `data/claimed-nfts.json` にレコードが保存されること（必要に応じて削除でリセット可能）
  ```bash
  cat data/claimed-nfts.json | jq
  rm -f data/claimed-nfts.json # リセット
  ```
- ブラウザ localStorage の整頓が必要な場合は `http://localhost:3000/clear-claims.html` を使用

## 代表的な失敗と対処

- `Authentication required...` / `Invalid or expired access token`
  - Bearer トークン未設定 / 無効。新しいトークンを取得して再実行
- `You are not eligible to claim...`
  - ホワイトリスト対象外。`data/user_whitelist.ts` を確認
- `The provided wallet address is not linked...`
  - ログイン中ユーザーに紐づくウォレットか確認（Privy のリンク済みウォレット）
- `Server configuration error` / `HELIUS_API_KEY not found`
  - `.env.local` の設定漏れを解消し、サーバ再起動

## 最終チェックリスト

- [ ] 401（トークンなし/無効）を再現できる
- [ ] 403（ホワイトリスト外）を再現できる
- [ ] 400（未リンク/形式不正）を再現できる
- [ ] 正常系でミント成功し、レスポンス/ログが期待通り
- [ ] 同一ユーザー/ウォレットで二重実行すると 400 が返る
- [ ] サーバー再起動後も二重クレームが防止される（永続ストレージ）
- [ ] オンチェーン所有検証が機能する（DAS API 利用時）
- [ ] `privyUserId` ボディ値が無視され、トークン由来の `userId` が使用される
- [ ] ネットワーク切替（devnet/mainnet）で参照先が切り替わる
- [ ] 機微情報（トークン本体）がログ出力されていない 

## 二重ミント防止メカニズムの確認

システムは3層の防御メカニズムで二重ミントを防止します：

1. **永続ストレージ（第1層）**
   - `data/claims.json` に記録
   - サーバー再起動後も維持
   - ネットワークごとに独立管理

2. **オンチェーン検証（第2層）**
   - DAS API による実際の所有確認
   - `HELIUS_API_KEY` 設定時のみ有効
   - 最も信頼性の高い検証

3. **メモリキャッシュ（第3層）**
   - 現在のセッション中の高速チェック
   - サーバー再起動でクリア

各層が独立して機能し、いずれかで検出されれば二重ミントを防止します。