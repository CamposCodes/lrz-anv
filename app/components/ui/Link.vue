<template>
  <component
    :is="tag"
    v-bind="extraAttrs"
    class="text-link underline decoration-1 underline-offset-[0.18em] transition-colors hover:text-link-hover"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
// Links nunca usam vermelho (reservado ao CTA de marca; evita confundir com erro).
const props = withDefaults(defineProps<{
  to?: string
  href?: string
}>(), { to: '', href: '' })

const tag = computed(() => (props.to ? 'NuxtLink' : 'a'))
const extraAttrs = computed(() => (props.to ? { to: props.to } : { href: props.href }))
</script>

<style scoped>
</style>
