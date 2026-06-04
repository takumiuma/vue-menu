// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  modules: [
    // @pinia/nuxt は Nuxt 5 未対応のため plugins/pinia.ts で手動セットアップ
    // 'pinia-plugin-persistedstate/nuxt' は @pinia/nuxt 依存のため無効
    // 'nuxt3-vuex-module',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error Vuetify plugin configuration requires this format
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    },
  },
  srcDir: '.',
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
