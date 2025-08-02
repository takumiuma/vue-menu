import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    typescript: true,
    vue: true,
    stylistic: false, // Disable stylistic rules to avoid conflicts with Prettier
  },
})
  .override('nuxt/vue/rules', {
    rules: {
      // Allow Vuetify data table slot syntax with dots (e.g., #item.shopSearch)
      'vue/valid-v-slot': [
        'error',
        {
          allowModifiers: true,
        },
      ],
      // Disable Vue stylistic rules that conflict with Prettier
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/html-self-closing': 'off',
    },
  })
  // Add prettier config to turn off conflicting rules
  .append({
    name: 'prettier-compatibility',
    rules: {
      // Turn off all stylistic rules that might conflict with Prettier
      '@stylistic/arrow-parens': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/indent': 'off',
    },
  })
