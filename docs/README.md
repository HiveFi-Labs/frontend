# HiveFi Compressed NFT Documentation

このディレクトリには、HiveFi プラットフォームの Compressed NFT (cNFT) 機能に関するドキュメントが含まれています。

## 📚 ドキュメント一覧

### [cNFT セットアップガイド](./cnft-setup.md)
Compressed NFT を発行するための完全なセットアップ手順です。環境変数の設定から本番環境への移行まで、ステップバイステップで説明しています。

**含まれる内容:**
- 環境変数の設定方法
- Merkle Tree の作成手順
- コレクション NFT の準備
- メタデータの設定とアップロード
- devnet/mainnet の切り替え

### [API リファレンス](./api-reference.md)
cNFT Claim API の詳細な仕様書です。エンドポイント、パラメータ、レスポンス形式について説明しています。

**含まれる内容:**
- エンドポイントの仕様
- リクエスト/レスポンスの形式
- エラーコードの一覧
- 使用例（JavaScript、cURL）

### [トラブルシューティング](./troubleshooting.md)
よくある問題と解決方法をまとめています。エラーメッセージから解決策を素早く見つけることができます。

**含まれる内容:**
- 環境設定の問題
- Merkle Tree 関連のエラー
- トランザクションエラー
- デバッグのヒント

## 🚀 クイックスタート

初めて cNFT を実装する場合は、以下の順序でドキュメントを読むことをお勧めします：

1. **[cNFT セットアップガイド](./cnft-setup.md)** - 基本的なセットアップ
2. **[API リファレンス](./api-reference.md)** - API の使用方法
3. **[トラブルシューティング](./troubleshooting.md)** - 問題が発生した場合

## 🔗 関連リソース

- [scripts/README.md](../scripts/README.md) - ユーティリティスクリプトの詳細
- [Metaplex Bubblegum](https://github.com/metaplex-foundation/mpl-bubblegum) - Compressed NFT の実装
- [Solana Docs](https://docs.solana.com) - Solana の公式ドキュメント

## 📝 重要な注意事項

### セキュリティ

- 秘密鍵は絶対に公開リポジトリにコミットしない
- 本番環境では環境変数を安全に管理する
- API エンドポイントには適切な認証とレート制限を実装する

### コスト

- **devnet**: 無料（テスト用）
- **mainnet**: Merkle Tree の作成に約 0.1-1 SOL
- **NFT 発行**: 1つあたり約 0.00001 SOL

### 制限事項

- 1つの Merkle Tree で最大 16,384 個の NFT を格納可能（現在の設定）
- cNFT は多くのウォレットでまだ完全にサポートされていない
- 転送やバーンなどの機能は追加実装が必要

## 🤝 貢献

ドキュメントの改善や追加は歓迎します。以下の点にご注意ください：

- 明確で簡潔な説明を心がける
- コード例は実際に動作することを確認する
- 新しい機能を追加した場合は必ずドキュメントも更新する

## 📞 サポート

問題が発生した場合は、まず[トラブルシューティングガイド](./troubleshooting.md)を確認してください。それでも解決しない場合は、GitHub Issues で報告してください。