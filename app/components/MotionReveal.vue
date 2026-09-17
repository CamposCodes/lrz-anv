<template>
  <Motion
    :initial="{ opacity: 0, y: 24 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="{ once: true, margin: '0px 0px -10% 0px' }"
    :transition="{ duration, delay, ease: [0.16, 1, 0.3, 1] }"
  >
    <slot />
  </Motion>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  delay?: number
  duration?: number
}>(), { delay: 0, duration: 0.6 })
</script>

<style scoped>
</style>
