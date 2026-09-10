<template>
  <div :class="['mx-auto w-full px-6 md:px-8', sizeClass]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'full'
}>(), { size: 'lg' })

const sizeClass = computed(() => ({
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  full: 'max-w-none'
}[props.size]))
</script>

<style scoped>
</style>
