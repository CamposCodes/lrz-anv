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
            <li v-for="row in rows" :key="row.index">
              <button
                type="button"
                class="nav-menu-pill flex w-full items-baseline justify-between gap-4 rounded-full border border-white/10 px-4 py-2.5 text-left"
                @click="goTo(row.index)"
              >
                <!-- Cursiva a 1.75rem: a Luxurious Script é uma face de display,
                     e nos 20px de antes os nomes viravam rabisco (é o que o dono
                     do site reportou). Em linha única, de largura cheia, sobra
                     espaço pra ela nesse tamanho. -->
                <span class="nav-menu-name font-script text-[1.75rem] leading-none">{{ row.name }}</span>
                <!-- Apelido/parentesco em amarelo (o dourado da marca): é o que
                     distingue os homônimos (dois Vitor, dois Gabriel, dois
                     Arthur) sem competir com o nome pela atenção. -->
                <span v-if="row.title" class="nav-menu-title shrink-0 text-[0.6875rem] uppercase tracking-[0.14em]">
                  {{ row.title }}
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

const props = defineProps<{ contributors: Contributor[] }>()

// Rótulo de MENU, só daqui — de propósito não mexe no `name` do contributors.ts,
// que continua sendo o que aparece na legenda gigante sobre a foto de cada
// seção ("Mãe", "Vó Malu", "Tio Gu"). Aqui o menu precisa de outra coisa: o
// nome de quem é (primeiro plano) e o apelido/parentesco em amarelo, que é o
// que diferencia os homônimos numa lista de 25.
//
// Chaveado pelo `name` de cada entrada. Mudar um `name` no contributors.ts sem
// atualizar aqui não quebra nada: cai no fallback da vírgula, abaixo.
const MENU_LABELS: Record<string, [string, string]> = {
  'Mãe': ['Taíz', 'Mãe'],
  'Pai': ['Cabral', 'Pai'],
  'Vó Malu': ['Malu', 'Vó'],
  'Vó Regina': ['Regina', 'Vó'],
  'Tio Gu': ['Gu', 'Tio'],
  'Tia Claudia & Tio Kali': ['Claudia & Kali', 'Tios'],
  'Tia Selma & Tio Ronaldo': ['Selma & Ronaldo', 'Tios'],
  'Breno Prenassi': ['Breno', 'Prenassi'],
  'Licurci MC': ['Licurci', 'MC'],
  'Davi Dooup': ['Davi', 'Dooup'],
  'Arthur Dexis': ['Arthur', 'Dexis'],
  'Gabriel Vassoura': ['Gabriel', 'Vassoura'],
  'Babi Lino': ['Bárbara Lino', 'Babi'],
  'Arthur DMA': ['Arthur', 'DMA'],
  'Muay Thai': ['Jô Muay Thai', 'Equipe']
}

// Fallback: as entradas restantes já guardam os dois papéis numa string só
// ("Vitor, Irmão", "Gabriel, Campos", "João Gabriel, Naipe Hom") — a vírgula
// separa nome e apelido.
const rows = computed(() => props.contributors.map((c, index) => {
  const [name, title] = MENU_LABELS[c.name] ?? c.name.split(',').map(s => s.trim())
  return { index, name: name!, title }
}))

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

/* Amarelo cheio da marca (--primary), não um champanhe apagado: o apelido é
   informação que se procura na lista, não enfeite de apoio. ~10:1 de contraste
   sobre o painel escuro. */
.nav-menu-title {
  color: var(--primary);
}

/* Toque dispara :hover no tap e deixa o estado grudado — por isso o hover fica
   atrás de (hover: hover) and (pointer: fine), e o dedo conta só com o :active. */
@media (hover: hover) and (pointer: fine) {
  .nav-menu-pill:hover {
    background-color: color-mix(in srgb, var(--primary) 9%, transparent);
    border-color: color-mix(in srgb, var(--primary) 45%, transparent);
  }

  /* O apelido já é amarelo em repouso; no hover é o NOME que acende, então a
     linha inteira fica dourada. */
  .nav-menu-pill:hover .nav-menu-name {
    color: var(--primary);
  }
}

/* Alvo largo: 0.98 dá o "ouvi você" sem parecer elástico (0.97 num botão de
   largura cheia já lê como sacudida). */
.nav-menu-pill:active {
  transform: scale(0.98);
}
</style>
