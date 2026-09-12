<template>
  <div ref="rootEl" class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7" style="background: var(--background)">
    <div class="relative w-40 sm:w-52" style="aspect-ratio: 1172 / 449">
      <span
        ref="nameEl"
        class="font-script absolute inset-0 flex items-center justify-center text-6xl leading-none sm:text-8xl"
        style="color: var(--primary)"
      >Lorenzo</span>
      <!-- opacity:0 estático aqui, não só via $gsap.set no onMounted — sem isso,
           entre o primeiro paint (hydration) e o JS rodar existe um frame em que
           as duas camadas aparecem juntas (o bug era exatamente esse). Só
           dourado (var(--primary)) nos dois — nada de vinho aqui. -->
      <div ref="markEl" class="lrz-mark absolute inset-0" style="opacity: 0; background-color: var(--primary)" />
    </div>

    <!-- Barra de progresso de verdade, não decorativa — a largura reflete quantos
         dos passos do gate (fontes, fotos, marca, load da janela) já resolveram
         de verdade, ver `progress` no script. -->
    <div class="h-1 w-40 overflow-hidden rounded-full sm:w-48" style="background-color: rgba(255,255,255,0.12)" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(progress * 100)">
      <div class="h-full rounded-full transition-[width] duration-300 ease-out" :style="{ width: `${progress * 100}%`, backgroundColor: 'var(--primary)' }" />
    </div>
    <span class="sr-only" role="status" aria-live="polite">Carregando…</span>
  </div>
</template>

<script setup lang="ts">
import { contributors } from '@/data/contributors'

const emit = defineEmits<{ ready: [], exited: [] }>()

const rootEl = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLElement | null>(null)
const markEl = ref<HTMLElement | null>(null)

const { $gsap, $prefersReducedMotion } = useNuxtApp()

const MIN_VISIBLE_MS = 1500

// font-display: swap só busca a fonte quando um texto com aquele font-family é
// de fato renderizado — e o resto da árvore (Cover/Contributor/Finale) só monta
// DEPOIS do gate. Sem esse load() explícito, document.fonts.ready resolveria
// cedo demais (só veria a Luxurious Script, usada aqui no próprio loading).
const FONT_PROBES = [
  '400 16px "Comico"',
  '400 16px "Luxurious Script"',
  '400 16px "Magazine Letter"',
  '400 16px "Pauls Ransom Note"',
  '400 16px "Instrument Serif"'
]

function waitFonts() {
  if (!('fonts' in document)) return Promise.resolve()
  return Promise.all(FONT_PROBES.map(f => document.fonts.load(f).catch(() => {})))
    .then(() => document.fonts.ready)
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    let done = false
    const finish = () => { if (!done) { done = true; resolve() } }
    const img = new Image()
    // decode() garante que o frame já está pronto pra desenhar, não só baixado.
    // Falha (404, formato) nunca deve travar o gate pra sempre — resolve mesmo assim.
    // decode() pode nunca resolver em alguns ambientes (bug conhecido sem
    // aceleração de GPU) — o timeout garante que o gate nunca trava pra sempre.
    img.onload = () => { img.decode().then(finish).catch(finish); setTimeout(finish, 2000) }
    img.onerror = () => finish()
    img.src = src
  })
}

function waitWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }))
}

function minDelay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

// Progresso real da barra: fontes (1) + uma foto por contribuidor + a marca (1)
// + load da janela (1) — cada passo que resolve empurra a largura, não é uma
// barra falsa correndo sozinha.
const progress = ref(0)
const TOTAL_STEPS = 3 + contributors.length
let doneSteps = 0

function trackStep<T>(p: Promise<T>): Promise<T> {
  return p.then((v) => {
    doneSteps++
    progress.value = doneSteps / TOTAL_STEPS
    return v
  })
}

let cycleTl: { kill: () => void } | null = null

