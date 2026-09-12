<template>
  <section ref="sectionEl" class="scroll-scene relative" style="min-height: 200dvh">
    <div ref="stageEl" class="sticky top-0 h-dvh overflow-hidden px-6">
      <!-- Chuva de letras "recorte de revista" caindo antes das fotos assentarem —
           eco do Cover se dispersando. Cada letra é `absolute` e ganha x/y própria
           via GSAP (onMounted), não flex/gap — é isso que espalha elas pela largura
           em vez de uma fila única. overflow-hidden no stageEl já esconde a queda
           fora da tela (entra por cima, sai por baixo), sem precisar de opacidade. -->
      <div ref="tickerEl" class="pointer-events-none absolute inset-0 font-magazine-letter text-7xl">
        <span v-for="(ch, i) in tickerLetters" :key="i" class="ticker-letter absolute left-0 top-0 inline-block" :style="{ color: TICKER_COLORS[i % TICKER_COLORS.length] }">{{ ch }}</span>
      </div>

      <!-- Pilhas físicas nos cantos — bolo de fotos jogadas umas sobre as outras,
           não uma foto solta. Cada camada é a MESMA caixa (mesmo tamanho/moldura
           do cartão central) só que posicionada/escalada pro canto via GSAP
           transform (xPercent/yPercent centra, x/y/scale/rotation aparcam no
           canto) — assim, na troca, uma foto pode percorrer de verdade a
           distância entre pilha e centro sem precisar trocar de elemento no meio
           do caminho (ver commitStackTransition). -->
      <div
        v-for="(photo, i) in prevDeque"
        :key="`prev-stack-${i}`"
        :ref="(el) => setStackRef('prev', i, el)"
        class="polaroid-frame pointer-events-none absolute left-1/2 top-[38%] z-0 w-[48vw] max-w-md sm:top-1/2 sm:w-[62vw] opacity-0"
      >
        <div class="aspect-[4/5] overflow-hidden">
          <img :src="photo?.photo" :alt="photo?.name" loading="lazy" class="h-full w-full object-cover">
        </div>
      </div>

      <div
        v-for="(photo, i) in nextDeque"
        :key="`next-stack-${i}`"
        :ref="(el) => setStackRef('next', i, el)"
        class="polaroid-frame pointer-events-none absolute left-1/2 top-[38%] z-0 w-[48vw] max-w-md sm:top-1/2 sm:w-[62vw] opacity-0"
      >
        <div class="aspect-[4/5] overflow-hidden">
          <img :src="photo?.photo" :alt="photo?.name" loading="lazy" class="h-full w-full object-cover">
        </div>
      </div>

      <!-- Viajantes: mesma caixa/moldura das pilhas e do cartão central, ficam
           invisíveis em repouso. Na troca (commitStackTransition) eles é que
           percorrem de verdade o trajeto pilha↔centro — o cartão central e a
           camada de topo da pilha de destino somem por baixo enquanto isso, e
           voltam a aparecer já no estado final quando o trajeto termina.
           travelInEl (vira a nova principal) precisa de z MAIOR que
           travelOutEl (vai pro bolo) — com z-index igual, o DOM decidia
           (travelOutEl vinha depois, então pintava por cima, exatamente o
           inverso do pedido: a foto que está saindo cobrindo a que está
           virando principal). z-31 > z-30 resolve sem depender de ordem. -->
      <div ref="travelInEl" class="polaroid-frame pointer-events-none absolute left-1/2 top-[38%] z-[31] w-[48vw] max-w-md sm:top-1/2 sm:w-[62vw] opacity-0">
        <div class="aspect-[4/5] overflow-hidden">
          <img ref="travelInImgEl" draggable="false" loading="lazy" class="h-full w-full object-cover">
        </div>
      </div>
      <div ref="travelOutEl" class="polaroid-frame pointer-events-none absolute left-1/2 top-[38%] z-30 w-[48vw] max-w-md sm:top-1/2 sm:w-[62vw] opacity-0">
        <div class="aspect-[4/5] overflow-hidden">
          <img ref="travelOutImgEl" draggable="false" loading="lazy" class="h-full w-full object-cover">
        </div>
      </div>

      <!-- Coluna central: só a foto arrastável (reta, sem giro estático). No mobile
           ela e as pilhas/viajantes (top-[38%] acima, em vez de top-1/2) sobem pro
           terço superior do stage — libera uma faixa inferior genuinamente livre
           pro captionEl full-width (ver comentário dele). `photoStageEl` já nasce
           absolute/centrado (left-1/2+top-[38%]+translate -50%/-50%, mesmo padrão
           das pilhas) em vez do wrapper flex `h-full` de antes — um nível a menos
           de DOM, e sendo z-20 continua sempre por cima do captionEl (z-index:auto)
           mesmo depois dele no DOM, então o clique do botão/seek do
           AudioMessagePlayer (visualmente abaixo) não é roubado. O drag continua
           igual: pointer handler no próprio photoStageEl. -->
      <div
        ref="photoStageEl"
        class="pointer-events-auto absolute left-1/2 top-[38%] z-20 w-[48vw] max-w-md -translate-x-1/2 -translate-y-1/2 touch-pan-y select-none sm:top-1/2 sm:w-[62vw]"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div ref="photoCardEl" class="polaroid-frame polaroid-frame--center flip-3d">
          <!-- `overflow-hidden` NUNCA pode dividir elemento com `preserve-3d`
               (a caixa aqui, sem overflow) — por spec, overflow != visible
               força transform-style:flat no MESMO elemento, achatando os
               filhos e quebrando o cálculo de backface-visibility deles
               (era exatamente esse bug: as duas faces ficavam sempre
               visíveis/planas). Por isso `overflow-hidden` desceu pra cada
               FACE individualmente (folhas, sem preserve-3d próprio — não
               conflita), e este nível intermediário só tem `position` +
               `preserve-3d`, sem overflow. -->
          <div class="relative aspect-[4/5] flip-3d">
            <div class="flip-face absolute inset-0 overflow-hidden">
              <img
                ref="photoImgEl"
                :src="current?.photo"
                :alt="current?.name"
                loading="lazy"
                draggable="false"
                class="h-full w-full object-cover"
              >
            </div>
            <!-- Verso: mesma caixa, pré-girado 180° (estático) — só aparece
                 quando o pai (photoCardEl) gira e o backface-visibility do
                 lado oposto (a foto) esconde a si mesmo. Fundo cru de papel
                 (sem gradiente/textura nova) igual ao `.polaroid-frame`, pra
                 ler como o verso físico do mesmo cartão. SEM `flex items-
                 center` aqui: centralizar verticalmente um texto mais alto
                 que a caixa faz o overflow "vazar" pros dois lados igual,
                 mas scrollTop nunca é negativo — a metade de cima do
                 transbordo fica cortada e IMPOSSÍVEL de rolar até ela (era
                 o bug reportado). Bloco normal + scroll do topo resolve:
                 scrollTop=0 já mostra o início de verdade, dá pra rolar até
                 o fim, nada fica inacessível. -->
            <div class="flip-face flip-face--back absolute inset-0 overflow-y-auto p-[8%]" style="background: #f8f4ea">
              <!-- `contributor.message`, não `current.message`: o carrossel
                   cicla a FOTO em exibição por qualquer contribuidor via
                   drag, mas áudio/nome/transcrição no captionEl SEMPRE são
                   do dono desta seção (props.contributor) — o verso segue a
                   mesma regra, senão virar a foto numa seção mostra a
                   mensagem de outra pessoa (bug reportado: "mensagem que
                   aparece não é a completa, é um mock" — na real era a
                   mensagem de quem estivesse `current` no momento). -->
              <p class="font-instrument-serif text-center text-base leading-snug tracking-tight text-[#2a2220] sm:text-lg">
                {{ contributor.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ícone + rótulo de virar foto — canto superior-esquerdo do stage
           (fixo mesmo com o cartão se movendo/arrastando, porque vive fora
           de photoStageEl). z-40 > z-20 do photoStageEl. Os dois formam UM
           bloco só: opacity/pointer-events no CONTAINER (não em cada filho
           separado) faz ícone e texto aparecerem juntos, no mesmo instante
           — antes disso o ícone nem é clicável (pointer-events-none no
           grupo inteiro). Em seções com áudio, só depois que ele começa a
           tocar (showFlipHint); sem áudio não há "início" pra esperar,
           então o bloco já nasce visível. Some de novo assim que a foto já
           foi virada uma vez. gap-1.5 (era gap-2) pra ler como uma etiqueta
           única grudada no ícone, não dois elementos soltos lado a lado. -->
      <div
        class="absolute left-1 top-6 z-40 flex items-center transition-opacity duration-500 motion-reduce:transition-none"
        :class="showFlipHint ? 'opacity-100' : 'pointer-events-none opacity-0'"
      >
        <button
          type="button"
          class="flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-white/80 outline-offset-4 transition-transform duration-150 ease-out motion-reduce:transition-none active:scale-90"
          :aria-label="isFlipped ? 'Mostrar foto' : 'Virar foto e ler a mensagem'"
          :aria-pressed="isFlipped"
          @click="toggleFlip"
        >
          <RotateCcw class="size-6" />
        </button>
        <!-- O botão em si é size-11 (44px, alvo de toque) mas o ícone dentro
             é só size-6 (24px) centralizado — sobra ~10px de "padding
             invisível" do próprio botão antes do texto começar. -ml compensa
             esse vão, senão o gap parece grande mesmo com gap:0 no pai. -->
        <span class="-ml-2 text-xs tracking-wide text-white/70">{{ flipHintLabel }}</span>
      </div>

      <!-- Legenda: texto puro, sem borda/fundo/caixa. No mobile virou uma faixa
           FULL-WIDTH no rodapé (left-6/right-6/bottom-6) em vez da coluna estreita
           (w-[4.75rem]) de uma correção anterior — aquela coluna consertou a
           sobreposição com a pilha PREV, mas sufocava o AudioMessagePlayer (~28px
           de waveform útil, ilegível). A correção definitiva não é apertar a
           legenda pro lado, é abrir espaço embaixo: todo o conjunto foto+pilhas+
           viajantes subiu pro anchor top-[38%] (era top-1/2) e STACK_OFFSET_Y_MOBILE
           caiu de 0.36 pra 0.18 (ver script), então mesmo a camada mais funda da
           pilha (que mais "espia" pro canto) não desce além de ~y=527 num stage de
           844px — sobra ≈95px de respiro antes do topo da legenda (~y=620,
           definido pelo conteúdo + bottom-6) e ainda folga pra um arrasto vertical
           realista do cartão central (testado com chrome-devtools: pointerdown/
           move/up sintéticos, rápido e devagar, os dois lados, em Ana Souza e
           Carla Mendes — zero overlap de bounding box em repouso e durante o
           arrasto/transição). `break-words` é rede de segurança pra nomes/
           mensagens longos. Ordem mensagem → áudio → nome: a assinatura fecha o
           bloco. `isolate` + `.caption-fade` (tailwind.css) dão o fade preto
           radial de contraste atrás do texto, sem virar caixa/borda/blur — é um
           ::before do próprio captionEl, herda a opacity animada pelo GSAP. No
           desktop nada muda: sm:* restaura a coluna lateral original
           (right-10/top-[58%]/max-w-xs/text-right), inclusive o sm:top-[58%] que
           já corrigia a pilha NEXT encostando no topo da legenda em repouso. -->
      <div
        ref="captionEl"
        class="caption-fade absolute left-6 right-6 bottom-6 isolate text-center opacity-0 sm:left-auto sm:right-10 sm:w-auto sm:bottom-auto sm:top-[58%] sm:max-w-xs sm:text-right sm:-translate-y-1/2"
      >
        <!-- Ordem: assinatura → player → transcrição. De quem é a mensagem
             vem primeiro, o player logo abaixo (o que se toca), e só depois
             o texto do trecho que está tocando. Sem o truque de sobreposição
             (-mb puxando o próximo bloco) que existia quando a assinatura
             ficava colada na transcrição — aqui embaixo dela vem o PLAYER,
             não texto, e a assinatura dourada por cima dos controles ficaria
             confusa/ilegível em vez de bonita; margem normal em vez disso. -->
        <h3
          class="relative z-10 mb-3 break-words font-script text-5xl leading-none sm:mb-4 sm:text-8xl"
          style="color: var(--primary); text-shadow: -2px -2px 3px #000, 2px -2px 3px #000, -2px 2px 3px #000, 2px 2px 3px #000, 0 0 3px #000, 0 6px 18px rgba(0,0,0,0.95)"
        >
          {{ contributor.name }}
        </h3>

        <AudioMessagePlayer v-if="contributor.audio" :src="contributor.audio" @timeupdate="onAudioTime" />

        <!-- Quando há áudio, o texto É a transcrição do que a pessoa fala nele
             (mesmo campo `contributor.message`, sem duplicar dado). Se o
             contribuidor tem `transcriptSegments` (gerados por
             scripts/transcribe.mjs), o texto exibido troca de trecho em trecho
             acompanhando `audioTime` (ver @timeupdate no player acima) — uma
             legenda de verdade, do repouso em diante, não uma transcrição
             estática. Sem segments, mostra `contributor.message` inteiro,
             igual sempre foi. -->
        <!-- min-h em `em` (relativo ao próprio font-size do parágrafo, então
             escala sozinho entre o text-3xl do mobile e o sm:text-4xl do
             desktop) reserva altura fixa pro texto — medido de verdade no
             browser: o trecho mais longo desta transcrição quebra em 4
             linhas em 390px (3.45em/3 linhas não bastava, sobrava um trecho
             de 138px contra 103.5px reservados, e a caixa ainda encolhia/
             crescia 1 linha inteira entre trocas). 4.6em (4 linhas) cobre o
             pior caso atual; se um contribuidor futuro tiver um trecho ainda
             mais longo, ajuste este valor de novo medindo a altura real. Sem
             isso, o bloco (ancorado por baixo, `bottom-6`, no mobile) subia/
             descia a cada troca, empurrando player/assinatura/fotos junto —
             exatamente o "aumentando e diminuindo" reportado. -->
        <Transition name="caption-swap" mode="out-in">
          <p
            :key="displayedMessage"
            class="relative break-words font-instrument-serif text-3xl leading-[1.15] tracking-tight text-white sm:text-4xl"
            :class="{ 'mt-5 min-h-[4.6em] sm:mt-6': contributor.audio }"
          >
            {{ displayedMessage }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RotateCcw } from '@lucide/vue'
import type { Contributor } from '@/types'

const props = defineProps<{ contributor: Contributor, contributors: Contributor[] }>()

// Pool do filme: todo mundo, com este contribuidor sempre por último — é nele
// que o ciclo das pilhas assenta com mais frequência conforme o pool clampeia.
const photoPool = computed(() => [
  ...props.contributors.filter(c => c.name !== props.contributor.name),
  props.contributor
])

function clampIdx(i: number) {
  return Math.min(Math.max(i, 0), photoPool.value.length - 1)
}

// Legenda sincronizada: já nasce mostrando o trecho correspondente a
// audioTime=0 (o primeiro segmento), não a mensagem inteira — antes era
// "mensagem completa até o play, aí pula pra trecho curto", o que dava um
// salto de tamanho feio bem no momento em que o usuário clica em play. Com
// segments, SEMPRE mostra o trecho ativo, do repouso em diante; sem segments
// (contribuidor sem transcrição sincronizada), continua mostrando a
// mensagem inteira, como sempre foi.
const audioTime = ref(0)

function onAudioTime(t: number) {
  audioTime.value = t
}

// Segmentos do Whisper têm GAPS entre um e outro (silêncio/pausa na fala) —
// `find` por `t >= start && t < end` retorna undefined bem nesses intervalos.
// O fallback antigo pulava direto pro ÚLTIMO segmento do áudio nesse
// momento (bug reportado: depois de "Te desejo tudo de melhor nessa vida."
// aparecia o trecho final do áudio por ~1s, antes de "corrigir" pro trecho
// certo) — porque `active ?? segments[length-1]` não distingue "ainda não
// comecei" de "estou num intervalo entre falas". Fix: manter mostrando o
// ÚLTIMO segmento que já começou (varre em ordem, guarda o mais recente com
// start <= t) — nos gaps, a legenda simplesmente continua na fala anterior
// até a próxima começar, sem pular pro fim.
const activeSegmentText = computed(() => {
  const segments = props.contributor.transcriptSegments
  if (!segments?.length) return null
  let candidate = segments[0]!
  for (const segment of segments) {
    if (audioTime.value >= segment.start) candidate = segment
    else break
  }
  return candidate.text
})

const displayedMessage = computed(() => {
  if (activeSegmentText.value) return activeSegmentText.value
  return props.contributor.message
})

const sectionEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const tickerEl = ref<HTMLElement | null>(null)
const photoStageEl = ref<HTMLElement | null>(null)
const photoCardEl = ref<HTMLElement | null>(null)
const photoImgEl = ref<HTMLElement | null>(null)
const travelInEl = ref<HTMLElement | null>(null)
const travelInImgEl = ref<HTMLImageElement | null>(null)
const travelOutEl = ref<HTMLElement | null>(null)
const travelOutImgEl = ref<HTMLImageElement | null>(null)
const captionEl = ref<HTMLElement | null>(null)

// Chuva de letras "recorte de revista" (mesma linguagem do Cover) que cai antes
// das fotos aparecerem — eco do Cover se dispersando, não caracteres aleatórios
// genéricos. Quantidade alta (48) pra tela ficar visivelmente cheia, tipo chuva
// de verdade — compensado com stagger pequeno no tween pra não esticar a entrada.
const TICKER_POOL = Array.from('FELIZANIVERSARIOLORENZO')
const TICKER_COLORS = ['#f2b90f', '#e63946', '#2a9d8f', '#f2f2f2', '#9b5de5', '#e9724c']
const TICKER_LENGTH = 48

// Placeholder determinístico no SSR (nunca Math.random aqui — quebraria o
// hydration); sorteia de verdade só depois de montado, quando a fila ainda
// está fora da tela e invisível pro usuário.
const tickerLetters = ref(Array.from({ length: TICKER_LENGTH }, (_, i) => TICKER_POOL[i % TICKER_POOL.length]!))

// Pilhas físicas: cada lado guarda LAYER_COUNT fotos (frente..fundo). Índice 0
// é sempre a próxima a assentar no centro. São arrays de verdade (não deriváveis
// só de um índice) porque a foto que sai do centro precisa pousar no FUNDO da
// pilha oposta — não é a mesma posição que ela ocuparia numa sequência circular
// simples (ver commitStackTransition/advanceCarousel).
const LAYER_COUNT = 3
let prevCursor = -1
let nextCursor = LAYER_COUNT

function pullFresh(side: 'prev' | 'next'): Contributor {
  if (side === 'next') {
    const photo = photoPool.value[clampIdx(nextCursor)]!
    nextCursor += 1
    return photo
  }
  const photo = photoPool.value[clampIdx(prevCursor)]!
  prevCursor -= 1
  return photo
}

const current = ref<Contributor>(photoPool.value[0]!)
const prevDeque = ref<Contributor[]>(Array.from({ length: LAYER_COUNT }, () => pullFresh('prev')))
const nextDeque = ref<Contributor[]>(Array.from({ length: LAYER_COUNT }, () => pullFresh('next')))

const prevStackEls: (HTMLElement | null)[] = Array(LAYER_COUNT).fill(null)
const nextStackEls: (HTMLElement | null)[] = Array(LAYER_COUNT).fill(null)

function setStackRef(side: 'prev' | 'next', index: number, el: unknown) {
  const arr = side === 'prev' ? prevStackEls : nextStackEls
  arr[index] = el instanceof HTMLElement ? el : null
}

// Pose de repouso de cada camada, em transform puro (x/y/rotation/scale) —
// nunca width/height (gsap-performance): a mesma caixa do cartão central,
// só "arcada" pro canto. stageWidth/stageHeight vêm do onMounted (ver mais
// abaixo) e alimentam tanto a entrada quanto o cálculo do trajeto na troca.
let stageWidth = 0
let stageHeight = 0
const STACK_SCALE = 0.36
const STACK_SCALE_STEP = 0.025
const STACK_OFFSET_X = 0.30
// Y de repouso das pilhas — menor no mobile (definido no onMounted, abaixo,
// conforme stageWidth) que no desktop, apesar do nome sugerir o contrário:
// o mobile precisa COMPACTAR a pilha verticalmente porque o anchor do grupo
// inteiro (template: top-[38%] nas pilhas/viajantes/photoStageEl, em vez de
// top-1/2) subiu pro terço superior do stage, abrindo uma faixa inferior
// livre pro captionEl full-width. 0.18 (era 0.36, valor herdado de quando a
// legenda vivia numa coluna lateral e não precisava dessa faixa) faz a camada
// mais funda da pilha (a que mais "espia" pro canto) parar em ~y=527 num
// stage de 844px — a legenda começa perto de y=620, sobra ~95px de respiro
// mesmo com o arrasto do cartão central. No desktop sobra largura de sobra
// pros lados (legenda é coluna lateral, não faixa inferior), então o valor
// original permanece. Só o VALOR muda por breakpoint, a fórmula em
// stackPose() continua igual.
const STACK_OFFSET_Y_DESKTOP = 0.27
const STACK_OFFSET_Y_MOBILE = 0.18
let STACK_OFFSET_Y = STACK_OFFSET_Y_DESKTOP
// Cada camada mais funda "espia" um pouco mais pra fora do canto, sempre na
// MESMA diagonal da camada da frente — é o que lê como pilha de verdade em
// perspectiva (fotos alinhadas, uma atrás da outra) em vez de leque
// espalhado: nada de camada nenhuma migrando de volta pro centro.
const STACK_LAYER_PEEK = 15
const STACK_ROTATION = { prev: -12, next: 9 }
const STACK_ROTATION_STEP = 3
// Fotos físicas empilhadas são opacas — profundidade vem do deslocamento/
// rotação/escala (stackPose), não de transparência. 0.6/0.4 (valores
// antigos) faziam a pilha parecer vidro/fantasma, cada camada deixando ver a
// de trás através dela — o oposto do "foto atrás da outra" real. Só a mais
// funda perde um pouquinho de opacidade (0.94), sutil o bastante pra não
// competir visualmente com a de cima sem parecer transparente.
const STACK_LAYER_OPACITY = [1, 0.97, 0.94]

function stackPose(side: 'prev' | 'next', layerIndex: number) {
  const dir = side === 'prev' ? -1 : 1
  const peek = layerIndex * STACK_LAYER_PEEK
  return {
    x: dir * stageWidth * STACK_OFFSET_X + dir * peek,
    y: (side === 'prev' ? 1 : -1) * (stageHeight * STACK_OFFSET_Y + peek * 0.6),
    rotation: STACK_ROTATION[side] + dir * layerIndex * STACK_ROTATION_STEP,
    scale: STACK_SCALE - layerIndex * STACK_SCALE_STEP
  }
}

function setStackPose(el: HTMLElement | null, side: 'prev' | 'next', layerIndex: number, opacity: number) {
  if (!el) return
  const pose = stackPose(side, layerIndex)
  $gsap.set(el, { xPercent: -50, yPercent: -50, x: pose.x, y: pose.y, rotation: pose.rotation, scale: pose.scale, opacity })
}

function poseFromDataset(target: Element, key: string): number {
  return Number((target as HTMLElement).dataset[key] ?? 0)
}

const { $gsap, $prefersReducedMotion } = useNuxtApp()

onMounted(() => {
  if (!$gsap || !sectionEl.value || !tickerEl.value || !photoCardEl.value || !photoImgEl.value
    || !travelInEl.value || !travelOutEl.value || !captionEl.value
    || prevStackEls.some(el => !el) || nextStackEls.some(el => !el)) return

  stageWidth = stageEl.value?.clientWidth ?? window.innerWidth
  stageHeight = stageEl.value?.clientHeight ?? window.innerHeight
  // Breakpoint mobile = mesmo `sm` (640px) que já rege o resto do layout da
  // legenda no template — abaixo dele as pilhas ganham mais respiro vertical.
  STACK_OFFSET_Y = stageWidth < 640 ? STACK_OFFSET_Y_MOBILE : STACK_OFFSET_Y_DESKTOP

  // Sorteio de verdade só depois de montado (client-only) — a fila começa fora
  // da tela (ver gsap.set abaixo), então trocar o texto aqui não pisca nada.
  tickerLetters.value = Array.from({ length: TICKER_LENGTH }, () => TICKER_POOL[$gsap.utils.random(0, TICKER_POOL.length - 1, 1)]!)

  // gsap.quickTo em vez de gsap.set a cada pointermove — reaproveita um único
  // tween por propriedade (recomendação oficial do GSAP pra followers de
  // ponteiro em alta frequência). Precisa existir mesmo com prefers-reduced-
  // motion: o arrasto continua sendo o mecanismo de entrada (não é a entrada
  // decorativa que é pulada), só a animação de troca de pilha simplifica.
  cardXTo = $gsap.quickTo(photoCardEl.value, 'x', { duration: 0.3, ease: 'power3' })
  cardYTo = $gsap.quickTo(photoCardEl.value, 'y', { duration: 0.3, ease: 'power3' })
  cardRotTo = $gsap.quickTo(photoCardEl.value, 'rotation', { duration: 0.35, ease: 'power3' })

  // Perspectiva pro flip 3D (toggleFlip) ler como um cartão físico girando no
  // espaço, não um achatamento/esmagamento — aplicado uma vez aqui, convive
  // sem conflito com x/y/rotation(Z)/scale que o resto do componente já
  // anima no mesmo elemento (rotationY é um eixo independente).
  // rotationY:0 explícito (não só "confiar" no default do navegador): a
  // seção sempre nasce com a FOTO na frente, nunca o verso — isFlipped já
  // começa false, mas garantir aqui remove qualquer ambiguidade de estado
  // inicial entre o CSS estático das faces e o primeiro gsap.set do ciclo
  // de vida do componente.
  $gsap.set(photoCardEl.value, { transformPerspective: 1200, rotationY: 0 })
  isFlipped.value = false

  // Movimento reduzido: pula direto pro estado final, sem entrada animada.
  if ($prefersReducedMotion?.()) {
    $gsap.set(tickerEl.value, { autoAlpha: 0 })
    $gsap.set(photoCardEl.value, { opacity: 1, scale: 1 })
    prevStackEls.forEach((el, i) => setStackPose(el, 'prev', i, STACK_LAYER_OPACITY[i] ?? 0.4))
    nextStackEls.forEach((el, i) => setStackPose(el, 'next', i, STACK_LAYER_OPACITY[i] ?? 0.4))
    $gsap.set([travelInEl.value, travelOutEl.value], { opacity: 0 })
    $gsap.set(captionEl.value, { opacity: 1 })
    return
  }

  // Entrada: fila de letras atravessa a tela, depois cartão principal, cantos e
  // legenda nascem fechados/invisíveis e assentam. toggleActions (em vez de
  // once) faz a entrada TOCAR AO CONTRÁRIO quando o scroll volta pra cima —
  // fotos/legenda somem e a fila de letras atravessa de novo, na direção oposta.
  const letterEls = Array.from(tickerEl.value.querySelectorAll<HTMLElement>('.ticker-letter'))
  // Cada letra ganha x espalhado pela largura toda, y de partida próprio (alturas
  // diferentes acima do topo, não uma fileira única) e uma rotação forte tipo
  // recorte torto (mesma ideia do .ransom-letter do Cover, só que aleatória de
  // verdade em vez de nth-child — aqui não tem problema de hydration porque só
  // roda client-side). Pré-posicionadas fora da tela pra não piscar no canto
  // superior esquerdo (posição natural do span) um frame antes do scroll disparar.
  $gsap.set(letterEls, {
    x: () => $gsap.utils.random(0, stageWidth),
    y: () => -stageHeight * $gsap.utils.random(0.2, 1.2),
    rotation: () => $gsap.utils.random(-35, 35)
  })
  $gsap.set(photoCardEl.value, { opacity: 0, scale: 0.5 })

  // Pilhas entram deslizando de fora da tela (esquerda/direita) até a pose de
  // repouso de cada camada — a pose final fica guardada em dataset pra o tween
  // com stagger usar valor-por-alvo (gsap-core: function-based values).
  const stackEls = [...prevStackEls, ...nextStackEls] as HTMLElement[]
  ;(['prev', 'next'] as const).forEach((side) => {
    const els = side === 'prev' ? prevStackEls : nextStackEls
    els.forEach((el, i) => {
      if (!el) return
      const pose = stackPose(side, i)
      const dir = side === 'prev' ? -1 : 1
      el.dataset.poseX = String(pose.x)
      el.dataset.poseY = String(pose.y)
      el.dataset.poseRotation = String(pose.rotation)
      el.dataset.poseScale = String(pose.scale)
      el.dataset.poseOpacity = String(STACK_LAYER_OPACITY[i] ?? 0.4)
      $gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: pose.x + dir * 140,
        y: pose.y,
        rotation: pose.rotation,
        scale: pose.scale * 0.7,
        opacity: 0
      })
    })
  })
  $gsap.set([travelInEl.value, travelOutEl.value], { xPercent: -50, yPercent: -50, opacity: 0 })
  $gsap.set(captionEl.value, { opacity: 0, y: 16 })

  // 'top top' faz essa entrada disparar exatamente quando o Cover (100vh, sem
  // pin) termina de rolar pra fora — o mesmo ponto de scroll em que o texto do
  // Cover (CoverSection.vue) termina de encolher/sumir. Handoff sincronizado
  // sem precisar acoplar os dois componentes diretamente.
  $gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl.value,
      start: 'top top',
      toggleActions: 'play reverse play reverse'
    }
  })
    // Queda reta (y) com leve deriva lateral (x relativo) e rotação contínua
    // somada à inicial (tombando/rodopiando, não só caindo reto) — sem motionPath,
    // que seria overkill pra uma queda sem curva. stagger "from: random" + duration
    // função-por-letra tira a sincronia: cada letra cai em ritmo levemente
    // diferente, tipo chuva de verdade em vez de tudo em bloco.
    .to(letterEls, {
      y: () => stageHeight * 1.3,
      x: () => `+=${$gsap.utils.random(-50, 50)}`,
      rotation: () => `+=${$gsap.utils.random(-40, 40)}`,
      duration: () => $gsap.utils.random(0.8, 1.4),
      ease: 'power1.in',
      stagger: { each: 0.01, from: 'random' }
    }, 0)
    .to(stackEls, {
      x: (_i, target) => poseFromDataset(target, 'poseX'),
      y: (_i, target) => poseFromDataset(target, 'poseY'),
      rotation: (_i, target) => poseFromDataset(target, 'poseRotation'),
      scale: (_i, target) => poseFromDataset(target, 'poseScale'),
      opacity: (_i, target) => poseFromDataset(target, 'poseOpacity'),
      duration: 0.6,
      ease: 'back.out(1.6)',
      stagger: 0.05
    })
    .to(photoCardEl.value, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, '-=0.45')
    .to(captionEl.value, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
})

