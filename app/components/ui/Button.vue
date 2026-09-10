<template>
  <component
    :is="tag"
    v-bind="extraAttrs"
    :class="classes"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
// Regras de marca embutidas:
// - Vermelho é FILL-ONLY: primary = bg-primary + texto branco fixo (o rótulo tem que
//   ler tanto sobre sangue quanto sobre o fill branco da superfície SANGUE); secondary
//   usa --color-primary-text (branco em NOITE, sangue #D30000 em PAPEL) como cor de TEXTO/borda.
// - zambi reaproveita o vermelho de accent — a paleta de três cores não tem mais um
//   acento quente distinto. Foco: contorno global :focus-visible (token de anel).
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'zambi'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), { variant: 'primary', size: 'md', to: '', href: '', type: 'button', disabled: false })

const tag = computed(() => (props.to ? 'NuxtLink' : props.href ? 'a' : 'button'))

const extraAttrs = computed(() => {
  if (props.to) return { to: props.to, 'aria-disabled': props.disabled || undefined }
  if (props.href) return { href: props.href, 'aria-disabled': props.disabled || undefined }
  return { type: props.type, disabled: props.disabled }
})

// transition (não transition-colors) p/ animar também shadow + transform.
// active:scale-[0.97] = feedback tátil ao pressionar (restaura ao soltar).
const base = 'inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-sans font-semibold uppercase tracking-wider leading-none cursor-pointer transition-[color,background-color,border-color,box-shadow,transform] active:scale-[0.97] disabled:opacity-45 disabled:pointer-events-none aria-disabled:opacity-45 aria-disabled:pointer-events-none'

const sizeClass = computed(() => ({
  sm: 'px-4 py-2.5 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base'
}[props.size]))

// Fills ganham elevação sutil no hover (sombra tingida pela própria cor).
const variantClass = computed(() => ({
  primary: 'bg-primary text-on-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30',
  secondary: 'border-2 border-primary-text text-primary-text hover:bg-primary-text/10',
  ghost: 'text-link hover:bg-surface',
  zambi: 'bg-accent text-on-primary hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30'
}[props.variant]))

const classes = computed(() => [base, sizeClass.value, variantClass.value])
</script>

<style scoped>
</style>
