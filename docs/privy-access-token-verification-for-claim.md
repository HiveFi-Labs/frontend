# cNFT Claim API: Privy アクセストークン検証導入ガイド

`app/api/claim/route.ts` のクレームAPIに対し、クライアントから送られてくる `privyUserId` をそのまま信用するのではなく、Privy のアクセストークンをサーバ側で検証し、トークンのクレームから得られるユーザーIDと、要求された `walletAddress` の整合性を確認するように改修します。

## 背景

- 現状（該当箇所）: `app/api/claim/route.ts` 78行目付近で、リクエストボディの `privyUserId` を元にホワイトリスト確認を行っています。
  - 問題点: クライアントが `privyUserId` を偽装した場合、不正ミントにつながるリスクがあります。
- レビュー指摘: 「ユーザーがAPIに渡す UserId が誤っていたら不正に mint される。アクセストークンを渡し、サーバ側で userId と wallet address が正しいか検証するべき」
  - 参考: Privy 公式ドキュメント（アクセストークン）: `https://docs.privy.io/authentication/user-authentication/access-tokens`

## 仕様（サーバ側認証・検証フロー）

- リクエスト要件
  - 認証方式: Privy アクセストークン（JWT）を `Authorization: Bearer <token>` ヘッダで送信
  - リクエストボディ: `walletAddress`（必須）
  - 互換性: `privyUserId` は非推奨（送られてきても無視）。トークンのクレーム値を唯一の信頼情報源とする

- 検証手順
  1. `Authorization` ヘッダからアクセストークンを抽出。未設定なら 401
  2. `@privy-io/server-auth` を用いてアクセストークンを検証
     - 必要な環境変数: `PRIVY_APP_ID`、`PRIVY_APP_SECRET`
     - 成功時: `userId`（Privy DID）等のクレームを取得
     - 失敗時: 401（期限切れ/不正トークン）
  3. `userId` を用いて Privy からユーザー情報を取得（`privy.getUser(userId)`）
     - ユーザーのリンク済みウォレット一覧から、リクエストの `walletAddress` が当該ユーザーに紐づくことを確認
     - 紐づかない場合: 400（無効なウォレットアドレス）
  4. 既存のホワイトリストチェック
     - `user_whitelist` は `userId`（トークン由来）を用いて判定（403）
  5. 以降のクレーム重複チェック等は従来通り

- エラーレスポンス
  - 401: アクセストークン未提供／無効／期限切れ
  - 403: ホワイトリスト対象外
  - 400: ウォレットアドレス形式不正、またはユーザー未リンクのウォレット
  - 500: サーバ設定不備（`PRIVY_APP_*` 未設定など）や外部依存の失敗

- ログ方針（PIIに注意）
  - `userId` は短縮（先頭/末尾のみ）でログ出力
  - トークンや機微情報はログに出さない

- 実装補助モジュール（推奨）
  - `lib/auth/privy.ts`
    - `getAccessTokenFromRequest(req): string | null`
    - `verifyAccessToken(token): { userId: string, sessionId: string, appId: string, expiration: string }`
    - `getUserAndWallets(userId): { userId: string, wallets: string[] }`
    - `assertWalletBelongsToUser(walletAddress, wallets): void` （不一致なら Error）

- フロントエンド（参照）
  - `@privy-io/react-auth` の `getAccessToken()` を用いて、API リクエストに `Authorization` ヘッダを付与
  - 例:
    ```ts
    const token = await getAccessToken()
    await fetch('/api/claim', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress })
    })
    ```

## 影響範囲と更新対象

- コード
  - `app/api/claim/route.ts`
    - リクエストスキーマから `privyUserId` を非推奨化（削除または無視）
    - `Authorization` ヘッダからトークン抽出・検証を追加
    - `user_whitelist` 判定はトークン検証で得た `userId` を用いる
    - `walletAddress` がユーザーのリンク済みウォレットに含まれることを確認
  - 新規: `lib/auth/privy.ts`（トークン検証・ユーザー取得の共通化）

- 依存関係
  - 追加: `@privy-io/server-auth`

- 環境変数
  - `.env.example` に追加
    - `PRIVY_APP_ID=`（既存の `NEXT_PUBLIC_PRIVY_APP_ID` と同値でOK）
    - `PRIVY_APP_SECRET=`（ダッシュボードから取得）

- ドキュメント
  - `docs/api-reference.md`：Claim API の認証要件更新（Authorization: Bearer 必須、`privyUserId` 非推奨）
  - `docs/troubleshooting.md`：トークン検証失敗・期限切れ・権限不足の対処追加
  - `docs/nft-claim-pr-review.md`：レビュー観点に「サーバ側でトークン検証＆ウォレット所有確認」を追加
  - `docs/manual-testing-solana-addresses-migration.md`：手動テスト観点に「Bearer トークン必須」「未設定/無効時の期待エラー」追加

## 実施タスク

1) 依存関係の追加
- `pnpm add @privy-io/server-auth`

