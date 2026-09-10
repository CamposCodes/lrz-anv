<template>
  <!-- Selo Zambi tingido por currentColor (o pai escolhe o token: accent/fg/prata).
       Decorativo por padrão; passe `label` para virar imagem semântica. -->
  <span
    class="jm-zambi-badge"
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
}>(), { size: '2.5rem', label: '' })
</script>

<style scoped>
.jm-zambi-badge {
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url("/images/MARCA/ZAMBI/zambi-badge.png") center / contain no-repeat;
          mask: url("/images/MARCA/ZAMBI/zambi-badge.png") center / contain no-repeat;
}
</style>
