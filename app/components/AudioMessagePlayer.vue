<template>
  <div class="pointer-events-auto flex w-full flex-col gap-1.5">
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

const { src, media = null } = defineProps<{ src: string, media?: HTMLMediaElement | null }>()

const emit = defineEmits<{ timeupdate: [seconds: number] }>()

const { audioRef, isPlaying, currentTime, duration, toggle, seek, onPlay, onPause, onEnded, onTimeUpdate, onLoadedMetadata } = useAudioPlayer()

watch(currentTime, (t) => emit('timeupdate', t))

const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

const kind = computed(() => media?.tagName === 'VIDEO' ? 'vídeo' : 'áudio')

const innerAudioRef = ref<HTMLAudioElement | null>(null)
watch([() => media, innerAudioRef], () => {
  audioRef.value = media ?? innerAudioRef.value
}, { immediate: true, flush: 'post' })

onMounted(() => {
  if (audioRef.value && audioRef.value.readyState >= 1) onLoadedMetadata()
})

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

.waveform.is-playing .waveform-bar {
  animation: waveform-pulse 1.1s ease-in-out infinite;
}

@keyframes waveform-pulse {
  0%, 100% { transform: scaleY(0.82); }
  50% { transform: scaleY(1); }
}

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
