<template>
  <section ref="sectionEl" class="scroll-scene relative flex min-h-svh items-center justify-center overflow-hidden px-8">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-black" />

    <div ref="titleWrapEl" class="mx-auto max-w-4xl text-center">
      <h1 class="font-magazine-letter text-[2.5rem] uppercase leading-[1.15] tracking-tight sm:text-8xl">
        <span
          v-for="(ch, i) in Array.from('FELIZ')"
          :key="`feliz-${i}`"
          class="ransom-letter inline-block"
          :class="{ 'font-ransom': isThinGlyph(ch) }"
          :style="{ color: RANSOM_COLORS[i % RANSOM_COLORS.length] }"
        >{{ ch }}</span>
        <br>
        <span
          v-for="(ch, i) in Array.from('ANIVERSÁRIO')"
          :key="`aniversario-${i}`"
          class="ransom-letter inline-block"
          :class="{ 'font-ransom': isThinGlyph(ch) }"
          :style="{ color: RANSOM_COLORS[(i + 4) % RANSOM_COLORS.length] }"
        >{{ ch }}</span>
        <span class="font-script cover-name normal-case block text-7xl leading-none sm:text-9xl" style="color: var(--primary)">Lorenzo</span>
      </h1>
    </div>

    <div ref="hintEl" class="absolute bottom-10 flex flex-col items-center gap-1 text-white/80">
      <span class="text-sm">role para ver as mensagens</span>
      <ChevronDown class="size-5 animate-bounce" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

const RANSOM_COLORS = [
  '#f2b90f', 
  '#e63946', 
  '#2a9d8f', 
  '#f2f2f2', 
  '#9b5de5', 
  '#588157', 
  '#ff8fab', 
  '#457b9d', 
  '#b03a3a', 
  '#e9724c' 
]

const isThinGlyph = (ch: string) => ch === 'I'

const sectionEl = ref<HTMLElement | null>(null)
const titleWrapEl = ref<HTMLElement | null>(null)
const hintEl = ref<HTMLElement | null>(null)
const { $gsap, $gsapMatchMedia, $ScrollTrigger, $prefersReducedMotion } = useNuxtApp()

onMounted(() => {
  if (!$gsap || !titleWrapEl.value) return

  const letters = titleWrapEl.value.querySelectorAll<HTMLElement>('.ransom-letter')
  const nameEl = titleWrapEl.value.querySelector<HTMLElement>('.cover-name')

  const wrapCenterX = titleWrapEl.value.getBoundingClientRect().left + titleWrapEl.value.getBoundingClientRect().width / 2
  const letterOffsets = Array.from(letters, (el) => {
    const r = el.getBoundingClientRect()
    return r.left + r.width / 2 - wrapCenterX
  })

  if ($prefersReducedMotion?.()) {
    $gsap.set([...letters, nameEl], { opacity: 1, rotation: 0, scale: 1 })
    return
  }

  if ($ScrollTrigger && sectionEl.value) {
    const tl = $gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.9
      }
    })

    tl.to(letters, {
      x: (i: number) => letterOffsets[i] * 2.5,
      y: () => $gsap.utils.random(-100, 100),
      rotation: () => $gsap.utils.random(-160, 160),
      scale: 0.4,
      opacity: 0,
      ease: 'none'
    }, 0)

    if (nameEl) {
      tl.to(nameEl, { y: 140, scale: 0.5, opacity: 0, ease: 'none' }, 0)
    }

    tl.to(hintEl.value, { opacity: 0, scale: 0.6, ease: 'none' }, 0)
  }

  $gsapMatchMedia.add({ isMobile: '(max-width: 639px)', isDesktop: '(min-width: 640px)' }, (context: { conditions: { isMobile: boolean } }) => {
    const { isMobile } = context.conditions
    const [minRadius, maxRadius] = isMobile ? [40, 80] : [90, 180]

    const angles = Array.from(letters, () => $gsap.utils.random(0, Math.PI * 2))
    const radii = Array.from(letters, () => $gsap.utils.random(minRadius, maxRadius))

    const tl = $gsap.timeline({ delay: 0.2 })
      .from(letters, {
        opacity: 0,
        scale: 0.3,
        x: (i: number) => Math.cos(angles[i]) * radii[i],
        y: (i: number) => Math.sin(angles[i]) * radii[i],
        rotation: () => $gsap.utils.random(-720, 720),
        duration: 1,
        ease: 'power3.out',
        stagger: { each: 0.045, from: 'random' }
      })

    if (nameEl) {
      tl.from(nameEl, {
        opacity: 0,
        y: 60,
        rotation: 6,
        scale: 0.9,
        duration: 0.9,
        ease: 'power4.out'
      }, '-=0.35')
    }

    return () => {
      tl.kill()
    }
  })
})
</script>
