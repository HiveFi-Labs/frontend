# Solana アドレスの環境変数から config への移行ガイド

本書は、`.env` に設定している cNFT 関連の Solana アドレス（`SOLANA_MERKLE_TREE_ADDRESS`／`SOLANA_COLLECTION_MINT`）を、バージョン管理された `config` ファイルにハードコードする方式へ移行するための背景、仕様、影響範囲、作業手順、検証方法、および Claude Code に依頼するためのプロンプトをまとめたものです。

## 背景

- 現状、以下のように `.env` でアドレスを参照しています。
  - `app/api/claim/route.ts`：`process.env.SOLANA_MERKLE_TREE_ADDRESS`、`process.env.SOLANA_COLLECTION_MINT`
  - `app/api/claim/check/route.ts`：同上
  - スクリプト群（例：`scripts/check-network-config.ts`、`scripts/check-tree-authority.ts`、`scripts/test-collection-count.ts`）
- アドレスは公開情報であり秘密情報ではありません。一方、環境変数で管理すると、環境ごとのドリフトや設定漏れが発生しやすく、動作不一致や運用手間の増加に繋がります。
- レビュー指摘：「アドレスは `config` ファイルを作ってハードコードするのがベストプラクティス」
  - 目的は「再現性」「可読性」「設定の明示性」の向上、および「本番／検証の差異をコード上で明確にする」ことです。

## 方針・仕様

- 新規に `config` 配下へネットワーク別のアドレス定義ファイルを追加します。
  - 例：`config/solana-addresses.ts`
  - ネットワークキーは `'mainnet' | 'devnet'` を基本とし、必要に応じて拡張可能とします。
- ネットワーク選択は既存の `NEXT_PUBLIC_SOLANA_NETWORK`（または `SOLANA_NETWORK` サーバー環境変数があればそれも許容）を使用します。
- 参照側（API ルートやスクリプト）は `process.env` から直接読むのではなく、この `config` を import して利用します。
- 必須フィールド:
  - `merkleTreeAddress`: cNFT の Merkle Tree アドレス
  - `collectionMint`: コレクション NFT のミントアドレス
- 例: `config/solana-addresses.ts`

```ts
// config/solana-addresses.ts
export type SolanaNetwork = 'mainnet' | 'devnet'

export type SolanaAddresses = {
  merkleTreeAddress: string
  collectionMint: string
}

const addressesByNetwork: Record<SolanaNetwork, SolanaAddresses> = {
  mainnet: {
    // TODO: 本番の確定値を入力
    merkleTreeAddress: 'REPLACE_WITH_MAINNET_TREE',
    collectionMint: 'REPLACE_WITH_MAINNET_COLLECTION',
  },
  devnet: {
    // TODO: 検証環境の確定値を入力
    merkleTreeAddress: 'REPLACE_WITH_DEVNET_TREE',
    collectionMint: 'REPLACE_WITH_DEVNET_COLLECTION',
  },
}

export function getActiveNetworkFromEnv(): SolanaNetwork {
  const raw = (process.env.SOLANA_NETWORK || process.env.NEXT_PUBLIC_SOLANA_NETWORK || '').toLowerCase()
  return raw === 'mainnet' ? 'mainnet' : 'devnet'
}

export function getSolanaAddresses(network: SolanaNetwork = getActiveNetworkFromEnv()): SolanaAddresses {
  const value = addressesByNetwork[network]
  if (!value?.merkleTreeAddress || !value?.collectionMint) {
    throw new Error(`Solana addresses are not configured for network: ${network}`)
  }
  return value
}

export const SOLANA_ADDRESSES = addressesByNetwork
```

- 参照例（API ルート）：

```ts
// 変更前（抜粋）
const MERKLE_TREE_ADDRESS = process.env.SOLANA_MERKLE_TREE_ADDRESS
const COLLECTION_MINT = process.env.SOLANA_COLLECTION_MINT

// 変更後（抜粋）
import { getSolanaAddresses, getActiveNetworkFromEnv } from '@/config/solana-addresses'
const network = getActiveNetworkFromEnv()
const { merkleTreeAddress: MERKLE_TREE_ADDRESS, collectionMint: COLLECTION_MINT } = getSolanaAddresses(network)
```

- 参照例（スクリプト）：

```ts
import { getSolanaAddresses } from '../config/solana-addresses'

const argNetwork = (process.argv.find(v => v.startsWith('--network='))?.split('=')[1] || '').toLowerCase()
const network = argNetwork === 'mainnet' ? 'mainnet' : 'devnet'
const { merkleTreeAddress, collectionMint } = getSolanaAddresses(network)
```

- 環境変数の扱い変更：
  - `.env.example` から `SOLANA_MERKLE_TREE_ADDRESS` と `SOLANA_COLLECTION_MINT` を削除（またはコメント化して非推奨を明記）。
  - `NEXT_PUBLIC_SOLANA_NETWORK` は引き続き使用（`mainnet` / `devnet`）。

## 影響範囲と更新対象

- コード
  - `app/api/claim/route.ts`：環境変数参照 → config 参照へ変更
  - `app/api/claim/check/route.ts`：同上
  - `scripts/check-network-config.ts`：環境変数参照 → config 参照へ変更
  - `scripts/check-tree-authority.ts`：同上
  - `scripts/test-collection-count.ts`：同上
  - 必要に応じて他のスクリプト（`scripts/view-cnft.ts` など）も統一
- ドキュメント
  - `docs/cnft-setup.md`：`.env` 追記手順を `config` 編集手順へ置換
  - `docs/scripts/README.md`（`scripts/README.md`）：出力値を `.env.local` に入れる手順 → `config/solana-addresses.ts` を更新する手順に差し替え
  - `docs/api-reference.md`：環境変数のパラメータ表から当該2項目を削除／非推奨化注記
  - `docs/troubleshooting.md`：該当エラーの解決方法を `config` 更新ベースに変更
  - `docs/nft-claim-pr-review.md`：同上
