# vue-menu

Nuxt + Vuetify で構築したメニュー管理アプリです。GitHub Pages 向けに静的サイトとして生成できます。

## GitHub Pages で試す

GitHub Pages で公開する場合の URL は次の形式です。

- `https://<GitHubユーザーまたはOrganization>.github.io/vue-menu/`

このリポジトリはサブパス `/vue-menu/` で配信される前提なので、静的生成時は `NUXT_APP_BASE_URL=/vue-menu/` を付けます。

```bash
yarn install
NUXT_APP_BASE_URL=/vue-menu/ yarn generate
```

GitHub Actions では `.github/workflows/deploy-pages.yml` が `master` への push を契機に `yarn generate` を実行し、`.output/public` を GitHub Pages へデプロイします。公開するには、リポジトリの **Settings > Pages** で **Build and deployment / Source** を **GitHub Actions** に設定してください。

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

## スクリーンショット

### ホーム画面

<img width="1455" alt="スクリーンショット 2024-12-01 0 34 03" src="https://github.com/user-attachments/assets/9a3dccc2-a034-43a2-9b23-3ad6ea0319bc">

### フィルター機能

<img width="1220" alt="スクリーンショット 2024-11-24 18 04 27" src="https://github.com/user-attachments/assets/b52d23c5-c760-4b78-8e82-5359c76de63f">

### タグ付け更新機能

<img width="370" alt="スクリーンショット 2024-12-01 0 34 33" src="https://github.com/user-attachments/assets/62db64e5-5dee-42f5-8b14-3c438ab34c5a">
