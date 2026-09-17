import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
    'vue/block-lang': ['error', { script: { lang: 'ts' } }],
    'no-empty': ['error', { allowEmptyCatch: true }]
  }
})
