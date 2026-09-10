<template>
  <!-- Wordmark Zambi tingido por currentColor. O asset tem moldura quadrada nativa. -->
  <span
    class="jm-zambi-wordmark"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    :style="{ width: size, height: size }"
  />
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  size?: string
  label?: string
}>(), { size: '4rem', label: '' })
</script>

<style scoped>
.jm-zambi-wordmark {
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url("/images/MARCA/ZAMBI/zambi-wordmark.png") center / contain no-repeat;
          mask: url("/images/MARCA/ZAMBI/zambi-wordmark.png") center / contain no-repeat;
}
</style>
