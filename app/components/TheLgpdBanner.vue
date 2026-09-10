<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="!isDecided"
      ref="caixa"
      role="region"
      aria-label="Aviso de cookies e privacidade"
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-border-strong bg-surface-2 px-4 py-4 shadow-2xl md:py-5"
    >
      <div class="container mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p class="flex-1 text-sm leading-relaxed text-fg-muted">
          Usamos cookies essenciais para o funcionamento do site e, com seu consentimento, cookies analíticos para entender como você navega.
          Saiba mais na <NuxtLink to="/privacidade" class="font-medium text-link underline hover:text-link-hover">Política de Privacidade</NuxtLink>.
        </p>
        <div class="flex w-full flex-shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <UiButton variant="ghost" size="sm" @click="openPreferences">Personalizar</UiButton>
          <UiButton variant="secondary" size="sm" @click="acceptOnlyEssential">Apenas essenciais</UiButton>
          <UiButton variant="primary" size="sm" @click="acceptAll">Aceitar todos</UiButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { isDecided, acceptAll, acceptOnlyEssential } = useLgpdConsent()
const { open: openPreferences } = useLgpdPreferencesModal()

// O banner é `fixed bottom-0` e come a base da tela. No desktop ele mede 121px e sobra
// dobra acima; num 390×844 ele mede 263px — 31% da tela — e cobre a headline do hero
// INTEIRA (medido: <h1> em y 601–731, banner em y 581–844). Ou seja: na primeira visita
// pelo celular, que é sempre a visita COM banner, a dobra não tem texto nenhum.
//
// Publicar a altura em vez de empurrar o layout: quem precisa recuar recua (hoje só o
// hero, que ancora o conteúdo na base), e as outras seções não ganham CLS por causa de
// um elemento que some no primeiro clique.
const caixa = useTemplateRef<HTMLElement>('caixa')
let ro: ResizeObserver | null = null

const publicar = (px: number) =>
  document.documentElement.style.setProperty('--lgpd-h', `${Math.round(px)}px`)

// offsetHeight e não contentRect: o banner tem padding e borda, e é a caixa TODA que
// tapa o hero.
watch(caixa, (el) => {
  ro?.disconnect()
  ro = null
  if (!el) { publicar(0); return }
  ro = new ResizeObserver(() => publicar(el.offsetHeight))
  ro.observe(el)
  publicar(el.offsetHeight)
}, { flush: 'post', immediate: true })

onBeforeUnmount(() => {
  ro?.disconnect()
  if (import.meta.client) publicar(0)
})
</script>

<style scoped>
</style>
