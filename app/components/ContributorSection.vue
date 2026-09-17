<template>
  <section :id="`contributor-${index}`" ref="sectionEl" class="scroll-scene relative" style="min-height: 200svh">
    <div ref="stageEl" class="sticky top-0 h-svh overflow-hidden px-6">
      <div ref="safelightEl" class="safelight pointer-events-none absolute inset-0 opacity-0" />

      <div
        v-if="contributor.voices?.length"
        class="absolute inset-x-6 inset-y-16 z-10 flex items-center justify-center overflow-y-auto sm:inset-x-10 sm:inset-y-10"
      >
        <div
          ref="voicesEl"
          data-scene-ready
          class="flex w-full flex-col items-center gap-6 opacity-0 sm:flex-row sm:items-start sm:justify-center sm:gap-16"
        >
          <div v-for="(voice, i) in contributor.voices" :key="voice.name" class="flex w-full max-w-sm shrink-0 flex-col items-center text-center">
            <h3
              class="mb-2 break-words font-script text-4xl leading-none sm:mb-4 sm:text-7xl"
              style="color: var(--primary); text-shadow: -2px -2px 3px #000, 2px -2px 3px #000, -2px 2px 3px #000, 2px 2px 3px #000, 0 0 3px #000, 0 6px 18px rgba(0,0,0,0.95)"
            >
              {{ voice.name }}
            </h3>
            <AudioMessagePlayer class="w-full" :src="voice.audio" @timeupdate="(t) => onVoiceAudioTime(i, t)" />
            <Transition name="caption-swap" mode="out-in">
              <p
                v-if="voiceDisplayedMessage(voice, i)"
                :key="voiceDisplayedMessage(voice, i)"
                class="relative mt-3 min-h-[3.5em] w-full break-words font-instrument-serif text-xl leading-[1.15] tracking-tight text-white sm:mt-5 sm:min-h-[4.6em] sm:text-3xl"
              >
                {{ voiceDisplayedMessage(voice, i) }}
              </p>
            </Transition>
          </div>
        </div>
      </div>

      <div
        v-else-if="!contributor.photo"
        class="absolute inset-x-6 inset-y-16 z-10 flex items-center justify-center overflow-y-auto sm:inset-x-10 sm:inset-y-10"
      >
        <div ref="voicesEl" data-scene-ready class="flex w-full max-w-md flex-col items-center gap-5 text-center opacity-0">
          <h3
            class="break-words font-script text-6xl leading-none sm:text-9xl"
            style="color: var(--primary); text-shadow: -2px -2px 3px #000, 2px -2px 3px #000, -2px 2px 3px #000, 2px 2px 3px #000, 0 0 3px #000, 0 6px 18px rgba(0,0,0,0.95)"
          >
            {{ contributor.name }}
          </h3>
          <AudioMessagePlayer v-if="contributor.audio" class="w-full" :src="contributor.audio" @timeupdate="onAudioTime" />
          <Transition name="caption-swap" mode="out-in">
            <p
              v-if="displayedMessage"
              :key="displayedMessage"
              class="relative min-h-[4.6em] w-full break-words font-instrument-serif text-2xl leading-[1.15] tracking-tight text-white sm:text-3xl"
            >
              {{ displayedMessage }}
            </p>
          </Transition>
        </div>
      </div>

      <template v-else>
      <div v-if="entrance === 'letters'" ref="rainEl" class="pointer-events-none absolute inset-0 font-magazine-letter text-7xl">
        <span v-for="(ch, i) in tickerLetters" :key="i" class="rain-piece absolute left-0 top-0 inline-block" :style="{ color: TICKER_COLORS[i % TICKER_COLORS.length] }">{{ ch }}</span>
      </div>
      <div v-else-if="entrance === 'confetti'" ref="rainEl" class="pointer-events-none absolute inset-0">
        <span v-for="i in CONFETTI_COUNT" :key="i" class="rain-piece absolute left-0 top-0 block h-3 w-2 rounded-[1px]" :style="{ backgroundColor: TICKER_COLORS[i % TICKER_COLORS.length] }" />
      </div>

      <template v-if="entrance === 'reel'">
        <div
          v-for="(photo, k) in reelPhotos"
          :key="`reel-${k}`"
          class="reel-print print pointer-events-none absolute left-1/2 w-max top-[38%] z-0 sm:top-1/2 opacity-0"
          aria-hidden="true"
        >
          <img :src="photo.photo" alt="" draggable="false" decoding="async" class="max-h-[40svh] max-w-[min(48vw,28rem)] sm:max-h-[64svh] sm:max-w-[min(62vw,28rem)]">
        </div>
      </template>

      <div
        v-for="(photo, i) in prevDeque"
        v-show="hasCarousel"
        :key="`prev-stack-${i}`"
        :ref="(el) => setStackRef('prev', i, el)"
        class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-0 sm:top-1/2 opacity-0"
      >
        <img :src="photo?.photo || undefined" :alt="photo?.name" loading="lazy" draggable="false" class="max-h-[40svh] max-w-[min(48vw,28rem)] sm:max-h-[64svh] sm:max-w-[min(62vw,28rem)]">
      </div>

      <div
        v-for="(photo, i) in nextDeque"
        v-show="hasCarousel"
        :key="`next-stack-${i}`"
        :ref="(el) => setStackRef('next', i, el)"
        class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-0 sm:top-1/2 opacity-0"
      >
        <img :src="photo?.photo || undefined" :alt="photo?.name" loading="lazy" draggable="false" class="max-h-[40svh] max-w-[min(48vw,28rem)] sm:max-h-[64svh] sm:max-w-[min(62vw,28rem)]">
      </div>

      <div ref="travelInEl" class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-[31] sm:top-1/2 opacity-0">
        <img ref="travelInImgEl" draggable="false" loading="lazy" class="max-h-[40svh] max-w-[min(48vw,28rem)] sm:max-h-[64svh] sm:max-w-[min(62vw,28rem)]">
      </div>
      <div ref="travelOutEl" class="print pointer-events-none absolute left-1/2 w-max top-[38%] z-30 sm:top-1/2 opacity-0">
        <img ref="travelOutImgEl" draggable="false" loading="lazy" class="max-h-[40svh] max-w-[min(48vw,28rem)] sm:max-h-[64svh] sm:max-w-[min(62vw,28rem)]">
      </div>

      <div
        ref="photoStageEl"
        class="pointer-events-auto absolute left-1/2 top-[38%] z-20 w-max -translate-x-1/2 -translate-y-1/2 touch-pan-y select-none outline-offset-8 sm:top-1/2"
        :class="isDragging ? 'cursor-grabbing' : hasCarousel ? 'cursor-grab' : canZoom ? 'cursor-zoom-in' : 'cursor-default'"
        :role="canZoom ? 'button' : undefined"
        :tabindex="canZoom ? 0 : undefined"
        :aria-label="canZoom ? `Ampliar foto de ${contributor.name}` : undefined"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @keydown.enter.prevent="openLightbox"
        @keydown.space.prevent="openLightbox"
      >
        <div ref="photoCardEl" class="flip-3d">
          <div class="relative flip-3d">
            <div class="print print--lifted flip-face">
              <video
                v-if="current?.video"
                ref="photoImgEl"
                class="print-video"
                :style="{ '--video-ratio': videoBoxRatio }"
                :poster="current?.photo"
                :aria-label="`Mensagem em vídeo de ${contributor.name}`"
                playsinline
                preload="metadata"
                @play="videoStarted = true"
              >
                <source v-if="current.video.av1" :src="current.video.av1" type="video/mp4; codecs=av01.0.05M.08">
                <source :src="current.video.h264" type="video/mp4">
              </video>
              <img
                v-else-if="current?.photo"
                ref="photoImgEl"
                :src="current.photo"
                :alt="current.name"
                loading="lazy"
                draggable="false"
                class="max-h-[40svh] max-w-[min(48vw,28rem)] sm:max-h-[64svh] sm:max-w-[min(62vw,28rem)]"
              >
              <div
                v-else
                ref="photoImgEl"
                class="print-empty flex items-center justify-center p-6 text-center font-script text-5xl leading-none sm:text-7xl"
                style="color: var(--primary)"
                role="img"
                :aria-label="`${contributor.name} (foto em breve)`"
              >
                {{ contributor.name.split(',')[0] }}
              </div>

              <button
                v-if="isStackVideo"
                type="button"
                class="absolute bottom-[calc(var(--frame)+0.5rem)] right-[calc(var(--frame)+0.5rem)] z-10 flex size-11 items-center justify-center rounded-full border-0 bg-black/45 text-white outline-offset-4 backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none active:scale-90"
                :aria-label="stackVideoPlaying ? 'Pausar vídeo' : 'Tocar vídeo'"
                :aria-pressed="stackVideoPlaying"
                @pointerdown.stop
                @click.stop="toggleStackVideo"
              >
                <Pause v-if="stackVideoPlaying" fill="currentColor" class="size-5" />
                <Play v-else fill="currentColor" class="size-5 translate-x-px" />
              </button>

              <div
                v-if="hasCarousel"
                class="pointer-events-none absolute inset-x-0 bottom-[calc(var(--frame)+0.6rem)] z-10 flex justify-center transition-opacity duration-700 motion-reduce:transition-none"
                :class="showDragHint ? 'opacity-100' : 'opacity-0'"
              >
                <span class="drag-hint-pill flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs tracking-wide text-white/90 backdrop-blur-sm">
                  <ChevronsLeftRight class="size-3.5 shrink-0" />
                  arraste para ver mais fotos
                </span>
              </div>
            </div>
            <div class="print-back print--lifted flip-face flip-face--back absolute inset-0 overflow-y-auto p-[8%]">
              <p class="font-instrument-serif text-center text-base leading-snug tracking-tight text-[#2a2220] sm:text-lg">
                {{ contributor.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="contributor.message"
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
        <span class="-ml-2 text-xs tracking-wide text-white/70">{{ flipHintLabel }}</span>
      </div>

      <div
        ref="captionEl"
        data-scene-ready
        class="caption-fade pointer-events-none absolute left-6 right-6 bottom-6 isolate z-30 text-center opacity-0 sm:left-auto sm:right-10 sm:w-auto sm:bottom-auto sm:top-[58%] sm:max-w-xs sm:text-right sm:-translate-y-1/2"
      >
        <h3
          class="relative z-10 mb-3 break-words font-script text-5xl leading-none sm:mb-4 sm:text-8xl"
          style="color: var(--primary); text-shadow: -2px -2px 3px #000, 2px -2px 3px #000, -2px 2px 3px #000, 2px 2px 3px #000, 0 0 3px #000, 0 6px 18px rgba(0,0,0,0.95)"
        >
          {{ contributor.name }}
        </h3>

        <div style="display: contents" @click.capture="onCaptionPlayClick">
          <AudioMessagePlayer
            v-if="contributor.audio || contributor.video"
            :src="contributor.audio ?? contributor.video?.h264 ?? ''"
            :media="topVideoEl"
            @timeupdate="onAudioTime"
          />
        </div>

        <Transition name="caption-swap" mode="out-in">
          <p
            v-if="displayedMessage"
            :key="displayedMessage"
            class="relative break-words font-instrument-serif text-3xl leading-[1.15] tracking-tight text-white sm:text-4xl"
            :class="{ 'mt-5 min-h-[4.6em] sm:mt-6': contributor.audio || contributor.video }"
          >
            {{ displayedMessage }}
          </p>
        </Transition>
      </div>
      </template>
    </div>

    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          :aria-label="current?.video ? `Vídeo de ${contributor.name}` : `Foto de ${contributor.name}`"
          @click.self="closeLightbox"
        >
          <div
            v-if="current?.video"
            class="lightbox-photo flex flex-col items-center gap-4"
            @click.self="closeLightbox"
          >
            <div class="print print--lifted [--frame:clamp(10px,1.6vmin,18px)]">
              <video
                ref="lightboxVideoEl"
                class="lightbox-video"
                :style="{ '--video-ratio': current.video.height / current.video.width }"
                :poster="current?.photo"
                playsinline
                preload="metadata"
              >
                <source v-if="current.video.av1" :src="current.video.av1" type="video/mp4; codecs=av01.0.05M.08">
                <source :src="current.video.h264" type="video/mp4">
              </video>
            </div>
            <div class="w-full max-w-md">
              <AudioMessagePlayer
                :src="current.video.h264"
                :media="lightboxVideoEl"
                @timeupdate="onAudioTime"
              />
            </div>
            <p
              v-if="displayedMessage"
              class="max-w-xl text-center font-instrument-serif text-xl leading-snug text-white sm:text-2xl"
              aria-live="off"
            >
              {{ displayedMessage }}
            </p>
          </div>
          <div v-else class="lightbox-photo print print--lifted [--frame:clamp(10px,1.6vmin,18px)]">
            <img
              :src="current?.photo"
              :alt="current?.name"
              draggable="false"
              class="max-h-[80dvh] max-w-[calc(100vw-4rem)] sm:max-h-[84dvh] sm:max-w-[calc(100vw-10rem)]"
            >
          </div>
          <button
            ref="lightboxCloseEl"
            type="button"
            class="absolute right-3 top-3 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20 sm:right-6 sm:top-6"
            :aria-label="contributor.video ? 'Fechar vídeo' : 'Fechar foto'"
            @click="closeLightbox"
          >
            <X class="size-7" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { RotateCcw, X, Play, Pause, ChevronsLeftRight } from '@lucide/vue'
import type { Contributor } from '@/types'
import { carouselWindow, step, wrapIndex } from '@/utils/carousel'

const props = defineProps<{ contributor: Contributor, index: number }>()

const ENTRANCES = ['letters', 'reel', 'confetti'] as const
const rotated = ENTRANCES[props.index % ENTRANCES.length]!
const entrance = rotated === 'reel' && !props.contributor.photo ? 'confetti' : rotated

const photoPool = computed(() => {
  const items = props.contributor.photos?.length ? props.contributor.photos : [props.contributor.photo ?? '']
  return items.map(item => typeof item === 'string'
    ? { ...props.contributor, photo: item, video: item === props.contributor.photo ? props.contributor.video : undefined }
    : { ...props.contributor, photo: item.poster, video: item })
})

const hasCarousel = computed(() => photoPool.value.length > 1)

const lightboxOpen = ref(false)
const lightboxCloseEl = ref<HTMLButtonElement | null>(null)
const lightboxVideoEl = ref<HTMLVideoElement | null>(null)

function onLightboxKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

const canZoom = computed(() => !!(current.value?.video || current.value?.photo))

function openLightbox() {
  if (lightboxOpen.value || isFlipped.value || !canZoom.value) return
  const card = videoEl.value
  const resumeAt = card?.currentTime ?? 0
  const wasPlaying = !!card && !card.paused
  card?.pause()
  lightboxOpen.value = true
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onLightboxKey)
  nextTick(() => {
    lightboxCloseEl.value?.focus()
    const big = lightboxVideoEl.value
    if (!big) return
    big.currentTime = resumeAt
    if (wasPlaying) big.play().catch(() => {})
  })
}

function closeLightbox() {
  if (!lightboxOpen.value) return
  const big = lightboxVideoEl.value
  const card = videoEl.value
  if (big && card) {
    const wasPlaying = !big.paused
    big.pause()
    card.currentTime = big.currentTime
    if (wasPlaying) card.play().catch(() => {})
  }
  lightboxOpen.value = false
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onLightboxKey)
  photoStageEl.value?.focus()
}

