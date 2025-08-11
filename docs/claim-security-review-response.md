# レビュー対応報告: Claim API のセキュリティ強化（アクセストークン検証 + オンチェーン事前確認）

本ドキュメントは、いただいたレビュー（「UserId をリクエスト任せにせず、アクセストークンでサーバ側検証」「メモリ依存の重複防止ではなくオンチェーン状態で確認」）に対する改修内容をまとめたものです。

## 背景（指摘事項）
- クライアントが `privyUserId` を偽装すると不正ミントの恐れがある → サーバ側で Privy アクセストークン（Bearer）を検証し、真正な `userId` を取得すべき
- プロセス再起動等でメモリがリセットされると再ミントできる恐れ → オンチェーンで「該当コレクションのNFT所有」を事前確認すべき

## 対応概要
- サーバ側で Privy アクセストークンを検証し、`userId` をトークン由来で確定
- `walletAddress` が当該ユーザーのリンク済みウォレットであることを照合
- ミント前に「永続ストレージ → オンチェーン（DAS/Helius） → メモリ」の順で重複判定を実施
- アドレス管理は `config/solana-addresses.ts` にハードコード（mainnet/devnet 切替）

## 主な変更点（ファイル）
- `app/api/claim/route.ts`
  - Bearer トークン抽出・`@privy-io/server-auth` による検証
  - WL 判定をトークン由来の `userId` で実施
  - `walletAddress` のユーザー紐付け確認
  - 三層防御（永続→オンチェーン→メモリ）の重複チェックを追加
- `app/api/claim/check/route.ts`
  - 所有確認ロジックを共通関数に寄せて簡潔化
- 新規 `lib/auth/privy.ts`
  - トークン抽出/検証、ユーザーとリンク済みウォレット取得、照合
- 新規 `lib/ownership-check.ts`
  - DAS API によるオンチェーン所有確認（assetId 取得）
  - ネットワーク判定ヘルパ（`mainnet`/`mainnet-beta` 両対応）
- `lib/claim-storage.ts`
  - `hasClaimedNFT` が `network` を考慮する実装に
- `config/solana-addresses.ts`
  - mainnet/devnet のアドレスをハードコードし一元管理
- `docs/`
  - 実装設計/理由: `privy-access-token-verification-for-claim.md`, `duplicate-mint-prevention-onchain-validation.md`
  - 手動テスト: `manual-testing-privy-claim-access-token.md`, `manual-testing-duplicate-mint-prevention.md`

## セキュリティインパクト（強化点）
- なりすまし対策: クライアント送信の `privyUserId` を信頼せず、Privy の署名済みトークンから `userId` を確定
- 認可厳格化: リンク済みウォレット以外は拒否（暫定フラグでの一時許容も明示）
- 二重ミント防止: 永続（ローカルDB相当）+ オンチェーン（最も信頼）+ メモリ（レース防止）の三層

## API 仕様の要点
- リクエスト（POST `/api/claim`）
  - Header: `Authorization: Bearer <PrivyAccessToken>`（必須）
  - Body: `{ walletAddress: string }`
- レスポンス
  - 401: トークン未提供/無効/期限切れ
  - 403: WL 外
  - 400: 未リンクウォレット/無効形式/既存所有（assetId 付与の場合あり）
  - 200: ミント成功（signature/assetId/leafIndex 等）

## 環境変数
- 必須
  - `PRIVY_APP_ID`, `PRIVY_APP_SECRET`
  - `NEXT_PUBLIC_SOLANA_NETWORK`（devnet/mainnet）
  - `DEVNET_BACKEND_PRIVATE_KEY` / `MAINNET_BACKEND_PRIVATE_KEY`（または `SOLANA_BACKEND_PRIVATE_KEY`）
  - `HELIUS_API_KEY`（オンチェーン確認に利用）

## 検証結果（サマリ）
- 正常系: Bearer トークンで `userId` 検証→WL OK→リンク済みウォレット→ミント成功
- 401: トークンなし/無効/期限切れで拒否
- 403: WL 外で拒否
- 400: 未リンクウォレットで拒否
- 二重ミント防止: 再起動後も、既存所有は 400（永続またはオンチェーンで検出）

詳細な手順は以下を参照:
- `docs/manual-testing-privy-claim-access-token.md`
- `docs/manual-testing-duplicate-mint-prevention.md`

## 参考 cURL（抜粋）
```bash
# 正常
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"walletAddress":"YOUR_LINKED_WALLET_ADDRESS"}'

# 401（トークンなし）
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}'

# 400（既存所有）
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"walletAddress":"WALLET_THAT_ALREADY_OWNS"}'
```

---

## Claude Code 実装サマリ（実装済み）
- Bearer トークン検証とウォレット照合を追加
- 三層の二重ミント防止（永続→オンチェーン→メモリ）を導入
- アドレス管理を `config` に集約
- ドキュメント/手動テスト手順を整備

必要に応じて、追加の観点（Rate Limit/再試行/観測性）も別途ご提案可能です。 