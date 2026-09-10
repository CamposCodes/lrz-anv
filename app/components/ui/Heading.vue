<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>

<script lang="ts" setup>
// voice="lua" → Lastik (didone). voice="zambi" → Space Grotesk caixa-alta (Modo Sol).
// Disciplina didone: tamanhos sempre ≥ ~28px (a partir de text-xl) e wght normal,
// para os fios capilares da Lastik não sumirem sobre escuro.
const props = withDefaults(defineProps<{
  level?: 1 | 2 | 3 | 4
  voice?: 'lua' | 'zambi'
  as?: string
}>(), { level: 2, voice: 'lua', as: '' })

const tag = computed(() => props.as || `h${props.level}`)

const sizeClass = computed(() => ({
  1: 'text-4xl md:text-6xl',
  2: 'text-3xl md:text-5xl',
  3: 'text-2xl md:text-4xl',
  4: 'text-xl md:text-2xl'
}[props.level]))

const voiceClass = computed(() => (props.voice === 'zambi'
  ? 'font-zambi font-semibold uppercase tracking-[0.18em]'
  : 'font-display font-normal'))

const classes = computed(() => [voiceClass.value, sizeClass.value, 'text-fg leading-tight text-balance'])
</script>

<style scoped>
</style>