const audioTime = ref(0)

function onAudioTime(t: number) {
  audioTime.value = t
}

const voiceAudioTimes = ref<number[]>(props.contributor.voices?.map(() => 0) ?? [])

function onVoiceAudioTime(i: number, t: number) {
  voiceAudioTimes.value[i] = t
}

function voiceDisplayedMessage(voice: NonNullable<Contributor['voices']>[number], i: number): string {
  const segments = voice.transcriptSegments
  if (!segments?.length) return voice.message
  const t = voiceAudioTimes.value[i] ?? 0
  let candidate = segments[0]!
  for (const segment of segments) {
    if (t >= segment.start) candidate = segment
    else break
  }
  return candidate.text
}

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
const rainEl = ref<HTMLElement | null>(null)
const photoStageEl = ref<HTMLElement | null>(null)
const photoCardEl = ref<HTMLElement | null>(null)
const photoImgEl = ref<HTMLElement | null>(null)
const videoEl = computed(() => current.value?.video ? photoImgEl.value as HTMLVideoElement | null : null)
const topVideoEl = computed(() => (props.contributor.video && current.value?.video === props.contributor.video) ? photoImgEl.value as HTMLVideoElement | null : null)
const safelightEl = ref<HTMLElement | null>(null)
const travelInEl = ref<HTMLElement | null>(null)
const travelInImgEl = ref<HTMLImageElement | null>(null)
const travelOutEl = ref<HTMLElement | null>(null)
const travelOutImgEl = ref<HTMLImageElement | null>(null)
const captionEl = ref<HTMLElement | null>(null)
const voicesEl = ref<HTMLElement | null>(null)

