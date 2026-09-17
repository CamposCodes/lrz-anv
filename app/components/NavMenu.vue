<template>
  <button
    ref="triggerEl"
    type="button"
    class="fixed right-4 top-4 z-40 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/20 sm:right-6 sm:top-6"
    :aria-label="open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
    aria-haspopup="true"
    :aria-expanded="open"
    aria-controls="nav-menu-panel"
    @click="toggle"
  >
    <Menu v-if="!open" class="size-5" />
    <X v-else class="size-5" />
  </button>

  <Teleport to="body">
    <Transition name="nav-menu">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/40"
        @click="close"
      >
        <div
          id="nav-menu-panel"
          class="nav-menu-panel fixed right-4 top-[4.75rem] max-h-[min(34rem,calc(100dvh-6rem))] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-3 shadow-2xl backdrop-blur-md sm:right-6 sm:top-20"
          role="dialog"
          aria-modal="true"
          aria-label="Navegação entre mensagens"
          @click.stop
        >
          <p class="px-1 pb-2 pt-1 text-xs uppercase tracking-wide" style="color: var(--muted-foreground)">
            Ir direto pra mensagem de
          </p>
          <ul ref="listEl" class="flex flex-wrap gap-2">
            <li v-for="(c, i) in contributors" :key="c.name">
              <button
                type="button"
                class="nav-menu-pill rounded-full border border-white/15 bg-white/5 px-4 py-2 font-script text-xl leading-none text-foreground transition-[color,background-color,border-color,transform] duration-150 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                @click="goTo(i)"
              >
                {{ c.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import type { Contributor } from '@/types'

defineProps<{ contributors: Contributor[] }>()

const open = ref(false)
const triggerEl = ref<HTMLButtonElement | null>(null)
const listEl = ref<HTMLUListElement | null>(null)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function toggle() {
  if (open.value) close()
  else openMenu()
}

function openMenu() {
  open.value = true
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  nextTick(() => listEl.value?.querySelector('button')?.focus())
}

function close() {
  if (!open.value) return
  open.value = false
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  triggerEl.value?.focus()
}

// Fecha e só então rola: com overflow ainda travado (documentElement.style.overflow
// = 'hidden' em openMenu) o scrollIntoView não move a página de verdade.
// behavior:'instant' é proposital, não só um default esquecido: com
// scroll-snap-stop:always em toda .scroll-scene (tailwind.css), um scrollIntoView
// 'smooth' (explícito ou herdado do scroll-behavior:smooth do CSS) que precise
// atravessar várias seções trava e não rola NADA — o Chrome parece desistir da
// animação inteira em vez de passar por cada stop. 'instant' é o único behavior
// que rola de forma confiável nessa combinação.
function goTo(index: number) {
  close()
  nextTick(() => {
    document.getElementById(`contributor-${index}`)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  })
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (open.value) document.documentElement.style.overflow = ''
})
</script>

<style scoped>
/* Mesmo par de curvas/duração do lightbox em ContributorSection.vue (abre
   devagar, fecha rápido) — cubic-bezier(0.16,1,0.3,1) é a curva 'easeOut'
   já registrada em gsap.client.ts, espelhada aqui em CSS puro. */
.nav-menu-enter-active,
.nav-menu-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-menu-leave-active {
  transition-duration: 0.18s;
}

.nav-menu-enter-from,
.nav-menu-leave-to {
  opacity: 0;
}

.nav-menu-enter-active .nav-menu-panel,
.nav-menu-leave-active .nav-menu-panel {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}

.nav-menu-leave-active .nav-menu-panel {
  transition-duration: 0.18s;
}

.nav-menu-enter-from .nav-menu-panel,
.nav-menu-leave-to .nav-menu-panel {
  transform: scale(0.94);
}

.nav-menu-pill:active {
  transform: scale(0.97);
}
</style>
