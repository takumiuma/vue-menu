# 技術スタック

## フレームワーク・コア技術

- **Nuxt 3** (v3.12.4) - SSR/SSG機能を持つVue.jsメタフレームワーク
- **Vue 3** - Composition APIを使用するフロントエンドフレームワーク
- **TypeScript** - 型安全なJavaScript開発
- **Vite** (v4.4.0) - ビルドツール・開発サーバー

## UI・スタイリング

- **Vuetify 3** (v3.7.4) - Material Designコンポーネントライブラリ
- **Material Design Icons** (@mdi/font) - アイコンシステム

## 状態管理・データ

- **Pinia** - 永続化プラグイン付きVue状態管理
- **Axios** - API通信用HTTPクライアント
- **Lodash** - ユーティリティライブラリ

## 認証

- **Auth0 SPA SDK** (@auth0/auth0-spa-js) - 認証サービス統合

## 開発ツール

- **ESLint** with Nuxt config - Vue・TypeScriptサポート付きコードリンティング
- **Prettier** - コードフォーマッティング
- **Vitest** - jsdom環境でのユニットテストフレームワーク
- **Playwright** - エンドツーエンドテスト
- **Vue Test Utils** - Vueコンポーネントテストユーティリティ

## よく使用するコマンド

### 開発

```bash
yarn dev          # localhost:3000で開発サーバー起動
yarn build        # 本番用ビルド
yarn preview      # 本番ビルドをローカルでプレビュー
yarn generate     # 静的サイト生成
```

### コード品質

```bash
yarn lint         # ESLint実行
yarn lint:fix     # ESLintの問題を自動修正
yarn format       # Prettierでコードフォーマット
yarn format:check # コードフォーマットをチェック
yarn type-check   # TypeScript型チェック実行
```

### テスト

```bash
yarn test         # Vitestでユニットテスト実行
yarn test:ui      # UIでテスト実行
yarn test:run     # テストを一度実行
yarn test:coverage # カバレッジレポート付きテスト実行
yarn test:e2e     # Playwright E2Eテスト実行
yarn test:e2e:install # Playwrightブラウザインストール
```

## 設定に関する注意事項

- ESモジュールを使用（`"type": "module"`）
- Prettierはシングルクォート、セミコロンなし、2スペースタブで設定
- ESLintにはVuetifyデータテーブルスロット用のVue固有ルールを含む
- VitestはE2Eテストを除外（Playwrightで処理）
- Auth0設定は環境変数経由