function playExit(): Promise<void> {
  cycleTl?.kill()

  if (!$gsap || !rootEl.value) {
    document.documentElement.style.overflow = ''
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    // Saída sempre mais rápida que a espera (assimetria proposital: quem decide
    // é lento, quem responde é rápido) — easeOut é a curva forte já usada no
    // resto do projeto (ver gsap.client.ts), não o power2 genérico do GSAP.
    $gsap.to(rootEl.value, {
      autoAlpha: 0,
      duration: $prefersReducedMotion?.() ? 0.2 : 0.45,
      ease: 'easeOut',
      onComplete: () => {
        document.documentElement.style.overflow = ''
        resolve()
      }
    })
  })
}

onMounted(async () => {
  // Trava o scroll enquanto o loading cobre a tela — os ScrollTrigger das seções
  // só podem nascer com o layout final estável (ver comentário no gate abaixo).
  document.documentElement.style.overflow = 'hidden'

  if ($gsap && nameEl.value && markEl.value) {
    const reduced = $prefersReducedMotion?.()
    const dur = reduced ? 0.3 : 0.5
    const hold = reduced ? 0.5 : 0.65

    $gsap.set(markEl.value, { autoAlpha: 0 })

    // Loop infinito (para só quando o gate resolver, ver playExit) — crossfade
    // simples em reduced motion, com scale+blur no caso normal. Construído numa
    // const local (tipo inferido) e só depois guardado em cycleTl (tipo mínimo
    // { kill }), pra não depender de importar os tipos internos do GSAP.
    const tl = $gsap.timeline({ repeat: -1 })
    if (reduced) {
      tl
        .to({}, { duration: hold })
        .to(nameEl.value, { autoAlpha: 0, duration: dur })
        .to(markEl.value, { autoAlpha: 1, duration: dur }, '<')
        .to({}, { duration: hold })
        .to(markEl.value, { autoAlpha: 0, duration: dur })
        .to(nameEl.value, { autoAlpha: 1, duration: dur }, '<')
    } else {
      // Crossfade é "morph" na tela (scale+blur+opacity juntos), não uma entrada/
      // saída isolada — easeInOut é a curva certa pela árvore de decisão de easing,
      // e é a mesma curva custom que o resto do projeto usa (gsap.client.ts).
      tl
        .to({}, { duration: hold })
        .to(nameEl.value, { autoAlpha: 0, scale: 0.85, filter: 'blur(8px)', duration: dur, ease: 'easeInOut' })
        .to(markEl.value, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: dur, ease: 'easeInOut' }, '<')
        .to({}, { duration: hold })
        .to(markEl.value, { autoAlpha: 0, scale: 0.85, filter: 'blur(8px)', duration: dur, ease: 'easeInOut' })
        .to(nameEl.value, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: dur, ease: 'easeInOut' }, '<')
    }
    cycleTl = tl
  }

  // Gate de verdade: fontes + fotos dos contribuidores + a própria marca + load
  // da janela, e só then libera junto com o piso de percepção mínima — nunca
  // antes do sinal real, mesmo em conexão rápida.
  const realReady = Promise.all([
    trackStep(waitFonts()),
    ...contributors.map(c => trackStep(preloadImage(c.photo))),
    trackStep(preloadImage('/images/lrz-mark.png')),
    trackStep(waitWindowLoad())
  ])

  await Promise.all([realReady, minDelay(MIN_VISIBLE_MS)])

  // Libera o resto da árvore (v-if no app.vue) ANTES do loading sumir da tela —
  // assim CoverSection mede as letras com a fonte real já carregada, mesmo
  // enquanto ainda fica escondida atrás deste overlay fixed.
  emit('ready')
  await playExit()
  emit('exited')
})

onBeforeUnmount(() => {
  cycleTl?.kill()
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.lrz-mark {
  mask-image: url('/images/lrz-mark.png');
  -webkit-mask-image: url('/images/lrz-mark.png');
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}
</style>
