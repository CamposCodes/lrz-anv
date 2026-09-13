<template>
  <section ref="sectionEl" class="scroll-scene relative flex min-h-dvh flex-col items-center justify-end gap-6 overflow-hidden px-6 pb-12 sm:px-12">
    <!-- Galeria em cilindro ocupando a cena inteira: TODAS as fotos de todo
         mundo em colunas dispostas num cilindro visto de fora — a coluna do
         meio de frente, as das bordas girando e se afastando em perspectiva.
         Gira sozinho, devagar; arrastar (mouse/touch, com inércia) gira mais
         rápido que o dedo e depois volta ao giro lento. O viewport inteiro é
         a área de arraste (antes o Draggable ficava num grid absolute de 0×0
         com cartões pointer-events-none — nenhum toque chegava nele).
         `touch-pan-y`: só o gesto horizontal é da galeria, rolar a página
         continua livre no celular. -->
    <div
      ref="galleryViewportEl"
      class="gallery-viewport absolute inset-0 cursor-grab touch-pan-y select-none overflow-hidden"
      role="region"
      aria-label="Galeria com todas as fotos — arraste para os lados"
    >
      <div
        v-for="(column, c) in galleryColumns"
        :key="c"
        class="gallery-col pointer-events-none absolute left-1/2 top-1/2 flex flex-col items-center"
      >
        <!-- Célula fixa com a cópia centralizada: cada foto mantém a própria
             proporção (paisagem mais baixa, retrato mais estreito). -->
        <div
          v-for="tile in column"
          :key="tile.key"
          class="gallery-cell flex items-center justify-center"
        >
          <div class="print [--frame:6px]">
            <img :src="tile.photo" :alt="tile.name" loading="lazy" draggable="false" class="gallery-img">
          </div>
        </div>
      </div>
    </div>

    <!-- Sombreamento das laterais: a superfície do cilindro escurece à medida
         que curva pra longe da câmera — reforça a perspectiva cilíndrica.
         Degradê estático (sem filtro por coluna, que repintaria a cada quadro). -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />

    <!-- Degradê escuro no rodapé: contraste pra dica e mensagem por cima das fotos. -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/80 to-transparent" />
    <div ref="confettiHost" class="pointer-events-none absolute inset-0" />

    <p class="pointer-events-none relative text-center text-xs text-white/70">
      arraste pra ver todas as fotos
    </p>

    <div ref="messageEl" class="pointer-events-none relative font-comico ml-auto max-w-md text-right text-xl leading-[1.15] tracking-tight text-white sm:text-2xl">
      Feliz aniversário,
      <span class="font-script text-3xl leading-none sm:text-4xl" style="color: var(--primary)">Lorenzo</span>!
      Todo mundo que passou por aqui te deseja um ano incrível.
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Contributor } from '@/types'

const props = defineProps<{ contributors: Contributor[] }>()

const sectionEl = ref<HTMLElement | null>(null)
const confettiHost = ref<HTMLElement | null>(null)
const messageEl = ref<HTMLElement | null>(null)
const galleryViewportEl = ref<HTMLElement | null>(null)
const { isVisible } = useIntersectionVisibility(sectionEl, { threshold: 0.5 })

useMaskReveal(messageEl)

const { $gsap, $Draggable, $prefersReducedMotion } = useNuxtApp()

// Cilindro: ROWS linhas por coluna; a altura da célula sai da altura da cena
// (medida no mount) e a largura é CELL_RATIO dela.
const ROWS = 5
const CELL_GAP = 8 // px entre fotos, na vertical e entre colunas
const CELL_RATIO = 1.15 // célula mais larga que alta: a maioria das fotos é paisagem
// Projeção de câmera feita à mão (x e escala), sem translateZ: com a
// perspectiva por coluna, o z também puxava o x pro centro e as colunas
// das bordas se amontoavam no meio, deixando as laterais vazias.
// EDGE_ANGLE (rad) = ângulo do cilindro que cai exatamente na borda da tela.
const EDGE_ANGLE = 0.95
const CAMERA_DISTANCE = 0.9 // distância da câmera, em larguras de tela (menor = mais profundidade)
// Depois da borda as colunas ainda sobem um pouco e voltam por trás — somem
// entre FADE_START e FADE_END, já fora da tela.
const FADE_START = 1.05
const FADE_END = 1.25
const TILT = 1 // fração do ângulo real aplicada no rotationY (1 = giro real da superfície)
const PERSPECTIVE = 650 // perspectiva do giro de cada coluna (menor = mais acentuada)
const MIN_COLUMNS = 10
// Giro contínuo (px da superfície por segundo) e aceleração do arraste.
const AUTO_SPEED = 28
const DRAG_BOOST = 1.8

