<template>
  <!-- Root único (fallthrough do `class="mt-4"` do ContributorSection precisa
       de um só elemento raiz). Composição de uma linha só (referência
       voice-message estilo iOS): ícone de play solto (sem botão circular) +
       waveform ocupando o resto da largura. Sem contador de tempo — a
       waveform/legenda sincronizada já comunicam progresso. A linha de áudio
       assume 100% do seek (clique/arrasto/teclado), sem botões de skip
       dedicados. -->
  <div class="flex w-full flex-col gap-1.5">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="play-btn relative flex size-9 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-foreground outline-offset-4 transition-transform duration-150 ease-out motion-reduce:transition-none active:scale-[0.94]"
        :class="{ 'is-playing': isPlaying }"
        :aria-label="isPlaying ? `Pausar ${kind}` : `Tocar ${kind}`"
        @click="toggle"
      >
        <span class="relative flex size-8 items-center justify-center">
          <Pause
            fill="currentColor"
            class="absolute size-8 transition-[opacity,filter,transform] duration-200 ease-out motion-reduce:transition-none"
            :class="isPlaying ? 'scale-100 opacity-100 blur-0' : 'scale-50 opacity-0 blur-[2px]'"
          />
          <Play
            fill="currentColor"
            class="absolute size-8 translate-x-px transition-[opacity,filter,transform] duration-200 ease-out motion-reduce:transition-none"
            :class="isPlaying ? 'scale-50 opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-0'"
          />
        </span>
      </button>

      <!-- Waveform: barras grossas e espaçadas (gap-1, poucas e largas em vez de
           muitas e finas) pra ler como equalizador de verdade, não uma textura
           contínua — altura pseudo-aleatória determinística seedada pelo
           próprio src (mesmo áudio sempre desenha a mesma forma, sem Web Audio
           API/decode, efeito puramente decorativo). Preenchimento dourado
           acompanha o progresso via clip-path numa segunda cópia das barras
           (mesma técnica de "duplicar e recortar" de tabs com transição de cor
           perfeita: mais barato e mais nítido que colorir cada barra por JS).
           Quem escuta de verdade a interação é o <input type="range"> por
           baixo, invisível mas funcional — clique/arrasto/teclado/toque cobrem
           100% do seek, pra frente e pra trás, sem precisar de botão dedicado. -->
      <div class="waveform relative h-9 min-w-0 flex-1" :class="{ 'is-playing': isPlaying }" :style="{ '--seek-progress': `${progress}%` }">
        <div class="waveform-track pointer-events-none absolute inset-0 flex items-center gap-1" aria-hidden="true">
          <span
            v-for="(h, i) in bars"
            :key="i"
            class="waveform-bar block flex-1 rounded-full"
            :style="{ height: `${h}%`, animationDelay: `${i * 0.045}s` }"
          />
        </div>
        <div class="waveform-track waveform-track--fill pointer-events-none absolute inset-0 flex items-center gap-1" aria-hidden="true">
          <span
            v-for="(h, i) in bars"
            :key="i"
            class="waveform-bar block flex-1 rounded-full"
            :style="{ height: `${h}%`, animationDelay: `${i * 0.045}s` }"
          />
        </div>

        <input
          type="range"
          class="waveform-range absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-offset-4"
          min="0"
          :max="duration || 0"
          step="0.01"
          :value="currentTime"
          :aria-label="`Posição do ${kind}`"
          @input="onSeekInput"
        >
      </div>
    </div>

    <!-- Com `media` (ex.: o <video> do cartão central), o player controla esse
         elemento em vez de criar o próprio <audio>. -->
    <audio
      v-if="!media"
      ref="innerAudioRef"
      :src="src"
      preload="metadata"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />
  </div>
</template>

<script setup lang="ts">
import { Play, Pause } from '@lucide/vue'

// `src` também semeia o desenho da onda. `media` (opcional): elemento externo
// que o player passa a controlar — play/pause, seek, progresso e legenda —
// em vez do <audio> interno.
const { src, media = null } = defineProps<{ src: string, media?: HTMLMediaElement | null }>()

// Emite o tempo atual pra quem usa este player conseguir sincronizar algo
// externo com a reprodução (ex.: legenda por trecho em ContributorSection.vue)
// sem precisar duplicar o `<audio>`/composable lá fora.
const emit = defineEmits<{ timeupdate: [seconds: number] }>()

const { audioRef, isPlaying, currentTime, duration, toggle, seek, onPlay, onPause, onEnded, onTimeUpdate, onLoadedMetadata } = useAudioPlayer()

watch(currentTime, (t) => emit('timeupdate', t))

const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

const kind = computed(() => media?.tagName === 'VIDEO' ? 'vídeo' : 'áudio')

// <audio> interno tem ref PRÓPRIA: se fosse direto no audioRef do composable,
// ao trocar pra `media` o v-if desmontaria o <audio> e o Vue zeraria o
// audioRef DEPOIS de ele já apontar pro vídeo — botão e onda paravam de agir.
const innerAudioRef = ref<HTMLAudioElement | null>(null)
watch([() => media, innerAudioRef], () => {
  audioRef.value = media ?? innerAudioRef.value
}, { immediate: true, flush: 'post' })

// Áudio local/cacheado pode terminar de carregar metadata antes do Vue montar
// o listener @loadedmetadata — sem isso, a duração fica travada em 0:00.
onMounted(() => {
  if (audioRef.value && audioRef.value.readyState >= 1) onLoadedMetadata()
})