const TICKER_POOL = Array.from('FELIZANIVERSARIOLORENZO')
const TICKER_COLORS = ['#f2b90f', '#e63946', '#2a9d8f', '#f2f2f2', '#9b5de5', '#e9724c']
const TICKER_LENGTH = 48
const CONFETTI_COUNT = 70

const tickerLetters = ref(Array.from({ length: TICKER_LENGTH }, (_, i) => TICKER_POOL[i % TICKER_POOL.length]!))

const LAYER_COUNT = 3
const currentIndex = ref(0)
const carousel = computed(() => carouselWindow(currentIndex.value, photoPool.value.length, LAYER_COUNT))
const current = computed(() => photoPool.value[carousel.value.current]!)

const posterRatio = ref<number | null>(null)
const videoStarted = ref(false)
watch(current, () => { videoStarted.value = false }, { flush: 'sync' })
watch(() => current.value?.video ? current.value.photo : null, (src) => {
  posterRatio.value = null
  if (!src) return
  const probe = new Image()
  probe.onload = () => { posterRatio.value = probe.naturalHeight / probe.naturalWidth }
  probe.src = src
}, { immediate: true })
const videoBoxRatio = computed(() => {
  if (!current.value?.video) return 1
  if (!videoStarted.value && posterRatio.value) return posterRatio.value
  return current.value.video.height / current.value.video.width
})

