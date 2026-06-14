# vue-menu

Nuxt + Vuetify で構築したメニュー管理アプリです。

## GitHub Pages で試す

GitHub Pages利用し、一部機能制限して公開しています。
以下リンクからアクセスできます。

- `https://takumiuma.github.io/vue-menu/menuList`

## 自動デプロイについて
GitHub Actionsで`.github/workflows/deploy-pages.yml` が `master` への push を契機に `yarn generate` を実行し、`.output/public` を GitHub Pagesへデプロイします。

## ローカル開発

依存関係をインストールして開発サーバーを起動します。

```bash
yarn install
yarn dev
```

デフォルトでは `http://localhost:3000` で確認できます。

## 静的サイトをローカルで確認

GitHub Pages に近い形で確認したい場合は、同じ base URL を付けて静的生成してからプレビューします。

```bash
NUXT_APP_BASE_URL=/vue-menu/ yarn generate
npx serve .output/public
```

ルート配下で通常の本番プレビューだけを確認したい場合は次でも構いません。

```bash
yarn build
yarn preview
```
