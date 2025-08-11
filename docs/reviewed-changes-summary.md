# レビュー対応まとめ（3点）

本ドキュメントは、レビュー指摘に基づき実施した以下3項目の改修を1つに集約して説明します。

- 改修1: Solana アドレスの `.env` 依存を廃止し、`config` へハードコード移行
- 改修2: Privy アクセストークン（Bearer）検証＋リンク済みウォレットの所有確認
- 改修3: 二重ミント防止のためのオンチェーン事前確認（DAS/Helius）

---

## 改修1: Solana アドレスを `config` に移行

- 背景/目的
  - アドレスは秘匿情報ではなく、`.env` 管理は設定ドリフト・設定漏れを招くため、`config` ハードコードへ移行
- 主な変更
  - 追加: `config/solana-addresses.ts`
    - `mainnet`/`devnet` ごとに `merkleTreeAddress` / `collectionMint` を定義
    - `getActiveNetworkFromEnv()` でネットワーク解決、`getSolanaAddresses()` で取得
  - 参照更新: `app/api/claim/route.ts` / `app/api/claim/check/route.ts` / `scripts/*`
  - `.env.example`: 旧変数を非推奨コメント化
- 影響/設定
  - 切替: `NEXT_PUBLIC_SOLANA_NETWORK=mainnet|devnet`
  - 既存機能への影響は参照元変更のみ
- 受入条件
  - 旧 `.env` 参照の排除、`config` 参照の一元化、ネットワーク切替の反映
- 参考
  - `config/solana-addresses.ts`
  - `docs/solana-addresses-config-review-response.md`

---

## 改修2: Privy アクセストークン検証＋ウォレット所有確認

- 背景/目的
  - クライアント入力の `privyUserId` を信頼せず、署名済みトークンから `userId` を確定
  - `walletAddress` が当該ユーザーのリンク済みウォレットかを検証
- 主な変更
  - 追加: `lib/auth/privy.ts`
    - `getAccessTokenFromRequest()`、`verifyAccessToken()`、`getUserAndWallets()`、`assertWalletBelongsToUser()`
  - 更新: `app/api/claim/route.ts`
    - Bearer トークン検証→WL確認→リンク済みウォレット確認の順で認証/認可
- 影響/設定
  - 必須環境変数: `PRIVY_APP_ID` / `PRIVY_APP_SECRET`
  - リクエスト: `Authorization: Bearer <token>` 必須（ボディは `walletAddress` のみ）
- 受入条件
  - 401（トークンなし/無効/期限切れ）・403（WL外）・400（未リンク/形式不正）を正しく返却
- 参考
  - `docs/claim-security-review-response.md`
  - `docs/privy-authentication-flow-explanation.md`

---

## 改修3: 二重ミント防止のオンチェーン事前確認

- 背景/目的
  - 再起動/スケールでメモリがリセットされても重複ミント不可にするため、オンチェーン所有確認を導入
- 主な変更
  - 追加: `lib/ownership-check.ts`
    - `checkOwnedAssetIdByWalletAndCollection()`（DAS/Helius で所有確認）
    - `networkToIsMainnet()`（`mainnet`/`mainnet-beta` 両対応）
  - 更新: `app/api/claim/route.ts` / `app/api/claim/check/route.ts`
    - 「永続（`claimed-nfts.json`）→オンチェーン（DAS）→メモリ」の三層チェック
- 影響/設定
  - `HELIUS_API_KEY` が設定されていればオンチェーン確認を実施
  - 未設定時は永続ストレージでブロック（フォールバック）
- 受入条件
  - 初回成功後、再起動しても同一ユーザー/ウォレット/ネットワークで再ミント不可（400）
  - 既存所有ウォレットは常にブロック（assetId 返却可能）
- 参考
  - `docs/claim-security-review-response.md`

---

## クイック手動テスト

前提: `.env.local` に以下（例）
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
HELIUS_API_KEY=...
DEVNET_BACKEND_PRIVATE_KEY=[...]
```

1) ネットワーク/アドレス確認
```
pnpm check-network
pnpx tsx scripts/check-network-config.ts --network=devnet
pnpx tsx scripts/check-network-config.ts --network=mainnet
```
- 期待: 表示される Merkle/Collection が `config/solana-addresses.ts` の値

2) Claim 認証系（要 Bearer トークン）
```
pnpm dev
curl -s -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"walletAddress":"YOUR_LINKED_WALLET"}' | jq
```
- 期待: 正常時 200、WL外や未リンク・無効トークン時は適切なエラー

3) 二重ミント防止
- 初回クレーム成功 → サーバ再起動 → 同条件で再実行 → 400（永続またはオンチェーンで検出）
- 既存所有ウォレットで実行 → 400（オンチェーンで検出、`assetId` 付与場合あり）

---

## 受入条件（全体）
- アドレスは `config` に一元管理され、API/スクリプトはそこから参照
- Claim API は Bearer トークン検証＋リンク済みウォレット確認を実施
- ミント前に永続→オンチェーン→メモリの三層チェックで二重ミントを防止

---

## 参照ドキュメント
- `docs/solana-addresses-config-review-response.md`
- `docs/claim-security-review-response.md`
- `docs/privy-authentication-flow-explanation.md` 