// Arraste tipo polaroide: puxa o dedo/mouse, o cartão segue 1:1 com leve giro —
// solta com pouca força/distância e ele volta pro centro com folga elástica
// (back.out); solta com força, a troca vira uma travessia física na mesma
// timeline: a foto do topo da pilha de destino sai do canto e pousa reta no
// centro enquanto a foto que estava no centro migra pro fundo da pilha oposta
// (commitStackTransition) — velocidade real do gesto (mapRange+clamp) define
// duração/arco de AMBAS as viagens, não só da que sai. A legenda nunca participa
// disso — fica fixa, só as fotos se movem.
const THROW_DISTANCE = 60 // px de arrasto mínimos pra soltar já contar como arremesso
const THROW_VELOCITY = 0.35 // px/ms mínimos pra contar como arremesso rápido

// Flip 3D do cartão: um mini-timeline (levanta levemente → gira no eixo Y →
// assenta) em vez de só animar rotationY direto — o pequeno scale-up no meio
// do giro é o que faz o cartão ler como um objeto físico levantando da mesa
// pra virar, não uma textura sendo espelhada no lugar. Reduced motion pula
// direto pro estado final (duration 0), sem o levante. flipTween guardado
// separado de activeTween (drag/arremesso) — são independentes, matar um não
// deve cancelar o outro.
const isFlipped = ref(false)
let flipTween: { kill: () => void } | null = null