const isStackVideo = computed(() => !!(current.value?.video && props.contributor.photos) && current.value?.video !== props.contributor.video)
const stackVideoEl = computed(() => isStackVideo.value ? photoImgEl.value as HTMLVideoElement | null : null)
const {
  audioRef: stackVideoRef,
  isPlaying: stackVideoPlaying,
  toggle: toggleStackVideo,
  play: playStackVideo
} = useAudioPlayer()
watch(stackVideoEl, (el) => { stackVideoRef.value = el }, { immediate: true })
const STACK_VIDEO_EVENTS = [
  ['play', () => { stackVideoPlaying.value = true }],
  ['pause', () => { stackVideoPlaying.value = false }],
  ['ended', () => { stackVideoPlaying.value = false }]
] as const
watch(stackVideoEl, (el, _old, onCleanup) => {
  if (!el) return
  STACK_VIDEO_EVENTS.forEach(([name, handler]) => el.addEventListener(name, handler))
  onCleanup(() => STACK_VIDEO_EVENTS.forEach(([name, handler]) => el.removeEventListener(name, handler)))
}, { immediate: true })

watch(current, (item) => {
  if (!item?.video || !props.contributor.photos) return
  nextTick(() => playStackVideo())
})

let pendingVideoPlay = false
watch(current, (item) => {
  if (!pendingVideoPlay || item?.video !== props.contributor.video) return
  pendingVideoPlay = false
  nextTick(() => topVideoEl.value?.play().catch(() => {}))
})

function onCaptionPlayClick(e: MouseEvent) {
  if (!props.contributor.video || current.value?.video === props.contributor.video) return
  if (!(e.target as HTMLElement).closest('.play-btn')) return
  e.stopPropagation()
  pendingVideoPlay = true
  commitStackTransition('next', 0.4, THROW_VELOCITY * 4)
}

const prevDeque = computed(() => carousel.value.prev.map(i => photoPool.value[i]!))
const nextDeque = computed(() => carousel.value.next.map(i => photoPool.value[i]!))
const reelPhotos = computed(() => Array.from({ length: REEL_COUNT }, (_, k) =>
  photoPool.value[wrapIndex(currentIndex.value - LAYER_COUNT - REEL_COUNT + k, photoPool.value.length)]!))