// Achata TODAS as fotos de todo mundo num pool só (quem tem `photos` contribui
// com cada uma; quem só tem `photo`, com uma).
const photoPool = computed(() => props.contributors.flatMap(
  c => (c.photos?.length ? c.photos : [c.photo]).map(photo => ({ photo, name: c.name }))
))

// Quantidade de colunas: o bastante pra cobrir o arco visível do cilindro sem
// a mesma coluna aparecer nas duas bordas (recalculada no mount, ver layout()).
const columnCount = ref(MIN_COLUMNS)

// Fotos alinhadas (sem giro por foto): a curvatura vem só do cilindro.
const galleryColumns = computed(() => {
  const pool = photoPool.value
  if (!pool.length) return []
  const cols = Math.max(columnCount.value, Math.ceil(pool.length / ROWS))
  return Array.from({ length: cols }, (_, c) => Array.from({ length: ROWS }, (_, r) => {
    const i = c * ROWS + r
    const entry = pool[i % pool.length]!
    return { key: i, photo: entry.photo, name: entry.name }
  }))
})

let galleryDraggable: { kill: () => void }[] | null = null
let tick: (() => void) | null = null
let onResize: (() => void) | null = null

onMounted(async () => {
  const viewport = galleryViewportEl.value
  if (!$gsap || !$Draggable || !viewport || !photoPool.value.length) return

  const reduced = $prefersReducedMotion?.()
  // Proxy fora do DOM: o Draggable arrasta ESTE elemento (x) — o viewport é só
  // o gatilho do gesto. Offset final = giro automático + arraste × DRAG_BOOST.
  const proxy = document.createElement('div')
  const spin = { offset: 0, speed: reduced ? 0 : 1 }
  let dragging = false
  let pitch = 0
  let radius = 1
  let camera = 1
  let wrapOffset = (v: number) => v
  let setters: { x: (v: number) => void, scale: (v: number) => void, rotationY: (v: number) => void, opacity: (v: number) => void }[] = []

  const render = () => {
    const offset = spin.offset + (Number($gsap.getProperty(proxy, 'x')) || 0) * DRAG_BOOST
    setters.forEach((set, c) => {
      // Posição da coluna na superfície (volta infinita) -> ângulo -> projeção.
      const theta = wrapOffset(c * pitch + offset) / radius
      const a = $gsap.utils.clamp(-FADE_END, FADE_END, theta)
      const depth = camera / (camera + radius * (1 - Math.cos(a)))
      set.x(radius * Math.sin(a) * depth)
      set.scale(depth)
      set.rotationY((a * TILT * 180) / Math.PI)
      set.opacity($gsap.utils.clamp(0, 1, (FADE_END - Math.abs(theta)) / (FADE_END - FADE_START)))
    })
  }

  // Mede a cena e monta o cilindro: tamanho de célula, raio, colunas,
  // setters. Roda no mount e em cada resize.
  const layout = async () => {
    const width = viewport.clientWidth
    const height = viewport.clientHeight
    const cellH = Math.floor((height - CELL_GAP * (ROWS + 1)) / ROWS)
    const cellW = Math.round(cellH * CELL_RATIO)
    viewport.style.setProperty('--cell-h', `${cellH}px`)
    viewport.style.setProperty('--cell-w', `${cellW}px`)
    viewport.style.setProperty('--cell-gap', `${CELL_GAP}px`)

    pitch = cellW + CELL_GAP
    camera = width * CAMERA_DISTANCE
    // Raio que faz a projeção de EDGE_ANGLE cair exatamente na borda:
    // R·sinE·D/(D + R(1−cosE)) = W/2  =>  R = (W/2·D) / (D·sinE − W/2·(1−cosE))
    radius = (width / 2 * camera) / (camera * Math.sin(EDGE_ANGLE) - width / 2 * (1 - Math.cos(EDGE_ANGLE)))
    columnCount.value = Math.max(MIN_COLUMNS, Math.ceil((2 * FADE_END * radius) / pitch) + 1)
    await nextTick()

    const cols = Array.from(viewport.querySelectorAll<HTMLElement>('.gallery-col'))
    const total = cols.length * pitch
    wrapOffset = $gsap.utils.wrap(-total / 2, total / 2) as (v: number) => number
    // Perspectiva POR COLUNA (transformPerspective), sem preserve-3d no pai:
    // a combinação preserve-3d + scroll-snap disparava um bug de composição no
    // Chrome do Android (a camada 3D "grudava" sobre a cena anterior).
    $gsap.set(cols, { xPercent: -50, yPercent: -50, transformPerspective: PERSPECTIVE })
    setters = cols.map(col => ({
      x: $gsap.quickSetter(col, 'x', 'px') as (v: number) => void,
      scale: $gsap.quickSetter(col, 'scale') as (v: number) => void,
      rotationY: $gsap.quickSetter(col, 'rotationY', 'deg') as (v: number) => void,
      opacity: $gsap.quickSetter(col, 'opacity') as (v: number) => void
    }))
    render()
  }

  await layout()

  // Giro contínuo no ticker do GSAP (mesmo relógio das animações). Parado
  // enquanto o dedo segura a galeria e quando a cena não está na tela.
  tick = () => {
    if (dragging || !isVisible.value || !spin.speed) return
    spin.offset -= AUTO_SPEED * spin.speed * ($gsap.ticker.deltaRatio() / 60)
    render()
  }
  $gsap.ticker.add(tick)

  // type 'x': o Draggable aplica touch-action pan-y — rolar a página por cima
  // da galeria continua funcionando no celular. Sem bounds: cilindro infinito.
  galleryDraggable = $Draggable.create(proxy, {
    type: 'x',
    trigger: viewport,
    inertia: !reduced,
    onPress() {
      dragging = true
      viewport.classList.replace('cursor-grab', 'cursor-grabbing')
    },
    onRelease() {
      viewport.classList.replace('cursor-grabbing', 'cursor-grab')
      // Sem inércia (ou soltou parado), o giro lento volta na hora.
      if (!this.tween || !this.tween.isActive()) dragging = false
    },
    onDrag: render,
    onThrowUpdate: render,
    // Terminou a inércia: devolve o controle pro giro lento.
    onThrowComplete() { dragging = false }
  }) as unknown as { kill: () => void }[]

  let resizeTimer = 0
  onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => { layout() }, 150)
  }
  window.addEventListener('resize', onResize)

  if (!reduced) {
    // Entrada: a galeria surge e o cilindro chega girando rápido, desacelerando
    // até o giro lento contínuo.
    $gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })
      .from(viewport, { autoAlpha: 0, duration: 0.8, ease: 'easeOut' }, 0)
      .fromTo(spin, { speed: 40 }, { speed: 1, duration: 2, ease: 'expo.out', immediateRender: false }, 0)
  }
})

