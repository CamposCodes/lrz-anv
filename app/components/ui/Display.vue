<template>
  <component :is="as" class="jm-display font-display font-normal text-fg text-balance">
    <slot />
  </component>
</template>

<script lang="ts" setup>
// Display de hero — Lastik grande (didone de alto contraste). Não animar o
// LCP a partir de opacity:0 (CLAUDE.md): anime translateY, nunca opacidade.
withDefaults(defineProps<{ as?: string }>(), { as: 'h1' })
</script>

<style scoped>
.jm-display {
  font-size: clamp(2.75rem, 8vw, 7rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  /* peso único: nunca sintetizar bold (vale quando renderizado como <p>, fora de h1-h4). */
  font-synthesis: none;
}
</style>