- 環境ファイル
  - `.env.example`：`SOLANA_MERKLE_TREE_ADDRESS`／`SOLANA_COLLECTION_MINT` を削除または非推奨コメント

## 実施タスク

1) 新規ファイルの追加
- `config/solana-addresses.ts` を追加（上記テンプレート）。
- 一旦プレースホルダ値を入れ、後続で確定値に置換。

2) API ルートの置換
- `app/api/claim/route.ts` と `app/api/claim/check/route.ts` の `process.env.SOLANA_...` 参照を `getSolanaAddresses()` に置換。
- ネットワークは `NEXT_PUBLIC_SOLANA_NETWORK` の値をそのまま `getActiveNetworkFromEnv()` で解決。

3) スクリプトの置換
- `scripts/check-network-config.ts`、`scripts/check-tree-authority.ts`、`scripts/test-collection-count.ts` を `config` 参照に統一。
- 可能であれば `--network=devnet|mainnet` をサポート。

4) ドキュメント修正
- `docs/cnft-setup.md`、`docs/api-reference.md`、`docs/troubleshooting.md`、`docs/nft-claim-pr-review.md`、`scripts/README.md` の `.env` 追記箇所を `config` 更新フローへ差し替え。

5) `.env.example` の整理
- `SOLANA_MERKLE_TREE_ADDRESS` と `SOLANA_COLLECTION_MINT` を削除（または「非推奨：config に移行」注記へ変更）。

6) 値の確定と反映
- devnet／mainnet の正値を `config/solana-addresses.ts` に確定・投入。

7) 検証
- API: `POST /api/claim` と `GET /api/claim/check` が期待通りに `config` のアドレスを参照していること。
- スクリプト: `npx tsx scripts/check-network-config.ts` 等でネットワーク別に正しいアドレスが出力されること。

## 受け入れ条件（Acceptance Criteria）

- `.env.example` から当該2変数が削除（もしくは非推奨注記）されている。
- API・スクリプトは `config/solana-addresses.ts` を唯一の参照元としている。
- `NEXT_PUBLIC_SOLANA_NETWORK` の切り替えで mainnet/devnet のアドレスが確実に切り替わる。
- 既存機能（NFT クレーム、メタデータ参照、検証スクリプト等）が動作する。

## 検証方法

- 開発ネットワークでの起動

```bash
pnpm dev
```

- 代表 API の動作確認（例）

```bash
curl -X POST http://localhost:3000/api/claim \
  -H 'Content-Type: application/json' \
  -d '{"walletAddress":"<WALLET>","privyUserId":"<USER_ID>"}'
```

- スクリプトの動作確認

```bash
npx tsx scripts/check-network-config.ts --network=devnet
npx tsx scripts/check-network-config.ts --network=mainnet
```

- `NEXT_PUBLIC_SOLANA_NETWORK` を変更して、API が参照するアドレスが切り替わることをログ等で確認。

## ロールバック戦略

- 必要に応じて `process.env` 参照のコードへ戻せるよう、移行 PR では変更点を論理的に分割（config 追加 → 参照置換 → ドキュメント更新）。
- 既存 `.env.local` の値はブランチに残らないため、ロールバック時は `.env` 回帰の手順をドキュメント化しておく。

## セキュリティ・運用上の注意

- アドレスは公開情報のため、レポジトリにハードコードして問題ありません。秘密鍵や API キーは引き続き環境変数で管理します。
- ステージングと本番で異なるアドレスを使い分ける場合、`NEXT_PUBLIC_SOLANA_NETWORK` と `config` の値整合を CI で検証することを推奨します。

---

## Claude Code 実装プロンプト（貼り付け用）

以下の要件に従って、Solana の cNFT 関連アドレス管理を `.env` から `config` へのハードコード方式に移行してください。

- 目的: `SOLANA_MERKLE_TREE_ADDRESS` と `SOLANA_COLLECTION_MINT` を環境変数から撤廃し、`config/solana-addresses.ts` を唯一の参照元にする。
- 仕様:
  - `config/solana-addresses.ts` を新規作成し、`mainnet`/`devnet` 別の `merkleTreeAddress` と `collectionMint` を保持。
  - ネットワークは `NEXT_PUBLIC_SOLANA_NETWORK`（なければ `SOLANA_NETWORK`）から決定。
  - 取得 API: `getActiveNetworkFromEnv()` と `getSolanaAddresses()` を提供。
- 変更箇所:
  - `app/api/claim/route.ts` と `app/api/claim/check/route.ts` の `process.env.SOLANA_*` 参照を config 参照へ置換。
  - `scripts/check-network-config.ts`、`scripts/check-tree-authority.ts`、`scripts/test-collection-count.ts` を config 参照へ置換（`--network` フラグ対応）。
  - `.env.example` から当該2変数を削除または非推奨コメントに変更。
  - `docs/cnft-setup.md`、`docs/api-reference.md`、`docs/troubleshooting.md`、`docs/nft-claim-pr-review.md`、`scripts/README.md` を `config` ベースの手順に更新。
- 受け入れ条件:
  - 上記ドキュメント更新を含む一連の変更で CI が通ること。
  - `NEXT_PUBLIC_SOLANA_NETWORK` の切り替えで mainnet/devnet のアドレスが確実に切り替わることを確認。
  - ローカルで API とスクリプトの動作が確認できること。

実装後、差分一覧と動作確認ログ（ネットワークごとの出力・API レスポンス抜粋）を提示してください。 