// Elemento externo: liga os mesmos eventos que o <audio> interno usa no
// template e aponta o composable pra ele. Refaz se o elemento mudar.
const MEDIA_EVENTS = [
  ['play', onPlay],
  ['pause', onPause],
  ['ended', onEnded],
  ['timeupdate', onTimeUpdate],
  ['loadedmetadata', onLoadedMetadata]
] as const

watch(() => media, (el, _old, onCleanup) => {
  if (!el) return
  MEDIA_EVENTS.forEach(([name, handler]) => el.addEventListener(name, handler))
  if (el.readyState >= 1) onLoadedMetadata()
  if (!el.paused) onPlay()
  onCleanup(() => MEDIA_EVENTS.forEach(([name, handler]) => el.removeEventListener(name, handler)))
}, { immediate: true })

function onSeekInput(e: Event) {
  seek(Number((e.target as HTMLInputElement).value))
}

// Forma de onda "falsa" determinística: hash simples do src alimenta um PRNG
// (mulberry32) só pra gerar alturas de barra estáveis entre servidor e cliente
// (mesmo src → mesmo desenho, sempre) — nenhuma dependência nova, nenhum decode
// de áudio real necessário pra um efeito decorativo. Menos barras (20 em vez
// de 32) pra cada uma ficar mais grossa/visível como na referência (equalizer
// chunky, não textura fina).
const BAR_COUNT = 20

function seedFromString(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Envelope de 2 senoides de baixa frequência (fase/frequência sorteadas pelo
// seed) desenha os picos/vales largos de uma fala real; ruído por barra bem
// mais forte (0.45 em vez de 0.18) dá o contraste dramático da referência —
// barras vizinhas variam bastante, algumas quase pontos (piso 0.08), outras
// no topo. A faixa ficou mais alta (h-9) e com menos barras, então dá pra
// baixar o piso sem sumir visualmente.
const random = mulberry32(seedFromString(src))
const freqA = 1.5 + random() * 1.5
const freqB = 3 + random() * 2
const phaseA = random() * Math.PI * 2
const phaseB = random() * Math.PI * 2
const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1)
  const envelope = 0.55
    + 0.35 * Math.sin(t * Math.PI * freqA + phaseA)
    + 0.2 * Math.sin(t * Math.PI * freqB + phaseB)
  const noise = (random() - 0.5) * 0.45
  const value = Math.min(1, Math.max(0.08, envelope + noise))
  return Math.round(value * 100)
})
</script>

<style scoped>
/* Botão de play: leve glow dourado pulsante enquanto toca — feedback de estado
   sutil, não um efeito chamativo. Sem pill/círculo de fundo aqui pra glow em cima
   (referência atual é ícones soltos sobre o preto da página), então o glow vira
   um halo radial atrás do ícone via ::after — só opacity+transform (GPU, sem
   repaint de box-shadow) pra continuar dentro da regra de performance. prefers-
   reduced-motion já neutraliza a animação globalmente (tailwind.css força
   animation-duration: 0.01ms). */
.play-btn::after {
  content: '';
  position: absolute;
  inset: -8px;
  z-index: -1;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(242, 185, 15, 0.45) 0%, rgba(242, 185, 15, 0) 70%);
  opacity: 0;
  transform: scale(0.8);
}

.play-btn.is-playing::after {
  animation: play-glow-pulse 2.4s ease-in-out infinite;
}

@keyframes play-glow-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.85); }
  50% { opacity: 0.85; transform: scale(1.2); }
}

/* Foco por teclado: outline dourado — bom contraste contra o preto puro do
   fundo da página (a regra global usa currentColor, que aqui é branco no
   botão e ficaria fraco/pouco intencional; dourado combina com o resto do
   accent do site). */
.play-btn:focus-visible {
  outline: 2px solid var(--primary);
}

@media (hover: hover) and (pointer: fine) {
  .play-btn:hover {
    filter: brightness(1.15);
  }
}

.waveform-bar {
  background: color-mix(in srgb, var(--primary) 38%, transparent);
  transform-origin: center;
}

.waveform-track--fill {
  clip-path: inset(0 calc(100% - var(--seek-progress)) 0 0);
}

.waveform-track--fill .waveform-bar {
  background: var(--primary);
}

/* "Respirando": só quando tocando, e só a barra que já ganhou animation-delay
   por posição (v-for acima) — dá a sensação de forma de onda viva em vez de
   estática, sem GSAP pra um pulso puramente CSS (mais barato, roda fora da
   main thread). */
.waveform.is-playing .waveform-bar {
  animation: waveform-pulse 1.1s ease-in-out infinite;
}

@keyframes waveform-pulse {
  0%, 100% { transform: scaleY(0.82); }
  50% { transform: scaleY(1); }
}

/* Input nativo por cima das barras: mantém arrasto/teclado/toque de graça, mas
   com track/thumb tornados invisíveis — quem é visto é a waveform decorativa
   abaixo. Opacity não entra em jogo (esconderia também o outline de foco por
   teclado), só os pseudo-elementos do range viram transparentes. É essa
   camada — sem nenhum botão dedicado — que faz 100% do seek pra frente e pra
   trás: clique pula, arrasto segue o cursor/dedo, setas/Home/End funcionam. */
.waveform-range {
  margin: 0;
}
.waveform-range::-webkit-slider-runnable-track {
  height: 100%;
  background: transparent;
}
.waveform-range::-webkit-slider-thumb {
  appearance: none;
  width: 2px;
  height: 100%;
  background: transparent;
}
.waveform-range::-moz-range-track {
  height: 100%;
  background: transparent;
  border: none;
}
.waveform-range::-moz-range-thumb {
  width: 2px;
  height: 100%;
  background: transparent;
  border: none;
}
</style>
