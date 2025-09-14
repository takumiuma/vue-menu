# CI セットアップ

このプロジェクトには以下の機能を持つ包括的なGitHub Actions CIパイプラインが含まれています：

## ワークフロージョブ

### 1. ESLint

- VueとTypeScriptサポートでESLintを実行
- Nuxt固有のルールに`@nuxt/eslint-config`を使用
- コマンド: `yarn lint`

### 2. TypeScript型チェック

- vue-tscで静的型解析を実行
- VueコンポーネントとTypeScriptファイル全体で型安全性を確保
- コマンド: `yarn type-check`

### 3. ユニットテスト (Vitest)

- Vitestによる高速ユニットテスト
- jsdom環境でVueコンポーネント用に設定
- コマンド: `yarn test:run`

### 4. セキュリティ監査

- 依存関係の既知の脆弱性をチェック
- `yarn audit`を中程度のレベル閾値で使用
- コマンド: `yarn audit`

### 5. ビルド検証

- アプリケーションが正常にビルドされることを確認
- 潜在的なデプロイメント用にビルド成果物をアップロード
- コマンド: `yarn build`

### 6. E2Eテスト (Playwright)

- アプリケーションがエラーなしで読み込まれることを検証するスモークテスト
- 主要なユーザーフローとページ機能をテスト
- コマンド: `yarn test:e2e`

### 7. CodeQLセキュリティ解析

- GitHubの高度なセキュリティ解析
- セキュリティ脆弱性とコード品質の問題をスキャン
- pushとPRイベントで自動実行

## トリガー

CIワークフローは以下の場合に実行されます：

- `master`と`develop`ブランチへのpush
- `master`と`develop`ブランチをターゲットとするプルリクエスト

## ローカル開発

すべてのCIチェックはローカルで実行できます：

```bash
# 依存関係のインストール
yarn install

# リンティングの実行
yarn lint

# 型チェックの実行
yarn type-check

# ユニットテストの実行
yarn test

# E2Eテストの実行（開発サーバーが必要）
yarn dev # 一つのターミナルで
yarn test:e2e # 別のターミナルで

# アプリケーションのビルド
yarn build

# 脆弱性のチェック
yarn audit
```

## 利用可能な追加ツール

- **Prettier**: コード整形 (`yarn format`)
- **Test UI**: インタラクティブテストランナー (`yarn test:ui`)
- **Coverage**: テストカバレッジレポート (`yarn test:coverage`)
