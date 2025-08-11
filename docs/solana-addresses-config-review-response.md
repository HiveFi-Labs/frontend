# レビュー対応報告: Solana アドレスの `.env` 依存から `config` への移行

本ドキュメントは、いただいたレビュー（「アドレスは `config` ファイルを作ってハードコードするのがベストプラクティス」）に対する改修内容をまとめたものです。

## 背景（指摘事項）
- これまで `SOLANA_MERKLE_TREE_ADDRESS` / `SOLANA_COLLECTION_MINT` を `.env` で管理していました。
- アドレスは秘匿情報ではないため、`.env` 管理だと「環境ごとの設定ドリフト」「設定漏れ」「レビュー/履歴の追跡性低下」につながる。
- ベストプラクティスとして、バージョン管理可能な `config` にハードコードし、ネットワークごとに切替える設計が望ましい。

## 目的（Migration のねらい）
- 再現性・可観測性向上: 値がGit上でトラッキングされ、レビュー・履歴が明確。
- 運用安定性: 環境差異による事故を防止（特に本番/検証）
- シンプル化: アドレス参照元を `config` に一本化し、`.env` の責務を秘匿情報のみに限定。

## 変更点（実装サマリ）
- 新規: `config/solana-addresses.ts`
  - `mainnet`/`devnet` 別に `merkleTreeAddress` / `collectionMint` を定義
  - `getActiveNetworkFromEnv()` でネットワークを解決
  - `getSolanaAddresses()` で現在のネットワークのアドレスを取得
- API の参照更新
  - `app/api/claim/route.ts` / `app/api/claim/check/route.ts` で `getSolanaAddresses()` を使用
- スクリプトの参照更新
  - `scripts/check-network-config.ts` / `scripts/check-tree-authority.ts` / `scripts/test-collection-count.ts` で `config` を使用
- `.env.example`
  - 旧変数（`SOLANA_MERKLE_TREE_ADDRESS` / `SOLANA_COLLECTION_MINT`）を非推奨コメント化し、`config` 管理へ誘導

## 影響範囲
- コード: 上記 API ルートおよびユーティリティ/スクリプト
- ドキュメント: 参照元の案内を `.env` → `config` に更新
- CI/デプロイ: 環境変数のセット漏れによる不具合が減少（秘匿情報に限定）

## セキュリティ/運用観点の効果
- セキュリティ: アドレスは公開情報のためハードコードで問題なし。秘匿値（鍵/トークン）は引き続き `.env` 管理
- 運用: ネットワーク切替が明示化され、環境ドリフト防止。レビュー時に値の差分が可視化

## API/設定の変更点
- API 仕様への影響: なし（参照元のみ変更）
- 設定:
  - ネットワーク切替: `NEXT_PUBLIC_SOLANA_NETWORK=mainnet|devnet`
  - アドレス取得: `config/solana-addresses.ts` の `getSolanaAddresses()`

## 受け入れ条件（満たしています）
- `.env.example` から当該2変数を非推奨化し、`config` 管理に誘導
- API/スクリプトが `config` のみを参照（旧 `.env` に依存しない）
- `NEXT_PUBLIC_SOLANA_NETWORK` 切替で mainnet/devnet のアドレスが切替
- 既存機能（クレーム/メタデータ/カウント等）が動作

## 手動確認手順（抜粋）

1) ネットワーク設定の整合性確認
```bash
pnpm check-network
# 例: --network で明示
pnpx tsx scripts/check-network-config.ts --network=devnet
pnpx tsx scripts/check-network-config.ts --network=mainnet
```
- 期待: 表示される Merkle Tree / Collection Mint が `config/solana-addresses.ts` の値

2) API の参照確認
```bash
pnpm dev
# Claim API 実行（Privyトークン必須のため別ドキュメント参照）
curl -s -X POST http://localhost:3000/api/claim/check \
  -H 'Content-Type: application/json' \
  -d '{"walletAddress":"<WALLET_ADDRESS>"}' | jq
```
- 期待: ログに `Using collection: <collectionMint>` と出力され、`config` の値を使用

3) スクリプトの参照確認
```bash
pnpm test-collection -- --network=devnet
pnpm test-collection -- --network=mainnet
```
- 期待: コレクションミントが `config` の値で出力

## 互換性/フォローアップ
- 互換性: 既存の `.env` に過去の変数があっても無視されます（ドキュメントでは非推奨化を明記）
- フォローアップ（任意）:
  - `scripts/create-merkle-tree.ts` の出力メッセージを、`.env` 追記ではなく「`config/solana-addresses.ts` を更新」メッセージに統一
  - `getActiveNetworkFromEnv()` のデフォルトをプロジェクト方針に合わせて `devnet` に変更するか検討（現状は未設定/不正時に mainnet）

## 参照
- 実装ガイド: `docs/solana-addresses-config-migration.md`
- 設定ファイル: `config/solana-addresses.ts`
- 代表参照箇所: `app/api/claim/route.ts`, `app/api/claim/check/route.ts`
- 確認スクリプト: `scripts/check-network-config.ts`, `scripts/test-collection-count.ts`, `scripts/check-tree-authority.ts`

---

以上の通り、アドレス管理を `.env` から `config` へ移行し、レビュー方針に沿う形で実装・検証を完了しています。必要に応じて上記フォローアップも対応可能です。 