// Rótulo "veja o verso da foto": em seções com áudio, só depois que
// audioTime passa de 0 (áudio já começou a tocar pelo menos uma vez) — em
// seções sem áudio não existe "início" pra esperar, então nasce visível.
// Continua visível depois de virar a foto (não some mais) — só o TEXTO
// troca (flipHintLabel), pra sempre dar a ação certa: "veja o verso" antes
// de virar, "veja a foto" depois, o ícone servindo o tempo todo de volta.
const showFlipHint = computed(() => !props.contributor.audio || audioTime.value > 0)
const flipHintLabel = computed(() => isFlipped.value ? 'veja a foto' : 'veja o verso da foto')

function toggleFlip() {
  if (!photoCardEl.value || isDragging.value) return
  isFlipped.value = !isFlipped.value
  flipTween?.kill()

  const targetRotation = isFlipped.value ? 180 : 0
  if ($prefersReducedMotion?.()) {
    $gsap.set(photoCardEl.value, { rotationY: targetRotation })
    return
  }

  const tl = $gsap.timeline()
  tl.to(photoCardEl.value, { scale: 1.05, duration: 0.3, ease: 'power2.out' }, 0)
    .to(photoCardEl.value, { rotationY: targetRotation, duration: 0.65, ease: 'power2.inOut' }, 0)
    .to(photoCardEl.value, { scale: 1, duration: 0.3, ease: 'power2.in' }, 0.35)
  flipTween = tl
}

