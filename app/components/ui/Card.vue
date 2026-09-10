<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  variant?: 'surface' | 'cosmic'
  hover?: boolean
  as?: string
}>(), { variant: 'surface', hover: false, as: 'div' })

const base = 'rounded-[var(--radius)] border p-6'

const variantClass = computed(() => ({
  surface: 'bg-surface border-border-strong text-fg',
  // cosmic: card vermelho fixo (não segue a cascata de superfície); texto branco fixo,
  // não herdar fg. Era azul-noite antes da paleta de três cores.
  cosmic: 'bg-sangue border-border-strong text-branco'
}[props.variant]))

// Hover vermelho (bg-primary, segue a superfície) + elevação sutil (-translate-y-1 +
// sombra). Texto fica branco fixo — o fill de hover é sempre sangue em NOITE/PAPEL.
const hoverClass = computed(() => (props.hover ? 'cursor-pointer transition-[color,background-color,border-color,box-shadow,transform] hover:-translate-y-1 hover:bg-primary hover:border-primary hover:text-on-primary hover:shadow-xl hover:shadow-black/30' : ''))

const classes = computed(() => [base, variantClass.value, hoverClass.value])
</script>

<style scoped>
</style>
