import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// @pinia/nuxt は Nuxt 5 に未対応のため、手動で Pinia を登録する
export default defineNuxtPlugin((app) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.vueApp.use(pinia)
})