const isDragging = ref(false)
let startX = 0
let startY = 0
let startTime = 0
let dragDx = 0
let dragDy = 0
let activeTween: { kill: () => void } | null = null

// gsap.quickTo — um tween reaproveitado por propriedade em vez de recriar tween
// a cada pointermove (gsap-performance oficial: followers de ponteiro em alta
// frequência devem usar quickTo). Instanciados uma vez em onMounted. Só o
// cartão central usa quickTo: as pilhas também levam `scale`/`rotation` num
// $gsap.set combinado a cada troca (setStackPose), e misturar isso com quickTo
// na MESMA propriedade corrompe o cache interno do quickTo (warning "not
// eligible for reset") — por isso o hover das pilhas usa gsap.to comum.
type QuickSetter = (value: number) => void
let cardXTo: QuickSetter, cardYTo: QuickSetter, cardRotTo: QuickSetter

function setPeekHover(el: HTMLElement | null, scale: number, opacity: number) {
  if (!el) return
  $gsap.to(el, { scale, opacity, duration: 0.3, ease: 'power2', overwrite: 'auto' })
}

function onPointerDown(e: PointerEvent) {
  if (!photoCardEl.value || !photoStageEl.value || isFlipped.value) return
  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  startTime = performance.now()
  activeTween?.kill()
  try {
    // Sem ponteiro ativo (ex.: eventos sintéticos de teste), a captura falha —
    // não é fatal, só perdemos o reforço de continuar recebendo move/up fora
    // do elemento; o arraste em si não depende dela.
    photoStageEl.value.setPointerCapture(e.pointerId)
  } catch {
    // ignora
  }
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || !photoCardEl.value) return
  dragDx = e.clientX - startX
  dragDy = e.clientY - startY
  cardXTo(dragDx)
  cardYTo(dragDy)
  cardRotTo($gsap.utils.clamp(-16, 16, dragDx * 0.07))

  // As pilhas reagem ao arrasto antes de qualquer coisa trocar — dão a pista
  // visual de qual pilha está prestes a ceder a foto do topo.
  const frontOpacity = STACK_LAYER_OPACITY[0] ?? 0.9
  const pull = $gsap.utils.clamp(0, 1, Math.abs(dragDx) / 150)
  const towardNext = dragDx < 0
  setPeekHover(nextStackEls[0], towardNext ? STACK_SCALE + pull * 0.12 : STACK_SCALE, towardNext ? frontOpacity + pull * (1 - frontOpacity) : frontOpacity)
  setPeekHover(prevStackEls[0], towardNext ? STACK_SCALE : STACK_SCALE + pull * 0.12, towardNext ? frontOpacity : frontOpacity + pull * (1 - frontOpacity))
}