const prevStackEls: (HTMLElement | null)[] = Array(LAYER_COUNT).fill(null)
const nextStackEls: (HTMLElement | null)[] = Array(LAYER_COUNT).fill(null)

function setStackRef(side: 'prev' | 'next', index: number, el: unknown) {
  const arr = side === 'prev' ? prevStackEls : nextStackEls
  arr[index] = el instanceof HTMLElement ? el : null
}

let stageWidth = 0
let stageHeight = 0
const STACK_SCALE = 0.36
const STACK_SCALE_STEP = 0.025
const STACK_OFFSET_X = 0.30
const STACK_OFFSET_Y_DESKTOP = 0.27
const STACK_OFFSET_Y_MOBILE = 0.18
let STACK_OFFSET_Y = STACK_OFFSET_Y_DESKTOP
const STACK_LAYER_PEEK = 15
const STACK_ROTATION = { prev: -12, next: 9 }
const STACK_ROTATION_STEP = 3
const STACK_LAYER_OPACITY = [1, 0.97, 0.94]

function measureStage() {
  stageWidth = stageEl.value?.clientWidth ?? window.innerWidth
  stageHeight = stageEl.value?.clientHeight ?? window.innerHeight
  STACK_OFFSET_Y = stageWidth < 640 ? STACK_OFFSET_Y_MOBILE : STACK_OFFSET_Y_DESKTOP
}

function stackPose(side: 'prev' | 'next', layerIndex: number) {
  const dir = side === 'prev' ? -1 : 1
  const peek = layerIndex * STACK_LAYER_PEEK
  return {
    x: dir * stageWidth * STACK_OFFSET_X + dir * peek,
    y: (side === 'prev' ? 1 : -1) * (stageHeight * STACK_OFFSET_Y + peek * 0.6),
    rotation: STACK_ROTATION[side] + dir * layerIndex * STACK_ROTATION_STEP,
    scale: STACK_SCALE - layerIndex * STACK_SCALE_STEP,
    zIndex: LAYER_COUNT - layerIndex
  }
}

function setStackPose(el: HTMLElement | null, side: 'prev' | 'next', layerIndex: number, opacity: number) {
  if (!el) return
  const pose = stackPose(side, layerIndex)
  $gsap.set(el, { xPercent: -50, yPercent: -50, x: pose.x, y: pose.y, rotation: pose.rotation, scale: pose.scale, zIndex: pose.zIndex, opacity })
}

function poseFromDataset(target: Element, key: string): number {
  return Number((target as HTMLElement).dataset[key] ?? 0)
}

function writeStackPoses() {
  ;(['prev', 'next'] as const).forEach((side) => {
    const els = side === 'prev' ? prevStackEls : nextStackEls
    els.forEach((el, i) => {
      if (!el) return
      const pose = stackPose(side, i)
      el.dataset.poseX = String(pose.x)
      el.dataset.poseY = String(pose.y)
      el.dataset.poseRotation = String(pose.rotation)
      el.dataset.poseScale = String(pose.scale)
      el.dataset.poseOpacity = String(STACK_LAYER_OPACITY[i] ?? 0.4)
      $gsap.set(el, { xPercent: -50, yPercent: -50, zIndex: pose.zIndex })
    })
  })
}

const { $gsap, $prefersReducedMotion } = useNuxtApp()

let ctx: { revert: () => void } | null = null

let entranceTl: { progress: () => number } | null = null
let onViewportResize: (() => void) | null = null

function handleViewportResize() {
  measureStage()
  writeStackPoses()
  if (entranceTl?.progress() !== 1) return
  ;(['prev', 'next'] as const).forEach((side) => {
    const els = side === 'prev' ? prevStackEls : nextStackEls
    els.forEach((el, i) => {
      if (!el) return
      setStackPose(el, side, i, Number($gsap.getProperty(el, 'opacity')))
    })
  })
}

onMounted(() => {
  if (!$gsap || !sectionEl.value) return
  if (props.contributor.voices?.length || !props.contributor.photo) {
    if (!voicesEl.value) return
    if ($prefersReducedMotion?.()) {
      $gsap.set(voicesEl.value, { opacity: 1 })
      return
    }
    ctx = $gsap.context(() => {
      $gsap.set(voicesEl.value, { y: 16 })
      $gsap.to(voicesEl.value, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionEl.value,
          start: 'top 2px',
          toggleActions: 'play reverse play reverse'
        }
      })
    }, sectionEl.value)
    return
  }
  ctx = $gsap.context(setupScene, sectionEl.value)

  let resizeTimer = 0
  onViewportResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(handleViewportResize, 150)
  }
  window.addEventListener('resize', onViewportResize)
})

const REEL_COUNT = 8 
const PASS_SCALE_DESKTOP = 0.5
const PASS_SCALE_MOBILE = 0.55
const PASS_TILT_DEG = 3 
const PASS_DURATION = 0.9 
const PASS_STAGGER = 0.08 
const FORM_DURATION = 0.9 
const FORM_STAGGER = 0.06
const RAIN_FORM_AT = 0.55 

