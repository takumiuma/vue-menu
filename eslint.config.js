import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'

export default createConfigForNuxt({
  features: {
    typescript: true,
    vue: true,
    stylistic: true, // スタイリスティック機能を有効にして、Format on Saveでフォーマットを実行
  },
})
  .override('nuxt/vue/rules', {
    rules: {
      // Vuetifyのデータテーブルスロット構文でドット表記を許可 (例: #item.shopSearch)
      'vue/valid-v-slot': [
        'error',
        {
          allowModifiers: true,
        },
      ],
    },
  })
  // Prettierとの互換性設定を追加 - eslint-config-prettierを使用
  .append({
    name: 'prettier-compatibility',
    ...eslintConfigPrettier,
  })