2) 環境変数の整備
- `.env.example` に以下を追加し、README/Docs を更新
  ```env
  PRIVY_APP_ID=your_privy_app_id
  PRIVY_APP_SECRET=your_privy_app_secret
  ```

3) 認証ユーティリティの実装（新規）
- `lib/auth/privy.ts`
  - アクセストークン抽出、検証、ユーザー取得、ウォレット所有確認の関数群を実装

4) `app/api/claim/route.ts` の改修
- リクエストスキーマを `walletAddress` のみ（`privyUserId` は非推奨）
- `Authorization` ヘッダからトークン抽出→検証
- `userId` を用いて `user_whitelist` チェック
- ユーザーのリンク済みウォレットに `walletAddress` が含まれることを確認
- 既存の重複チェック（`hasClaimedNFT` 等）/ミント処理の前段にこれらの検証を追加
- エラーコードの整備（401/403/400/500）

5) ドキュメント更新
- 前述のファイルを更新（API 仕様、トラブルシュート、PR レビュー観点、手動テスト）

6) 手動テスト
- トークン無し→ 401
- 不正/期限切れトークン→ 401
- 正しいトークンだがホワイトリスト外→ 403
- 正しいトークン・ホワイトだが、未リンクウォレット→ 400
- 正常（トークン有効・ホワイト・リンクウォレット）→ ミント成功

## 実装のヒント（擬似コード）

```ts
// lib/auth/privy.ts（イメージ）
import { PrivyClient } from '@privy-io/server-auth'

const privy = new PrivyClient({ appId: process.env.PRIVY_APP_ID!, appSecret: process.env.PRIVY_APP_SECRET! })

export function getAccessTokenFromRequest(req: Request) {
  const h = req.headers.get('authorization') || ''
  return h.startsWith('Bearer ') ? h.slice(7) : null
}

export async function verifyAccessToken(token: string) {
  return privy.verifyAuthToken(token) // { userId, appId, expiration, sessionId, issuer }
}

export async function getUserAndWallets(userId: string) {
  const user = await privy.getUser(userId)
  const wallets = (user.linked_accounts || [])
    .filter((a: any) => a.type === 'wallet' && a.address)
    .map((a: any) => (a.address as string).toLowerCase())
  return { userId, wallets }
}

export function assertWalletBelongsToUser(wallet: string, wallets: string[]) {
  if (!wallets.includes(wallet.toLowerCase())) {
    throw new Error('WALLET_NOT_LINKED')
  }
}
```

## エラーメッセージの統一例

- 401
  - `Missing or invalid authorization token`
  - `Invalid or expired access token`
- 403
  - `You are not eligible to claim this NFT. Only whitelisted users can claim.`
- 400
  - `Invalid wallet address format`
  - `Wallet address is not linked to your Privy account`
- 500
  - `Server configuration error`

---

## Claude Code 実装プロンプト（貼り付け用）

以下の要件に従って、`/api/claim` の改修を実装してください。

- 目的:
  - クライアントから渡される `privyUserId` を信用せず、`Authorization: Bearer <token>` の Privy アクセストークンをサーバで検証
  - トークンの `userId` に対してホワイトリスト確認、かつ `walletAddress` がユーザーのリンク済みウォレットであることを検証

- 依存関係:
  - `@privy-io/server-auth` を追加

- 環境変数:
  - `.env.example` に `PRIVY_APP_ID` と `PRIVY_APP_SECRET` を追加

- 実装手順:
  1. `lib/auth/privy.ts` を新規追加し、以下を実装
     - `getAccessTokenFromRequest(req)`
     - `verifyAccessToken(token)` → `privy.verifyAuthToken(token)` を使用
     - `getUserAndWallets(userId)` → `privy.getUser(userId)` からリンク済みウォレットを抽出
     - `assertWalletBelongsToUser(walletAddress, wallets)`
  2. `app/api/claim/route.ts` を編集
     - リクエストスキーマは `walletAddress` のみ（`privyUserId` は非推奨で無視）
     - リクエストヘッダからアクセストークン抽出→検証（失敗は 401）
     - 検証で得た `userId` を使って `user_whitelist` 判定（403）
     - `getUserAndWallets(userId)` でウォレット一覧取得し、`walletAddress` が含まれることを確認（含まれなければ 400）
     - 以降のミント処理は現状踏襲
     - エラーコード/メッセージは本ドキュメントの例に準拠
  3. ドキュメント更新
     - `docs/api-reference.md`、`docs/troubleshooting.md`、`docs/nft-claim-pr-review.md`、`docs/manual-testing-solana-addresses-migration.md` に Bearer 必須と新エラーケースを反映

- 受け入れ条件:
  - トークン無し/不正/期限切れで 401 を返す
  - ホワイトリスト外は 403
  - ユーザー未リンクウォレットは 400
  - 正常系でミント成功（従来通りのレスポンスを維持）
  - 主要ログに `userId` とネットワーク、コレクション、ツリーなどが出るが、トークン自体は出力されない

実装後、差分一覧・動作ログ・失敗時の応答例（401/403/400）を提示してください。 