function setupScene() {
  if (!sectionEl.value || !photoCardEl.value || !photoImgEl.value || !photoStageEl.value
    || !safelightEl.value || !travelInEl.value || !travelOutEl.value || !captionEl.value
    || prevStackEls.some(el => !el) || nextStackEls.some(el => !el)) return

  measureStage()

  tickerLetters.value = Array.from({ length: TICKER_LENGTH }, () => TICKER_POOL[$gsap.utils.random(0, TICKER_POOL.length - 1, 1)]!)

  cardXTo = $gsap.quickTo(photoCardEl.value, 'x', { duration: 0.3, ease: 'power3' })
  cardYTo = $gsap.quickTo(photoCardEl.value, 'y', { duration: 0.3, ease: 'power3' })
  cardRotTo = $gsap.quickTo(photoCardEl.value, 'rotation', { duration: 0.35, ease: 'power3' })

  $gsap.set(photoCardEl.value, { transformPerspective: 1200, rotationY: 0 })
  isFlipped.value = false

  if ($prefersReducedMotion?.()) {
    if (rainEl.value) $gsap.set(rainEl.value, { autoAlpha: 0 })
    $gsap.set(safelightEl.value, { opacity: 1 })
    $gsap.set(photoCardEl.value, { opacity: 1, scale: 1 })
    prevStackEls.forEach((el, i) => setStackPose(el, 'prev', i, STACK_LAYER_OPACITY[i] ?? 0.4))
    nextStackEls.forEach((el, i) => setStackPose(el, 'next', i, STACK_LAYER_OPACITY[i] ?? 0.4))
    $gsap.set([travelInEl.value, travelOutEl.value], { opacity: 0 })
    $gsap.set(captionEl.value, { opacity: 1 })
    return
  }

  const rainPieces = Array.from(rainEl.value?.querySelectorAll<HTMLElement>('.rain-piece') ?? [])
  $gsap.set(rainPieces, {
    x: () => $gsap.utils.random(0, stageWidth),
    y: () => -stageHeight * $gsap.utils.random(0.2, 1.2),
    rotation: () => entrance === 'confetti' ? $gsap.utils.random(0, 360) : $gsap.utils.random(-35, 35)
  })
  $gsap.set(safelightEl.value, { opacity: 0 })

  const isMobile = stageWidth < 640
  const passScale = isMobile ? PASS_SCALE_MOBILE : PASS_SCALE_DESKTOP
  const reelEls = Array.from(stageEl.value!.querySelectorAll<HTMLElement>('.reel-print'))
  const maxPrintWidth = Math.min(window.innerWidth * (isMobile ? 0.48 : 0.62), 448)
  const offRight = stageWidth / 2 + maxPrintWidth
  const offLeft = -offRight
  const passY = (k: number) => [0, -0.06, 0.05, -0.03, 0.07, -0.05, 0.02, -0.07][k % 8]! * stageHeight

  writeStackPoses()
  if (reelEls.length) {
    $gsap.set(reelEls, {
      xPercent: -50,
      yPercent: -50,
      x: offRight,
      y: (k: number) => passY(k),
      rotation: (k: number) => (k % 2 ? -1 : 1) * PASS_TILT_DEG,
      scale: passScale,
      opacity: 0
    })
  }
  const stackFormEls = [2, 1, 0].flatMap(i => [nextStackEls[i], prevStackEls[i]]) as HTMLElement[]
  ;[...reelEls, ...stackFormEls, photoCardEl.value].forEach(el => el.querySelector('img')?.decode().catch(() => {}))
  $gsap.set(stackFormEls, {
    x: offRight,
    y: (_i: number, target: Element) => poseFromDataset(target, 'poseY'),
    rotation: (_i: number, target: Element) => poseFromDataset(target, 'poseRotation'),
    scale: (_i: number, target: Element) => poseFromDataset(target, 'poseScale'),
    opacity: 0
  })
  $gsap.set(photoCardEl.value, { x: offRight, y: 0, rotation: PASS_TILT_DEG, scale: passScale, opacity: 0 })
  $gsap.set(photoStageEl.value, { pointerEvents: 'none' })
  $gsap.set([travelInEl.value, travelOutEl.value], { xPercent: -50, yPercent: -50, opacity: 0 })
  $gsap.set(captionEl.value, { opacity: 0, y: 16 })

  const tl = $gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl.value,
      start: 'top 2px',
      toggleActions: 'play reverse play reverse'
    }
  })
  entranceTl = tl

  if (entrance === 'letters') {
    tl.to(rainPieces, {
      y: () => stageHeight * 1.3,
      x: () => `+=${$gsap.utils.random(-50, 50)}`,
      rotation: () => `+=${$gsap.utils.random(-40, 40)}`,
      duration: () => $gsap.utils.random(0.7, 1.1),
      ease: 'power1.in',
      stagger: { each: 0.008, from: 'random' }
    }, 0)
  } else if (entrance === 'confetti') {
    tl.to(rainPieces, {
      y: () => stageHeight * 1.2,
      x: () => `+=${$gsap.utils.random(-120, 120)}`,
      rotation: () => `+=${$gsap.utils.random(-540, 540)}`,
      rotationX: () => `+=${$gsap.utils.random(360, 1080)}`,
      duration: () => $gsap.utils.random(1.3, 2),
      ease: 'sine.in',
      stagger: { each: 0.006, from: 'random' }
    }, 0)
  }

  tl.to(safelightEl.value, { opacity: 0.85, duration: 0.07, ease: 'none' }, 0.2)
    .to(safelightEl.value, { opacity: 0.25, duration: 0.09, ease: 'none' }, 0.27)
    .to(safelightEl.value, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.36)

  if (entrance === 'reel') {
    tl.addLabel('pass', 0.3)
      .set(reelEls, { opacity: 1 }, 'pass')
      .to(reelEls, { x: offLeft, duration: PASS_DURATION, ease: 'power1.inOut', stagger: PASS_STAGGER }, 'pass')
      .set(reelEls, { opacity: 0 }, `pass+=${(REEL_COUNT - 1) * PASS_STAGGER + PASS_DURATION}`)
      .addLabel('form', `pass+=${(REEL_COUNT - 2) * PASS_STAGGER + PASS_DURATION * 0.5}`)
  } else {
    tl.addLabel('form', RAIN_FORM_AT)
  }

  tl.set(stackFormEls, { opacity: (_i: number, target: Element) => poseFromDataset(target, 'poseOpacity') }, 'form')
    .to(stackFormEls, {
      x: (_i: number, target: Element) => poseFromDataset(target, 'poseX'),
      duration: FORM_DURATION,
      ease: 'expo.out',
      stagger: FORM_STAGGER
    }, 'form')
    .set(photoCardEl.value, { opacity: 1 }, `form+=${FORM_STAGGER * 4}`)
    .to(photoCardEl.value, { x: 0, rotation: 0, scale: 1, duration: FORM_DURATION, ease: 'expo.out' }, `form+=${FORM_STAGGER * 4}`)
    .to(captionEl.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, `form+=${FORM_STAGGER * 4 + 0.3}`)
    .set(photoStageEl.value, { pointerEvents: 'auto' })
    .call(flashDragHint)
}

