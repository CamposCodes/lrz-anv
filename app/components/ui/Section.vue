<template>
  <!-- data-surface renderizado no servidor: a superfície é propriedade da SEÇÃO, não do
       documento. Não há preferência de usuário a persistir → sem cookie, sem FOUC.
       O conteúdo herda text-fg, que a cascata de [data-surface] já resolveu. -->
  <component
    :is="as"
    :data-surface="dataSurface"
    :class="['relative isolate', fillClass, paddingClass, 'text-fg']"
  >
    <slot name="decor" />
    <slot />
  </component>
</template>

<script lang="ts" setup>
// Três superfícies: NOITE · PAPEL · SANGUE (docs/prd/00-indice.md §3).
const props = withDefaults(defineProps<{
  surface?: 'noite' | 'papel' | 'sangue' | 'inherit'
  fill?: 'solid' | 'elevated' | 'transparent' | 'none'
  as?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}>(), { surface: 'inherit', fill: 'solid', as: 'section', padding: 'lg' })

const dataSurface = computed(() => (props.surface === 'inherit' ? undefined : props.surface))

const fillClass = computed(() => ({
  solid: 'bg-bg',
  elevated: 'bg-surface',
  // transparent deixa a atmosfera global (névoa) aparecer atrás do conteúdo.
  transparent: '',
  none: ''
}[props.fill]))

const paddingClass = computed(() => ({
  none: '',
  sm: 'py-10 md:py-14',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  // xl = o respiro do glossário (S2) e da abertura do arquivo (S5): >=18vh.
  xl: 'py-[18vh] md:py-[20vh]'
}[props.padding]))
</script>

<style scoped>
</style>
