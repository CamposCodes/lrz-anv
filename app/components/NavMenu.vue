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
          <p class="nav-menu-kicker px-2 pb-2.5 pt-1 text-[0.6875rem] uppercase tracking-[0.16em]">
            Ir direto pra mensagem de
          </p>
          <ul ref="listEl" class="flex flex-col gap-1.5">
            <li v-for="(c, i) in contributors" :key="c.name">
              <button
                type="button"
                class="nav-menu-pill flex w-full items-baseline justify-between gap-4 rounded-full border border-white/10 px-4 py-2.5 text-left"
                @click="goTo(i)"
              >
                <!-- Cursiva a 1.75rem: a Luxurious Script é uma face de display,
                     e nos 20px de antes os nomes viravam rabisco (é o que o dono
                     do site reportou). Em linha única, de largura cheia, sobra
                     espaço pra ela nesse tamanho. -->
                <span class="nav-menu-name font-script text-[1.75rem] leading-none">{{ splitName(c.name)[0] }}</span>
                <!-- O complemento (parentesco, sobrenome ou nome artístico) sai
                     de DENTRO da cursiva e vira rótulo miúdo: não competia por
                     atenção, só embaralhava. Não é enfeite — é o que distingue
                     os homônimos (dois Vitor, dois Gabriel, dois Arthur). -->
                <span v-if="splitName(c.name)[1]" class="nav-menu-qualifier shrink-0 text-[0.6875rem] uppercase tracking-[0.14em]">
                  {{ splitName(c.name)[1] }}
                </span>
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

// `name` guarda "Vitor, Irmão" / "Gabriel, Campos" / "João Gabriel, Naipe Hom":
// nome e complemento numa string só. A vírgula separa os dois papéis; nomes sem
// vírgula ("Vó Malu", "Tia Claudia & Tio Kali") não têm complemento e ocupam a
// linha inteira.
function splitName(name: string): [string, string?] {
  const [primary, secondary] = name.split(',').map(s => s.trim())
  return [primary!, secondary]
}

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

/* Secundário tingido do próprio dourado da marca, nunca cinza neutro: num
   painel escuro sobre a página inteira, cinza lê como "desligado", e o dourado
   é o único accent do projeto (ver tailwind.css). */
.nav-menu-panel {
  --champagne: color-mix(in srgb, var(--primary) 55%, var(--foreground));
}

.nav-menu-kicker {
  color: color-mix(in srgb, var(--primary) 30%, var(--muted-foreground));
}

.nav-menu-pill {
  background-color: rgb(255 255 255 / 4%);
  color: var(--foreground);
  /* Propriedades nomeadas, nunca `all`. transform entra porque o :active
     escala. */
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
}

.nav-menu-qualifier {
  color: var(--champagne);
  transition: color 150ms ease;
}

/* Toque dispara :hover no tap e deixa o estado grudado — por isso o hover fica
   atrás de (hover: hover) and (pointer: fine), e o dedo conta só com o :active. */
@media (hover: hover) and (pointer: fine) {
  .nav-menu-pill:hover {
    background-color: color-mix(in srgb, var(--primary) 9%, transparent);
    border-color: color-mix(in srgb, var(--primary) 45%, transparent);
  }

  .nav-menu-pill:hover .nav-menu-name {
    color: var(--primary);
  }

  .nav-menu-pill:hover .nav-menu-qualifier {
    color: var(--primary);
  }
}

/* Alvo largo: 0.98 dá o "ouvi você" sem parecer elástico (0.97 num botão de
   largura cheia já lê como sacudida). */
.nav-menu-pill:active {
  transform: scale(0.98);
}
</style>