const THROW_DISTANCE = 60 
const THROW_VELOCITY = 0.35 

const isFlipped = ref(false)
let flipTween: { kill: () => void } | null = null

const showFlipHint = computed(() => !(props.contributor.audio || props.contributor.video) || audioTime.value > 0)
const flipHintLabel = computed(() => isFlipped.value ? 'veja a foto' : 'veja o verso da foto')

const showDragHint = ref(false)
let dragHintTimer: ReturnType<typeof setTimeout> | null = null

function flashDragHint() {
  if (!hasCarousel.value || $prefersReducedMotion?.()) return
  showDragHint.value = true
  dragHintTimer = setTimeout(() => { showDragHint.value = false }, 2000)
}

function dismissDragHint() {
  if (!showDragHint.value) return
  if (dragHintTimer) clearTimeout(dragHintTimer)
  showDragHint.value = false
}

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
let activeTween: { progress: (value: number) => unknown, kill: () => void } | null = null

type QuickSetter = ((value: number) => void) & { tween: { pause: () => void } }
let cardXTo: QuickSetter, cardYTo: QuickSetter, cardRotTo: QuickSetter

const peekTweens = new Map<HTMLElement, { kill: () => void }>()

function setPeekHover(el: HTMLElement | null, scale: number, opacity: number) {
  if (!el) return
  peekTweens.get(el)?.kill()
  peekTweens.set(el, $gsap.to(el, { scale, opacity, duration: 0.3, ease: 'power2' }))
}

function killPeekHover() {
  peekTweens.forEach(tween => tween.kill())
  peekTweens.clear()
}

function onPointerDown(e: PointerEvent) {
  if (!photoCardEl.value || !photoStageEl.value || isFlipped.value) return
  dismissDragHint()
  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  startTime = performance.now()
  activeTween?.progress(1)
  activeTween?.kill()
  try {
    photoStageEl.value.setPointerCapture(e.pointerId)
  } catch {
  }
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || !photoCardEl.value) return
  dragDx = e.clientX - startX
  dragDy = e.clientY - startY
  cardXTo(dragDx)
  cardYTo(dragDy)
  cardRotTo($gsap.utils.clamp(-16, 16, dragDx * 0.07))

  const frontOpacity = STACK_LAYER_OPACITY[0] ?? 0.9
  const pull = $gsap.utils.clamp(0, 1, Math.abs(dragDx) / 150)
  const towardNext = dragDx < 0
  setPeekHover(nextStackEls[0], towardNext ? STACK_SCALE + pull * 0.12 : STACK_SCALE, towardNext ? frontOpacity + pull * (1 - frontOpacity) : frontOpacity)
  setPeekHover(prevStackEls[0], towardNext ? STACK_SCALE : STACK_SCALE + pull * 0.12, towardNext ? frontOpacity : frontOpacity + pull * (1 - frontOpacity))
}

