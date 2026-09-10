<template>
  <!-- Motivo line-art recolorido por máscara (.motif global em tailwind.css). A cor vem
       de currentColor (token herdado); a opacidade do tier; o blend (screen/multiply) do tema.
       Passe a cor via text-* e o tamanho via size ou classes w-/h-. -->
  <span class="motif" aria-hidden="true" :style="style" />
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  name: string
  tier?: 'ambient' | 'decor' | 'frame' | 'accent'
  size?: string
}>(), { tier: 'decor', size: '' })

const style = computed(() => {
  const s: Record<string, string> = {
    '--motif-src': `url(/images/ELEMENTOS/${props.name}.png)`,
    opacity: `var(--motif-${props.tier})`
  }
  if (props.size) {
    s.width = props.size
    s.height = props.size
  }
  return s
})
</script>

<style scoped>
</style>