onBeforeUnmount(() => {
  galleryDraggable?.forEach(d => d.kill())
  if (tick) $gsap.ticker.remove(tick)
  if (onResize) window.removeEventListener('resize', onResize)
})

const COLORS = ['#f2b90f', '#f2f2f2', '#520000']

const burstConfetti = () => {
  const host = confettiHost.value
  if (!host || !$gsap) return

  const { width } = host.getBoundingClientRect()

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('span')
    piece.className = 'absolute top-0 h-2 w-2 rounded-sm'
    piece.style.backgroundColor = COLORS[i % COLORS.length]!
    piece.style.left = `${Math.random() * width}px`
    host.appendChild(piece)

    $gsap.to(piece, {
      y: window.innerHeight * 0.8 + Math.random() * 200,
      x: `+=${(Math.random() - 0.5) * 200}`,
      rotation: Math.random() * 360,
      opacity: 0,
      duration: 1.8 + Math.random(),
      ease: 'easeInOut',
      onComplete: () => piece.remove()
    })
  }
}

watch(isVisible, (visible) => {
  if (visible && !$prefersReducedMotion?.()) burstConfetti()
})
</script>

<style scoped>
/* Tamanho da célula vem da cena (setado no mount em px); os valores daqui
   são só o primeiro paint no SSR, antes do JS medir. */
.gallery-viewport {
  --cell-h: 160px;
  --cell-w: 128px;
  --cell-gap: 8px;
}

.gallery-col {
  gap: var(--cell-gap);
  width: var(--cell-w);
}

.gallery-cell {
  width: var(--cell-w);
  height: var(--cell-h);
}

/* Foto + moldura (6px de cada lado) cabem na célula em qualquer proporção. */
.gallery-img {
  max-width: calc(var(--cell-w) - 12px);
  max-height: calc(var(--cell-h) - 12px);
}
</style>