function advanceCarousel(destSide: 'prev' | 'next') {
  currentIndex.value = step(currentIndex.value, destSide, photoPool.value.length)

  if (isFlipped.value) {
    isFlipped.value = false
    flipTween?.kill()
    $gsap.set(photoCardEl.value, { rotationY: 0 })
  }
}

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

  const startX = Number($gsap.getProperty(photoCardEl.value, 'x')) || 0
  const startY = Number($gsap.getProperty(photoCardEl.value, 'y')) || 0
  const startRotation = Number($gsap.getProperty(photoCardEl.value, 'rotation')) || 0

  const inStart = stackPose(destSide, 0)
  const inEnd = { x: 0, y: 0, rotation: $gsap.utils.random(-4, 4), scale: 1 }
  const outEnd = stackPose(oppositeSide, 0)
  const dirSign = destSide === 'next' ? 1 : -1
  const arcHeight = $gsap.utils.clamp(30, 90, $gsap.utils.mapRange(THROW_VELOCITY, 1.4, 30, 90, velocity))

  travelInImgEl.value.src = incomingPhoto.photo
  travelInImgEl.value.alt = incomingPhoto.name
  travelOutImgEl.value.src = oldCurrent.photo
  travelOutImgEl.value.alt = oldCurrent.name

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
      nextTick(() => {
        $gsap.set(photoCardEl.value, { opacity: 1 })
      })
    }
  })

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

  const shiftLayer = (el: HTMLElement | null, side: 'prev' | 'next', toLayer: number) => {
    if (!el) return
    const { zIndex: _zIndex, ...pose } = stackPose(side, toLayer)
    tl.to(el, { ...pose, opacity: STACK_LAYER_OPACITY[toLayer] ?? 0, duration, ease: 'power2.inOut', overwrite: 'auto' }, 0)
  }
  oppositeEls.forEach((el, i) => shiftLayer(el, oppositeSide, i + 1))
  destEls.forEach((el, i) => i > 0 && shiftLayer(el, destSide, i - 1))

  activeTween = tl
}

const TAP_DISTANCE = 8
const TAP_DURATION = 350

function onPointerUp(e?: PointerEvent) {
  if (!isDragging.value || !photoCardEl.value) return
  isDragging.value = false
  ;[cardXTo, cardYTo, cardRotTo].forEach(follow => follow.tween.pause())

  const elapsed = Math.max(1, performance.now() - startTime)
  const distance = Math.hypot(dragDx, dragDy)
  const velocity = distance / elapsed
  const wantsNext = dragDx < 0
  const committed = hasCarousel.value && (distance > THROW_DISTANCE || velocity > THROW_VELOCITY)
  const isTap = e?.type === 'pointerup' && distance < TAP_DISTANCE && elapsed < TAP_DURATION
  killPeekHover()

  if (isTap) openLightbox()

  if (!committed) {
    const frontOpacity = STACK_LAYER_OPACITY[0] ?? 0.9
    setPeekHover(prevStackEls[0], STACK_SCALE, frontOpacity)
    setPeekHover(nextStackEls[0], STACK_SCALE, frontOpacity)
    activeTween = $gsap.to(photoCardEl.value, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' })
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
  if (dragHintTimer) clearTimeout(dragHintTimer)
  ctx?.revert()
  closeLightbox()
  if (onViewportResize) window.removeEventListener('resize', onViewportResize)
})
</script>

<style scoped>
.print-empty {
  position: relative;
  height: min(40svh, calc(min(48vw, 28rem) * 1.25));
  aspect-ratio: 4 / 5;
  background: linear-gradient(155deg, #3a2a22 0%, #1f1612 60%, #120c0a 100%);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
}

@media (min-width: 640px) {
  .print-empty {
    height: min(64svh, calc(min(62vw, 28rem) * 1.25));
  }
}

.print-video {
  display: block;
  position: relative;
  height: min(40svh, calc(min(48vw, 28rem) * var(--video-ratio)));
  aspect-ratio: calc(1 / var(--video-ratio));
  object-fit: contain;
  background: #000;
}

@media (min-width: 640px) {
  .print-video {
    height: min(64svh, calc(min(62vw, 28rem) * var(--video-ratio)));
  }
}

.lightbox-video {
  display: block;
  height: min(68dvh, calc((100vw - 4rem) * var(--video-ratio)));
  aspect-ratio: calc(1 / var(--video-ratio));
  background: #000;
}

@media (min-width: 640px) {
  .lightbox-video {
    height: min(74dvh, calc((100vw - 10rem) * var(--video-ratio)));
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-leave-active {
  transition-duration: 0.18s;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .lightbox-photo,
.lightbox-leave-active .lightbox-photo {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-enter-from .lightbox-photo,
.lightbox-leave-to .lightbox-photo {
  transform: scale(0.94);
}

.caption-swap-enter-active,
.caption-swap-leave-active {
  transition: opacity 0.35s ease-out;
}

.caption-swap-enter-from,
.caption-swap-leave-to {
  opacity: 0;
}

.print--lifted {
  box-shadow:
    0 10px 18px -8px rgba(0, 0, 0, 0.55),
    0 32px 60px -20px rgba(0, 0, 0, 0.85);
}

.safelight {
  background: radial-gradient(70% 52% at 50% 38%, rgba(90, 10, 8, 0.28) 0%, rgba(50, 0, 0, 0.14) 45%, transparent 80%);
}

@media (min-width: 640px) {
  .safelight {
    background: radial-gradient(48% 70% at 50% 50%, rgba(90, 10, 8, 0.28) 0%, rgba(50, 0, 0, 0.14) 45%, transparent 80%);
  }
}

.drag-hint-pill {
  animation: drag-hint-drift 1.1s ease-in-out infinite;
}

@keyframes drag-hint-drift {
  0%, 100% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
}

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
