<template>
  <section ref="sectionEl" class="scroll-scene relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-6 py-24 sm:px-12">
    <div ref="confettiHost" class="pointer-events-none absolute inset-0" />

    <!-- Galeria arrastável: TODAS as fotos de todo mundo, ladrilhadas várias
         vezes num grid bem maior que a tela — arrastar (mouse/touch, com
         inércia) revela mais do "mural" pros lados. `w-screen left-1/2
         -translate-x-1/2` é o truque padrão de full-bleed (a seção tem
         padding lateral, a galeria quebra pra fora dele) pra parecer um
         mural de verdade, não um cartão contido. Perspectiva/inclinação 3D
         (`perspective` + `rotateX`) é aplicada via JS só no desktop — ver
         onMounted — e convive sem conflito com o x/y que o Draggable anima
         no MESMO elemento (GSAP compõe os eixos de transform automaticamente,
         mesmo padrão já usado no cartão arrastável do ContributorSection). -->
    <div
      ref="galleryViewportEl"
      class="relative left-1/2 h-[52vh] w-screen -translate-x-1/2 overflow-hidden sm:h-[62vh]"
    >
      <div ref="galleryGridEl" class="absolute left-0 top-0">
        <div
          v-for="tile in galleryTiles"
          :key="tile.key"
          class="polaroid-frame pointer-events-none absolute"
          :style="{
            left: `${tile.x}px`,
            top: `${tile.y}px`,
            width: `${TILE_WIDTH}px`,
            transform: `rotate(${tile.rotation}deg)`
          }"
        >
          <div class="aspect-[4/5] overflow-hidden">
            <img :src="tile.photo" :alt="tile.name" loading="lazy" draggable="false" class="h-full w-full object-cover">
          </div>
        </div>
      </div>
    </div>

    <p class="pointer-events-none text-center text-xs text-white/60">
      arraste pra ver todas as fotos
    </p>

    <div ref="messageEl" class="font-comico ml-auto max-w-md text-right text-xl leading-[1.15] tracking-tight text-white sm:text-2xl">
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
const { isVisible } = useIntersectionVisibility(sectionEl, { threshold: 0.5 })

useMaskReveal(messageEl)

const { $gsap, $Draggable, $prefersReducedMotion } = useNuxtApp()

// Grid bem maior que a tela (ladrilha as fotos várias vezes) — com só 3-4
// contribuidores, um grid do tamanho da tela pareceria vazio; repetir é o
// que faz parecer um mural cheio de verdade, como as referências (cadeiras/
// selos). Rotação por posição é DETERMINÍSTICA (fórmula, não Math.random)
// pelo mesmo motivo do `.ransom-letter`/ticker do resto do site: zero risco
// de mismatch servidor/cliente mesmo que este grid particular só ganhe vida
// no cliente (Draggable é client-only).
const TILE_WIDTH = 150
const TILE_GAP = 22
const GRID_COLS = 8
const GRID_ROWS = 6

// Achata TODAS as fotos de todo mundo (quem tem `photos` — várias fotos reais —
// contribui com cada uma; quem só tem `photo` contribui com uma) num pool só,
// e o grid cicla por esse pool em vez de por contribuidor. Com o Pai tendo 19
// fotos reais, o mural fica de verdade variado em vez de repetir uma só foto
// por pessoa 48 vezes.
const photoPool = computed(() => props.contributors.flatMap(
  c => (c.photos?.length ? c.photos : [c.photo]).map(photo => ({ photo, name: c.name }))
))

const galleryTiles = computed(() => {
  const pool = photoPool.value
  if (!pool.length) return []
  const tileHeight = TILE_WIDTH * 1.25 + (TILE_WIDTH * 1.25) / 9 // aspect-[4/5] + a "moldura" do .polaroid-frame
  return Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
    const col = i % GRID_COLS
    const row = Math.floor(i / GRID_COLS)
    const entry = pool[i % pool.length]!
    return {
      key: i,
      photo: entry.photo,
      name: entry.name,
      x: col * (TILE_WIDTH + TILE_GAP),
      y: row * (tileHeight + TILE_GAP),
      rotation: ((i * 37) % 7) - 3
    }
  })
})

const galleryViewportEl = ref<HTMLElement | null>(null)
const galleryGridEl = ref<HTMLElement | null>(null)
let galleryDraggable: { kill: () => void }[] | null = null
let tiltXTo: ((v: number) => void) | null = null

