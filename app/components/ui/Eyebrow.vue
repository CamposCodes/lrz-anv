<template>
  <component :is="as" class="font-mono text-xs font-medium uppercase tracking-[0.25em] text-fg-muted">
    <slot />
  </component>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ as?: string }>(), { as: 'p' })
</script>

<style scoped>
</style>
