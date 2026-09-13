// Só uma mensagem toca por vez: módulo guarda o <audio>/<video> ativo e pausa o anterior ao trocar.
const activeAudio = ref<HTMLMediaElement | null>(null)

export const useAudioPlayer = () => {
  const audioRef = ref<HTMLMediaElement | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)

  const toggle = () => {
    const el = audioRef.value
    if (!el) return

    if (isPlaying.value) {
      el.pause()
      return
    }

    if (activeAudio.value && activeAudio.value !== el) {
      activeAudio.value.pause()
    }
    activeAudio.value = el
    el.play()
  }

  const seek = (time: number) => {
    if (audioRef.value) audioRef.value.currentTime = time
  }

  // Retrocede/avança N segundos dentro do MESMO áudio (não existe playlist
  // aqui — cada player toca um único depoimento). Clampeia em [0, duration]
  // pra não deixar currentTime negativo nem passar da duração real.
  const skip = (delta: number) => {
    const el = audioRef.value
    if (!el) return
    const max = duration.value || el.duration || 0
    el.currentTime = Math.min(Math.max(el.currentTime + delta, 0), max)
  }

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    skip,
    onPlay: () => { isPlaying.value = true },
    onPause: () => { isPlaying.value = false },
    onEnded: () => { isPlaying.value = false },
    onTimeUpdate: () => { currentTime.value = audioRef.value?.currentTime ?? 0 },
    onLoadedMetadata: () => { duration.value = audioRef.value?.duration ?? 0 }
  }
}
