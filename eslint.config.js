import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    typescript: true,
    vue: true,
    stylistic: true,
  },
}).override('nuxt/vue/rules', {
  rules: {
    // Allow Vuetify data table slot syntax with dots (e.g., #item.shopSearch)
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
  },
})
