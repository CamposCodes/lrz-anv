<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="overlayRef"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm modal-fade"
      @click.self="close"
      @keydown.esc="close"
    >
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lgpd-prefs-title"
        tabindex="-1"
        class="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 text-fg shadow-2xl md:p-8"
      >
        <div class="mb-2 flex items-start justify-between">
          <h2 id="lgpd-prefs-title" class="font-display text-xl text-fg md:text-2xl">
            Preferências de Privacidade
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            class="-mr-1 -mt-1 p-2 text-fg-subtle transition-colors hover:text-fg"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p class="mb-6 text-sm text-fg-muted">
          Escolha quais cookies você autoriza. Os cookies essenciais são necessários para o site funcionar.
        </p>

        <div class="mb-6 space-y-4">
          <!-- Essenciais (sempre ativos, desabilitado) -->
          <div class="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface-2 p-4">
            <div class="min-w-0 flex-1">
              <h3 class="mb-1 text-sm font-bold text-fg">Cookies Essenciais</h3>
              <p class="text-xs leading-relaxed text-fg-subtle">
                Necessários para o funcionamento básico do site (consentimento, segurança).
              </p>
            </div>
            <label class="relative inline-flex flex-shrink-0 cursor-not-allowed items-center opacity-60">
              <input type="checkbox" checked disabled class="peer sr-only" >
              <span class="relative h-6 w-11 rounded-full bg-primary">
                <span class="absolute right-[2px] top-[2px] h-5 w-5 rounded-full border border-border bg-moon" />
              </span>
            </label>
          </div>

          <!-- Analíticos (alternável) -->
          <div class="flex items-start justify-between gap-4 rounded-2xl border border-border p-4">
            <div class="min-w-0 flex-1">
              <h3 class="mb-1 text-sm font-bold text-fg">Cookies Analíticos</h3>
              <p class="text-xs leading-relaxed text-fg-subtle">
                Google Analytics 4 (mensuração de audiência) e Microsoft Clarity (mapas de calor e gravações de sessão anônimas).
              </p>
            </div>
            <label class="relative inline-flex flex-shrink-0 cursor-pointer items-center">
              <input
                v-model="analyticsToggle"
                type="checkbox"
                class="peer sr-only"
                aria-label="Permitir cookies analíticos"
              >
              <span class="relative h-6 w-11 rounded-full bg-border-strong transition-colors peer-checked:bg-primary">
                <span class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full border border-border bg-moon transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>
        </div>

        <p class="mb-6 text-xs text-fg-subtle">
          Detalhes completos em
          <NuxtLink to="/cookies" class="text-link underline hover:text-link-hover">Política de Cookies</NuxtLink>.
        </p>

        <div class="flex flex-col justify-end gap-3 sm:flex-row">
          <UiButton variant="secondary" size="sm" @click="rejectAll">Recusar todos</UiButton>
          <UiButton variant="primary" size="sm" @click="save">Salvar preferências</UiButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
const { isOpen, close } = useLgpdPreferencesModal()
const { isAnalyticsAllowed, acceptAll, acceptOnlyEssential, setCategory } = useLgpdConsent()

const analyticsToggle = ref(isAnalyticsAllowed.value)

const overlayRef = ref<HTMLDivElement | null>(null)
const dialogRef = ref<HTMLDivElement | null>(null)

const save = () => {
  if (analyticsToggle.value) acceptAll()
  else setCategory('analytics', false)
  close()
}

const rejectAll = () => {
  acceptOnlyEssential()
  close()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key !== 'Tab') return
  // Focus trap simples dentro do diálogo
  const focusable = dialogRef.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable || focusable.length === 0) return
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

// O modal é renderizado uma única vez na raiz do app; ele controla a própria
// visibilidade via useLgpdPreferencesModal(). Os efeitos colaterais (trava de
// scroll, listener de teclado, foco) são ligados/desligados conforme `isOpen`.
watch(isOpen, (open) => {
  if (!import.meta.client) return
  if (open) {
    analyticsToggle.value = isAnalyticsAllowed.value
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
    nextTick(() => dialogRef.value?.focus())
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-fade {
  animation: fade-in 200ms ease-out;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