onMounted(() => {
  if (!$gsap || !$Draggable || !galleryViewportEl.value || !galleryGridEl.value || !galleryTiles.value.length) return

  const tileHeight = TILE_WIDTH * 1.25 + (TILE_WIDTH * 1.25) / 9
  const gridWidth = GRID_COLS * (TILE_WIDTH + TILE_GAP)
  const gridHeight = GRID_ROWS * (tileHeight + TILE_GAP)
  const viewportWidth = galleryViewportEl.value.clientWidth
  const viewportHeight = galleryViewportEl.value.clientHeight

  const minX = Math.min(0, viewportWidth - gridWidth)
  const minY = Math.min(0, viewportHeight - gridHeight)

  // Perspectiva 3D (perspective + preserve-3d + rotationX/Y) só no desktop.
  // No Android Chrome, essa combinação junto com `scroll-snap-type: y
  // mandatory` disparava um bug real de composição: em scrolls rápidos pra
  // cima/baixo, a camada 3D desta galeria "grudava" renderizada por cima da
  // cena anterior. `contain: paint` (tailwind.css) já é a rede de segurança;
  // aqui cortamos a causa raiz onde ela realmente acontece.
  const tilt3d = !$prefersReducedMotion?.() && window.matchMedia('(min-width: 640px)').matches

  if (tilt3d) {
    galleryViewportEl.value.style.perspective = '1600px'
    galleryGridEl.value.style.transformStyle = 'preserve-3d'
  }

  // Começa centralizado no meio do mural (não encostado num canto) — dá a
  // entender, já de cara, que dá pra arrastar em qualquer direção.
  $gsap.set(galleryGridEl.value, { x: minX / 2, y: minY / 2, rotationX: tilt3d ? 8 : 0 })

  // Leve "inclinação" reativa ao arrasto (rotationY conforme a velocidade
  // horizontal) — reforça a sensação de mural em perspectiva reagindo ao
  // gesto, igual as referências. quickTo porque é atualizado a cada frame
  // do drag (gsap-performance: evitar recriar tween por update). rotationX
  // fica fixa (setada uma vez acima) — sem drag vertical não há velocidade
  // de eixo Y pra reagir.
  if (tilt3d) {
    tiltXTo = $gsap.quickTo(galleryGridEl.value, 'rotationY', { duration: 0.4, ease: 'power3' })
  }

  // `type: 'x'` (não 'x,y'): o GSAP Draggable SEMPRE força `touch-action: none`
  // quando arrasta nos dois eixos (allowX === allowY na fonte do plugin, sem
  // exceção via config) — no celular isso bloqueava o scroll nativo da PÁGINA
  // toda vez que o gesto de rolar começava em cima da galeria (52-62% da
  // tela), travando a rolagem no meio da seção. Com um único eixo, o
  // Draggable aplica `touch-action: pan-y`, liberando o navegador pra rolar
  // verticalmente igual antes — só o arrasto horizontal continua sob o GSAP.
  // Sem perda de conteúdo: o grid só repete ciclicamente as mesmas fotos
  // (ver `galleryTiles` acima), então linhas fora do recorte vertical
  // estático não escondem nenhuma foto única.
  const draggables = $Draggable.create(galleryGridEl.value, {
    type: 'x',
    bounds: { minX, maxX: 0 },
    inertia: !$prefersReducedMotion?.(),
    cursor: 'grab',
    onPress() {
      this.target.style.cursor = 'grabbing'
      // `will-change` só durante o arrasto de fato, não permanente — reduz
      // o número de camadas GPU coexistindo com o scroll-snap das cenas.
      this.target.style.willChange = 'transform'
    },
    onRelease() {
      this.target.style.cursor = 'grab'
      this.target.style.willChange = 'auto'
      tiltXTo?.(0)
    },
    onDrag() {
      if (!tilt3d) return
      tiltXTo?.($gsap.utils.clamp(-10, 10, this.deltaX * 0.6))
    }
  })
  galleryDraggable = draggables as unknown as { kill: () => void }[]

  if (!$prefersReducedMotion?.()) {
    $gsap.from(galleryViewportEl.value, {
      autoAlpha: 0,
      y: 40,
      duration: 0.8,
      ease: 'easeOut',
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })
  }
})

onBeforeUnmount(() => {
  galleryDraggable?.forEach(d => d.kill())
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
