<template>
  <!-- Símbolo-mestre: dois anéis sobrepostos (eclipse) — eco do OO de MOON e da ampulheta
       do Z de Zambi. Traço em currentColor. -->
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    aria-hidden="true"
    :style="{ width: size, height: size }"
  >
    <circle cx="19" cy="24" r="13" />
    <circle cx="29" cy="24" r="13" />
  </svg>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  size?: string
  strokeWidth?: number
}>(), { size: '1.5rem', strokeWidth: 2 })
</script>

<style scoped>
</style>