// Avança o carrossel: tira a foto da frente da pilha de destino (vira a atual),
// repõe o fundo dessa pilha com uma foto nova do pool circular, e manda a foto
// que estava no centro pro fundo da pilha OPOSTA — fecha o ciclo sem depender
// de um índice único (a foto que sai do centro não "seria" a próxima da pilha
// oposta numa sequência simples, ela precisa ser empurrada pra lá de propósito).
function advanceCarousel(destSide: 'prev' | 'next'): Contributor {
  const destDeque = destSide === 'next' ? nextDeque : prevDeque
  const oppositeDeque = destSide === 'next' ? prevDeque : nextDeque
  const oldCurrent = current.value
  current.value = destDeque.value.shift()!
  destDeque.value.push(pullFresh(destSide))
  oppositeDeque.value[LAYER_COUNT - 1] = oldCurrent

  // Toda foto nova entra de frente — sem isso, trocar de contribuidor com o
  // cartão virado deixaria o texto do PRÓXIMO já visível antes do usuário
  // clicar o ícone de novo.
  if (isFlipped.value) {
    isFlipped.value = false
    flipTween?.kill()
    $gsap.set(photoCardEl.value, { rotationY: 0 })
  }

  return oldCurrent
}

// Fallback sério pro prefers-reduced-motion: sem arco, sem física, sem pouso
// imperfeito — troca de estado + crossfade simples no cartão central, pilhas
// reposicionadas direto (gsap.set, sem tween).
function reducedMotionCommit(destSide: 'prev' | 'next') {
  if (!photoCardEl.value) return
  const oppositeSide: 'prev' | 'next' = destSide === 'next' ? 'prev' : 'next'
  advanceCarousel(destSide)

  $gsap.set(photoCardEl.value, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 })
  nextTick(() => {
    if (!photoCardEl.value) return
    activeTween = $gsap.to(photoCardEl.value, { opacity: 1, duration: 0.25, ease: 'power1.out' })
  })

  const destSideEls = destSide === 'next' ? nextStackEls : prevStackEls
  const oppositeSideEls = destSide === 'next' ? prevStackEls : nextStackEls
  destSideEls.forEach((el, i) => setStackPose(el, destSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
  oppositeSideEls.forEach((el, i) => setStackPose(el, oppositeSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
}

// A travessia física de verdade: dois viajantes (mesma caixa/moldura das
// pilhas e do centro) percorrem, NA MESMA TIMELINE, trajetos opostos —
// keyframes com um ponto intermediário elevado (arco) em vez de x/y/rotation/
// scale instantâneos. Duração e altura do arco herdam a velocidade real do
// gesto (mapRange+clamp), igual ao arremesso já fazia pra x/y.
function commitStackTransition(destSide: 'prev' | 'next', duration: number, velocity: number) {
  if (!photoCardEl.value || !travelInEl.value || !travelOutEl.value || !travelInImgEl.value || !travelOutImgEl.value) return

  if ($prefersReducedMotion?.()) {
    reducedMotionCommit(destSide)
    return
  }

  const destDeque = destSide === 'next' ? nextDeque : prevDeque
  const destEls = destSide === 'next' ? nextStackEls : prevStackEls
  const oppositeSide: 'prev' | 'next' = destSide === 'next' ? 'prev' : 'next'
  const oppositeEls = destSide === 'next' ? prevStackEls : nextStackEls
  const destFront = destEls[0]
  if (!destFront) return

  const incomingPhoto = destDeque.value[0]
  const oldCurrent = current.value
  if (!incomingPhoto) return

  // Continuação do gesto: o viajante que sai do centro parte de onde o dedo
  // largou o cartão, não de um reset em (0,0).
  const startX = Number($gsap.getProperty(photoCardEl.value, 'x')) || 0
  const startY = Number($gsap.getProperty(photoCardEl.value, 'y')) || 0
  const startRotation = Number($gsap.getProperty(photoCardEl.value, 'rotation')) || 0

  const inStart = stackPose(destSide, 0)
  const inEnd = { x: 0, y: 0, rotation: $gsap.utils.random(-4, 4), scale: 1 }
  const outEnd = stackPose(oppositeSide, LAYER_COUNT - 1)
  const dirSign = destSide === 'next' ? 1 : -1
  const arcHeight = $gsap.utils.clamp(30, 90, $gsap.utils.mapRange(THROW_VELOCITY, 1.4, 30, 90, velocity))

  travelInImgEl.value.src = incomingPhoto.photo
  travelInImgEl.value.alt = incomingPhoto.name
  travelOutImgEl.value.src = oldCurrent.photo
  travelOutImgEl.value.alt = oldCurrent.name

  // O cartão central e a camada de topo da pilha de destino somem por baixo —
  // quem assume a cena visualmente são os viajantes, nas mesmas poses exatas.
  $gsap.set(photoCardEl.value, { opacity: 0 })
  $gsap.set(destFront, { opacity: 0 })
  $gsap.set(travelInEl.value, { xPercent: -50, yPercent: -50, opacity: 1, ...inStart })
  $gsap.set(travelOutEl.value, { xPercent: -50, yPercent: -50, opacity: 1, x: startX, y: startY, rotation: startRotation, scale: 1 })

  const tl = $gsap.timeline({
    onComplete: () => {
      advanceCarousel(destSide)
      $gsap.set([travelInEl.value, travelOutEl.value], { opacity: 0 })
      $gsap.set(photoCardEl.value, { x: 0, y: 0, rotation: $gsap.utils.random(-4, 4), scale: 1, opacity: 0 })
      destEls.forEach((el, i) => setStackPose(el, destSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
      oppositeEls.forEach((el, i) => setStackPose(el, oppositeSide, i, STACK_LAYER_OPACITY[i] ?? 0.4))
      // O <img> do cartão central só troca de src depois que Vue reagir à
      // mudança de `current` — espera o próximo tick pra não piscar a foto
      // antiga por um frame com opacidade já em 1.
      nextTick(() => {
        $gsap.set(photoCardEl.value, { opacity: 1 })
      })
    }
  })

  // Arco em dois tempos (sobe até um ponto intermediário elevado, depois desce
  // pousando) em vez de `keyframes` — GSAP acusa "scale not eligible for
  // reset" ao misturar keyframes com scale nesses viajantes; dois .to()
  // posicionados na timeline dão o mesmo arco sem o aviso.
  const riseDuration = duration * 0.55
  const fallDuration = duration * 0.45

  tl.to(travelInEl.value, {
    x: (inStart.x + inEnd.x) / 2,
    y: (inStart.y + inEnd.y) / 2 - arcHeight,
    rotation: (inStart.rotation + inEnd.rotation) / 2,
    scale: Math.max(inStart.scale, inEnd.scale) * 1.08,
    duration: riseDuration,
    ease: 'power2.out'
  }, 0)
  tl.to(travelInEl.value, {
    x: inEnd.x,
    y: inEnd.y,
    rotation: inEnd.rotation,
    scale: inEnd.scale,
    duration: fallDuration,
    ease: 'power2.inOut'
  }, riseDuration)

  tl.to(travelOutEl.value, {
    x: (startX + outEnd.x) / 2 + dirSign * 40,
    y: (startY + outEnd.y) / 2 - arcHeight * 0.7,
    rotation: (startRotation + outEnd.rotation) / 2,
    scale: 0.62,
    duration: riseDuration,
    ease: 'power2.out'
  }, 0)
  tl.to(travelOutEl.value, {
    x: outEnd.x,
    y: outEnd.y,
    rotation: outEnd.rotation,
    scale: outEnd.scale,
    duration: fallDuration,
    ease: 'power2.inOut'
  }, riseDuration)

  activeTween = tl
}

function onPointerUp() {
  if (!isDragging.value || !photoCardEl.value) return
  isDragging.value = false

  const elapsed = Math.max(1, performance.now() - startTime)
  const distance = Math.hypot(dragDx, dragDy)
  const velocity = distance / elapsed
  const wantsNext = dragDx < 0
  const committed = distance > THROW_DISTANCE || velocity > THROW_VELOCITY

  if (!committed) {
    // Folga: sem força/distância suficiente, volta pro centro com leve exagero
    // elástico em vez de trocar de pilha — nada nas pilhas se move.
    const frontOpacity = STACK_LAYER_OPACITY[0] ?? 0.9
    setPeekHover(prevStackEls[0], STACK_SCALE, frontOpacity)
    setPeekHover(nextStackEls[0], STACK_SCALE, frontOpacity)
    activeTween = $gsap.to(photoCardEl.value, { x: 0, y: 0, rotation: 0, duration: 0.45, ease: 'back.out(1.6)' })
    dragDx = 0
    dragDy = 0
    return
  }

  const throwDuration = $gsap.utils.clamp(0.28, 0.6, $gsap.utils.mapRange(THROW_VELOCITY, 1.4, 0.6, 0.28, velocity))
  commitStackTransition(wantsNext ? 'next' : 'prev', throwDuration, velocity)

  dragDx = 0
  dragDy = 0
}

onBeforeUnmount(() => {
  activeTween?.kill()
  flipTween?.kill()
})
</script>

<style scoped>
/* Crossfade simples (CSS, não GSAP — troca de texto por trecho não precisa da
   timeline de scroll/drag do resto do componente) entre um trecho da legenda
   e o próximo. prefers-reduced-motion já neutraliza via tailwind.css global. */
.caption-swap-enter-active,
.caption-swap-leave-active {
  transition: opacity 0.35s ease-out;
}

.caption-swap-enter-from,
.caption-swap-leave-to {
  opacity: 0;
}

/* Sombra mais forte só no cartão central — destaca "foto na frente" do bolo
   de fotos atrás, que usa a sombra padrão mais fraca do `.polaroid-frame`
   (tailwind.css). Duas camadas (contato apertado + ambiente largo) em vez de
   uma sombra só, pra ler como profundidade de verdade, não só um blur maior.
   Estático (box-shadow não entra no transform do GSAP), então não interfere
   em nenhuma animação — continua valendo durante o arrasto/travessia, já
   que o cartão central é sempre "a foto da frente" independente da pose. */
.polaroid-frame--center {
  box-shadow:
    0 8px 16px -6px rgba(0, 0, 0, 0.55),
    0 32px 60px -20px rgba(0, 0, 0, 0.85);
}

/* Flip 3D do cartão: photoCardEl (o pai, `.polaroid-frame`) é quem recebe a
   animação de `rotationY` via GSAP (toggleFlip) — precisa de preserve-3d pra
   propagar o espaço 3D pros filhos, e o próprio wrapper da foto (o segundo
   nível, `aspect-[4/5]`) também, senão o back-face-visibility dos dois
   `.flip-face` (foto e verso) é calculado num plano achatado e os dois
   ficam sempre visíveis ao mesmo tempo em vez de se esconderem alternados. */
.flip-3d {
  transform-style: preserve-3d;
}

.flip-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-face--back {
  transform: rotateY(180deg);
}
</style>
