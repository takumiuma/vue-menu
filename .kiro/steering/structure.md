# プロジェクト構造

## ルートレベル構成

```
├── app.vue                 # Vuetify v-appラッパー付きメインアプリコンポーネント
├── nuxt.config.ts         # Vuetify・Pinia設定付きNuxt設定
├── package.json           # 依存関係・スクリプト
├── tsconfig.json          # TypeScript設定（.nuxt/tsconfig.jsonを継承）
└── README.md              # プロジェクトドキュメント
```

## ソースコード構造

### ページ (`/pages`)

- `index.vue` - メニューフィルタリング機能付きホームページ
- `menuList.vue` - メニュー管理インターフェース
- Nuxtファイルベースルーティングを使用

### コンポーネント (`/components`)

- `TheHeader.vue` - ナビゲーション・Auth0統合付きアプリヘッダー
- `TheFooter.vue` - アプリフッター
- Nuxtによる自動インポート

### コンポーザブル (`/composables`)

- `useAxiosService.ts` - snake_case ↔ camelCase変換付きHTTPクライアント
- `useLoadingOverlayService.ts` - ローディング状態管理
- `useMenuService.ts` - メニュー関連ビジネスロジック
- Nuxtによる自動インポート

### ストア (`/store`)

- `menu.ts` - メニューCRUD操作用Piniaストア
- `defineStore()`でComposition APIスタイルを使用

### レイアウト (`/layouts`)

- Nuxtレイアウトシステム（フォルダは存在するが内容は非表示）

### プラグイン (`/plugins`)

- `vuetify.ts` - Vuetify設定・セットアップ

## 設定ファイル

### コード品質

- `.prettierrc.json` - Prettierフォーマットルール
- `eslint.config.js` - Nuxt・Vueルール付きESLint設定

### テスト

- `vitest.config.ts` - jsdom付きユニットテスト設定
- `playwright.config.ts` - E2Eテスト設定
- `tests/setup.ts` - テストセットアップファイル
- `tests/components/` - コンポーネントユニットテスト
- `tests/e2e/` - エンドツーエンドテスト

### ビルド・開発

- `.nuxt/` - 生成されたNuxtファイル（自動生成、コミット対象外）
- `.output/` - ビルド出力ディレクトリ
- `public/` - 静的アセット（favicon等）
- `server/` - サーバーサイドコード・APIルート

## 命名規則

### ファイル・ディレクトリ

- **コンポーネント**: PascalCase（例：`TheHeader.vue`）
- **ページ**: camelCase（例：`menuList.vue`）
- **コンポーザブル**: `use`プレフィックス付きcamelCase（例：`useAxiosService.ts`）
- **ストア**: camelCase（例：`menu.ts`）

### コードスタイル

- **変数・関数**: camelCase
- **インターフェース・型**: PascalCase
- **定数**: UPPER_SNAKE_CASE
- **API通信**: インターセプターによるsnake_case ↔ camelCase変換

## アーキテクチャパターン

### データフロー

1. **APIレイヤー**: 自動ケース変換付きAxiosサービス
2. **ストアレイヤー**: 状態管理用Piniaストア
3. **コンポーネントレイヤー**: Composition API使用Vueコンポーネント
4. **UIレイヤー**: 一貫したデザインのためのVuetifyコンポーネント

### 主要パターン

- 全体でComposition API使用
- コンポーザブル・コンポーネントの自動インポート
- インターセプター付き集約HTTPクライアント
- データモデル用型安全インターフェース
- Piniaプラグインによる永続化状態
